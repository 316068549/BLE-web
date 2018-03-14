import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { Rescue } from '../models/rescue';
import { rescueTeam } from '../models/rescueTeams';
declare var layer:any;

@Injectable()

export class RescueCountService {
  private headers = new Headers({'Content-Type': 'application/json'});
  private rescueslistUrl = 'wwe/rescueTeam/find';
  private menusUrl = 'web/query/rescueCount';
  private menusUrl2 = 'web/query/rescueCount/rescueCenterId';
  private userId = localStorage.getItem("userId");
  private roleId = localStorage.getItem("roleId");
  private tokenId = localStorage.getItem("urtokenId");
  private parUrl;

  constructor(public http:Http
  ){}

  getMenuDatas(current?:number,size?:number,id?:number): Promise<object> {
    let uurl='';
    if(id){
      if(current){
        uurl = this.menusUrl2+'?rescueCenterId='+id+'&pageIndex='+current +'&pageSize='+size+'&tokenId='+this.tokenId;
      }
    }else {
      if(current){
        uurl = this.menusUrl+'?pageIndex='+current +'&pageSize='+size+'&tokenId='+this.tokenId;
      }
    }
    return this.http.get(uurl)
      .toPromise()
      .then(response => response .json() as object)
      .catch(this.handleError);
  }
  //
  getRescuesList(): Promise<rescueTeam[]> {
    return this.http.get(this.rescueslistUrl)
      .toPromise()
      .then(response => response.json().data as rescueTeam[])
      .catch(this.handleError);
  }

  // search2(term: number,current?:number,size?:number): Promise<object> {
  //   return this.http.get(this.menusUrl+'?rescueTeamId='+term+'&pageIndex='+current +'&pageSize='+size+'&tokenId='+this.tokenId)
  //     .toPromise()
  //     .then(response => response.json() as object)
  //     .catch(this.handleError);
  // }


  private handleError(error: any): Promise<any> {
    layer.open({
      title: '提示'
      ,content: error
    });
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }



}
