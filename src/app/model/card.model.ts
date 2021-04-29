import * as uuid from 'uuid';
import { IProduct } from './product.model';

export interface ICard {
  id: string;
  nameOrder: string;
  date: Date;
  nameCustomer: string;
  phoneNumber: string;
  order: IProduct[];
}

export class Card {
  id: string;
  date: Date;
  constructor(
    public nameOrder: string,
    public nameCustomer: string,
    public phoneNumber: string,
    public order: IProduct[]
  ) {
    this.id = uuid.v4();
    this.date = new Date();
  }
}
