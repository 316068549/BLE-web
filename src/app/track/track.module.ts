import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import {CustomFormsModule} from "ng2-validation";
import { RouterModule } from '@angular/router';


import { ElectricityService} from '../electricity/electricity-service';
import { trackRoutes } from './track.routes';
import { TrackComponent } from './track.component';
import { TrackTableComponent } from './track-table/track-table.component';
import { TrackDetailComponent } from './track-detail/track-detail.component';
import { GaodeMapComponent } from '../track/track-detail/gaode-map/gaode-map.component';

@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(trackRoutes)
  ],
  declarations: [
    TrackTableComponent,
    TrackComponent,
    TrackDetailComponent,
    GaodeMapComponent
  ],
  providers: [ ElectricityService ]
})
export class TrackModule { }

