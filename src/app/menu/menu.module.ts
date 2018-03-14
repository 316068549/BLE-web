import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PaginationModule, ModalModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import {CustomFormsModule} from "ng2-validation";
import { RouterModule } from '@angular/router';
import { menuRoutes } from './menu.routes';
import { MenuComponent } from './menu.component';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';
import { MenuTableComponent } from './menu-table/menu-table.component';
import { MenuSearchComponent } from './menu-search/menu-search.component';
import { timeChangePipe } from './menu-table/time.pipe';


@NgModule({
  imports: [
    SharedModule,
    DataTableModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(menuRoutes)
  ],
  declarations: [
    MenuComponent,
    MenuDetailComponent,
    MenuTableComponent,
    MenuSearchComponent,
    timeChangePipe
  ]
})
export class MenuModule { }
