import { Component, inject, OnInit, NgZone } from '@angular/core';
import { Product } from '../../productModel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

declare var bootstrap: any;

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  selectedProduct: Product | null = null;
  selectedIndex: number | null = null;
  editMode: boolean = false;
  editIndex: number | null = null;

  searchTerm: string = '';
  selectedCategory: string = '';

  private productService = inject(ProductService);
  private zone = inject(NgZone);

  newProduct: Product = this.getEmptyProduct();
  products: Product[] = [];
  allProducts: Product[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    const updated = this.productService.getProducts();
    this.products = [...updated];
    this.allProducts = [...updated];
  }

  getEmptyProduct(): Product {
    return {
      name: '',
      sku: '',
      price: 0,
      stock: 0,
      description: '',
      category: ''
    };
  }

  get filteredProducts(): Product[] {
    let filtered = this.products;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  onSearchChange() {
    // Automatically update filteredProducts when searchTerm changes
  }

  restoreProducts() {
    this.products = [...this.allProducts];
    this.searchTerm = '';
  }

  submitProduct() {
    if (this.newProduct.name && this.newProduct.sku) {
      if (this.editMode && this.editIndex !== null) {
        this.productService.updateProduct(this.editIndex, { ...this.newProduct });
      } else {
        this.productService.addProduct({ ...this.newProduct });
      }

      this.loadProducts();

      this.newProduct = this.getEmptyProduct();
      this.editMode = false;
      this.editIndex = null;

      this.zone.run(() => {
        const modalEl = document.getElementById('exampleModal');
        if (modalEl) {
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal) {
            modal.hide();
          }
        }
      });
    }
  }

  deleteProduct(index: number) {
    this.productService.deleteProduct(index);
    this.loadProducts();
  }

  openDetails(product: Product, index: number) {
    this.selectedProduct = product;
    this.selectedIndex = index;
  }

  deleteSelectedProduct() {
    if (this.selectedIndex !== null) {
      this.deleteProduct(this.selectedIndex);
    }
  }

  editSelectedProduct() {
    if (this.selectedProduct !== null && this.selectedIndex !== null) {
      this.newProduct = { ...this.selectedProduct };
      this.editMode = true;
      this.editIndex = this.selectedIndex;

      setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('exampleModal')!);
        modal.show();
      }, 0);
    }
  }

  getStockStatus(stock: number): string {
    const defaultStockThreshold = 5;
    if (stock > defaultStockThreshold) return 'High stock';
    if (stock < defaultStockThreshold) return 'Low stock';
    return 'Instock';
  }
}
