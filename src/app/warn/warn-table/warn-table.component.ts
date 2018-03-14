import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Warn } from '../../models/warn';
import { WarnService} from './service/warn-service';
declare var $:any;
declare var layer: any;


@Component({
  selector: 'app-warn-table',
  templateUrl: './warn-table.component.html',
  styleUrls: ['./warn-table.component.css']
})
export class WarnTableComponent implements OnInit {
  public data: any[];
  rowsOnPage = 10;
  sortOrder = "asc";
  warnes: Warn[];
  warn: Warn;
  selectedWarn: Warn;


  constructor(
    private router: Router,
    private warnService: WarnService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getWarnes();
  }
  getWarnes(): void {
    this.warnService.getWarnes().then( warnes => {
      this.warnes = warnes;
      this.data = this.warnes;
    });
  }

  onSelect(warn: Warn): void {
    this.selectedWarn = warn;
    // console.log(electricity.data);

  }

  search(IMEI: string) {
    return this.warnService.search(IMEI).subscribe(
      res => {
        this.data = res;
      },
      error => {
        console.log(error);
        if (error.message.indexOf('Unexpected end of JSON input') > -1) {
          layer.open({
            title: '提示'
            ,content: '没有查询到数据！'
          });
          // this.data = res;
          return;
        }

      },
      () => { }
    );
  }
  gotoDetail(IMEI: string,alarmId:string): void {

    this.router.navigate(['home/warn/detail/'+IMEI+'/'+alarmId]);
  }

  goBack(): void {
    this.location.back();
  }


}







