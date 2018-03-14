import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Status } from '../models/status';
declare var layer: any;

@Injectable()

export class StatusService {
  private headers = new Headers({'Content-Type': 'application/x-www-from-urlencoded'});
  private headers2 = new Headers({'Content-Type': 'application/json'});
  private  statusUrl = 'web/query/onLine';
  private  statusUrl2 = 'web/query/offLine';
  private userId = localStorage.getItem("userId");
  private roleId = localStorage.getItem("roleId");
  private tokenId = localStorage.getItem("urtokenId");
  private parUrl;

  constructor(public http:Http
  ){}

  getStatuses(current?:number,size?:number): Promise<object> {
    let uurl='';
    if(current){
      uurl = this.statusUrl+'?pageIndex='+current +'&pageSize='+size+'&tokenId='+this.tokenId;
    }else{
      uurl = this.statusUrl+'?tokenId='+this.tokenId;
    }
    return this.http.get(uurl)
      .toPromise()
      .then(response => response .json() as object)
      .catch(this.handleError);
}
  getStatuses2(current?:number,size?:number): Promise<object> {
    let uurl='';
    if(current){
      uurl = this.statusUrl2+'?pageIndex='+current +'&pageSize='+size+'&tokenId='+this.tokenId;
    }else{
      uurl = this.statusUrl2+'?tokenId='+this.tokenId;
    }
    return this.http.get(uurl)
      .toPromise()
      .then(response => response .json() as object)
      .catch(this.handleError);
  }


  //
  search(IMEI: string,deviceMobile?:string,startTime?:string,endTime?:string): Observable<Status[]> {
    let paramms = {imeiCode:IMEI,deviceMobile:deviceMobile,startTime:startTime,endTime:endTime};
    if(paramms.startTime.trim()==''){
      delete paramms['startTime'];
    }
    if(paramms.endTime.trim()==''){
      delete paramms['endTime'];
    }
    if(paramms.deviceMobile.trim()==''){
      delete paramms['deviceMobile'];
    }
    if(paramms.imeiCode.trim()==''){
      delete paramms['imeiCode'];
    }
    return this.http.post(this.statusUrl,paramms,this.headers2)
        .map(res => {
            console.log(res);
            let result=res.json().objectbean;
            console.log(result);
            return result;
              })

    // return this.getElectricities()
    //     .then(menus => menus.find(menu => menu.id === id));

  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  }





// }
