import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http, Headers, Response,ResponseOptions,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Menu } from '../models/menu';
import { PayState } from '../models/payState';
declare var layer:any;

@Injectable()

export class PayService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private headers2 = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
  private headers3 = new Headers({'Content-Type': 'multipart/form-data;'});
  private menusbtnUrl = 'adminPermission/query/adminPermissionButton';
  private menusUrl2 = 'web/orders//queryPayStatus';
  private menusUrl = 'web/orders//queryPayList';
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

  getMenuDatas2(current?:number,size?:number): Promise<object> {
    let uurl='';
    if(current){
      uurl = this.menusUrl+'?pageIndex='+current +'&pageSize='+size+'&tokenId='+this.tokenId;
    }
    return this.http.get(uurl)
      .toPromise()
      .then(response => response.json() as object)
      .catch(this.handleError);
  }


  search2(term: string): Promise<object> {
    return this.http.get(this.menusUrl2+'?deviceIMEI='+term+'&pageIndex=1&pageSize=10&tokenId='+this.tokenId)
      .toPromise()
      .then(response => response.json().data as object)
      .catch(this.handleError);
  }

  search(term: string): Promise<object> {
    return this.http.get(this.menusUrl+'?deviceIMEI='+term+'&pageIndex=1&pageSize=10&tokenId='+this.tokenId)
      .toPromise()
      .then(response => response.json().data as object)
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







}
