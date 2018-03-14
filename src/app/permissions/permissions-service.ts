import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
declare var layer:any;
import { Menu } from '../models/menu';
import { Role } from '../models/role';

@Injectable()

export class PermissionService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private headers2 = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
  private menusbtnUrl = 'adminPermission/query/adminPermissionButton';
  private menusUrl = 'adminPermission/queryAdminPermission';
  private menuslistUrl = 'role/query/adminRole';
  private roleUrl = 'role/query/adminRoleAll';
  private userUrl = 'admin/query/adminUserId';
  private menusaddUrl = 'role/add/adminRole';
  private menusmodifyUrl = 'role/update/adminRole';
  private menusdeleteUrl = 'role/del/adminRole';
  private userId = localStorage.getItem("userId");
  private roleId = localStorage.getItem("roleId");
  private tokenId = localStorage.getItem("urtokenId");
  private parUrl;

  constructor(public http:Http
  ){}

  getMenuList(current?:number,size?:number): Promise<object> {
    let lastToken = localStorage.getItem("userId");
    let lastRole = localStorage.getItem("roleId");
    let lastToken2 = localStorage.getItem("urtokenId");
    this.tokenId = this.tokenId == lastToken2?this.tokenId:lastToken2;
    this.userId = this.userId == lastToken?this.userId:lastToken;
    this.roleId = this.roleId == lastRole?this.roleId:lastRole;
    let uurl='';
    if(current){
      uurl = this.menuslistUrl+'?current='+current +'&size='+ size +'&tokenId='+this.tokenId;
    }else{
      uurl = this.menuslistUrl+'?tokenId='+this.tokenId;
    }
    return this.http.get(uurl)
      .toPromise()
      .then(response => response.json() as object)
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

  getMenuDatas(id?:number): Promise<object> {
    if(id){
        this.parUrl=this.menusUrl+'?roleId='+id+'&userId=undefined&tokenId='+this.tokenId;
    }else{
      this.parUrl=this.menusUrl+'?null&userId=undefined&tokenId='+this.tokenId;
    }
    return this.http.get(this.parUrl)
      .toPromise()
      .then(response => response.json().data as object)
      .catch(this.handleError);
  }

  getParMenus(): Promise<Role[]> {
      this.parUrl = this.roleUrl+'?roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+this.tokenId;
    return this.http.get(this.parUrl)
      .toPromise()
      .then(response => response.json().data as Role[])
      .catch(this.handleError);
  }

  getMenuDetail(id:number): Promise<object> {
    const url = this.userUrl+'?usersId='+id+'&roleId='+this.roleId+'&userId='+this.userId+'&tokenId='+this.tokenId;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as object)
      .catch(this.handleError);
  }

  create(addIDs: string, roleName: string, roleDescription: string,  str2: string): Promise<Role> {
    let parment = 'delId=&addId='+addIDs+'&roleName='+roleName+'&roleDescription='+roleDescription+'&'+str2+
      'userId=undefined&tokenId='+this.tokenId;
    console.log(parment)
    return this.http
      .post(this.menusaddUrl,parment,{headers:this.headers2})
      .toPromise()
      .then(res => res.json().data as Role)
      .catch(this.handleError);
  }

  delete(id: number): Promise<object> {
    const durl=this.menusdeleteUrl+'?roleId='+id+'&usersId=undefined&tokenId='+this.tokenId;
    return this.http.get(durl)
      .toPromise()
      .then((res) => res.json() as object)
      .catch(this.handleError);
  }

  update(roleId:number,roleName:string,rolename2:string,des:string, str:string, str2:string,str3:string): Promise<object> {

    let parment = 'delId='+str3+'&addId='+str+'&originalRoleName='+roleName+'&roleId='+roleId+'&roleName='+rolename2+'&roleDescription='+des+'&'+str2+
      'userId=undefined&tokenId='+this.tokenId;
    console.log(parment)
    return this.http
      .post(this.menusmodifyUrl, parment, {headers: this.headers2})
      .toPromise()
      .then(res => res.json() as object)
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

  // search(term: string): Observable<User []> {
  //   return this.http.get(this.menusUrl+'?userName='+term)
  //     .map(response => response.json().objectbean as User[]
  //     );
  // }
  // search2(term: string): Promise<User []> {
  //   return this.http.get(this.menusUrl+'?userName='+term)
  //     .toPromise()
  //     .then(response => response.json().objectbean as User[])
  //     .catch(this.handleError);
  // }


}
