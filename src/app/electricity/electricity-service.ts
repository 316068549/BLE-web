import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Electricity } from '../models/Electricity';

@Injectable()

export class ElectricityService {
  private headers = new Headers({'Content-Type': 'application/x-www-from-urlencoded'});
  private headers2 = new Headers({'Content-Type': 'application/json'});
  private  electricityUrl = 'web/query/status';
  private  electricitiesUrl = '/api/query/messageNow';
  private userId = localStorage.getItem("userId");
  private roleId = localStorage.getItem("roleId");
  private tokenId = localStorage.getItem("urtokenId");
  private parUrl;
  dataed:Object;

  constructor(public http:Http
  ){}


  // getElectricities(): Observable<Electricity[]> {
  //   return this.http.get(this.electricitiesUrl)
  //     .map(res => {
  //               console.log(res);
  //             let result=res.json();
  //             console.log(result);
  //             return result;
  //           })
  // }

  getElectricities(current?:number,size?:number): Promise<object> {
    let uurl='';
    if(current){
      uurl = this.electricityUrl+'?pageIndex='+current +'&pageSize=10&tokenId='+this.tokenId;
    }else{
      uurl = this.electricityUrl+'?tokenId='+this.tokenId;
    }
  return this.http.get(uurl)
    .toPromise()
    .then(response => response .json() as object)
    .catch(this.handleError);
}

  getElectricity(deviceIMEI: string,startTime?:string,endTime?:string): Promise<Electricity> {
    console.log(deviceIMEI)
    // const creds = ''+deviceIMEI;
    return this.http.post(this.electricityUrl,{imeiCode:deviceIMEI,startTime:startTime,endTime:endTime},this.headers2)
      .toPromise()
        .then(response => response.json().objectbean as Electricity)
        .catch(this.handleError);

  }

  search(IMEI: string): Promise<object> {
    return this.http.get(this.electricityUrl+'?deviceImei='+IMEI+'&pageIndex=1&pageSize=10&tokenId='+this.tokenId)
      .toPromise()
      .then(response => response.json().data as object)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  }





// }
