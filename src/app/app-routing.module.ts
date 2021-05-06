import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListProductComponent } from './list-product/list-product.component';
import { ViewProductComponent } from './view-product/view-product.component';

const routes: Routes = [
  { path: '', component: ListProductComponent },
  { path: 'list-product/view/:id', component: ViewProductComponent },
  {
    path: 'list-card',
    loadChildren: () =>
      import('./card/cardd.module').then((m) => m.CarddModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  ngOnInit(): void {}
}
