import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomFormsModule} from "ng2-validation";

import { RescueOrganizationService } from './rescue-organization-service';
import { rescueOrganizationRoutes } from './rescue-organization.routes';
import { RescueOrganizationComponent } from './rescue-organization.component';
import { RescueOrganizationTableComponent } from './rescue-organization-table/rescue-organization-table.component';
import { timeChangePipe } from './time.pipe';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(rescueOrganizationRoutes)
  ],
  declarations: [
    RescueOrganizationTableComponent,
    RescueOrganizationComponent,
    timeChangePipe
  ],
  providers: [ RescueOrganizationService ]
})
export class RescueOrganizationModule { }

