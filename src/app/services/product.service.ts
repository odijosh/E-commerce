import { Injectable } from '@angular/core';
import { Product } from '../productModel';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private storageKey = 'products';
  private products: Product[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      this.products = JSON.parse(data);
    } else {
      
      this.products = [
        { name: 'Laptop', sku: 'LAP123', price: 1200, stock: 5, description: 'Powerful laptop', category: 'Electronics' },
        { name: 'Phone', sku: 'PH456', price: 800, stock: 10, description: 'Smartphone', category: 'Electronics' },
        { name: 'Tablet', sku: 'TAB789', price: 500, stock: 7, description: 'Portable tablet', category: 'Electronics' },
      ];
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.products));
  }

  getProducts(): Product[] {
    return this.products;
  }

  addProduct(product: Product): void {
    this.products.push(product);
    this.saveToLocalStorage();
  }

  deleteProduct(index: number): void {
    this.products.splice(index, 1);
    this.saveToLocalStorage();
  }

  updateProduct(index: number, updatedProduct: Product) {
    this.products[index] = updatedProduct;
    this.saveToLocalStorage();
  }
}
