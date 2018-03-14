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

import { Helpers } from '../../models/helpers';
import { HelperService } from '../helpers-service';
import { ActivatedRoute, Params }   from '@angular/router';
import { fadeIn } from '../../animations/fade-in';
declare var $:any;
declare var layer:any;

@Component({
  selector: 'app-helpers-table',
  templateUrl: './helpers-table.component.html',
  styleUrls: ['./helpers-table.component.css'],
  animations: [ fadeIn]
})
export class HelpersTableComponent implements OnInit {
  helpers: Helpers[];
  helper: Helpers;
  selectedHelper: Helpers;
  tjmenu:boolean;
  clicked:boolean;
  deletemenu:boolean = false;
  Helpers=new Helpers();
  parentNames = [];
  submied:boolean = false;
  addbtn:boolean = false;
  edit:boolean = false;
  del:boolean = false;
  public params; // 保存页面url参数
  public totalNum; // 总数据条数
  public pageSize = 10;// 每页数据条数
  public totalPage ;// 总页数
  public totalPages = 7 ;// 分页显示数目
  public curPage = 1;// 当前页码
  public isEmpty:boolean = false;
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
    private userService: HelperService,
    private location: Location
  ) {
    // // 4. 初始化表达组里面的内容
    // this.form = new FormGroup({
    //   phone: new FormControl('', CustomValidators.phone("zh-CN"))
    // });

  }
  // 添加选择数据初始化
  searchParMenu(): void{
    // this.parentNames=[];
    // this.addIDs=[];
    // this.addIDs2=[];
    // this.term={};
    // this.userService.getMenuDatas().then( menus => {
    //   this.menus = menus['allList']
    //   console.log(this.menus)
    // });
  }
  // 编辑选择数据初始化
  searchParMenu2(){

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
    for (var i = 0; i < this.pageList.length; i++) {
      this.pageList[i].isActive = false;
    }
    this.pageList[0].isActive = true;
    }

  changePage(index) {
    this.userService.getMenuDatas(index,10).then( res => {
      if(res['code'] == 0){
        this.helpers = res['data']['list'];
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


  delete(helper: Helpers): void{
    var ak = layer.open({
      content: '确定删除？'
      , btn: ['确定', '取消']
      , yes: () => {
        this.userService.delete(helper.volunteerId).then(res =>{
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
          this.resetPagingArr();
        })
      }
      , btn2: () => {

      }
    })
  }

  getElectricities2(index:number): void {
    this.userService.getMenuDatas(index,10).then( res => {
      if(res['code'] == 0){
        this.curPage = res['data']['pageNum'];
        if(res['data']['list']){
          this.helpers = res['data']['list'];
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
    this.userService.getMenuDatas(1,10).then( res => {
       layer.close(index);
      if(res['code'] == 0){
        this.curPage = res['data']['pageNum'];
        if(res['data']['list']){
          this.helpers = res['data']['list'];
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
    this.userService.getRescuesList().then( menus => {
      for(let i=0;i<menus.length;i++){
        this.rescueTeams.push(menus[i])
      }
    });
  }

  onSelect(helper: Helpers): void {
    this.selectedHelper = helper;
    console.log(this.selectedHelper)
  }

  cancel(){
    this.getElectricities2(this.curPage);
  }

  search2(term: string): void{
    this.userService.search2(term).then( menus => {
      if(!menus){
        layer.open({
          title: '提示'
          ,content: '没有查询到数据'
        });
        return
      }
      if(this.helpers.length==0){
        layer.open({
          title: '提示'
          ,content: '没有查询到数据！'
        });
      }
      if(menus['volunteerId']){
        this.helpers = [];
        this.helpers.push(menus);
      }
    });
  }

  add(helperName: string, sex: string, password: string,phone: string,
      nationalId: string, personnelForm:string ,rescue: number,file:File ): void {
    helperName = helperName.trim();
    phone = phone.trim();
    nationalId = nationalId.trim();
    if (!helperName && !sex  && !password && !phone && !nationalId && rescue ) { return; }
    $("#addWear").attr({"disabled":"disabled"});
    let index = layer.load(1, {shade: false,offset: '30%'});
    this.userService.create(helperName,sex,password,phone,nationalId,personnelForm,rescue,this.imgg)
      .subscribe(res => {
        $("#addWear").removeAttr("disabled");
        layer.close(index);
        if(res["status"]==1){
          layer.open({
            title: '提示'
            ,content: '添加成功'
          });
          // this.resetPagingArr();
          $('#imageUrl').val('');
          this.getElectricities2(this.curPage);
          this.selectedHelper = null;
          this.tjmenu = false;
          this.clicked = false;
        }else{
          layer.open({
            title: '提示'
            ,content: '添加失败'+res["msg"],
            end:function () {
              $('#helperName').focus();
            }
          });
        }
      });
  }

  onFileChanged(fileList: FileList) {
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.imgg = file;
      // let formData: FormData = new FormData();
      // formData.append('uploadFile', file, file.name);
    //   let headers = new Headers({
    //     "Accept": "application/json"
    //   });
    //   let options = new RequestOptions({ headers });
    //   this.http.post("https://localhost:44372/api/uploadFile", formData, options)
    //     .map(res => res.json())
    //     .catch(error => Observable.throw(error))
    //     .subscribe(
    //       data => console.log('success' + data),
    //       error => console.log(error)
    //     )
    }
  }

  save(): void {
    $("#saveWear").attr({"disabled":"disabled"});
    this.userService.update(this.selectedHelper)
      .then(res => {
        $("#saveWear").removeAttr("disabled");
        if(res["status"]==1){
          layer.open({
            title: '提示'
            ,content: '修改成功'
          });
          this.getElectricities2(this.curPage);
          this.selectedHelper = null;
          this.deletemenu = false;
          this.clicked = false;
        }else{
          layer.open({
            title: '提示'
            ,content: '修改失败'+res["msg"],
            end:function () {
              $('#helperName2').focus();
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
  // search(term: string): void {
  //   this.searchTerms.next(term);
  // }


}







