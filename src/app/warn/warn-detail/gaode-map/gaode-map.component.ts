import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { WarnService } from '../../warn-table/service/warn-service';
import { Warn } from '../../../models/warn';
import { Location }               from '@angular/common';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
declare var BMap: any;
declare var $:any;

@Component({
  selector: 'app-gaode-map',
  templateUrl: './gaode-map.component.html',
  styleUrls: ['./gaode-map.component.css']
})
export class GaodeMapComponent implements OnInit {
  warn: Warn;
  warnes:Warn[];

  constructor(
    private warnService: WarnService,
    private route: ActivatedRoute,
    private location: Location
  ) {



  }

  ngOnInit() {

    const imeicode = this.route.snapshot.params['deviceIMEI'];
    const alarmId = this.route.snapshot.params['alarmId'];
     // var  markers,lineArr = [];
    // var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});



    var map = new BMap.Map("container");            // 创建Map实例
    var point = new BMap.Point(108.924295,34.235939); // 创建点坐标
    map.centerAndZoom(point,15);
    map.enableScrollWheelZoom();                 //启用滚轮放大缩小


    // let map = new AMap.Map('container');
    // map.setZoom(11);
    // map.plugin(['AMap.ToolBar','AMap.PlaceSearch'], () => {
    //   var toolbar = new AMap.ToolBar();
    //   map.plugin(toolbar);
    //   var toolbar2 = new AMap.PlaceSearch();
    //   map.plugin(toolbar2);
    // });
    this.warnService.search(imeicode,alarmId).subscribe(
      res => {
        this.warnes = res;
          // for(var i=0,marker;i<this.warnes.length;i++) {
            var point = new BMap.Point(this.warnes[0].alarmLongitude, this.warnes[0].alarmLatitude);
            map.centerAndZoom(point,15);
            // var marker = new BMap.Marker(point);
            // map.addOverlay(marker);

        setTimeout(function(){
          var convertor = new BMap.Convertor();
          var pointArr = [];
          pointArr.push(point);
          convertor.translate(pointArr, 1, 5, function (data){
            if(data.status === 0) {
              var marker = new BMap.Marker(data.points[0]);
              map.addOverlay(marker);
              // var label = new BMap.Label("转换后的百度坐标（正确）",{offset:new BMap.Size(20,-10)});
              // marker.setLabel(label); //添加百度label
              map.setCenter(data.points[0]);
            }
          })
        }, 10);


            //在地图上创建标注点
            // var marker = new BMap.Marker({
            //   map: map,
            //   icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
            //   offset: new AMap.Pixel(-12, -36)
            // });
            // marker.setPosition(new AMap.LngLat(this.warnes[0].alarmLongitude, this.warnes[0].alarmLatitude));
            // marker.setMap(map);
            // marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
            //   offset: new AMap.Pixel(3, 0),//修改label相对于maker的位置
            //   content:  1
            // });
            // marker.content = this.warnes[0].name + "<br/>" + this.warnes[0].alarmTime;
            // marker.on('click', function (e) {
            //   infoWindow.setContent(e.target.content);
            //   infoWindow.open(map, e.target.getPosition());
            // });
            //        marker.emit('click', {target:marker});
          // }

        // for(var i=0,marker;i<this.warnes.length;i++) {
        //   marker = new AMap.Marker({
        //     icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
        //     position: [this.warnes[i].alarmLongitude, this.warnes[i].alarmLatitude]
        //   });
        //   if(i==0||i==this.warnes.length-1){
        //     marker.setzIndex(999);
        //   }
        //   marker.setMap(map);
        // }
      });
    console.log(this.warnes);
  }

  // getWarn():void{
  //   const imeicode = this.route.snapshot.params['deviceIMEI'];
  //   this.warnService.search(imeicode);
  // }


  goBack(): void {
    this.location.back();
  }
}


