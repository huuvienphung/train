import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCardComponent } from './card/list-card/list-card.component';
import { ViewCardComponent } from './card/view-card/view-card.component';
import { ListProductComponent } from './list-product/list-product.component';
import { ViewProductComponent } from './view-product/view-product.component';

const routes: Routes = [
  { path: '', component: ListProductComponent },
  { path: 'view/:id', component: ViewProductComponent },
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
