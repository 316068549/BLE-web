import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { fadeIn } from '../animations/fade-in';
import { LeftNavComponent } from '../left-nav/left-nav.component';
import { MenuService} from '../shared-service/menu-service';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [ fadeIn]

})
export class HomeComponent implements OnInit {
  @ViewChild(LeftNavComponent)
  private timerComponent2: LeftNavComponent;
  clicke:boolean = true;
  userName:string;
  roleName:string;
  ad:number;
  public currentRoleId = localStorage.getItem("roleId");
  private userId = parseInt(localStorage.getItem("userId"));

  constructor(private menuService:MenuService,private router: Router) {
  }

  ngOnInit() {
    $('.dropdown-toggle').dropdown();
    // $('.dropdown-toggle').click(function () {
    //   alert(1)
    // });
    // $('.dropdown-menu').show();
    setTimeout( ()=> {
      this.getUser();
    },200)
    // this.getUser();
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
        // this.ad = res['rescueTeam']['rescueCenterId'];
        // localStorage.setItem("address", res['rescueTeam']['addr']);
        localStorage.setItem("address","陕西省");
        // localStorage.setItem("rescueTeamId", res['rescueTeam']['rescueTeamId']);
        // this.address = res['rescueTeam']['addr'];
      }
    });
  }

  logout(){
    this.menuService
      .logout()
      .then(menus => {
        localStorage.removeItem("urtokenId");//清除
          localStorage.removeItem("tokenId");//清除
        console.log(this.router.url);
         this.router.navigateByUrl("");
         //this.loginFull(window.location);
      });
  }

  //重新登录
  loginFull(element) {
  //判断各种浏览器，找到正确的方法
  if (element) {
    element.href="http://60.205.4.247:9007";
  }
}


  countChange($event) {
   this.clicke=$event;
  }

}
