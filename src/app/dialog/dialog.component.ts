import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { IProduct, Product, Quantity } from '../model/product.model';
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
  url = '';
  selectedFile: File = null;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.addForm = this.fb.group({
      id: [''],
      name: ['', Validators.compose([Validators.required])],
      price: [
        1000,
        Validators.compose([Validators.required, Validators.min(1000)]),
      ],
      description: [''],
      quantityCard: [0],
      quantityProduct: [
        1,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      quantityListcard: [0],
    });
  }
  // onSelectfile(e) {
  //   if (e.target.files) {
  //     this.selectedFile = <File>e.target.files[0];
  //   }
  // }
  // onUpload() {
  //   if (this.selectedFile) {
  //     let reader = new FileReader();
  //     reader.readAsDataURL(this.selectedFile);
  //     reader.onload = (event: any) => {
  //       this.url = event.target.result;
  //     };
  //     const fd = new FormData();
  //     fd.append('image', this.selectedFile, this.selectedFile.name);

  //     this.http.post('http://localhost:4200/assets', fd).subscribe((res) => {
  //       console.log(res);
  //     });
  //   }
  // }

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
        quantityCard: product.quantity.card,
        quantityListcard: product.quantity.listcard,
        quantityProduct: product.quantity.product,
      });
    }
  }

  // submit form
  onSubmit() {
    if (this.addForm.value.id) {
      const item = {
        id: this.addForm.value.id,
        name: this.addForm.value.name,
        price: this.addForm.value.price,
        description: this.addForm.value.description,
        quantity: {
          card: this.addForm.value.quantityCard,
          listcard: this.addForm.value.quantityListcard,
          product: this.addForm.value.quantityProduct,
        },
      };
      this.productService.updateProduct(item);
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
      new Quantity(0, 0, this.addForm.value.quantityProduct)
    );

    this.productService.addProduct(item); // add new item vào service
  }
  // khi click lệnh cancel
  cancel() {
    this.show = false;
    this.cleanForm();
  }
  // set lại rỗng cho form
  cleanForm() {
    this.addForm.reset();
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
