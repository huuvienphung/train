import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { MessageModule } from 'primeng/message';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CardRoutingModule } from './card-routing.module';
import { DialogCardComponent } from './dialog-card/dialog-card.component';
import { ListCardComponent } from './list-card/list-card.component';
import { ViewCardComponent } from './view-card/view-card.component';

@NgModule({
  declarations: [DialogCardComponent, ListCardComponent, ViewCardComponent],
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
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
    ConfirmDialogModule,
    MenubarModule,
    MenuModule,
    InputNumberModule,
    DynamicDialogModule,
    MessageModule,
    RouterModule.forChild(CardRoutingModule),
  ],
})
export class CarddModule {}
