import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import {CustomFormsModule} from "ng2-validation";
import { RouterModule } from '@angular/router';

import { RescuePapersService } from '../rescuepapers/rescuepapers-service';
import { rescuePaperRoutes } from './rescuepapers.routes';
import { RescuepapersComponent } from './rescuepapers.component';
import { RescuepapersTableComponent } from './rescuepapers-table/rescuepapers-table.component';
import { RescueDetailComponent } from './rescue-detail/rescue-detail.component';
import { timeChangePipe } from './time.pipe';

@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(rescuePaperRoutes)
  ],
  declarations: [
    RescuepapersTableComponent,
    RescuepapersComponent,
    RescueDetailComponent,
    timeChangePipe
  ],
  providers: [ RescuePapersService ]
})
export class RescuepapersModule { }

