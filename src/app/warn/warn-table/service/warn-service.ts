import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';




import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Warn } from '../../../models/warn';
declare var layer: any;

@Injectable()

export class WarnService {
  private headers = new Headers({'Content-Type': 'application/x-www-from-urlencoded'});
  private headers2 = new Headers({'Content-Type': 'application/json'});

  private  alarmUrl = '/api/query/alarm';


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


  getWarnes(): Promise<Warn[]> {
  return this.http.post(this.alarmUrl,this.headers2)
    .toPromise()
    .then(response => response.json().objectbean as Warn[])
    .catch(this.handleError);
}

  search(IMEI: string,alarmId?:string): Observable<Warn[]> {
    return this.http.post(this.alarmUrl,{imeiCode:IMEI,alarmId:alarmId},this.headers2)
      .map(res => {
        let result=res.json().objectbean;
        console.log(result);
        return result;
      })
  }


  //
  // search(IMEI: string,deviceMobile?:string,startTime?:string,endTime?:string): Observable<Status[]> {
  //   let paramms = {imeiCode:IMEI,deviceMobile:deviceMobile,startTime:startTime,endTime:endTime};
  //   if(paramms.startTime.trim()==''){
  //     delete paramms['startTime'];
  //   }
  //   if(paramms.endTime.trim()==''){
  //     delete paramms['endTime'];
  //   }
  //   if(paramms.deviceMobile.trim()==''){
  //     delete paramms['deviceMobile'];
  //   }
  //   if(paramms.imeiCode.trim()==''){
  //     delete paramms['imeiCode'];
  //   }
  //   return this.http.post(this.statusUrl,paramms,this.headers2)
  //       .map(res => {
  //           console.log(res);
  //           let result=res.json();
  //           console.log(result);
  //           return result;
  //             })
  // }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  }





// }
