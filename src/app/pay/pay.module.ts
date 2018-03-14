import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {CKEditorModule} from 'ng2-ckeditor';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomFormsModule} from "ng2-validation";

import { PayService } from './pay-service';
import { payRoutes } from './pay.routes';
import { PayComponent } from './pay.component';
import { PayStateTableComponent } from './pay-state/paystate-table.component';
 import { timeChangePipe } from './time.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DataTableModule,
    CKEditorModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(payRoutes)
  ],
  declarations: [
    PayStateTableComponent,
    PayComponent
    ,
    timeChangePipe
  ],
  providers: [ PayService ]
})
export class PayModule { }


