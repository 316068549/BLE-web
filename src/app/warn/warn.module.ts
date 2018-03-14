import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import {CustomFormsModule} from "ng2-validation";
import { RouterModule } from '@angular/router';

import { WarnService} from './warn-table/service/warn-service';
import { warnRoutes } from './warn.routes';
import { WarnComponent } from './warn.component';
import { WarnTableComponent } from './warn-table/warn-table.component';
import { WarnDetailComponent } from './warn-detail/warn-detail.component';
import { GaodeMapComponent } from './warn-detail/gaode-map/gaode-map.component';




@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(warnRoutes)
  ],
  declarations: [
    WarnTableComponent,
    WarnComponent,
    WarnDetailComponent,
    GaodeMapComponent
  ],
  providers: [ WarnService ]
})
export class WarnModule { }

