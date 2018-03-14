import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http, Headers, Response,ResponseOptions,RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Menu } from '../models/menu';
import { Wearer } from '../models/wearer';
import { rescueTeam } from '../models/rescueTeams';
declare var layer:any;

@Injectable()

export class WearerService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private headers2 = new Headers({'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'});
  private headers3 = new Headers({'Content-Type': 'multipart/form-data;'});
  private menusbtnUrl = 'adminPermission/query/adminPermissionButton';
  private rescueslistUrl = 'wwe/rescueTeam/find';
  private menusUrl2 = 'web/oldman/findOldMan';
  private menusaddUrl = 'web/oldman/addOldMan';
  private menuseditUrl = 'web/oldman/updateOldMan';
  private menusdeleteUrl = 'web/oldman/deleteOldMan';
  private phonesaddUrl = 'web/oldman/addParentPhone';
  private phoneseditUrl = 'web/oldman/updateParentPhones';
  private phonesdeleteUrl = 'web/oldman/deleteParentPhones';
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

  getRescuesList(): Promise<rescueTeam[]> {
    return this.http.get(this.rescueslistUrl)
      .toPromise()
      .then(response => response.json().data as rescueTeam[])
      .catch(this.handleError);
  }

  search2(term: string): Promise<Wearer> {
    return this.http.get(this.menusUrl2+'?deviceIMEI='+term+'&pageIndex=1&pageSize=10&tokenId='+this.tokenId)
      .toPromise()
      .then(response => response.json().data.list as Wearer)
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

  create(imei:string,Name: string,lastName:string, sex: string, age: number,phone: string,
         address: string,phone1:string,phone2?:string,phone3?:string,phone4?:string,phone5?:string): Observable<Wearer> {
    let formData: FormData = new FormData();
    formData.append("deviceIMEI", imei);
    formData.append("xing", Name);
    formData.append("ming", lastName);
    formData.append("sex", sex);
    formData.append("age", age);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("phone1",phone1);
    if(typeof(phone2)!="undefined"&&phone2){
      formData.append("phone2",phone2);
    }
    if(typeof(phone3)!="undefined"&&phone3){
      formData.append("phone3",phone3);
    }
    if(typeof(phone4)!="undefined"&&phone4){
      formData.append("phone4",phone4);
    }
    if(typeof(phone5)!="undefined"&&phone5){
      formData.append("phone5",phone5);
    }
// fileInputElement中已经包含了用户所选择的文件
//     formData.append('avatar', file);
    formData.append('tokenId', this.tokenId);
    let headers = new Headers({
      "Accept": "application/json"
    });
    let options = new RequestOptions({ headers });
    // let parment = 'name='+helperName+'&sex='+sex+'&password='+password+'&mobile='+phone+
    //   '&identityCard='+nationalId+'&rescueTeamId='+rescue+'&file='+file+'&tokenId='+this.tokenId;
    return this.http
      .post(this.menusaddUrl, formData,options)
    // return this.http
    //   .post(this.menusaddUrl, JSON.stringify({name: helperName,sex:sex,password:password,mobile:phone,
    //     identityCard:nationalId,rescueTeamId:rescue,imageUrl:imageUrl}), {headers: this.headers})
      .map(response => {
          let result=response.json();
          return result;
        })
    // return this.http
    //   .post(this.menusaddUrl, JSON.stringify({userId:userId,userName: userName,password:password,role:role,sex:sex,phoneNumber:phoneNumber,
    //     address:address,remarks:remarks
    //   }), {headers: this.headers})
    //   .map(response => {
    //       let result=response.json();
    //       return result;
    //     }
    //   )
  }


  delete(oldManId: string): Promise<object> {
    const durl=this.menusdeleteUrl+'?oldManId='+oldManId+'&tokenId='+this.tokenId;
    return this.http.get(durl)
      .toPromise()
      .then(res => res.json() as object)
      .catch(this.handleError);
  }

  //修改亲情号
  editPhone(emergencyId: string,phone:string): Observable<object> {
    let parment = 'emergencyId='+emergencyId+'&phone='+phone+'&tokenId='+this.tokenId;
    return this.http.post(this.phoneseditUrl,parment,{headers: this.headers2})
      .map(response => {
        let result=response.json();
        return result;
      })
  }
  //删除亲情号
  deletePhone(emergencyId: string,oldManId:string): Promise<object> {
    const durl=this.phonesdeleteUrl+'?emergencyId='+emergencyId+'&oldManId='+oldManId+'&tokenId='+this.tokenId;
    return this.http.get(durl)
      .toPromise()
      .then(res => res.json() as object)
      .catch(this.handleError);
  }
  //添加亲情号
  addPhone(oldManId: string,phone:string): Observable<object> {
    let parment = 'oldManId='+oldManId+'&phone='+phone+'&tokenId='+this.tokenId;
    return this.http.post(this.phonesaddUrl,parment,{headers: this.headers2})
      .map(response => {
        let result=response.json();
        return result;
      })
  }


  update(oldManId:string,Name: string,lastName:string ,sex: string, age: number,phone: string,
         address: string): Observable<Wearer> {
          let formData: FormData = new FormData();
          formData.append("oldManId", oldManId);
          formData.append("xing", Name);
          formData.append("ming", lastName);
          formData.append("sex", sex);
          formData.append("age", age);
          formData.append("phone", phone);
          formData.append("address", address);
          // if(file){
          //   formData.append('avatar', file);
          // }
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



  // search(term: string): Observable<Helpers []> {
  //   return this.http.get(this.menusUrl+'?helperName='+term)
  //     .map(response => response.json().objectbean as Helpers[]
  //     );
  //   // return this.http.get(this.menusUrl+'?userName='+term)
  //   //   .map(response => response.json().objectbean as Helpers[]
  //   //   );
  // }
  // search2(term: string): Promise<Helpers[]> {
  //   return this.http
  //     .get(`api/helpers/?helperName=${term}`)
  //     .toPromise()
  //     .then(response => response.json().data as Helpers[])
  //     .catch(this.handleError);
  // }


  // addItem(item){
  //     ITEMS.push(item);
  // }
  // test(){
  //     console.log(ITEMS);
  // }

}
