import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { Observable } from 'rxjs';
import { IProduct } from '../model/product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ListProductComponent implements OnInit {
  products$: Observable<IProduct[]>;
  // @Output() updateChange = new EventEmitter<Product>();

  constructor(
    private productService: ProductService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }

  viewProduct(id: string) {
    this.router.navigate(['/view/' + id]);
  }

  deleteProduct(id: string) {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa sản phẩm này không?',
      header: 'Xóa sản phẩm!',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.productService.deleleProduct(id);
        this.messageService.add({
          severity: 'info',
          summary: 'Đồng ý',
          detail: 'Bạn đã xóa',
        });
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({
              severity: 'error',
              summary: 'Từ chối',
              detail: 'Bạn đã từ chối',
            });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({
              severity: 'warn',
              summary: 'Đã hủy',
              detail: 'Bạn đã hủy',
            });
            break;
        }
      },
    });
  }
}
