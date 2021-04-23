import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogComponent } from './dialog/dialog.component';
import { ListProductComponent } from './list-product/list-product.component';
import { ViewProductComponent } from './view-product/view-product.component';

@NgModule({
  declarations: [
    AppComponent,
    ListProductComponent,
    DialogComponent,
    ViewProductComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    MenubarModule,
    MenuModule,
    BrowserAnimationsModule,
    PanelMenuModule,
    TableModule,
    DialogModule,
    ToastModule,
    AutoCompleteModule,
    InputTextModule,
    InputTextareaModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
  ],
  providers: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
