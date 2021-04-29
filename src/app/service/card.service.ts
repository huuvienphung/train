import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Card, ICard } from '../model/card.model';
import { IProduct, Product, Quantity } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  cards: ICard[] = [
    new Card('nameOrder1', 'nameCustomer1', 'phoneNumber1', [
      new Product('nameProduct1', 10, '', new Quantity(1, 2, 3)),
      new Product('nameProduct2', 20, '', new Quantity(2, 3, 5)),
      new Product('nameProduct3', 30, '', new Quantity(3, 4, 7)),
    ]),
    new Card('nameOrder2', 'nameCustomer2', 'phoneNumber2', [
      new Product('nameProduct1', 10, '', new Quantity(1, 2, 3)),
      new Product('nameProduct2', 20, '', new Quantity(2, 3, 5)),
    ]),
    new Card('nameOrder3', 'nameCustomer3', 'phoneNumber3', [
      new Product('nameProduct1', 10, '', new Quantity(1, 2, 3)),
      new Product('nameProduct2', 20, '', new Quantity(2, 3, 5)),
    ]),
  ];
  smallCard: IProduct[] = [
    // new Product('nameProduct1', 10, '', 1),
    // new Product('nameProduct2', 20, '', 2),
  ];

  constructor() {
    if (localStorage.getItem('cards') === null) {
      this.addLocalSorage();
    } else {
      this.cards = JSON.parse(localStorage.getItem('cards'));
    }
  }
  // xử lý với card
  getCards(): Observable<ICard[]> {
    return of(this.cards);
  }
  getCard(id: string): Observable<ICard> {
    return of(this.cards.find((c) => c.id === id));
  }
  addCard(card: ICard) {
    this.cards.push(card);
  }
  deleteCard(id: string) {
    let index = this.findIndexcard(id, this.cards);
    this.cards.splice(index, 1);
    this.addLocalSorage();
  }
  updateCard(card: ICard): void {
    let index = this.findIndexcard(card.id, this.cards);
    this.cards.splice(index, 1, card);
  }
  // xử lý với small card
  getSmallCards(): Observable<IProduct[]> {
    return of(this.smallCard);
  }
  getSmallCard(id: string): Observable<IProduct> {
    return of(this.smallCard.find((c) => c.id === id));
  }
  addSmallCard(c: IProduct) {
    c.quantity.card = 1;
    this.smallCard.push(c);
  }
  deleteSmallCard(id: string) {
    let index = this.findIndexcard(id, this.smallCard);
    this.smallCard.splice(index, 1);
  }
  updateSmallCard(index: number, c: IProduct) {
    this.smallCard.splice(index, 1, c);
  }
  removeAll() {
    while (this.smallCard.length) {
      this.smallCard.pop();
    }
  }
  // các hàm xử lý
  findIndexcard(id: string, parent: any): number {
    return parent.findIndex((c) => c.id === id);
  }
  addLocalSorage() {
    localStorage.setItem('cards', JSON.stringify(this.cards));
  }
}
