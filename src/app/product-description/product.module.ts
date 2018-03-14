import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomFormsModule} from "ng2-validation";

import { ProductService } from './product-service';
import { productRoutes } from './product.routes';
import { ProductComponent } from './product.component';
import { ProductTableComponent } from './product-table/product-table.component';
import { timeChangePipe } from './time.pipe';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(productRoutes)
  ],
  declarations: [
    ProductTableComponent,
    ProductComponent,
    timeChangePipe
  ],
  providers: [ ProductService ]
})
export class ProductModule { }

