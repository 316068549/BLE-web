import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http, Headers, Response,ResponseOptions,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Menu } from '../models/menu';
import { Product } from '../models/product';
declare var layer:any;

@Injectable()

export class RescueOrganizationService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private headers2 = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
  private headers3 = new Headers({'Content-Type': 'multipart/form-data;'});
  private menusbtnUrl = 'adminPermission/query/adminPermissionButton';
  private rescueslistUrl = 'wwe/rescueTeam/find';
  private menusUrl2 = 'web/rescueCenter/findRescues';
  private menusaddUrl = 'web/rescueCenter/addRescue';
  private menuseditUrl = 'web/rescueCenter/modifyRescue';
  private menusdeleteUrl = 'web/oldman/deleteOldMan';
  //省市区选择
  private provinceUrl = 'web/rescueCenter/findProvinceCode';
  private cityUrl = 'web/rescueCenter/findCityCode';
  private sectionUrl = 'web/rescueCenter/findDistrictCode';
  //上级选择
  private parentUrl = 'web/rescueCenter/findParent';
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

  getRescuesList(): Promise<Product[]> {
    return this.http.get(this.rescueslistUrl)
      .toPromise()
      .then(response => response.json().data as Product[])
      .catch(this.handleError);
  }

  search2(term: string): Promise<Product> {
    return this.http.get(this.menusUrl2+'?rescueCenterName='+term+'&pageIndex=1&pageSize=10&tokenId='+this.tokenId)
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


  create(rescueCenterName:string,rescueChargeName: string,code:string, ChargeMobile: string,address: string,
         mark: string,rescueParentCode:string): Observable<Product> {
     let parment = 'rescueCenterName='+rescueCenterName+'&rescueChargeName='+rescueChargeName+'&code='+code+'&ChargeMobile='+ChargeMobile+
       '&address='+address+'&mark='+mark+'&rescueParentCode='+rescueParentCode+'&tokenId='+this.tokenId;
       return this.http
       .post(this.menusaddUrl,parment, {headers: this.headers2})
      .map(response => {
          let result=response.json();
          return result;
        })
  }


  delete(oldManId: string): Promise<object> {
    const durl=this.menusdeleteUrl+'?oldManId='+oldManId+'&tokenId='+this.tokenId;
    return this.http.get(durl)
      .toPromise()
      .then(res => res.json() as object)
      .catch(this.handleError);
  }

  update(id:string,rescueCenterName:string,rescueChargeName: string,code:string, ChargeMobile: string,address: string,
         mark: string,rescueParentCode:string): Observable<Product> {

          return this.http.post(this.menuseditUrl,JSON.stringify({rescueCenterId:id,rescueCenterName:rescueCenterName,rescueChargeName: rescueChargeName,
            code:code, ChargeMobile: ChargeMobile,address: address, mark: mark,rescueParentCode:rescueParentCode}),{headers: this.headers})
            .map(response => {
              let result=response.json();
              return result;
            })
  }
  // 省市区选择
  getProvinces(): Promise<object>{
    return this.http.get(this.provinceUrl)
      .toPromise()
      .then(res => res.json() as object)
      .catch(this.handleError);
  }
  getCitys(code:string): Promise<object>{
    const url=this.cityUrl+'?provinceId='+code+'&tokenId='+this.tokenId;
    return this.http.get(url)
      .toPromise()
      .then(res => res.json() as object)
      .catch(this.handleError);
  }
  getSections(code:string): Promise<object>{
    const url=this.sectionUrl+'?cityId='+code+'&tokenId='+this.tokenId;
    return this.http.get(url)
      .toPromise()
      .then(res => res.json() as object)
      .catch(this.handleError);
  }
  //上级选择
  getPars(code:string): Promise<object>{
    const url=this.parentUrl+'?code='+code+'&tokenId='+this.tokenId;
    return this.http.get(url)
      .toPromise()
      .then(res => res.json() as object)
      .catch(this.handleError);
  }


}
