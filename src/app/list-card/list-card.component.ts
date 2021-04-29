import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  ConfirmEventType,
  MessageService,
} from 'primeng/api';
import { Observable } from 'rxjs';
import { ICard } from '../model/card.model';
import { CardService } from '../service/card.service';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class ListCardComponent implements OnInit {
  show: boolean;
  listCards$: Observable<ICard[]>;

  constructor(
    private cardService: CardService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.listCards$ = this.cardService.getCards();
  }
  viewCard(id: string): void {
    this.router.navigate(['view-card/' + id]);
  }
  onChange(val) {
    this.show = val;
  }
  delete(id: string): void {
    this.confirmationService.confirm({
      message: 'Bạn có muốn xóa sản phẩm này không?',
      header: 'Xóa sản phẩm!',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.cardService.deleteCard(id);

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
  update(): void {
    this.show = true;
  }
}
