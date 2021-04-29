import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCardComponent } from './list-card/list-card.component';
import { ListProductComponent } from './list-product/list-product.component';
import { ViewCardComponent } from './view-card/view-card.component';
import { ViewProductComponent } from './view-product/view-product.component';

const routes: Routes = [
  { path: 'view/:id', component: ViewProductComponent },
  { path: '', component: ListProductComponent },
  { path: 'list-card', component: ListCardComponent },
  { path: 'view-card/:id', component: ViewCardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  ngOnInit(): void {}
}
