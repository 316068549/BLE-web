import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule} from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ng2-bootstrap';
import {DataTableModule} from "angular2-datatable";
import {CustomFormsModule} from "ng2-validation";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService }  from './in-memory-data.service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserLoginService } from './login/user-login.service';
import { appRoutes } from './app.routes';
import { MenuService} from './shared-service/menu-service';











@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule,
    DataTableModule,
    CustomFormsModule,
    ReactiveFormsModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService),
    AlertModule.forRoot(),
    RouterModule.forRoot(appRoutes)
  ],
  providers: [UserLoginService,MenuService],
  bootstrap: [AppComponent]
})
export class AppModule { }


