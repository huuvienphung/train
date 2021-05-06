import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck, reduce, switchMap } from 'rxjs/operators';
import { ICard } from '../../model/card.model';
import { CardService } from '../../service/card.service';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.scss'],
})
export class ViewCardComponent implements OnInit {
  card$: Observable<ICard>;
  total$: Observable<number>;

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // dựa vào key id trên router đưa vào service lấy được card
    this.route.params
      .pipe(pluck('id'))
      .subscribe((res) => (this.card$ = this.cardService.getCard(res)));
    // tính tổng của đơn hàng order nằm trong card
    this.total$ = this.card$.pipe(
      switchMap((val) => val.order),
      reduce((acc, value, index) => acc + value.price * value.quantity.card, 0)
    );
  }
}
