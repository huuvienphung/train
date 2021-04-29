import * as uuid from 'uuid';

export interface IQuantity {
  card: number;
  product: number;
  total: number;
}

export class Quantity {
  constructor(
    public card: number,
    public product: number,
    public total: number
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
