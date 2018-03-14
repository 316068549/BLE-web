import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { rescuePaper } from '../../models/rescue-paper';
import { RescuePapersService } from '../rescuepapers-service';
declare var $:any;
declare var layer:any;

@Component({
  selector: 'app-rescuepapers-table',
  templateUrl: './rescuepapers-table.component.html',
  styleUrls: ['./rescuepapers-table.component.css']
})
export class RescuepapersTableComponent implements OnInit {
  rescuePapers: Observable<rescuePaper[]>;
  rescuePaper: rescuePaper;
  selectedRescuePaper: rescuePaper;
  public params; // 保存页面url参数 2012-10-20 11:11:11
  public totalNum ; // 总数据条数
  public pageSize = 10;// 每页数据条数
  public totalPage;// 总页数
  public totalPages = 7 ;// 分页显示数目
  public curPage = 1;// 当前页码
  public isEmpty:boolean = false;
  // public rescueId = parseInt(localStorage.getItem("rescueTeamId"));
  public pageList= [{
    isActive: true,
    pageNum: '1'
  }];
  // rescueTeams = [];
  pages: any;
  parentNames = ['普通管理员', '超级管理员', '初级管理'];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: RescuePapersService,
    private location: Location
  ) {
  }

  setPagingArr() {
    // if ( this.totalPage == this.pageList.length) {
    //   return
    // }
    // this.pageList[this.pageList.length-1].pageNum;
    this.pageList = [{
      isActive: true,
      pageNum: '1'
    }];
    let offset = Math.floor(this.totalPages / 2) - 1;
    if(this.totalPage <= this.totalPages){
      for (let i=1;i < this.totalPage;i++){
        this.pageList.push({
          isActive:false,
          pageNum: ''+(i + 1)
        });
      }
    }else {
      if (this.curPage < this.totalPages - offset) {
        for (let i = 1; i < this.totalPages; i++) {
          this.pageList.push({
            isActive: false,
            pageNum: '' + (i + 1)
          });
        }
        this.pageList.push({
          isActive: false,
          pageNum: '...'
        });
        this.pageList.push({
          isActive: false,
          pageNum: '' + this.totalPage
        });
        //右边没有'...'
      }else if(this.curPage >= this.totalPage - offset - 1){
        this.pageList.push({
          isActive: false,
          pageNum: '...'
        });
        for(let i=this.totalPages - 2;i >= 0 ;i--){
          this.pageList.push({
            isActive: false,
            pageNum: ''+(this.totalPage - i)
          });
        }
        //两边都有'...'
      }else {
        this.pageList.push({
          isActive: false,
          pageNum: '...'
        });
        for(let i= this.curPage - offset;i < this.curPage + offset; i++){
          this.pageList.push({
            isActive: false,
            pageNum: '' + (i + 1)
          });
        }
        this.pageList.push({
          isActive: false,
          pageNum: '...'
        });
        this.pageList.push({
          isActive: false,
          pageNum: '' + this.totalPage
        });
      }
    }
  }

  resetPagingArr() {
    this.pageList[0].isActive = true;
    this.curPage = 0;
  }

  changePage(index) {
    let index2 = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    this.userService.getMenuDatas(index,10).then( res => {
      layer.close(index2);
      if(res['code'] == 0){
        this.rescuePapers = res['data']['list'];
        this.curPage = res['data']['pageNum'];
        this.setPagingArr();
        for (var i = 0; i < this.pageList.length; i++) {
          this.pageList[i].isActive = false;
          if(this.pageList[i].pageNum==''+this.curPage){
            this.pageList[i].isActive = true;
          }
        }
      }else if(res['code'] == 5){
        var ak = layer.open({
          content: res['error']+'请重新登录'
          , btn: ['确定']
          , yes: () => {
            this.router.navigate(['login']);
            layer.close(ak);
          }
        })
      }else{
        layer.open({
          title: '提示'
          ,content: res['error']
        });
      }

    })
  }

  ngOnInit(): void {
    let getId = this.route.snapshot.paramMap.get('cur');
    this.curPage = getId?parseInt(getId):1;
    console.log(getId)
    // this.curPage = this.route.paramMap
    //   .switchMap((params: ParamMap) => {
    //     this.selectedId = +params.get('id');
    //     return this.service.getHeroes();
    //   });
    this.getElectricities(this.curPage);
  }


  getElectricities(page:number): void {
    let index = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    this.userService.getMenuDatas(page).then( res => {
      layer.close(index);
      if(res['code'] == 0){
        if(res['data']['list']){
          this.rescuePapers = res['data']['list'];
        }else{
          this.isEmpty=true;
        }
        this.curPage = res['data']['pageNum'];
        this.totalNum   = res['data']['total'];
        this.totalPage   = res['data']['pages'];
        this.setPagingArr();
        if(this.curPage>1){
          for (var i = 0; i < this.pageList.length; i++) {
            this.pageList[i].isActive = false;
            if(this.pageList[i].pageNum==''+this.curPage){
              this.pageList[i].isActive = true;
            }
          }
        }
      }else if(res['code'] == 5){
        var ak = layer.open({
          content: res['error']+'请重新登录'
          , btn: ['确定']
          , yes: () => {
            this.router.navigate(['login']);
            layer.close(ak);
          }
        })
      }else{
        layer.open({
          title: '提示'
          ,content: res['error']
        });
      }
    });
    // this.userService.getRescuesList().then( menus => {
    //   for(let i=0;i<menus.length;i++){
    //     this.rescueTeams.push(menus[i])
    //   }
    // });
  }

  onSelect(helper: rescuePaper): void {
    this.selectedRescuePaper = helper;
  }


  search2(term: string): void{
    this.userService.search2(term,1,10).then( res => {
      if(res['code'] == 0){
        if(res['data']==null){
          layer.open({
            title: '提示'
            ,content: '没有查询到数据'
          });
          return
        }
        // this.rescueId = term;
        this.isEmpty=false;
        this.rescuePapers = res['data']['list'];
        this.curPage = res['data']['pageNum'];
        this.totalNum   = res['data']['total'];
        this.totalPage   = res['data']['pages'];
        this.setPagingArr();
      }else if(res['code'] == 5){
        var ak = layer.open({
          content: res['error']+'请重新登录'
          , btn: ['确定']
          , yes: () => {
            this.router.navigate(['login']);
            layer.close(ak);
          }
        })
      }else{
        layer.open({
          title: '提示'
          ,content: res['error']
        });
      }
    });
  }

  // gotoDetail(rescue:rescuePaper): void {
  //   this.router.navigate(['/home/rescuepapers/135/detail',rescue.taskId],{queryParams: { cur: this.curPage },preserveFragment: true});
  // }

  goBack(): void {
    this.location.back();
  }


}







