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

import { Serv } from '../../models/services';
import { ServService } from '../serv-service';
import { ActivatedRoute, Params }   from '@angular/router';
import { fadeIn } from '../../animations/fade-in';
declare var $:any;
declare var layer:any;

@Component({
  selector: 'app-serv-table',
  templateUrl: './serv-table.component.html',
  styleUrls: ['./serv-table.component.css'],
  animations: [ fadeIn]
})
export class ServTableComponent implements OnInit {
  ckeditorContent = '<p style="text-align:center"><span style="font-size:20px">&nbsp; &nbsp; ' +
    '请您在使用之前认真阅读使用说明书，以便正确安装和快速使用，产品颜色请以实物为准！</span></p> <p>一、使用方法</p> <p>1.使用前请检测设备型号是否正确，配件是否齐全。</p>'
  servs: Serv[];
  serv: Serv;
  selectedServ: Serv;
   tjmenu:boolean;
   clicked:boolean;
   deletemenu:boolean = false;
  Serv=new Serv();
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
    private userService: ServService,
    private location: Location
  ) {

  }
  config={
    filebrowserBrowseUrl :"&&&&&",
    filebrowserUploadUrl :"&&&",
    toolbar:
      [
        ['Cut','Copy','Undo', 'Redo', '-', 'SelectAll', 'RemoveFormat'],
        ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ],
        ['Maximize'],
        [ 'Link','Unlink'],
        '/',
        ['Format', 'Font', 'FontSize'],
        ['TextColor', 'BGColor'],
        ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript']
      ]
  };
  // 添加选择数据初始化
  searchParMenu(): void{
    $('#tjmenu')[0].reset();
    this.userService.getTypeList().then(res=>this.parentNames=res)
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


  //
  // delete(serv: Serv): void{
  //   var ak = layer.open({
  //     content: '确定删除？'
  //     , btn: ['确定', '取消']
  //     , yes: () => {
  //       this.userService.delete(serv.servId).then(res =>{
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

  getElectricities2(index:number): void {
    this.userService.getMenuDatas(index,10).then( res => {
      if(res['code'] == 0){
        this.curPage = res['data']['pageNum'];
        if(res['data']['list']){
          this.servs = res['data']['list'];
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

  getElectricities(): void {
    let index = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    this.userService.getMenuDatas(1,10).then( res => {
      layer.close(index);
      if(res['code'] == 0){
        if(res['data']['list']){
          this.curPage = res['data']['pageNum'];
          this.servs = res['data']['list'];
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

  onSelect(serv: Serv): void {
    this.selectedServ = serv;
  }

  cancel(){
    this.getElectricities2(this.curPage);
  }



  add(agreementName:string,agreementVersion: string,agreementDevice:string, agreementInstructions: string,remark: string): void {
    agreementName = agreementName.trim();
    agreementVersion = agreementVersion.trim();
    agreementInstructions = agreementInstructions.trim();
    if (!agreementName && !agreementVersion && !agreementInstructions) { return; }
    let index = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    $("#addWear").attr({"disabled":"disabled"});
    this.userService.create(agreementName,agreementVersion,agreementDevice,agreementInstructions,remark)
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
          this.selectedServ = null;
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

  save(imei:string,Name: string,lastName:string ,sex: string, age: number,phone: string,
       address: string ,file:File): void {
    $("#saveWear").attr({"disabled":"disabled"});
    this.userService.update(imei,Name,lastName,sex,age,phone,address,this.imgg)
      .subscribe(res => {
        $('#saveWear').removeAttr('disabled');
        if(res["status"]==1){
          layer.open({
            title: '提示'
            ,content: '修改成功'
          });
          // this.resetPagingArr();
          this.getElectricities2(this.curPage);
          this.selectedServ = null;
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







