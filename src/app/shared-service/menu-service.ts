import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Menu } from '../models/menu';


@Injectable()

export class MenuService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private headers2 = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
  private menusUrl = 'itemlist';
  private logoutUrl = 'logout';
  private menusbtnUrl = 'adminPermission/query/adminPermissionButton';
  private menuslistUrl = 'adminPermission/query/adminPermissionList';
  private menuslistUrl2 = 'adminPermission/query/subPermission';
  private menuslistUrl3 = 'adminPermission/query/parentPermission';
  private menuslistUrl4 = 'adminPermission/query/queryPermissionInfo';
  private userUrl = 'admin/query/adminUserId';
  // private menusUrl = 'api/query/findMenu';
  private menusaddUrl = 'adminPermission/add/adminPermission';
  private menusmodifyUrl = 'adminPermission/edit/adminPermission';
  private menusdeleteUrl = 'adminPermission/del/adminPermission';
  private userId = localStorage.getItem("userId");
  private roleId = localStorage.getItem("roleId");
  private tokenId = localStorage.getItem("urtokenId");
  private parUrl;
  constructor(public http:Http
  ){}

  getMenuDatas(): Promise<Menu[]> {
    let lastToken = localStorage.getItem("userId");
    let lastRole = localStorage.getItem("roleId");
    this.userId = this.userId == lastToken?this.userId:lastToken;
    this.roleId = this.roleId == lastRole?this.roleId:lastRole;
    let tok = localStorage.getItem("urtokenId");
    const url = this.menusUrl+'?roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+tok;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Menu[])
      .catch(this.handleError);
  }

  // getMenuList(): Promise<Menu[]> {
  //   const url = this.menuslistUrl+'?tokenId='+this.tokenId;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(response => response.json().data as Menu[])
  //     .catch(this.handleError);
  // }
  getMenuList(current?:number,size?:number): Promise<object> {
    let uurl='';
    if(current){
      uurl = this.menuslistUrl+'?current='+current +'&size=10&tokenId='+this.tokenId;
    }else{
      uurl = this.menuslistUrl+'?tokenId='+this.tokenId;
    }

    return this.http.get(uurl)
      .toPromise()
      .then(response => response.json() as object)
      .catch(this.handleError);
        // .map(response => {
        //   if(response.json().code==0){
        //     let result=response.json().data;
        //     return result;
        //   }else {
        //     alert(response.json().error);
        //   }
        //   }
        // );
  }
  search(term: string): Promise<object> {
    let lastToken2 = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken2?this.tokenId:lastToken2;
    let uurl= this.menuslistUrl+'?menuName='+term+'&current=1&size=10&tokenId='+this.tokenId;
    return this.http.get(uurl)
      .toPromise()
      .then(response => response.json() as object)
      .catch(this.handleError);
  }

  getParMenus(id:number): Promise<Menu[]> {
    let lastToken = localStorage.getItem("userId");
    let lastRole = localStorage.getItem("roleId");
    let lastToken2 = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken2?this.tokenId:lastToken2;
    this.userId = this.userId == lastToken?this.userId:lastToken;
    this.roleId = this.roleId == lastRole?this.roleId:lastRole;
    if(id!=-1){
      this.parUrl = this.menuslistUrl3+'?permissionId='+id+'&roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+this.tokenId;
    }else {
      this.parUrl = this.menuslistUrl3+'?roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+this.tokenId;
    }
    return this.http.get(this.parUrl)
      .toPromise()
      .then(response => response.json().data as Menu[])
      .catch(this.handleError);
  }

  getMenuBtns(id:number): Promise<Menu[]> {
    let lastToken = localStorage.getItem("userId");
    let lastRole = localStorage.getItem("roleId");
    let lastToken2 = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken2?this.tokenId:lastToken2;
    this.userId = this.userId == lastToken?this.userId:lastToken;
    this.roleId = this.roleId == lastRole?this.roleId:lastRole;
    const url = this.menusbtnUrl+'?permissionId='+id+'&roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+this.tokenId;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Menu[])
      .catch(this.handleError);
  }

  getSubMenu(id:number): Promise<Menu[]> {
    let lastToken = localStorage.getItem("userId");
    let lastToken2 = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken2?this.tokenId:lastToken2;
    this.userId = this.userId == lastToken?this.userId:lastToken;
    const url = this.menuslistUrl2+'?permissionId='+id+'&userId='+this.userId+'&tokenId='+this.tokenId;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Menu[])
      .catch(this.handleError);
  }
  getMenuDetail(id:number): Promise<object> {
    let lastToken = localStorage.getItem("userId");
    let lastRole = localStorage.getItem("roleId");
    let lastToken2 = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken2?this.tokenId:lastToken2;
    this.userId = this.userId == lastToken?this.userId:lastToken;
    this.roleId = this.roleId == lastRole?this.roleId:lastRole;
    const url = this.menuslistUrl4+'?permissionId='+id+'&roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+this.tokenId;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as object)
      .catch(this.handleError);
  }
  getMenuDetail2(id:number,tok?:string): Promise<Menu> {
    let lastToken = localStorage.getItem("userId");
    this.userId = this.userId == lastToken?this.userId:lastToken;
    let getTok = localStorage.getItem("urtokenId");
    let url;
    if(tok){
      url = this.userUrl+'?usersId='+id+'&tokenId='+tok;
    }else{
      // let tok = localStorage.getItem("urtokenId");
      url = this.userUrl+'?usersId='+id+'&tokenId='+getTok;
    }
    console.log(url)
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Menu)
      .catch(this.handleError);
  }

  // getMenuDatas(): Promise<Menu[]> {
  //   // return this.getWarns()
  //   //   .then(warns => warns.find(warn => warn.id === id));
  //   // const url = `${this.menusUrl}/${id}`;
  //   return this.http.get(this.menusUrl)
  //     .toPromise()
  //     .then(response => response.json().objectbean as Menu[])
  //     .catch(this.handleError);
  // }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  // getMenuData(menuId: number): Promise<Menu> {
  //   const url = this.menusUrl+'?menuId='+menuId;
  //   return this.http.get(url)
  //     .toPromise()
  //     .then(response => response.json().objectbean[0] as Menu)
  //     .catch(this.handleError);
  // }
  //
  // getMenuData(id: number): Promise<Menu> {  {permissionName: name,permissionParentId:coding,permissionSubId:subName,permissionUrl:parentCode,permissionTypeId:newWindow,permissionResource:parentName,permissionDescription:details,roleId:this.roleId,tokenId:this.tokenId
  //   return this.getMenuDatas()
  //     .then(menus => menus.find(menu => menu.permissionId === id));
  // }
  //
  create(name: string, coding: number, subName: number,  parentName: string,parentCode: string, newWindow: number, details: string): Promise<Menu> {
    let lastToken = localStorage.getItem("userId");
    let lastRole = localStorage.getItem("roleId");
    let lastToken2 = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken2?this.tokenId:lastToken2;
    this.userId = this.userId == lastToken?this.userId:lastToken;
    this.roleId = this.roleId == lastRole?this.roleId:lastRole;
    if(!subName){
      subName=-1;
    }
    let parment = 'addId='+''+'&permissionName='+name+'&permissionParentId='+coding+'&permissionSubId='+subName+'&permissionUrl='+parentCode+'&permissionTypeId='+newWindow+
    '&permissionResource='+parentName + '&permissionDescription='+details+'&roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+this.tokenId;
    console.log(parment)
    return this.http
      .post(this.menusaddUrl,parment,{headers:this.headers2})
      .toPromise()
      .then(res => res.json().data as Menu)
      .catch(this.handleError);
  }


  delete(id: number): Promise<object> {
    let lastToken2 = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken2?this.tokenId:lastToken2;
    const durl=this.menusdeleteUrl+'?permissionId='+id+'&tokenId='+this.tokenId;
    return this.http.get(durl)
      .toPromise()
      .then((res) => res.json() as object)
      .catch(this.handleError);
  }

  update(id:number,oldName:string,name: string, coding: number, subName: number,  parentName: string,parentCode: string, newWindow: number, details: string): Promise<Menu> {
    let lastToken = localStorage.getItem("userId");
    let lastRole = localStorage.getItem("roleId");
    let lastToken2 = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken2?this.tokenId:lastToken2;
    this.userId = this.userId == lastToken?this.userId:lastToken;
    this.roleId = this.roleId == lastRole?this.roleId:lastRole;
    if(!subName){
      subName=-1;
    }
    let parment = 'addId='+''+'&permissionId='+id+'&originalPermissionName='+oldName+'&permissionName='+name+'&permissionParentId='+coding+'&permissionSubId='+subName+'&permissionUrl='+parentCode+'&permissionTypeId='+newWindow+
      '&permissionResource='+parentName + '&permissionDescription='+details+'&roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+this.tokenId;
    console.log(parment)
    return this.http
      .post(this.menusmodifyUrl, parment, {headers: this.headers2})
      .toPromise()
      .then(res => res.json().data as Menu)
      .catch(this.handleError);
  }
  logout(){
    let lastToken = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken?this.tokenId:lastToken;
    let parment = 'tokenId='+ this.tokenId;
    return this.http.post(this.logoutUrl,parment, {headers: this.headers2})
      .toPromise()
      .then((res) => res.json() as object)
      .catch(this.handleError);
  }

}
