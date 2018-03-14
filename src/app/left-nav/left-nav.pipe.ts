import { Pipe, PipeTransform } from '@angular/core';

import { Menu } from '../models/menu';

@Pipe({ name: 'parentmenu' })
export class ParentsmenuesPipe implements PipeTransform {
  // transform(allHeroes: Menu[],prefix? ) {
  //   return allHeroes.filter(menus => menus.selected.match("^"+prefix));
  // }
  transform(allHeroes: Menu[],args) {
    if (allHeroes==null) {
      return null;
    }
    return allHeroes.filter(menus => {return menus.permissionParentId == args;
    });
  }

//   transform(allHeroes:  Menu[]) {
//     if (allHeroes==null) {
//       return null;
//     }
//     return allHeroes.filter(menus => menus.selected);
//   }

  // return value.filter((student)=>new RegExp(queryString).test(student.name))

}




