import { Pipe, PipeTransform } from '@angular/core';

import { Wearer } from '../../models/wearer';

@Pipe({ name: 'timeChange' })
export class timeChangePipe implements PipeTransform {
  transform(value) {
    // return new Date(parseInt(value)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    var time = new Date(value);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+(m<10?'0'+m:m)+'-'+(d<10?'0'+d:d)+' '+(h<10?'0'+h:h)+':'+(mm<10?'0'+mm:mm)+':'+(s<10?'0'+s:s);
  }

}




