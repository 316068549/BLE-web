import { Pipe, PipeTransform } from '@angular/core';

import { Wearer } from '../../models/wearer';

@Pipe({ name: 'sexChange' })
export class sexChangePipe implements PipeTransform {
  // transform(allHeroes: Menu[],prefix? ) {
  //   return allHeroes.filter(menus => menus.selected.match("^"+prefix));
  // }
  transform(value:number) {
    // if (allHeroes==null) {
    //   return null;
    // }
    if(value==1){
      return '男'
    }else {
      return '女'
    }
    // return value * 10 * arg;
    // return allHeroes.filter(menus => {return menus.permissionParentId == args;
    // });
  }

}




