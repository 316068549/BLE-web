import { Component, OnInit,Input,OnChanges, SimpleChange } from '@angular/core';
import { StatusService } from '../status-service'
import { ActivatedRoute, Params } from '@angular/router';
import { Status } from '../../models/status';
import { Location }               from '@angular/common';
declare var $:any;

@Component({
  selector: 'app-status-chart',
  template: `    
    <div>
      <div [ng2-highcharts]="chartOptions3" class="graph" style="height: 300px"></div>
    </div>
    
  `,
  styleUrls: ['./status-chart.component.css'],
  providers: [StatusService]
})
export class StatusChartComponent implements OnInit,OnChanges {
   status: Status;
  @Input()
  data: number;

  constructor(
    private StatusService: StatusService,
    private route: ActivatedRoute,
    private location: Location
  ) {

  }

  chartOptions3: Object;

  ngOnInit() {
   }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.chartOptions3 = {
      chart: {
        type: 'pie',
        backgroundColor: '#EEE',
        plotBackgroundColor: '#EEE',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        }
      },
      title: {
        text: '在线详情'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Browser share',
        data:  [
          ['不在线',100-this.data ],
          {
            name: '在线',
            y: this.data*100,
            sliced: true,
            selected: true
          }
        ]
      }]
    };

    for (let propName in changes) {
      let changedProp = changes[propName];
      let to = JSON.stringify(changedProp.currentValue);
      if (changedProp.isFirstChange()) {
        console.log(`Initial value of ${propName} set to ${to}`)
      } else {
        let from = JSON.stringify(changedProp.previousValue);
        console.log(`${propName} changed from ${from} to ${to}`)
      }
    }
  }


}



