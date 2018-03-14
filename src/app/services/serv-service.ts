import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http, Headers, Response,ResponseOptions,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Menu } from '../models/menu';
import { Product } from '../models/product';
import { Device } from '../models/device';
declare var layer:any;

@Injectable()

export class ServService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private headers2 = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
  private headers3 = new Headers({'Content-Type': 'multipart/form-data;'});
  private menusbtnUrl = 'adminPermission/query/adminPermissionButton';
  private typeUrl = 'web/product/findAppKinds';
  private menusUrl2 = 'web/product/agreement/find';
  private menusaddUrl = 'web/product/agreement/update';
  private menuseditUrl = 'web/oldman/updateOldMan';
  // private menusdeleteUrl = 'web/oldman/deleteOldMan';
  private userId = localStorage.getItem("userId");
  private roleId = localStorage.getItem("roleId");
  private tokenId = localStorage.getItem("urtokenId");

  constructor(public http:Http
  ){}

  getMenuBtns(id:number): Promise<Menu[]> {
    const url = this.menusbtnUrl+'?permissionId='+id+'&roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+this.tokenId;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Menu[])
      .catch(this.handleError);
  }

  getMenuDatas(current?:number,size?:number): Promise<object> {
    let uurl='';
    if(current){
      uurl = this.menusUrl2+'?pageIndex='+current +'&pageSize='+size+'&tokenId='+this.tokenId;
    }
    return this.http.get(uurl)
      .toPromise()
      .then(response => response.json() as object)
      .catch(this.handleError);
  }

  getTypeList(): Promise<Device[]> {
    let uurl=this.typeUrl+'?tokenId='+this.tokenId;
    return this.http.get(uurl)
      .toPromise()
      .then(response => response.json().data as Device[])
      .catch(this.handleError);
  }

  search2(term: string): Promise<Product> {
    return this.http.get(this.menusUrl2+'?deviceIMEI='+term+'&pageIndex=1&pageSize=10&tokenId='+this.tokenId)
      .toPromise()
      .then(response => response.json().data.list as Product)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    layer.open({
      title: '提示'
      ,content: error
    });
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  // getMenuData(menuId: number): Promise<Wearer> {
  //   const url = this.menusUrl2+'?helperId='+menuId;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(response => response.json().objectbean[0] as Wearer)
  //     .catch(this.handleError);
  // }

  // getMenuData(id: number): Promise<Menu> {
  //   return this.getMenuDatas()
  //     .then(menus => menus.find(menu => menu.id === id));
  // }  helperId,helperName,age,sex,address,phoneNumber,nationalId

  // create(helperId:number,helperName: string, age: number, sex: string,  address: string,phoneNumber: string,
  //                nationalId: string): Promise<Helpers> {
  //   return this.http
  //     .post(this.menusUrl, JSON.stringify({helperId:helperId,helperName: helperName,age:age,sex:sex,address:address,phoneNumber:phoneNumber,nationalId:nationalId}), {headers: this.headers})
  //     .toPromise()
  //     .then(res => res.json().data as Helpers)
  //     .catch(this.handleError);
  // }

  create(agreementName:string,agreementVersion: string,agreementDevice:string, agreementInstructions: string,remark: string): Observable<Product> {
    let html ='<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" /><title></title></head><body> ';
    html+=agreementInstructions;
    html+=' </body></html>';
    let parment = 'agreementName='+agreementName+'&agreementVersion='+agreementVersion+'&agreementDevice='+agreementDevice+'&agreementInstructions='+html+
      '&remark='+remark+'&tokenId='+this.tokenId;
    return this.http
      .post(this.menusaddUrl,parment, {headers: this.headers2})
      .map(response => {
        let result=response.json();
        return result;
      })
  }


  // delete(oldManId: string): Promise<object> {
  //   const durl=this.menusdeleteUrl+'?oldManId='+oldManId+'&tokenId='+this.tokenId;
  //   return this.http.get(durl)
  //     .toPromise()
  //     .then(res => res.json() as object)
  //     .catch(this.handleError);
  // }

  update(imei:string,Name: string,lastName:string ,sex: string, age: number,phone: string,
         address: string ,file:File): Observable<Product> {
          let formData: FormData = new FormData();
          formData.append("deviceIMEI", imei);
          formData.append("xing", Name);
          formData.append("ming", lastName);
          formData.append("sex", sex);
          formData.append("age", age);
          formData.append("phone", phone);
          formData.append("address", address);
          if(file){
            formData.append('avatar', file);
          }
          formData.append('tokenId', this.tokenId);
          let headers = new Headers({
            "Accept": "application/json"
          });
          let options = new RequestOptions({ headers });
          return this.http.post(this.menuseditUrl, formData,options)
            .map(response => {
              let result=response.json();
              return result;
            })
    // return this.http
    //   .post(this.menusaddUrl, JSON.stringify(user), {headers: this.headers})
    //   .toPromise()
    //   .then(() => user)
    //   .catch(this.handleError);
  }


}
