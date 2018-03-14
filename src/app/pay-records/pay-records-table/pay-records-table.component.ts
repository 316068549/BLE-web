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

import { PayRecord } from '../../models/pay-record';
import { PayService } from '../../pay/pay-service';
import { ActivatedRoute, Params }   from '@angular/router';
import { fadeIn } from '../../animations/fade-in';
declare var $:any;
declare var layer:any;

@Component({
  selector: 'app-pay-records-table',
  templateUrl: './pay-records-table.component.html',
  styleUrls: ['./pay-records-table.component.css'],
  animations: [ fadeIn]
})
export class PayRecordsTableComponent implements OnInit {
  payRecords: PayRecord[];
  payRecord: PayRecord;
  selectedPayRecord: PayRecord;
  tjmenu:boolean;
  clicked:boolean;
  deletemenu:boolean = false;
  PayRecord=new PayRecord();
  parentNames = [];
  submied:boolean = false;
  addbtn:boolean = false;
  edit:boolean = false;
  del:boolean = false;
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
  pages: any;
  term={};
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
    return this.userService.search(IMEI).then(
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
          this.payRecords = menus['list'];
          this.isSearch = true
        }

        // this.router.navigate(['/detail', deviceIMEI])
      })
  }

  changePage(index) {
    this.userService.getMenuDatas(index,10).then( res => {
      if(res['code'] == 0){
        this.payRecords = res['data']['list'];
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


  // delete(description: Description): void{
  //   var ak = layer.open({
  //     content: '确定删除？'
  //     , btn: ['确定', '取消']
  //     , yes: () => {
  //       this.userService.delete(description.manualId).then(res =>{
  //         if(res['code'] == 0){
  //         }else if(res['code'] == 5){
  //           alert(res['error']);
  //           this.router.navigate(['login']);
  //         }else if(res['code'] == 6){
  //           alert(res['error']);
  //           this.router.navigate(['login']);
  //         }else{
  //           alert(res['error']);
  //         }
  //         layer.close(ak);
  //         this.getElectricities2(this.curPage);
  //       })
  //     }
  //     , btn2: () => {
  //
  //     }
  //   })
  // }


  getElectricities(): void {
    let index = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    this.userService.getMenuDatas2(1,10).then( res => {
      layer.close(index);
      if(res['code'] == 0){
        if(res['data']['list']){
          this.payRecords = res['data']['list'];
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

  onSelect(payRecord: PayRecord): void {
    this.selectedPayRecord = payRecord;
  }

  // gotoDetail(): void {
  //   this.router.navigate(['/user-detail', this.selectedMenu.id]);
  // }

  goBack(): void {
    this.location.back();
  }



}







