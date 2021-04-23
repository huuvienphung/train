import * as uuid from 'uuid';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}
export class Product {
  id: string;
  constructor(
    public name: string,
    public price: number,
    public description: string,
    public quantity: number
  ) {
    this.id = uuid.v4();
  }
}
