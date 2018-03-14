import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomFormsModule} from "ng2-validation";
import {CKEditorModule} from 'ng2-ckeditor';

import { ServService } from './serv-service';
import { servRoutes } from './serv.routes';
import { ServComponent } from './serv.component';
import { ServTableComponent } from './serv-table/serv-table.component';
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
    RouterModule.forChild(servRoutes)
  ],
  declarations: [
    ServTableComponent,
    ServComponent,
    timeChangePipe
  ],
  providers: [ ServService ]
})
export class ServModule { }

