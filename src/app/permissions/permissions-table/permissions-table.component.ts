import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute, Params }   from '@angular/router';

import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Role } from '../../models/role';
import { Menu } from '../../models/menu';
import { PermissionService } from '../permissions-service';
declare var $:any;
declare var layer:any;

@Component({
  selector: 'app-permissions-table',
  templateUrl: './permissions-table.component.html',
  styleUrls: ['./permissions-table.component.css']
})
export class PermissionTableComponent implements OnInit {
  roles: Role[];
  role: Role;
  menus: Menu[];
  menus2: Menu[];
  menus3: Menu[];
  selectedRole: Role;
  tjmenu:boolean;
  clicked:boolean;
  submied:boolean = false;
  addbtn:boolean = false;
   edit:boolean = false;
   del:boolean = false;
   deletemenu:boolean = false;
  Role=new Role();
  addIDs = [];
  delIds = [];
  public params; // 保存页面url参数
  public totalNum; // 总数据条数
  public pageSize = 10;// 每页数据条数
  public totalPage ;// 总页数
  public totalPages = 7 ;// 总页数
  public curPage = 1;// 当前页码
  public isEmpty:boolean = false;
  public usersLength;// 当前页码
  pages: any;
  term={};
  parentNames = [];
  public pageList= [{
    isActive: true,
    pageNum: '1'
  }];
  addIDs2 = [];
  originalRoleId:number;
  originalUserName:string;
  constructor(
    private router: Router,
    private userService: PermissionService,
    private location: Location,
  private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => this.userService.getMenuBtns(params['permissionId']))
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
    this.getElectricities(1);
  }

  setPagingArr() {
    console.log(this.curPage)
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
        // this.pageList.push({
        //   isActive: false,
        //   pageNum: '2'
        // });
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
        // this.pageList.push({
        //   isActive: false,
        //   pageNum: '2'
        // });
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

  getElectricities(index:number): void {
    let loadingIcon = layer.load(1, {shade: false,skin: 'load-box',offset: '30%',area:'30px'});
    this.userService.getMenuList(index,10).then( res => {
      layer.close(loadingIcon);
      if(res['code'] == 0){
        this.curPage = res['data']['pageNum'];
        if(res['data']['list']){
          this.roles = res['data']['list'];
        }else{
          this.isEmpty=true;
        }
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

  changePage(index) {
    this.userService.getMenuList(index,10).then( res => {
      if(res['code'] == 0){
        this.roles = res['data']['list'];
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

  onSelect(user: Role): void {
    this.selectedRole = user;
    this.originalUserName =this.selectedRole.roleName;
  }

  searchParMenu(): void{
    this.parentNames=[];
    this.addIDs=[];
    this.addIDs2=[];
    this.term={};
    this.userService.getMenuDatas().then( menus => {
      this.menus = menus['allList']
      console.log(this.menus)
      // for(let i=0;i<this.menus.length;i++){
      //   this.menus[i].permissionDescription = null;
      //   for(let a=0;a<this.menus[i].subAdminPermission.length;a++){
      //     this.menus[i].subAdminPermission[a].permissionDescription = null;
      //     for(let b=0;b<this.menus[i].subAdminPermission[a].subAdminPermission.length;b++){
      //       this.menus[i].subAdminPermission[a].subAdminPermission[b].permissionDescription = null;
      //     }
      //   }
      // }
    });
  }
  ak3(status,name,id){
    $.each(this.menus,(i, role)=>{
      $.each(role.subAdminPermission,(s, role2)=>{
        $.each(role2.subAdminPermission,(d, role3)=>{
          if(role3.permissionId ==id){
            if(status) {
              role3.selected = false;
            }else {
              role3.selected = true;
            }
          }
          if(role3.selected) {
            $.each(this.menus,(m, ak)=>{
              $.each(ak.subAdminPermission,(w, ak2)=>{
                if(ak2.permissionId==role3.permissionParentId){
                  ak2.selected =true;
                  $.each(this.menus,(n, it)=>{
                    if(it.permissionId==ak2.permissionParentId){
                      it.selected =true;
                    }
                  })
                }
              })
            })
          }
        })
      })
    })
    console.log(this.addIDs2)
  }
  ak2(status,name,id,pid){
    $.each(this.menus,(i, role)=>{
       if(role.permissionId==pid){
         if(!status) {
           role.selected = true;
         }
       }
      $.each(role.subAdminPermission,(i, role2)=>{
        if(role2.permissionId ==id){
          if(status) {
            role2.selected = false;
            $.each(role2.subAdminPermission,(w, role3)=>{
              role3.selected=false;
            })
          }else{
            role2.selected = true;
            $.each(role2.subAdminPermission,(w, role3)=>{
              role3.selected=true;
            })
          }
        }
      })
    })
    console.log(this.addIDs2)
  }
  ak(status,name,id){
    $.each(this.menus,(i, role)=>{
      if(role.permissionId ==id){
        if(status) {
          role.selected=false;
          $.each(role.subAdminPermission,(i, role2)=>{
            role2.selected=false;
            $.each(role2.subAdminPermission,(m, role3)=>{
              role3.selected=false;
            })
          })
        }else{
          role.selected=true;
          $.each(role.subAdminPermission,(i, role2)=>{
            role2.selected=true;
            $.each(role2.subAdminPermission,(m, role3)=>{
              role3.selected=true;
            })
          })
        }
      }
    })
   // if(status){
   //   this.addIDs2.push(id);
   //   // if(name){
   //   //   if(name.indexOf('status')==-1){
   //   //     this.term[id]=name;
   //   //   }
   //   // }
   // }else{
   //   for(let i=0;i<this.addIDs2.length;i++){
   //     if(this.addIDs2[i]==id){
   //       this.addIDs2.splice(i,1)
   //     }
   //   }
   //   // if(this.term.hasOwnProperty(id)){
   //   //  delete this.term[id];
   //   //   console.log(this.term)
   //   // }
   // }
     console.log(this.term)
    console.log(this.addIDs2)
 }

  add(): void {
    $.each(this.menus,(i, role)=>{
      if(role.selected){
        this.addIDs.push(role.permissionId);
      }
      $.each(role.subAdminPermission,(i, role2)=>{
        if(role2.selected){
          this.addIDs.push(role2.permissionId);
          this.term[role2.permissionId]='subMenu_'+role2.permissionParentId;
        }
        $.each(role2.subAdminPermission,(i, role3)=>{
          if(role3.selected){
            this.addIDs.push(role3.permissionId);
            this.term[role3.permissionId]='buttonMenu_'+role2.permissionParentId+'_'+role3.permissionParentId;
          }
        })
      })
    })
    let str ='';
    $.each(this.addIDs, function(i, item){
      str +=item+',';
    });
    str=str.substring(0,str.length - 1)
    console.log(str);
    let str2 ='';
    for(var key in this.term){
      str2+=this.term[key]+'='+key+'&';
    }
    console.log(str2);
    this.userService.create(str, this.Role.roleName, this.Role.roleDescription,str2)
      .then(menu => {
        // if(!menu) {
        //   layer.open({
        //     title: '提示'
        //     , content: "添加失败"
        //   });
        //   return;
        // }
        if(typeof (menu)=='string'){
          layer.open({
            title: '提示'
            ,content: '添加成功'
          });
        }
        this.getElectricities(this.curPage);
        this.selectedRole = null;
        $('#details').val('');
        this.submied = true;
        this.tjmenu = false;
        this.clicked = false;
      });
  }

  searchParMenu2(id:number): void{
    this.addIDs=[];
    this.addIDs2=[];
    this.delIds=[];
    this.term={};
    this.originalUserName='';
    this.menus3 = null;
    this.menus = null;
    this.userService.getMenuDatas(id).then( menus => {
      this.menus = menus['allList'];
      this.menus3 = menus['userList'];
      console.log(this.addIDs2);
      $.each(this.menus3,(i, role)=>{
          this.addIDs2.push(role.permissionId);
        $.each(role.subAdminPermission,(w, role2)=>{
            this.addIDs2.push(role2.permissionId);
          $.each(role2.subAdminPermission,(l, role3)=>{
              this.addIDs2.push(role3.permissionId);
          })
        })
      })
      console.log(this.addIDs2);
        if(menus['userList'].length>0){
          $.each(this.menus, (i, item)=>{
            $.each(menus['userList'], (f, item2)=>{
              if(item.permissionId==item2.permissionId){
                item.selected = true;
              }
              $.each(item.subAdminPermission, (b, item3)=>{
                $.each(item2.subAdminPermission, (c, item4)=>{
                  if(item3.permissionId==item4.permissionId){
                    item3.selected = true;
                  }else{

                  }
                  $.each(item3.subAdminPermission, (d, item5)=>{
                    $.each(item4.subAdminPermission, (e, item6)=>{
                      if(item5.permissionId==item6.permissionId){
                        item5.selected = true;
                      }else{

                      }

                    })

                  })
                })
              })
            });
          });
          console.log(this.addIDs2)

        }
    });
  }

  delete(role: Role): void{
    var ak = layer.open({
      content: '确定删除？'
      , btn: ['确定', '取消']
      , yes: () => {
        this.userService.delete(role.roleId).then(res =>{
          if(res['code'] == 0){
            this.getElectricities(this.curPage);
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
          this.getElectricities(this.curPage);
        })
      }
      , btn2: () => {

      }
    })
  }

  save(roleId:number,roleName:string,des:string): void {
    console.log(this.menus)
    $.each(this.menus,(i, role)=>{
      if(role.selected){
        this.addIDs.push(role.permissionId);
      }
      $.each(role.subAdminPermission,(i, role2)=>{
        if(role2.selected){
          this.addIDs.push(role2.permissionId);
          this.term[role2.permissionId]='subMenu_'+role2.permissionParentId;
        }
        $.each(role2.subAdminPermission,(i, role3)=>{
          if(role3.selected){
            this.addIDs.push(role3.permissionId);
            this.term[role3.permissionId]='buttonMenu_'+role2.permissionParentId+'_'+role3.permissionParentId;
          }
        })
      })
    })
    console.log(this.addIDs2);
    console.log(this.addIDs);
    for(let a=0;a<this.addIDs2.length;a++) {
      if(this.addIDs.indexOf(this.addIDs2[a])<0){
        this.delIds.push(this.addIDs2[a])
      }
      for (let i = 0; i < this.addIDs.length; i++) {
        if (this.addIDs[i] == this.addIDs2[a]) {
          this.addIDs.splice(i, 1)
        }

      }
    }

    console.log(this.addIDs);
    console.log(this.delIds);
    let str ='';
    $.each(this.addIDs, function(i, item){
      str +=item+',';
    });
    str=str.substring(0,str.length - 1)
    console.log(str);
    let str3 ='';
    $.each(this.delIds, function(i, item){
      str3 +=item+',';
    });
    str3=str3.substring(0,str3.length - 1)
    console.log(str3);
    let str2 ='';
    for(var key in this.term){
      str2+=this.term[key]+'='+key+'&';
    }
    console.log(str2);

    this.userService.update(roleId,this.originalUserName,roleName,des, str, str2,str3)
      .then(res => {
        if(res['code'] == 0){
          layer.open({
            title: '提示'
            ,content: '修改成功'
          });

        }else{
          layer.open({
            title: '提示'
            ,content: res['data']
          });
          return
        }
        this.selectedRole = null;
        this.getElectricities(this.curPage);
        this.deletemenu = false;
        this.clicked = false;
    });
  }


  // gotoDetail(): void {
  //   this.router.navigate(['/user-detail', this.selectedMenu.id]);
  // }
  cancel(){
    this.getElectricities(this.curPage);
    this.selectedRole = null;
  }

  goBack(): void {
    this.location.back();
  }


}







