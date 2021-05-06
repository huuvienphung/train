import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { IProduct } from '../model/product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
  product$: Observable<IProduct>;
  addForm: FormGroup;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    // this.route.params.subscribe((res) => console.log(res));
    // this.route.paramMap.subscribe((res) => console.log(res));
    // console.log(this.route.snapshot.params);
    // console.log(this.route.snapshot.paramMap);
    let id: string;
    this.route.params.pipe(pluck('id')).subscribe((res) => {
      id = res;
    });
    this.product$ = this.productService.getProduct(id);
  }
}
