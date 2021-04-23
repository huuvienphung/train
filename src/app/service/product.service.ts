import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProduct, Product } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: Product[] = [
    new Product('name11111', 1000, 'cc1', 1),
    new Product('name22222222', 2000, 'cc2', 2),
    new Product('name33333', 2000, 'cc2', 3),
    new Product('name4444444', 2000, 'cc2', 4),
  ];

  constructor() {
    if (localStorage.getItem('products') === null) {
      this.addLocalSorage();
    } else {
      this.products = JSON.parse(localStorage.getItem('products'));
    }
  }

  // getAll
  getProducts(): Observable<IProduct[]> {
    return of(this.products);
  }
  // get one
  getProduct(id: string): Observable<IProduct> {
    return of(this.products.find((p) => p.id === id));
  }
  // add item
  addProduct(item: Product) {
    this.products.push(item);
    this.addLocalSorage();
  }
  // delete item
  deleleProduct(id: string) {
    const index = this.foundIndex(id);
    if (index == -1) return;
    this.products.splice(index, 1);
    this.addLocalSorage();
  }
  // update item
  updateProduct(id: string, updateFields: IProduct) {
    // const note = this.getProduct(id);
    // Object.assign(note, updateFields);
    // console.log(note);
    this.products.splice(this.foundIndex(id), 1, updateFields);
    this.addLocalSorage();
  }

  foundIndex(id: string): number {
    const index = this.products.findIndex((p) => p.id === id);
    return index;
  }
  addLocalSorage() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
}
