import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private primengConfig: PrimeNGConfig, private router: Router) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-pw pi-home',
        command: () => {
          this.router.navigate(['/']);
        },
      },
      {
        label: 'Card',
        icon: 'pi pi-pw pi-shopping-cart',
        command: () => {
          this.router.navigate(['list-card']);
        },
      },
    ];
  }
}
