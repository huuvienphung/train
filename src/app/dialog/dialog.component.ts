import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { IProduct, Product } from '../model/product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  providers: [MessageService],
})
export class DialogComponent implements OnInit {
  show: boolean;
  addForm: FormGroup;

  constructor(
    private primengConfig: PrimeNGConfig,
    private productService: ProductService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.addForm = this.fb.group({
      id: [''],
      name: [
        '',
        Validators.compose([
          Validators.required,
          // Validators.pattern(/^[a-z]{6,32}$/i),
        ]),
      ],
      price: [0, Validators.required],
      description: ['', Validators.required],
      quantity: [0, Validators.required],
    });
  }

  // show dialog create or update
  showDialog(id: string) {
    this.show = true;
    if (id !== '1') {
      let product: IProduct;
      this.productService.getProduct(id).subscribe((res) => (product = res));
      this.addForm.setValue({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        quantity: product.quantity,
      });
    }
  }

  // submit form
  onSubmit() {
    if (this.addForm.value.id) {
      this.productService.updateProduct(
        this.addForm.value.id,
        this.addForm.value
      );
    } else {
      this.add();
    }
    this.cleanForm();
    this.show = false; // show => false đóng dinalog
    this.showSuccess();
  }
  // khi thực hiện save với new item
  add() {
    const item = new Product(
      this.addForm.value.name,
      this.addForm.value.price,
      this.addForm.value.description,
      this.addForm.value.quantity
    );

    this.productService.addProduct(item); // add new item vào service
  }
  // khi click lệnh cancel
  cancel() {
    this.show = false;
    this.cleanForm();
    this.showCustom();
  }
  // set lại rỗng cho form
  cleanForm() {
    this.addForm.patchValue({
      id: '',
      name: '',
      price: 0,
      quantity: 1,
      description: '',
    });
  }
  showSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Thêm thành công',
    });
  }
  showCustom() {
    this.messageService.add({
      severity: 'custom',
      summary: 'Cancel',
      detail: 'Đã cancel form',
      icon: 'pi-file',
    });
  }
}
