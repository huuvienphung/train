import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private productService: ProductService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    // this.route.params.subscribe((res) => console.log(res));
    // this.route.paramMap.subscribe((res) => console.log(res));
    // console.log(this.route.snapshot.params);
    // console.log(this.route.snapshot.paramMap);
    this.addForm = this.fb.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z]{6,32}$/i),
        ]),
      ],
      price: [0, Validators.required],
      description: ['', Validators.required],
      quantity: [0, Validators.required],
    });
    let id: string;
    this.route.params.pipe(pluck('id')).subscribe((res) => {
      id = res;
    });
    this.product$ = this.productService.getProduct(id);
  }
  back() {
    this.router.navigate(['/']);
  }
}
