import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import {CustomFormsModule} from "ng2-validation";
import { RouterModule } from '@angular/router';

import { UserService } from '../users/users-service';
import { userRoutes } from './users.routes';
import { UserComponent } from './users.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { timeChangePipe } from './users-table/time.pipe';


@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(userRoutes)
  ],
  declarations: [
    UsersTableComponent,
    UserComponent,
    timeChangePipe
  ],
  providers: [ UserService ]
})
export class UsersModule { }

