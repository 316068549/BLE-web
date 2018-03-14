import 'rxjs/add/operator/switchMap';
import { Component, Input, OnInit } from '@angular/core';
import { Menu } from '../../models/menu';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { MenuService} from '../../shared-service/menu-service';

@Component({
  selector: 'app-menu-detail',
  templateUrl: './menu-detail.component.html',
  styleUrls: ['./menu-detail.component.css']
})
export class MenuDetailComponent implements OnInit {
  @Input() menu: Menu;
  // time = new Date();
  parentNames = ['首页', '设备管理', '系统管理'];
  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  // print(text: string) {
  //   this.Sex = this.sex;
  //   console.log(this.Sex);
  // }
  ngOnInit(): void {
  //   this.route.params
  //     .switchMap((params: Params) => this.menuService.getMenuData(params['menuId']))
  //     .subscribe(menu => this.menu = menu);
  //   // this.route.params
  //   //   .switchMap((params: Params) => this.menuService.getMenuData(+params['id'])
  //   //   .subscribe(menu => this.menu = menu);
   }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    // this.menuService.update(this.menu)
    //   .then(() => this.goBack());
  }

}


