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

import { Wearer } from '../../models/wearer';
import { familyPhone } from '../../models/family-phone';
import { sexChangePipe } from './wearer.pipe';
import { WearerService } from '../wearer-service';
import { ActivatedRoute, Params }   from '@angular/router';
import { fadeIn } from '../../animations/fade-in';
declare var $:any;
declare var layer:any;

@Component({
  selector: 'app-wearer-table',
  templateUrl: './wearer-table.component.html',
  styleUrls: ['./wearer-table.component.css'],
  animations: [ fadeIn]
})
export class WearerTableComponent implements OnInit {
  wearers: Wearer[];
  wearer: Wearer;
  selectedWearer: Wearer;
   tjmenu:boolean;
   clicked:boolean;
   deletemenu:boolean = false;
  phonemenu:boolean = false;
  Wearer=new Wearer();
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
    private userService: WearerService,
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

  // 添加设备
  addImei(){

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
        this.wearers = res['data']['list'];
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


  delete(wearer: Wearer): void{
    var ak = layer.open({
      content: '确定删除？'
      , btn: ['确定', '取消']
      , yes: () => {
        this.userService.delete(wearer.oldManId).then(res =>{
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
    this.userService.getMenuDatas(index,10).then( res => {
      if(res['code'] == 0){
        this.curPage = res['data']['pageNum'];
        if(res['data']['list']){
          this.wearers = res['data']['list'];
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
          this.wearers = res['data']['list'];
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

  onSelect(wearer: Wearer): void {
    this.selectedWearer = wearer;
    console.log(this.selectedWearer)
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
      if(this.wearers.length==0){
        layer.open({
          title: '提示'
          ,content: '没有查询到数据！'
        });
      }
      if(menus[0]['oldManId']){
         this.wearers = [];
         this.wearers.push(menus[0]);
        this.pageList = [{
          isActive: true,
          pageNum: '1'
        }];
        this.totalPage=1;
      }
    });
  }

  add(imei:string,Name: string,lastName:string ,sex: string, age: number,phone: string,
      address: string,phone1:string,phone2:string,phone3:string,phone4:string,phone5:string): void {
    Name = Name.trim();
    lastName = lastName.trim();
    phone = phone.trim();
    phone1 = phone1.trim();
    if (!imei && !Name && !lastName && !sex  && !age && !phone && !address && !phone1 ) { return; }
    let index = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    $("#addWear").attr({"disabled":"disabled"});
    this.userService.create(imei,Name,lastName,sex,age,phone,address,phone1,phone2,phone3,phone4,phone5)
      .subscribe(res => {
        layer.close(index);
        $("#addWear").removeAttr("disabled");
        if(res["status"]==1){
          layer.open({
            title: '提示'
            ,content: '添加成功'
          });
          $('#imageUrl').val('');
          this.getElectricities2(this.curPage);
          this.selectedWearer = null;
          this.tjmenu = false;
          this.clicked = false;
        }else{
          layer.open({
            title: '提示'
            ,content: '添加失败'+res["msg"],
            end:function () {
              $('#deviceIMEI').focus();
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

  save(oldManId:string,Name: string,lastName:string ,sex: string, age: number,phone: string,
       address: string ): void {
    $("#saveWear").attr({"disabled":"disabled"});
    this.userService.update(oldManId,Name,lastName,sex,age,phone,address)
      .subscribe(res => {
        $('#saveWear').removeAttr('disabled');
        if(res["status"]==1){
          layer.open({
            title: '提示'
            ,content: '修改成功'
          });
          // this.resetPagingArr();
          this.getElectricities2(this.curPage);
          this.selectedWearer = null;
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
  //检查电话号码
  checkPhone(obj){
    if(/^1[3|4|5|7|8|9][0-9]{9}$/.test(obj)){
      return true;
    }else {
      return false;
    }
  }
  //添加亲情号
  addBox(wearer: Wearer){
    $.each(wearer.familyPhones,(i,val)=>{
      val.selected = true;
    })
    console.log(wearer);
    this.selectedWearer = wearer;
    console.log(this.selectedWearer);
    $('.addBox').find('.form-box').on('blur',()=> {
      if(!this.checkPhone($(this).find('.form-box').val())){
        $(this).find('p').show();
      }
    })
  }
  addPhoneIn(){
    if(!this.selectedWearer.familyPhones.length||this.selectedWearer.familyPhones.length<5){
      let ak = new familyPhone();
      this.selectedWearer.familyPhones.push(ak);
    }else {
      layer.open({
        title: '提示'
        ,content: '亲情号最多为五个！'
      });
    }
  }
  addPhone(oldManId: string,phone:string,i:number): void{
    console.log(oldManId);
    console.log(phone);
    this.userService.addPhone(oldManId,phone).subscribe(res =>{
      if(res["status"]==1){
        layer.open({
          title: '提示'
          ,content: '添加成功'
        });
        this.selectedWearer.familyPhones[i].selected = true;
      }else{
        layer.open({
          title: '提示'
          ,content: '添加失败'+res["msg"]
        });
        // $.each(this.selectedWearer.familyPhones,(i,val)=>{
        //   if(val.emergencyId==emergencyId){
        //     this.selectedWearer.familyPhones
        //   }
        // })
      }
    })
  }
  //修改亲情号
  editPhone(emergencyId: string,phone:string,i:number): void{
    console.log(emergencyId);
    console.log(phone);
    this.userService.editPhone(emergencyId,phone).subscribe(res =>{
      if(res["status"]==1){
        layer.open({
          title: '提示'
          ,content: '修改成功'
        });
      }else{
        layer.open({
          title: '提示'
          ,content: '修改失败'+res["msg"]
        });
        // $.each(this.selectedWearer.familyPhones,(i,val)=>{
        //   if(val.emergencyId==emergencyId){
        //     this.selectedWearer.familyPhones
        //   }
        // })
      }
    })
  }
  //删除亲情号
  delPhone(emergencyId: string,oldManId:string,i:number): void{
    console.log(emergencyId);
    console.log(oldManId);
        this.userService.deletePhone(emergencyId,oldManId).then(res =>{
          if(res["status"]==1){
            layer.open({
              title: '提示'
              ,content: '删除成功'
            });
            this.selectedWearer.familyPhones.splice(i,1);
           // $.each(this.selectedWearer.familyPhones,(i,val)=>{
           //   if(val.emergencyId==emergencyId){
           //     this.selectedWearer.familyPhones
           //   }
           // })
          }else{
            layer.open({
              title: '提示'
              ,content: '删除失败'+res["msg"]
            });
          }
        })
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







