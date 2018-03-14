import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';
import { Menu } from '../models/menu';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
import { MenuService} from '../shared-service/menu-service';
import { ParentsmenuesPipe } from '../left-nav/left-nav.pipe';
declare var $:any;
@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {
  @Input()
  url:boolean;
  address:string;
  data:  Menu[];

  @Output()
  change = new EventEmitter();

  menus: Menu[];
  menuactive:boolean = false;
  menuactive2:boolean = true;
  userName:string;
  roleName:string;
  roleId:number;
  ad:number;
  // address:string;
  private userId = parseInt(localStorage.getItem("userId"));
  constructor(
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }
  ngOnInit(): void {
    let rout = this.route.snapshot['_routerState']['url'];
    let str = rout.split('/');
    console.log(str[2]);
    if(str[2]!='monitorCenter')this.menuactive2 = false;
    setTimeout( ()=> {
      this.getMenu();
      this.getUser();
    },200)
   // $('.item').click(function () {
   //  if($(this).hasClass("actives")){
   //    $(this).removeClass("actives");
   //    $(this).children("ul").addClass("collapse in");
   //  }else{
   //    $(this).addClass("actives");
   //    $(this).children("ul").removeClass("collapse in");
   //  }
   //   // $(this).find("li").not(".active").has("ul").children("ul").addClass("collapse");
   // })
  }

  searvh(ak){
    this.menuactive2 = false;
    if(ak=='monitor'){
      this.url = true;
      this.change.emit(this.url);
    }else{
      this.url = false;
      this.change.emit(this.url);
    }

  }

  logout(){
    this.menuService
      .logout()
      .then(menus => {
        if(menus['code'] == 0){
          localStorage.removeItem("urtokenId");//清除
          this.router.navigateByUrl("");
        }
      });
  }

  getMenus(): void {
    this.menuService
      .getMenuDatas()
      .then(menus => {
        this.menus = menus
        $.each(this.menus,(i,obj)=>{
          obj.selected = true;
        })
      });
  }
  getUser(): void{
    let lastToken = parseInt(localStorage.getItem("userId"));
    this.userId = this.userId == lastToken?this.userId : lastToken ;
    this.menuService.getMenuDetail2(this.userId).then(res => {
      if(res['adminUser']){
        console.log(res['adminUser'])
        // menus['adminUser']['roleList'] = menus['adminRoleList'];
        this.userName = res['adminUser']['userName'];
        this.roleName = res['adminUser']['roleList'][0]['roleName'];
        this.roleId = res['adminUser']['roleList'][0]['roleId'];;
        // this.ad = res['rescueTeam']['rescueCenterId'];
        console.log(this.roleId);
        // localStorage.setItem("address", res['rescueTeam']['address']);
        localStorage.setItem("address","陕西省");
        // localStorage.setItem("rescueCenterId", res['rescueTeam']['rescueCenterId']);
        this.address ="陕西省";
      }
    });
  }
  getSubMenu(menu2:Menu){
    this.data=null;
    this.data = menu2.subAdminPermission;
  }

  getMenu(): void {
    this.menuService
      .getMenuDatas()
      .then(menus => this.menus = menus);
  }



}
