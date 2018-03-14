import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CKEditorModule} from 'ng2-ckeditor';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import {CustomFormsModule} from "ng2-validation";
import { RouterModule } from '@angular/router';

import { DeviceService } from '../device/device-service';
import { deviceRoutes } from './device.routes';
import { DeviceComponent } from './device.component';
import { DeviceTableComponent } from './device-table/device-table.component';


@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    CKEditorModule,
    ModalModule.forRoot(),
    RouterModule.forChild(deviceRoutes)
  ],
  declarations: [
    DeviceTableComponent,
    DeviceComponent
  ],
  providers: [ DeviceService ]
})
export class DeviceModule { }

