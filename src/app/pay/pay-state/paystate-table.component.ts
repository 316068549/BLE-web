import { Component, Input, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// 1. 引入forms中的组件
import {FormGroup, FormControl} from '@angular/forms';
// 2. 引入ng2-validation中的组件
import {CustomValidators} from 'ng2-validation';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { PayState } from '../../models/payState';
import { PayService } from '../pay-service';
import { ActivatedRoute, Params }   from '@angular/router';
import { fadeIn } from '../../animations/fade-in';
declare var $:any;
declare var layer:any;

@Component({
  selector: 'app-pay-table',
  templateUrl: './paystate-table.component.html',
  styleUrls: ['./paystate-table.component.css'],
  animations: [ fadeIn]
})
export class PayStateTableComponent implements OnInit {
  payStates: PayState[];
  payState: PayState;
  selectedPayState: PayState;
  tjmenu:boolean;
  clicked:boolean;
  deletemenu:boolean = false;
  PayState=new PayState();
  parentNames = [];
  submied:boolean = false;
  addbtn:boolean = false;
  edit:boolean = false;
  del:boolean = false;
  now:number;
  public params; // 保存页面url参数
  public totalNum; // 总数据条数
  public pageSize = 10;// 每页数据条数
  public totalPage ;// 总页数
  public totalPages = 7 ;// 总页数
  public curPage = 1;// 当前页码
  public isEmpty:boolean = false;
  public isSearch:boolean = false;
  public pageList= [{
    isActive: true,
    pageNum: '1'
  }];
  rescueTeams = [];
  pages: any;
  term={};
  public imgg:File;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: PayService,
    private location: Location
  ) {
  }

  ngOnInit(): void {
    // var imeicode = this.route.snapshot.params['deviceIMEI'];
    // this.route.params
    //   .switchMap((params: Params) => this.userService.getMenuBtns(params['permissionId']))
    //   .subscribe(rescue => {
    //     for(let i=0;i<rescue.length;i++){
    //       if(rescue[i].permissionUrl=="add"){
    //         this.addbtn = true;
    //       }
    //       if(rescue[i].permissionUrl=="edit"){
    //         this.edit = true;
    //       }
    //       if(rescue[i].permissionUrl=="del"){
    //         this.del = true;
    //       }
    //
    //     }
    //   });
    this.now = new Date().getTime();
    this.getElectricities();
  }

  setPagingArr() {
    if ( this.totalPage == this.pageList.length) {
      return
    }
    this.pageList = [{
      isActive: true,
      pageNum: '1'
    }];
    let offset = Math.floor(this.totalPages / 2) - 1;
    if(this.totalPage <= this.totalPages){
      for (let i=1;i < this.totalPage;i++){
        this.pageList.push({
          isActive:false,
          pageNum: ''+(i + 1)
        });
      }
    }else {
      if (this.curPage < this.totalPages - offset) {
        for (let i = 1; i < this.totalPages; i++) {
          this.pageList.push({
            isActive: false,
            pageNum: '' + (i + 1)
          });
        }
        this.pageList.push({
          isActive: false,
          pageNum: '...'
        });
        this.pageList.push({
          isActive: false,
          pageNum: '' + this.totalPage
        });
        //右边没有'...'
      }else if(this.curPage >= this.totalPage - offset - 1){
        this.pageList.push({
          isActive: false,
          pageNum: '...'
        });
        for(let i=this.totalPages - 2;i >= 0 ;i--){
          this.pageList.push({
            isActive: false,
            pageNum: ''+(this.totalPage - i)
          });
        }
        //两边都有'...'
      }else {
        this.pageList.push({
          isActive: false,
          pageNum: '...'
        });
        for(let i= this.curPage - offset;i < this.curPage + offset; i++){
          this.pageList.push({
            isActive: false,
            pageNum: '' + (i + 1)
          });
        }
        this.pageList.push({
          isActive: false,
          pageNum: '...'
        });
        this.pageList.push({
          isActive: false,
          pageNum: '' + this.totalPage
        });
      }
    }
  }

  resetPagingArr() {
    this.pageList[0].isActive = true;
    this.curPage = 0;
  }

  search(IMEI: string) {
    return this.userService.search2(IMEI).then(
      menus => {
        if(!menus['list']){
          layer.open({
            title: '提示'
            ,content: '没有查询到数据'
          });
          return
        }
        // if(menus['list'].length==0){
        //   layer.open({
        //     title: '提示'
        //     ,content: '没有查询到数据！'
        //   });
        // }
        if(menus['list'].length>0){
          this.payStates = menus['list'];
          this.isSearch = true
        }

        // this.router.navigate(['/detail', deviceIMEI])
      })
  }

  changePage(index) {
    this.userService.getMenuDatas(index,10).then( res => {
      if(res['code'] == 0){
        this.payStates = res['data']['list'];
        this.curPage = res['data']['pageNum'];
        this.setPagingArr();
        for (var i = 0; i < this.pageList.length; i++) {
          this.pageList[i].isActive = false;
          if(this.pageList[i].pageNum==''+this.curPage){
            this.pageList[i].isActive = true;
          }
        }
      }else if(res['code'] == 5){
        var ak = layer.open({
          content: res['error']+'请重新登录'
          , btn: ['确定']
          , yes: () => {
            this.router.navigate(['login']);
            layer.close(ak);
          }
        })
      }else{
        layer.open({
          title: '提示'
          ,content: res['error']
        });
      }

    })
  }

  getElectricities(): void {
    let index = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    this.userService.getMenuDatas(1,10).then( res => {
      layer.close(index);
      if(res['code'] == 0){
        if(res['data']['list']){
          this.payStates = res['data']['list'];
          this.curPage = res['data']['pageNum'];
          this.totalNum   = res['data']['total'];
          this.totalPage   = res['data']['pages'];
          this.setPagingArr();
        }else{
          this.isEmpty=true;
        }
      }else if(res['code'] == 5){
        var ak = layer.open({
          content: res['error']+'请重新登录'
          , btn: ['确定']
          , yes: () => {
            this.router.navigate(['login']);
            layer.close(ak);
          }
        })
      }else{
        layer.open({
          title: '提示'
          ,content: res['error']
        });
      }
    });
  }

  onSelect(payState: PayState): void {
    this.selectedPayState = payState;
  }

  // gotoDetail(): void {
  //   this.router.navigate(['/user-detail', this.selectedMenu.id]);
  // }

  goBack(): void {
    this.location.back();
  }



}







