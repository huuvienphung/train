import * as uuid from 'uuid';

export interface IQuantity {
  card: number;
  listcard: number;
  product: number;
}

export class Quantity {
  constructor(
    public card: number,
    public listcard: number,
    public product: number
  ) {}
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: IQuantity;
}
export class Product {
  id: string;
  constructor(
    public name: string,
    public price: number,
    public description: string,
    public quantity: IQuantity
  ) {
    this.id = uuid.v4();
  }
}
