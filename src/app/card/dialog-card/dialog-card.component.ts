import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { fromEvent, merge, Observable, of } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  pluck,
  reduce,
  switchMap,
} from 'rxjs/operators';
import { Card } from '../../model/card.model';
import { IProduct, IQuantity, Quantity } from '../../model/product.model';
import { CardService } from '../../service/card.service';
import { ProductService } from '../../service/product.service';

@Component({
  selector: 'app-dialog-card',
  templateUrl: './dialog-card.component.html',
  styleUrls: ['./dialog-card.component.scss'],
  providers: [MessageService],
})
export class DialogCardComponent implements OnInit {
  show: boolean;

  addForm: FormGroup;
  products$: Observable<IProduct[]>;
  productsCard$: Observable<IProduct[]>;
  total$: Observable<number>;
  @ViewChild('input', { static: true }) input: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private productService: ProductService,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    // console.log(this.ref);

    this.addForm = this.fb.group({
      id: [''],
      nameOrder: ['', Validators.required],
      date: [''],
      nameCustomer: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      order: [],
    });
    // console.log(this.config);

    this.products$ = this.productService.getProducts();
    this.productsCard$ = this.cardService.getSmallCards();

    fromEvent(this.input.nativeElement, 'keydown')
      .pipe(
        debounceTime(200),
        pluck('target', 'value'),
        map((val: string) => this.filterName(val))
      )
      .subscribe((res) => (this.products$ = of(res)));
  }

  onSubmit() {
    if (this.addForm.value.id) {
      let updateCard = {
        id: this.addForm.value.id,
        nameOrder: this.addForm.value.nameOrder,
        date: this.addForm.value.date,
        nameCustomer: this.addForm.value.nameCustomer,
        phoneNumber: this.addForm.value.phoneNumber,
        order: [],
      };

      this.cardService.updateCard(updateCard);
    } else {
      let newCard = new Card(
        this.addForm.value.nameOrder,
        this.addForm.value.nameCustomer,
        this.addForm.value.phoneNumber,
        []
      );

      this.cardService.addCard(newCard);
    }

    this.addForm.reset();
    this.show = false;
    this.total$ = this.total();
  }

  showDialog(id: string) {
    this.show = true;
    if (id !== '1') {
      let card;
      this.cardService.getCard(id).subscribe((res) => (card = res));
      this.addForm.patchValue({
        id: card.id,
        nameOrder: card.nameOrder,
        date: new Date(),
        nameCustomer: card.nameCustomer,
        phoneNumber: card.phoneNumber,
      });
      this.cardService.setSmallCard(card.order);
      this.total$ = this.total();
    }
  }
  cancel() {
    this.show = false;
    this.cardService.removeAll();
    this.addForm.reset();
    this.total$ = this.total();
  }
  delete(id: string) {
    this.cardService.deleteSmallCard(id);
    this.total$ = this.total();
  }
  changeQuantity(event, product: IProduct) {
    let x: number = event.value;
    // n???u s??? l?????ng nh??? h??n 1 s??? t??nh 1
    console.log(x);

    if (event.value < 1) {
      x = 1;
    }
    // n???u s??? l?????ng l???n h??n t???ng s??? l?????ng s???n ph???m th?? g??n ch?? total
    if (event.value > product.quantity.product) {
      x = product.quantity.product;
    }
    product.quantity.card = x;
    this.total$ = this.total();

    // this.cardService
    //   .getSmallCards()
    //   .pipe(
    //     switchMap((x) => x),
    //     map((x) => x.quantity)
    //   )
    //   .subscribe((res) => console.log(res));
  }

  filterName(value: string): IProduct[] {
    let x: IProduct[];
    this.productService
      .getProducts()
      .subscribe(
        (res) =>
          (x = res.filter(
            (product) =>
              product.name.toLowerCase().indexOf(value.toLowerCase()) > -1
          ))
      );
    return x;
  }
  addCard(item: IProduct): void {
    let newItem = {
      id: '',
      name: '',
      price: 0,
      description: '',
      quantity: new Quantity(0, 0, 0),
    };
    // ki???m tra s??? l?????ng s???n ph???m c??n l???i c?? l???n h??n 0
    if (item.quantity.product - item.quantity.listcard > 0) {
      this.cardService.getSmallCards().subscribe((res) => {
        // t??m v??? tr?? ????? ki???m tra s???n ph???m ???? t???n t???i trong card ch??a
        let index = res.findIndex((car) => car.id === item.id);

        // check v??? tr?? ???? t???n t???i trong m???ng ch??a
        if (index > -1) {
          newItem = res[index];
          // ki???m tra s??? s???n ph???m trong card ph???i nh??? h??n total
          if (
            newItem.quantity.card <
            newItem.quantity.product - newItem.quantity.listcard
          ) {
            newItem.quantity.card++;
            this.cardService.updateSmallCard(index, newItem);
          } else {
            console.log('s???n ph???m ???? h???t ');
          }
        } else {
          newItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: new Quantity(
              item.quantity.card,
              item.quantity.listcard,
              item.quantity.product
            ),
          };
          this.cardService.addSmallCard(newItem);
        }
      });
      this.total$ = this.total();
    }
  }

  total(): Observable<number> {
    return this.productsCard$.pipe(
      switchMap((x) => x),
      reduce((acc, val) => acc + val.price * val.quantity.card, 0)
    );
  }

  updateQuantity(): void {
    // c???p nh???t l???i s??? l?????ng trong danh s??ch ????n h??ng
    // this.cardService
    //   .getSmallCards()
    //   .pipe(
    //     switchMap((val) => val),
    //     tap(
    //       (val) =>
    //         (val.quantity.listcard = val.quantity.listcard + val.quantity.card)
    //     ),
    //     toArray()
    //   )
    //   .subscribe();
    // c???p nh???t l???i s??? l?????ng s???n ph???m trong t???ng s???n ph???m
    // this.productService
    //   .getProducts()
    //   .pipe(
    //     switchMap((val) => val),
    //     tap((val) => {
    //       if (this.filterUpdateQuantity(val) != undefined) {
    //         val.quantity = this.filterUpdateQuantity(val);
    //       } else {
    //         val.quantity = val.quantity;
    //       }
    //     }),
    //     toArray()
    //   )
    //   .subscribe((res) => this.productService.setProducts(res));
  }

  filterUpdateQuantity(product: IProduct): IQuantity {
    let k: IQuantity;
    merge(
      this.cardService.getSmallCards().pipe(
        switchMap((val) => val),
        filter((val: IProduct) => val.id === product.id)
      )
    ).subscribe((res) => {
      k = new Quantity(0, res.quantity.listcard, product.quantity.product);
    });
    return k;
  }
}
