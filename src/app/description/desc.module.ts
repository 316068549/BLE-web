import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import {CKEditorModule} from 'ng2-ckeditor';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomFormsModule} from "ng2-validation";

import { DescService } from './desc-service';
import { descRoutes } from './desc.routes';
import { DescComponent } from './desc.component';
import { DescTableComponent } from './desc-table/desc-table.component';
import { timeChangePipe } from './time.pipe';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DataTableModule,
    CKEditorModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(descRoutes)
  ],
  declarations: [
    DescTableComponent,
    DescComponent,
    timeChangePipe
  ],
  providers: [ DescService ]
})
export class DescModule { }

