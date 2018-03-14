import { Component, Input, OnInit,AfterViewInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute, Params }   from '@angular/router';
import {FormGroup, FormControl, Validators} from '@angular/forms';

// 2. 引入ng2-validation中的组件
import {CustomValidators} from 'ng2-validation';
import { Subject }           from 'rxjs/Subject';

import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Menu } from '../../models/menu';
import { MenuSearchComponent } from '../menu-search/menu-search.component';
import { LeftNavComponent } from '../../left-nav/left-nav.component';
import { MenuService} from '../../shared-service/menu-service';
import set = Reflect.set;
declare var $:any;
declare var layer: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu-table.component.html',
  styleUrls: ['./menu-table.component.css']
})
export class MenuTableComponent implements OnInit {
  // menus: Observable<Menu[]>;
  // @Input("mfData") public inputData: any[] = [];
  @ViewChild(MenuSearchComponent)
  private timerComponent: MenuSearchComponent;
   public data: any[];
  agreed = false;
  voted;
  countChange(agreed:boolean) {
    let ak  = agreed;
    // console.log(typeof (ak))
    if(ak == false){
      layer.open({
        title: '提示'
        ,content: '没有查询到数据'
      });
    }
    if(ak == true) {this.menus = this.timerComponent.menus;this.isSearch=true;}
  }
  tjmenu:boolean;
  clicked:boolean;
  submied:boolean = false;
  deletemenu:boolean = false;
  addbtn:boolean = false;
  edit:boolean = false;
  del:boolean = false;
  originalUserName:string;
  public params: any;  // 保存页面url参数
  public totalNum ; // 总数据条数
  public pageSize = 10;// 每页数据条数
  public totalPage;// 总页数
  public totalPages = 7 ;// 分页显示数目
  public curPage = 1;// 当前页码
  public isEmpty:boolean = false;
  public isSearch:boolean = false
  public pageList= [{
    isActive: true,
    pageNum: '1'
  }];
  menus: Menu[];
  pages: any;
  btns: Menu[];
  menu: Menu;
  selectedMenu: Menu;
  Menu=new Menu();
  wordControl: string='展开';
  comIdList:any = [
  ];
  comIdList2:any = [
  ];
  info: string = '';
  ref;
  // 表单验证
  form:FormGroup;
  onSelect(menu: Menu): void {
    this.selectedMenu = menu;
    if(!this.selectedMenu.permissionSubId){
      this.selectedMenu.permissionSubId=-1;
    }
    console.log(this.selectedMenu);
  }
  setInfo(id:number) {
    this.comIdList2 =[];
    this.menuService.getParMenus(id).then( menus => {
      for(let i=0;i<menus.length;i++){
        this.comIdList2.push(menus[i])
      }
    });
  }
  setInfo2(obj){
    console.log(obj)
    if(obj<0){
      this.Menu.permissionTypeId=1
    }else {
      this.Menu.permissionTypeId=2;
      this.Menu.permissionUrl='add';
    }
  }
  setInfo22(obj){
    console.log(obj)
    if(obj<0){
      this.selectedMenu.permissionTypeId=1;
    }else {
      this.selectedMenu.permissionTypeId=2;
      this.selectedMenu.permissionUrl='add';
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
     ref: ChangeDetectorRef,
    private location: Location) {

    // 初始化表达组里面的内容
    this.form = new FormGroup({
      name: new FormControl('', CustomValidators.range([2, 10])),
      coding: new FormControl('', CustomValidators.number)
    });
    this.Menu.permissionTypeId = 1;
  }

  setPagingArr() {
    if ( this.totalPage == this.pageList.length) {
      return
    }
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
    for (var i = 0; i < this.pageList.length; i++) {
      this.pageList[i].isActive = false;
    }
    this.pageList[0].isActive = true;
  }

  changePage(index) {
    this.menuService.getMenuList(index,10).then( res => {
      if(res['code'] == 0){
        this.menus = res['data']['list'];
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
    this.route.params
      .switchMap((params: Params) => this.menuService.getMenuBtns(params['permissionId']))
      .subscribe(rescue => {
        for(let i=0;i<rescue.length;i++){
          if(rescue[i].permissionUrl=="add"){
            this.addbtn = true;
          }
          if(rescue[i].permissionUrl=="edit"){
            this.edit = true;
          }
          if(rescue[i].permissionUrl=="del"){
            this.del = true;
          }

        }
      });
    this.getMenus(1);
    // $('input[name="address"],#parentName').change(function(){
    //   if($(this).val()){
    //     $(this).parent().find('.must3').hide();
    //   }
    // })

  }


  searchParMenu(): void{
    this.Menu.permissionTypeId=1;
    this.comIdList=[];
    this.menuService.getParMenus(-1).then( menus => {
      for(let i=0;i<menus.length;i++){
        this.comIdList.push(menus[i])
      }
    });
  }
  searchParMenu2(id:number): void{
    this.originalUserName='';
    this.comIdList=[];
    this.comIdList2=[];
    this.menuService.getMenuDetail(id).then( menus => {

      if(menus['adminPermission']){
        this.originalUserName=menus['adminPermission'].permissionName;
      }
      if(menus['parentPermissionList']){
        for(let i=0;i<menus['parentPermissionList'].length;i++){
          this.comIdList.push(menus['parentPermissionList'][i])
        }
      }
      if(menus['subPermissionList']){
        this.selectedMenu.subPermissionList = menus['subPermissionList'];
        for(let i=0;i<menus['subPermissionList'].length;i++){
          if(this.selectedMenu.permissionParentId==menus['subPermissionList'][i].permissionId){
            this.selectedMenu.parentPermission = menus['subPermissionList'][i].permissionParentId;
          }
          this.comIdList2.push(menus['subPermissionList'][i])
        }
      }
    });

  }
  openClose(id:number,val:string,number:number): void{
      this.menuService.getSubMenu(id).then( men => {
        $.each(men,(i,n) => {
          n.ak="subTr"+id;
          this.menus.splice(number,0,n)
          number++;
          if(n.subAdminPermission.length>0){
            $.each(n.subAdminPermission,(m,obj) => {
              obj.ak="subTr2"+id+' subTr3'+obj.permissionParentId;
              this.menus.splice(number,0,obj);
                number++;
            })
          }
        })
      });
  }
   Close(id:number,val:string,number:number,id2:number): void{
     $(".subTr"+ id).remove();
     $(".subTr2"+ id).remove();
    if(id==id2){
      $(".subTr2"+ id).hide();
    }else{
      $(".subTr"+ id).remove();
      $(".subTr2"+ id).remove();
    }


   }
  Close2(id:number,val:string,number:number,id2:number): void{
      $(".subTr3"+ id2).hide();
  }
  openClose2(id:number,val:string,number:number,id2:number): void{
    $(".subTr3"+ id2).show();
  }

  getMenus(index:number) {
    let loadingIcon = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    var self = this;
    this.menuService.getMenuList(index).then( res => {
      layer.close(loadingIcon);
      if(res['code'] == 0){
        if(res['data']['list']){
          this.menus = res['data']['list'];
        }else{
          this.isEmpty=true;
        }
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
      // if(menus){
      //   this.menus  = menus['list'];
      //   // for(let i=0;i<this.menus.length;i++){
      //   //   this.menus[i].selected = true;
      //   // }
      //   this.pages  = menus['page'];
      //   this.usersLength = menus['list'].length;
      //   self.ref.markForCheck();
      //   self.ref.detectChanges();
      //   console.log(this.pages)
      //   return this.pages;
      // }
    });
  }
  // getMenuBtns(id:number): void{
  //   this.menuService.getMenuBtns().then( menus => {
  //     this.menus  = menus;
  //   });
  // }
  // gotoDetail(): void {
  //   this.router.navigate(['/user-detail', this.selectedMenu.id]);
  // }
  add(name: string, coding: number, subName: number,  parentName: string,parentCode: string, newWindow: number, details: string ): void {
    console.log(newWindow)
    console.log(parentCode)
    name = name.trim();
    if(!parentName){
      $('.must3').show();
      return;
    }
    parentName = parentName.trim();
    parentCode = parentCode.trim();
    details = details.trim();
    // if (!name && !coding && !subName  && !parentName  ) { return; }
    if(!newWindow){
      newWindow = 1;
    }
      this.menuService.create(name, coding, subName, parentName, parentCode,newWindow, details)
        .then(menu => {
          if(!menu) {
            layer.open({
              title: '提示'
              , content: "添加失败"
            });
            return;
          }
          if(typeof (menu)=='string'){
            layer.open({
              title: '提示'
              ,content: menu
            });
          }
          this.getMenus(this.curPage);
          this.resetPagingArr();
          this.selectedMenu = null;
          $('#details').val('');
          this.tjmenu = false;
          this.submied = true;
          this.clicked = false;
        });

    // this.menuService.create(name, coding, subName, parentName, parentCode,newWindow, details)
    //   .then(menu => {
    //     if(!menu) {
    //       layer.open({
    //         title: '提示'
    //         , content: "添加失败"
    //       });
    //     }
    //     if(typeof (menu)=='string'){
    //       layer.open({
    //         title: '提示'
    //         ,content: menu
    //       });
    //     }
    //     this.getMenus();
    //     this.selectedMenu = null;
    //     $('#details').val('');
    //   });

    // layer.open({
    //   title: '提示'
    //   ,content: '添加成功'
    // });
  }
  delete(menu: Menu): void {
    var ak = layer.open({
      content: '确定删除？'
      , btn: ['确定', '取消']
      , yes: () => {
        this.menuService
          .delete(menu.permissionId)
          .then(res =>{
            if(res['code'] == 0){
            }else if(res['code'] == 5){
              alert(res['error']);
              this.router.navigate(['login']);
            }else if(res['code'] == 6){
              alert(res['error']);
              this.router.navigate(['login']);
            }else{
              alert(res['error']);
            }
            layer.close(ak);
            this.getMenus(this.curPage);
            this.resetPagingArr();
            if (this.selectedMenu === menu) { this.selectedMenu = null; }
          });

      }
      , btn2: () => {

      }
    })
  }

  save(id:number,name: string, coding: number, subName: number,  parentName: string,parentCode: string, newWindow: number, details: string): void {
    name = name.trim();
    parentName = parentName.trim();
    parentCode = parentCode.trim();
    details = details.trim();
    if (!id&&!name && !coding && !subName && !newWindow && !parentName && !parentCode ) { return; }
    this.menuService.update(id,this.originalUserName,name, coding, subName, parentName, parentCode,newWindow, details)
      .then(menu => {
        if(!menu) {
          layer.open({
            title: '提示'
            , content: "修改失败"
          });
        }
        if(typeof (menu)=='string'){
          layer.open({
            title: '提示'
            ,content: menu
          });
        }
        this.getMenus(this.curPage);
        this.resetPagingArr();
        this.selectedMenu = null;
        $('#details').val('');
      });
    $('#details').val('');
    this.deletemenu = false;
    this.clicked = false;
  }
  cancel(){
    this.getMenus(this.curPage);
    this.selectedMenu = null;
  }
  goBack(): void {
    this.location.back();
  }
  toInt(num: string) {
    return +num;
  }

  sortByWordLength = (a: any) => {
    return a.city.length;
  }

}





