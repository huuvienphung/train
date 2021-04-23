import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IProduct } from '../model/product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss'],
})
export class ListProductComponent implements OnInit {
  products$: Observable<IProduct[]>;
  // @Output() updateChange = new EventEmitter<Product>();

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }

  deleteProduct(id: string) {
    this.productService.deleleProduct(id); // xóa trong service
  }
  viewProduct(id: string) {
    console.log(id);
    this.router.navigate(['/view/' + id]);
  }
}
