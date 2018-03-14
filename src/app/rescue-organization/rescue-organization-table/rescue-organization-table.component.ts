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

import { Organization } from '../../models/rescue-organization';
import { RescueOrganizationService } from '../rescue-organization-service';
import { ActivatedRoute, Params }   from '@angular/router';
import { fadeIn } from '../../animations/fade-in';
declare var $:any;
declare var layer:any;

@Component({
  selector: 'rescue-organization-table',
  templateUrl: './rescue-organization-table.component.html',
  styleUrls: ['./rescue-organization-table.component.css'],
  animations: [ fadeIn]
})
export class RescueOrganizationTableComponent implements OnInit {
  organizations: Organization[];
  organization: Organization;
  selectedOrganization: Organization;
   tjmenu:boolean;
   clicked:boolean;
   deletemenu:boolean = false;
  Organization=new Organization();
  parentNames=[];
   childNames = [];
   childNames2 = [];
   rescueParents = [];
   proCode:string;//修改省绑定
   cityCode:string;//修改市绑定
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
  public pageList= [{
    isActive: true,
    pageNum: '1'
  }];
  rescueTeams = [];
  pages: any;
  term={};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: RescueOrganizationService,
    private location: Location
  ) {

  }
  //分页
  changePage(index) {
    this.userService.getMenuDatas(index,5).then( res => {
      if(res['code'] == 0){
        this.organizations = res['data']['list'];
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
  // 添加选择数据初始化
  searchParMenu(): void{
    this.parentNames=[];
    this.term={};
    this.choiceProvince();
  }
  // 编辑选择数据初始化
  searchParMenu2(org:Organization){
    this.choiceProvince();
    if(!org.rescueParentCode){
      this.proCode = '0';
    }else{
      this.proCode = org.code.substring(0,2)+'0000';
      console.log(org.code.substr(2,2))
      console.log(org.code.substring(4,6))
      if(org.code.substr(2,2)!='00'){
        this.cityCode = org.code.substring(0,4)+'00';
        this.choiceCity(this.proCode);
      }
      if(org.code.substring(4,6)!='00'){
        this.choiceSec(this.cityCode);
      }
      this.getPars(org.code);
    }

  }
  ngOnInit(): void {
    // var imeicode = this.route.snapshot.params['deviceIMEI'];
    this.route.params
      .switchMap((params: Params) => this.userService.getMenuBtns(params['permissionId']))
      .subscribe(rescue => {
        for(let i=0;i<rescue.length;i++){
          if(rescue[i].permissionUrl=="add"){
            this.addbtn = true;
          }
          if(rescue[i].permissionUrl=="edit"){
            this.edit = true;
          }
          if(rescue[i].permissionUrl=="del"){
            this.del = true;
          }

        }
      });
    this.getElectricities();
  }

  // 添加设备
  addImei(){

  }
  //地区选择
  choiceProvince(){
    this.userService.getProvinces().then( menus => {
      if(menus["status"]==1){
        this.parentNames = menus['data']
        console.log(this.parentNames)
      }else{
        layer.open({
          title: '提示'
          ,content: '查询地区失败'+menus["msg"]
        });
      }
    });
  }
  choiceCity(id:any){
    if(id==0){
      return
    }
    this.userService.getCitys(id).then( menus => {
      if(menus["status"]==1){
        this.childNames = menus['data']
        console.log(this.childNames)
      }else{
        layer.open({
          title: '提示'
          ,content: '查询地区失败'+menus["msg"]
        });
      }
    });
  }
  choiceCity2(id:any){
    this.choiceCity(id);
    this.getPars(id);
  }
  choiceSec(id:string){
    this.userService.getSections(id).then( menus => {
      if(menus["status"]==1){
        this.childNames2 = menus['data']
        console.log(this.childNames2)
      }else{
        layer.open({
          title: '提示'
          ,content: '查询地区失败'+menus["msg"]
        });
      }
    });
  }
  choiceSec2(id:string){
    this.choiceSec(id);
    this.getPars(id);
  }
  //上级选择
  getPars(id:string){
    this.userService.getPars(id).then( menus => {
      if(menus["status"]==1){
        this.rescueParents = menus['data']
        console.log(this.rescueParents)
      }else{
        layer.open({
          title: '提示'
          ,content: '查询上级失败'+menus["msg"]
        });
      }
    });
  }






  delete(organization: Organization): void{
    var ak = layer.open({
      content: '确定删除？'
      , btn: ['确定', '取消']
      , yes: () => {
        this.userService.delete(organization.rescueCenterId).then(res =>{
          if(res['code'] == 0){
          }else if(res['code'] == 5){
            alert(res['error']);
            this.router.navigate(['login']);
          }else if(res['code'] == 6){
            alert(res['error']);
            this.router.navigate(['login']);
          }else{
            alert(res['error']);
          }
          layer.close(ak);
          this.getElectricities2(this.curPage);
        })
      }
      , btn2: () => {

      }
    })
  }

  getElectricities2(index:number): void {
    this.userService.getMenuDatas(index,5).then( res => {
      if(res['code'] == 0){
        this.curPage = res['data']['pageNum'];
        if(res['data']['list']){
          this.organizations = res['data']['list'];
        }else{
          this.isEmpty=true;
        }
        this.totalNum   = res['data']['total'];
        this.totalPage   = res['data']['pages'];
        this.setPagingArr();
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

  getElectricities(): void {
    let index = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    this.userService.getMenuDatas(1,5).then( res => {
      layer.close(index);
      if(res['code'] == 0){
        this.curPage = res['data']['pageNum'];
        if(res['data']['list']){
          this.organizations = res['data']['list'];
        }else{
          this.isEmpty=true;
        }
        this.totalNum   = res['data']['total'];
        this.totalPage   = res['data']['pages'];
        this.setPagingArr();
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

  onSelect(organization: Organization): void {
    this.selectedOrganization = organization;
  }

  cancel(){
    this.getElectricities2(this.curPage);
    this.selectedOrganization = null;
    this.cancel2();
  }

  cancel2(){
    this.parentNames=[];
    this.childNames = [];
    this.childNames2 = [];
    this.rescueParents = [];
  }


  Add(rescueCenterName:string,rescueChargeName: string,code:string ,code1:string ,code2:string ,ChargeMobile: string, address: any,address1: any,address2: any,mark: string,
      rescueParentCode: string): void{
    console.log(address)
    if(code2){
      this.add(rescueCenterName,rescueChargeName,code2,ChargeMobile,address2,mark,rescueParentCode);
    }else if(!code2&&code1){
      this.add(rescueCenterName,rescueChargeName,code1,ChargeMobile,address1,mark,rescueParentCode);
    }else {
      this.add(rescueCenterName,rescueChargeName,code,ChargeMobile,address,mark,rescueParentCode);
    }
  }
  add(rescueCenterName:string,rescueChargeName: string,code:string ,ChargeMobile: string, address: string,mark: string,
      rescueParentCode: string): void {
    rescueCenterName = rescueCenterName.trim();
    rescueChargeName = rescueChargeName.trim();
    ChargeMobile = ChargeMobile.trim();
    if (!rescueCenterName && !rescueChargeName && !code && !ChargeMobile  && !address && !mark && !rescueParentCode ) { return; }
    let index = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    $("#addWear").attr({"disabled":"disabled"});
    this.userService.create(rescueCenterName,rescueChargeName,code,ChargeMobile,address,mark,rescueParentCode)
      .subscribe(res => {
        layer.close(index);
        $("#addWear").removeAttr("disabled");
        if(res["status"]==1){
          layer.open({
            title: '提示'
            ,content: '添加成功'
          });
          this.getElectricities2(this.curPage);
          this.selectedOrganization = null;
          this.parentNames=[];
          this.childNames = [];
          this.childNames2 = [];
        this.rescueParents = [];
          this.tjmenu = false;
          this.clicked = false;
        }else{
          layer.open({
            title: '提示'
            ,content: '添加失败'+res["msg"],
            end:function () {
              $('#description').focus();
            }
          });
        }
      });
  }

  Save(rescueCenterId:string,rescueCenterName:string,rescueChargeName: string,code:string ,code1:string ,code2:string ,ChargeMobile: string,
       address: any,mark: string,
       rescueParentCode: string){
    console.log(address)
    if(code2){
      let address2 = $('#sec2').find('option:selected').text();
      console.log(address2)
      this.save(rescueCenterId,rescueCenterName,rescueChargeName,code2,ChargeMobile,address2,mark,rescueParentCode);
    }else if(!code2&&code1){
      let address1 = $('#childname2').find('option:selected').text();
      console.log(address1)
      this.save(rescueCenterId,rescueCenterName,rescueChargeName,code1,ChargeMobile,address1,mark,rescueParentCode);
    }else {
      this.save(rescueCenterId,rescueCenterName,rescueChargeName,code,ChargeMobile,address,mark,rescueParentCode);
    }
  }
  save(rescueCenterId:string,rescueCenterName:string,rescueChargeName: string,code:string,ChargeMobile: string, address: string,mark: string,
       rescueParentCode: string): void {
    $("#saveWear").attr({"disabled":"disabled"});
    this.userService.update(rescueCenterId,rescueCenterName,rescueChargeName,code,ChargeMobile,address,mark,rescueParentCode)
      .subscribe(res => {
        $('#saveWear').removeAttr('disabled');
        if(res["status"]==1){
          layer.open({
            title: '提示'
            ,content: '修改成功'
          });
          // this.resetPagingArr();
          this.getElectricities2(this.curPage);
          this.selectedOrganization = null;
          this.deletemenu = false;
          this.clicked = false;
        }else{
          layer.open({
            title: '提示'
            ,content: '修改失败'+res["msg"],
            end:function () {
              $('#deviceIMEI2').focus();
            }
          });
        }
    });
  }
  // gotoDetail(): void {
  //   this.router.navigate(['/user-detail', this.selectedMenu.id]);
  // }

  goBack(): void {
    this.location.back();
  }



}







