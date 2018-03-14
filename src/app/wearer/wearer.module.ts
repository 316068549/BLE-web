import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomFormsModule} from "ng2-validation";

import { WearerService } from '../wearer/wearer-service';
import { wearerRoutes } from './wearer.routes';
import { WearerComponent } from './wearer.component';
import { WearerTableComponent } from './wearer-table/wearer-table.component';
import { sexChangePipe } from './wearer-table/wearer.pipe';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(wearerRoutes)
  ],
  declarations: [
    WearerTableComponent,
    WearerComponent,
    sexChangePipe
  ],
  providers: [ WearerService ]
})
export class WearerModule { }

