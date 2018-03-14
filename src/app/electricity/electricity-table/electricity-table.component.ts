import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';
// 2. 引入ng2-validation中的组件
import {CustomValidators} from 'ng2-validation';
import { Subject }           from 'rxjs/Subject';

import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Electricity } from '../../models/electricity';
import { ElectricityService} from '../electricity-service';
declare var $:any;
declare var layer: any;

@Component({
  selector: 'app-electricity-table',
  templateUrl: './electricity-table.component.html',
  styleUrls: ['./electricity-table.component.css']
})
export class ElectricityTableComponent implements OnInit {

  public data: any[];
  countChange($event) {
    console.log($event)
    console.log(typeof ($event))
    this.data = $event;
  }
  rowsOnPage = 10;
  // sortBy = "parentCode";
  sortOrder = "asc";
  electricities: Electricity[];
  electricity: Electricity;
  selectedElectricity: Electricity;
  Menu=new Electricity();


  constructor(
    private router: Router,
    private electricityService: ElectricityService,
    private location: Location) {
  }
  ngOnInit(): void {
    this.getElectricities();
  }
  getElectricities(): void {
    // this.electricityService.getElectricities()
    //   .subscribe(
    //     res=>{
    //       console.log(res);
    //       this.data = res;
    //     },
    //     error => {alert(error)
    //     },
    //     () => {}
    //   );
    this.electricityService.getElectricities().then( electricities => {
      console.log(electricities)
      // this.electricities = electricities
      // this.data = this.electricities;
    });
  }

  onSelect(electricity: Electricity): void {
    this.selectedElectricity = electricity;

  }
  // search(IMEI: string) {
  //   return this.electricityService.search(IMEI).subscribe(
  //     res => {
  //       this.data = res;
  //     },
  //     error => {
  //       console.log(error);
  //       if (error.message.indexOf('Unexpected end of JSON input') > -1) {
  //         layer.open({
  //           title: '提示'
  //           ,content: '没有查询到数据！'
  //         });
  //         // this.data = res;
  //         return;
  //       }
  //
  //     },
  //     () => { }
  //   );
  // }

  goBack(): void {
    this.location.back();
  }
  toInt(num: string) {
    return +num;
  }

  sortByWordLength = (a: any) => {
    return a.city.length;
  }

}






