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
  tap,
  toArray,
} from 'rxjs/operators';
import { Card } from '../model/card.model';
import { IProduct, IQuantity, Quantity } from '../model/product.model';
import { CardService } from '../service/card.service';
import { ProductService } from '../service/product.service';

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
      this.updateQuantity();
      this.cardService.updateCard(updateCard);
    } else {
      let newCard = new Card(
        this.addForm.value.nameOrder,
        this.addForm.value.nameCustomer,
        this.addForm.value.phoneNumber,
        []
      );
      this.updateQuantity();
      this.cardService.addCard(newCard);
    }
    this.addForm.patchValue({
      id: '',
      nameOrder: '',
      nameCustomer: '',
      phoneNumber: '',
    });
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
    this.addForm.patchValue({
      id: '',
      nameOrder: '',
      nameCustomer: '',
      phoneNumber: '',
    });
    this.total$ = this.total();
  }
  delete(id: string) {
    this.cardService.deleteSmallCard(id);
    this.total$ = this.total();
  }
  changeQuantity(event, product: IProduct) {
    let x: number = event.value;
    // nếu số lượng nhỏ hơn 1 sẽ tính 1
    if (event.value < 1) {
      x = 1;
    }
    // nếu số lượng lớn hơn tổng số lượng sản phẩm thì gán chó total
    if (event.value > product.quantity.total) {
      x = product.quantity.total;
    }
    product.quantity.card = x;
    product.quantity.product = product.quantity.total - x;
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
    // kiểm tra số lượng sản phẩm còn lại có lớn hơn 0
    if (item.quantity.product > 0) {
      this.cardService.getSmallCards().subscribe((res) => {
        // tìm vị trí để kiểm tra sản phẩm đã tồn tại trong card chưa
        let index = res.findIndex((car) => car.id === item.id);

        // check vị trí đã tồn tại trong mảng chưa
        if (index > -1) {
          newItem = res[index];
          // kiểm tra số sản phẩm trong card phải nhỏ hơn total
          if (newItem.quantity.card < newItem.quantity.total) {
            newItem.quantity.card++;
            this.cardService.updateSmallCard(index, newItem);
          } else {
            console.log('sản phẩm đã hết ');
          }
        } else {
          newItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: new Quantity(
              item.quantity.card,
              item.quantity.product,
              item.quantity.total
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
    this.productService
      .getProducts()
      .pipe(
        switchMap((val) => val),
        tap((val) => {
          if (this.filterId(val) != undefined) {
            val.quantity = this.filterId(val);
          } else {
            val.quantity = val.quantity;
          }
        }),
        toArray()
      )
      .subscribe();
  }

  filterId(obj: IProduct): IQuantity {
    let k: IQuantity;
    merge(
      this.cardService.getSmallCards().pipe(
        switchMap((val) => val),
        filter((val: IProduct) => val.id === obj.id)
      )
    ).subscribe(
      (res) =>
        (k = new Quantity(
          obj.quantity.card + res.quantity.card,
          obj.quantity.total - (obj.quantity.card + res.quantity.card),
          obj.quantity.total
        ))
    );
    return k;
  }
}
