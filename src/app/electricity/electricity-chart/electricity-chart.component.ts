import { Component, OnInit,Input } from '@angular/core';
import { ElectricityService } from '../electricity-service';
import { ActivatedRoute, Params } from '@angular/router';
import { Electricity } from '../../models/Electricity';
import { Location }               from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-electricity-chart',
  template: `
 
    <div>
      <div [ng2-highcharts]="chartOptions" class="graph" id="chart" style="min-height: 660px"></div>

      <!--<div [ng2-highcharts]="chartOptions2" class="graph" (load)="saveInstance($event.context)"></div>-->

      <!--<div [ng2-highcharts]="chartOptions3" class="graph"></div>-->
    </div>
    
  `,
  styleUrls: ['./electricity-chart.component.css'],
  providers: [ElectricityService]
})
export class ElectricityChartComponent implements OnInit {
   electricity: Electricity;

  constructor(
    private electricityService: ElectricityService,
    private route: ActivatedRoute,
    private location: Location
  ) {

  }

  chartOptions: Object;
  ngOnInit() {
    var pointList;
    var imeicode = this.route.snapshot.params['deviceIMEI'];
    var arr;
    var arr2;
    init();
    this.chartOptions = {
      chart: { type: 'spline' },
      title: { text : '电量详情'},
      xAxis: {
        categories: arr2
      },
      yAxis: {
        title: {
          text: ''
        },
        labels: {//y轴刻度文字标签
          formatter: function () {
            return this.value + '%';//y轴加上%
          }
        },
        plotLines: [{//区域划分线，0刻度
          value: 0,
          width: 1,
          color: '#3582d9'
        }]
      },

      series: [{id :'exSeries', data: arr}]
    };

   $('#searchit').on('click',function () {
     var exSeries =  $('#chart').highcharts().get('exSeries');
     init();
     exSeries.setData(arr, true, false, false);
     // this.chartOptions.series.data=arr;
   })

    function init(){
      var start= $('#start').val();
      var end = $('#end').val();
      var result;
      var paramms = {imeiCode:imeicode,startTime:start,endTime:end}
      if(paramms.startTime==''){
        delete paramms['startTime'];
      }
      if(paramms.endTime==''){
        delete paramms['endTime'];
      }
      $.ajax({
        type: "post",
        url: "/api/query/messageAll",
        contentType:"application/json",
        dataType: "json",
        data:JSON.stringify(paramms),
        cache: false,
        async: false,
        success: function(data){
          result=data.objectbean
        }
      });
      pointList=result;
          var count = 0;
          for(var i in pointList){
            count ++;
          }
       arr=[];
       arr2=[];
          for (let i = 0; i < count;i++) {
            arr.push(parseInt(pointList[i].locationPower));
            arr2.push(pointList[i].locationTime);
      };

    }


  }

  // count={
  //   daa:[],
  //   data:[],
  //   time:[]
  // }

  // saveInstance(chartInstance: any) {
  //   this.chart = chartInstance;
  // }



}



