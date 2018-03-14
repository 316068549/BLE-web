import 'rxjs/add/operator/switchMap';
import {  OnDestroy,Component, OnInit,OnChanges,SimpleChanges, }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';

import { Electricity }         from '../../models/electricity';
import { ElectricityService }  from '../electricity-service';
import { ElectricityChartComponent } from'../electricity-chart/electricity-chart.component'

@Component({
  selector: 'app-electricity-detail',
  templateUrl: './electricity-detail.component.html',
  styleUrls: ['./electricity-detail.component.css'],
  providers: [ElectricityService]
})
export class ElectricityDetailComponent implements  OnInit{

  electricity: Electricity;


  params={
    daa:[],
    data:[],
    time:[]
  }
  constructor(
    private electricityService: ElectricityService,
    private route: ActivatedRoute,
    private location: Location
  ) {



  }

  ngOnInit(): void {

    this.route.params
      .switchMap((params: Params) => this.electricityService.getElectricity(params['deviceIMEI'].toString()))
      .subscribe(electricity => {
        this.electricityService.dataed = electricity;
        this.electricity = electricity;
        console.log(this.electricity);
        var count = 0;
        for(var i in this.electricity){
          count ++;
        }
        let arr=[];
        let arr2=[];
        for (let i = 0; i < count;i++) {
          arr.push(this.electricity[i].locationPower);
          arr2.push(this.electricity[i].locationTime);
          };

        this.params.data=arr;
        this.params.time=arr2;
        console.log(this.params);
      });
  }


  goBack(): void {
    this.location.back();
  }

}
