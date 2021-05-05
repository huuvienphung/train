import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IProduct, Product, Quantity } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products: Product[] = [
    new Product('name11111', 1000, 'cc1', new Quantity(0, 0, 2)),
    new Product('name22222222', 2000, 'cc2', new Quantity(0, 0, 3)),
    new Product('name33333', 2000, 'cc2', new Quantity(0, 0, 4)),
    new Product('name4444444', 2000, 'cc2', new Quantity(0, 0, 5)),
  ];

  constructor() {
    if (localStorage.getItem('products') === null) {
      this.addLocalSorage();
    } else {
      this.products = JSON.parse(localStorage.getItem('products'));
    }
  }
  show() {
    console.log(this.products);
  }

  // getAll
  getProducts(): Observable<IProduct[]> {
    return of(this.products);
  }
  // get one
  getProduct(id: string): Observable<IProduct> {
    return of(this.products.find((p) => p.id === id));
  }
  setProducts(items: IProduct[]) {
    let i = 0;
    while (i < items.length) {
      this.products.splice(i, 1, items[i]);
      i++;
    }
    // this.addLocalSorage();
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
  updateProduct(updateFields: IProduct) {
    this.products.splice(this.foundIndex(updateFields.id), 1, updateFields);
    this.addLocalSorage();
  }
  // tìm vị trí
  foundIndex(id: string): number {
    const index = this.products.findIndex((p) => p.id === id);
    return index;
  }
  //add localstorage
  addLocalSorage() {
    localStorage.setItem('products', JSON.stringify(this.products));
  }
  // update lại số lượng sản phẩm
}
