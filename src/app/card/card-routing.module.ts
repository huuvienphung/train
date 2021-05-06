import { Routes } from '@angular/router';
import { ListCardComponent } from './list-card/list-card.component';
import { ViewCardComponent } from './view-card/view-card.component';

export const CardRoutingModule: Routes = [
  { path: '', component: ListCardComponent },
  { path: 'view/:id', component: ViewCardComponent },
];
