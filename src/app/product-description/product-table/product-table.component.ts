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

import { Product } from '../../models/product';
import { ProductService } from '../product-service';
import { ActivatedRoute, Params }   from '@angular/router';
import { fadeIn } from '../../animations/fade-in';
declare var $:any;
declare var layer:any;
declare var QRCode:any;

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
  animations: [ fadeIn]
})
export class ProductTableComponent implements OnInit {
  products: Product[];
  product: Product;
  selectedProduct: Product;
  tjmenu:boolean;
  clicked:boolean;
  deletemenu:boolean = false;
  Product=new Product();
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
    private userService: ProductService,
    private location: Location
  ) {

  }
  // 添加选择数据初始化
  searchParMenu(): void{
    $('#tjmenu')[0].reset();
    this.userService.getTypeList().then(res=>this.parentNames=res)
  }
  // 编辑选择数据初始化
  searchParMenu2(product:Product){
    this.onSelect(product);
    this.deletemenu=true;
    var content = 'http://60.205.4.247:9009/web/product/downloadFile/'+this.selectedProduct.downloadLink;
    if($('#qrcode_1 img')){
      $('#qrcode_1 img').remove();
    }
    var qrcode = new QRCode(document.getElementById('qrcode_1'), content);
    // (function(){
    //     var qrcode = new QRCode(document.getElementById('qrcode_1'), content);
    //   }
    // )();
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









  // delete(product: Product): void{
  //   var ak = layer.open({
  //     content: '确定删除？'
  //     , btn: ['确定', '取消']
  //     , yes: () => {
  //       this.userService.delete(product.versionId).then(res =>{
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
        if(res['data']['list']){
          this.products = res['data']['list'];
          this.curPage = res['data']['pageNum'];
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
      //带分页
      if(res['code'] == 0){
        this.curPage = res['data']['pageNum'];
        if(res['data']['list']){
          if(res['data']['list'].length>0){
            this.products = res['data']['list'];
            this.selectedProduct =res['data']['list'][0];
          }else{
            this.isEmpty=true;
          }
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
      //不带分页
      // if(res['status'] == 1){
      //     if(res['data']){
      //       this.products = res['data'];
      //     }
      //   }else if(res['code'] == 5){
      //     var ak = layer.open({
      //       content: res['error']+'请重新登录'
      //       , btn: ['确定']
      //       , yes: () => {
      //         this.router.navigate(['login']);
      //         layer.close(ak);
      //       }
      //     })
      //   }else{
      //     layer.open({
      //       title: '提示'
      //       ,content: res['msg']+res['error']
      //     });
      //   }
    });
  }

  onSelect(product: Product): void {
    this.selectedProduct = product;
  }

  cancel(){
    this.getElectricities2(this.curPage);
  }



  add(versionName:string,versionname:string,versionNumber: number,versionDevice:number ,remark: string,file:any ): void {
    versionName = versionName.trim();
    versionname = versionname.trim();
    if (!versionName && !versionDevice && !versionNumber) { return; }
    if(file==''){
      return;
    }
    let index = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    $("#addWear").attr({"disabled":"disabled"});
    this.userService.create(versionName,versionname,versionNumber,versionDevice,remark,this.imgg)
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
          this.selectedProduct = null;
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







