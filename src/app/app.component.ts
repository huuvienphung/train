import { Component } from '@angular/core';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  title = 'app08';
  items: MenuItem[];

  lists: number[];

  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-pw pi-home',
        routerLink: '/',
      },
      {
        label: 'Card',
        icon: 'pi pi-pw pi-shopping-cart',
        routerLink: '/list-card',
      },
    ];
  }
}
