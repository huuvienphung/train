import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, map, pluck, reduce, switchMap } from 'rxjs/operators';
import { Card } from '../model/card.model';
import { IProduct } from '../model/product.model';
import { CardService } from '../service/card.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-dialog-card',
  templateUrl: './dialog-card.component.html',
  styleUrls: ['./dialog-card.component.scss'],
  providers: [MessageService],
})
export class DialogCardComponent implements OnInit {
  @Input() show: boolean;
  @Output() change = new EventEmitter<boolean>();

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
    this.addForm = this.fb.group({
      id: [''],
      nameOrder: ['', Validators.required],
      date: [''],
      nameCustomer: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      order: [],
    });

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
    let newCard = new Card(
      this.addForm.value.nameOrder,
      this.addForm.value.nameCustomer,
      this.addForm.value.phoneNumber,
      []
    );
    // this.cardService.getSmallCards().subscribe((res) => {
    //   console.log(newCard);
    //   this.cardService.addCard(newCard);
    // });
    this.cardService.addCard(newCard);

    this.addForm.patchValue({
      nameOrder: ' ',
      nameCustomer: ' ',
      phoneNumber: ' ',
    });
    this.change.emit(!this.show);
  }
  showDialog(id: string) {
    this.show = true;
  }
  cancel() {
    // this.show = false;
    this.change.emit(!this.show);
    this.cardService.removeAll();
    this.addForm.patchValue({
      nameOrder: ' ',
      nameCustomer: ' ',
      phoneNumber: ' ',
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
    this.cardService.getSmallCards().subscribe((res) => {
      let index = res.findIndex((car) => car.id === product.id);

      product.quantity.card = x;
      this.cardService.updateSmallCard(index, product);
    });
    this.total$ = this.total();
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
    this.cardService.getSmallCards().subscribe((res) => {
      // tìm vị trí
      let index = res.findIndex((car) => car.id === item.id);
      if (index > -1) {
        // kiểm tra số sản phẩm trong card phải nhỏ hơn total
        if (item.quantity.card < item.quantity.total) {
          item.quantity.card++;
          this.cardService.updateSmallCard(index, item);
        }
      } else {
        this.cardService.addSmallCard(item);
      }
    });
    this.total$ = this.total();
  }

  total(): Observable<number> {
    return this.productsCard$.pipe(
      switchMap((x) => x),
      reduce((acc, val) => acc + val.price * val.quantity.card, 0)
    );
  }
}
