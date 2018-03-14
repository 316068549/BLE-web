import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {CKEditorModule} from 'ng2-ckeditor';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomFormsModule} from "ng2-validation";

import { PayService } from '../pay/pay-service';
import { payRecordsRoutes } from './pay-records.routes';
import { timeChangePipe } from './time.pipe';
import { PayRecordsComponent } from './pay-records.component';
import { PayRecordsTableComponent } from './pay-records-table/pay-records-table.component';

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
    RouterModule.forChild(payRecordsRoutes)
  ],
  declarations: [
    PayRecordsTableComponent
    ,
    timeChangePipe,
    PayRecordsComponent
  ],
  providers: [ PayService ]
})
export class PayRecordsModule { }


