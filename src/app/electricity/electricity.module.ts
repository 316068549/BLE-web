import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import {CustomFormsModule} from "ng2-validation";
import { RouterModule } from '@angular/router';
import { Ng2HighchartsModule } from 'ng2-highcharts';

import { ElectricityService} from './electricity-service';
import { electricityRoutes } from './electricity.routes';
import { ElectricityComponent } from './electricity.component';
import { ElectricityTableComponent } from './electricity-table/electricity-table.component';
import { ElectricityDetailComponent } from './electricity-detail/electricity-detail.component';
import { ElectricityChartComponent } from './electricity-chart/electricity-chart.component';


@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    Ng2HighchartsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(electricityRoutes)
  ],
  declarations: [
    ElectricityTableComponent,
    ElectricityComponent,
    ElectricityDetailComponent,
    ElectricityChartComponent
  ],
  providers: [ ElectricityService ]
})
export class ElectricityModule { }

