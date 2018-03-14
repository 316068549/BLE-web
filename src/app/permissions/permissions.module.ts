import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import {CustomFormsModule} from "ng2-validation";
import { RouterModule } from '@angular/router';

import { PermissionService } from '../permissions/permissions-service';
import { permissionRoutes } from './permissions.routes';
import { PermissionComponent } from './permissions.component';
import { PermissionTableComponent } from './permissions-table/permissions-table.component';
import { timeChangePipe } from './permissions-table/time.pipe';

@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(permissionRoutes)
  ],
  declarations: [
    PermissionTableComponent,
    PermissionComponent,
    timeChangePipe
  ],
  providers: [ PermissionService ]
})
export class PermissionModule { }

