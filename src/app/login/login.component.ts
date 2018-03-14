import { Component,Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterState, RouterStateSnapshot } from '@angular/router';
import { UserLoginService } from './user-login.service';
import { MenuService } from '../shared-service/menu-service';
import { User } from '../models/user-model';
import { fadeIn } from '../animations/fade-in';
declare var $:any;
declare var layer:any;

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [ fadeIn
  ]
})
export class LoginComponent implements OnInit {

  rescueCenterId:number;
  user = new User();


  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public userLoginService: UserLoginService,
    public menuService:MenuService
  ) {

  }


  ngOnInit() {
    let index = layer.load(0, {shade: false,offset: '30%'}); //0代表加载的风格，支持0-2
    console.log("--- user-login-component ---");
    console.log(this.router);
    console.log(this.activatedRoute);
    let activatedRouteSnapshot:ActivatedRouteSnapshot=this.activatedRoute.snapshot;
    let routerState: RouterState = this.router.routerState;
    let routerStateSnapshot: RouterStateSnapshot = routerState.snapshot;

    console.log(activatedRouteSnapshot);
    console.log(routerState);
    console.log(routerStateSnapshot);
    layer.close(index);
    $('#name').val('');
    $('#userPassword').val('');
  }


  getUser(userId:number,token:string): void{
    this.menuService.getMenuDetail2(userId,token).then(res => {
      if(res['rescueTeam']){
        this.rescueCenterId = res['rescueTeam']['rescueCenterId'];
        localStorage.setItem("code", res['rescueTeam']['code']);
        if(this.rescueCenterId==0){
          this.router.navigateByUrl("home/ ");
        }
        else{
          this.router.navigateByUrl("home");
        }
      }
    });
  }

  public login():void{
    let index = layer.load(1, {shade: false,offset: '30%'}); //0代表加载的风格，支持0-2
      this.userLoginService.login(this.user.userName,this.user.userPassword).subscribe(res => {
        layer.close(index);
        if(res){
          localStorage.setItem("urtokenId", res.tokenId);
          localStorage.setItem("roleId", res.roleId);
          let userid = res.tokenId.split('==')[1];
          let tokenId = res.tokenId;
          localStorage.setItem("userId", userid);
          this.router.navigateByUrl("home");
          // if(res.roleId==3){
          //   this.router.navigateByUrl("home/helpers/116");
          // }else if(res.roleId==8){
          //   this.router.navigateByUrl("home/monitorCenter");
          // }
          // else{
          //    this.router.navigateByUrl("home");
          // }

        }
        return false;

      });



  }

}

