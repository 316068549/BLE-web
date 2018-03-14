import { Component, OnInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ElectricityService } from '../../../electricity/electricity-service';
import { Electricity } from '../../../models/electricity';
import { Location }               from '@angular/common';
declare var BMap: any;
declare var $:any;
declare var layer:any;

@Component({
  selector: 'app-gaode-map',
  templateUrl: './gaode-map.component.html',
  styleUrls: ['./gaode-map.component.css']
})
export class GaodeMapComponent implements OnInit {
  electricity: Electricity;

  constructor(
    private electricityService: ElectricityService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    var loading;
    var pointList;
    var points =[];
     var  markers,lineArr = [];
    var polyline;

    var imeicode = this.route.snapshot.params['deviceIMEI'];
    var map = new BMap.Map("container");            // 创建Map实例
    var point = new BMap.Point(108.924295,34.235939); // 创建点坐标  width: 437px; height: 267px; top: -3px; left: -9px;
    var myIcon = new BMap.Icon("assets/img/poi-marker2.png", new BMap.Size(25,35),{
      anchor: new BMap.Size(10, 30),
      imageOffset: new BMap.Size(-10, -4)
    });
    var myIcon3 =  new BMap.Icon("assets/img/poi-marker2.png", new BMap.Size(25,35),{
      anchor: new BMap.Size(10, 30),
      imageOffset: new BMap.Size(-53, -4)
    });
    var myIcon2 = new BMap.Icon("assets/img/poi-marker2.png", new BMap.Size(25,35),{
      anchor: new BMap.Size(10, 30),
      imageOffset: new BMap.Size(-98, -4)
    });
    map.centerAndZoom(point,15);
    map.addControl(new BMap.NavigationControl());
    map.enableScrollWheelZoom();                 //启用滚轮放大缩小
    //初始化
    // 鹰眼获取轨迹
    // changeX();
    // track()

    // 后台获取GPS坐标点
    init();



    function init(){
      var start= $('#start').val();
      var end = $('#end').val();
      var result;
      var paramms = {deviceImei:imeicode,startTime:start,endTime:end}

      if(paramms.startTime==''){
        delete paramms['startTime'];
      }
      if(paramms.endTime==''){
        delete paramms['endTime'];
      }
      $.ajax({
        type: "post",
        url: "web/query/orbit",
        //    url: " api/query/messageAll",
        contentType:"application/json",
        dataType: "json",
        data:JSON.stringify(paramms),
        cache: false,
        async: false,
        success: function(data){
          console.log('success')
          if(data.data){
            result=data.data;
            loading = layer.msg('轨迹加载中...');
          }else {
            layer.open({
              title: '提示'
              ,content: '没有查询到轨迹'
            });
            return;
          }
        }
      });
      pointList=result;
      completeEventHandler();
    }

    function completeEventHandler(){
      var lngX ;
      var latY ;
      markers = [];
      var lineArr=[];
      if(!pointList){
        return
      }
      console.log(pointList);
      var pointLen = pointList.length;
      for(var d = 0,marker;d<pointLen;d++){
        var point = new BMap.Point(pointList[d].locationLongitude,pointList[d].locationLatitude);
        lineArr.push(point);
        if(d==0){
          var marker = new BMap.Marker(point,{icon:myIcon,title:pointList[d].locationTime});
          marker.setLabel('起');
          marker.setZIndex(99)
          map.addOverlay(marker);
        }else if(d<pointLen-1){
          // var point = new BMap.Point(resultList2.resultList[d].x, resultList2.resultList[d].y);
          var marker = new BMap.Marker(point,{icon:myIcon3,title:pointList[d].locationTime});
          map.addOverlay(marker);
          // points.push(point);
        }else{
          var marker = new BMap.Marker(point,{icon:myIcon2,title:pointList[d].locationTime});
          map.addOverlay(marker);
          marker.setZIndex(99)
        }
      }
      var view = map.getViewport(lineArr);
      var mapZoom = view.zoom;
      var centerPoint = view.center;
      map.centerAndZoom(centerPoint,mapZoom);
      // //绘制轨迹
      polyline = new BMap.Polyline(lineArr, {strokeColor:"#5298FF", strokeWeight:3, strokeOpacity:0.9});
      layer.close(loading);
      map.addOverlay(polyline);
      //调整视野
    }

    //转换代码，暂时用不到
    function getPoints(pointList){
       var points =[];
       for(var i=0;i<pointList.length;i++){
         var pt = new BMap.Point(pointList[i].locationLongitude,pointList[i].locationLatitude);
         points.push(pt);
       }
       return points;
    }
    function fengzhuang(gpsPouints){
      var pointsArray = new Array();
      var times = Math.floor(gpsPouints.length/10)
      var k = 0;
      for(var i=0;i<times;i++){
        pointsArray[i]=new Array();
        for(var j=0;j<10;j++,k++){
          pointsArray[i][j] = gpsPouints[k]
        }
      }
      if(k<gpsPouints.length){
        var j=0;var i = times;
        pointsArray[i]=new Array();
        while (k<gpsPouints.length){
          pointsArray[i][j] = gpsPouints[k];
          k++;
          j++;
        }
      }
      return pointsArray;
    }
    //转换end

    // function completeEventHandler(){
    //   var lngX ;
    //   var latY ;
    //   markers = [];
    //   var lineArr=[];
    //   var posIndex = 0;
    //   var pointsArray = new Array();
    //   var maxCnt = 10;
    //   if(!pointList){
    //     return
    //   }
    //   //转换百度坐标代码
    //   var gpsPouints = getPoints(pointList);
    //   pointsArray = fengzhuang(gpsPouints);
    //   console.log(pointList);
    //   console.log(pointsArray);
    //   var convertor = new BMap.Convertor();
    //   var translateCallback = function (data){
    //     if(data.status!=0){
    //       alert("转换出错");
    //       return
    //     }
    //     for (var i = 0; i < data.points.length; i++) {
    //       lineArr.push(data.points[i])
    //     }
    //     posIndex++;
    //     if(posIndex<pointsArray.length){
    //       convertor.translate(pointsArray[posIndex], 1, 5, translateCallback);
    //     }
    //     if(posIndex==pointsArray.length){
    //       console.log(lineArr);
    //
    //       for(var d = 0,marker;d<lineArr.length;d++){
    //         if(lineArr.length == 0){
    //           return;
    //         }
    //         if(d==0){
    //           var marker = new BMap.Marker(lineArr[d],{icon:myIcon,title:pointList[d].locationTime});
    //           marker.setLabel('起');
    //           marker.setZIndex(99)
    //           map.addOverlay(marker);
    //         }else if(d<lineArr.length-1){
    //           // var point = new BMap.Point(resultList2.resultList[d].x, resultList2.resultList[d].y);
    //           var marker = new BMap.Marker(lineArr[d],{icon:myIcon3,title:pointList[d].locationTime});
    //           map.addOverlay(marker);
    //           // points.push(point);
    //         }else{
    //           var marker = new BMap.Marker(lineArr[d],{icon:myIcon2,title:pointList[d].locationTime});
    //           map.addOverlay(marker);
    //           marker.setZIndex(99)
    //         }
    //       }
    //       var view = map.getViewport(lineArr);
    //       var mapZoom = view.zoom;
    //       var centerPoint = view.center;
    //       map.centerAndZoom(centerPoint,mapZoom);
    //       // //绘制轨迹
    //       polyline = new BMap.Polyline(lineArr, {strokeColor:"#5298FF", strokeWeight:3, strokeOpacity:0.9});
    //       layer.close(loading);
    //       map.addOverlay(polyline);
    //       //调整视野
    //     }
    //   }
    //   convertor.translate(pointsArray[posIndex], 1, 5, translateCallback);
    // }
    //根据时间搜索
    function changeTime(str){
      // var str ="2013-01-01 00:00:00";
      str = str.replace(/-/g,"/");
      var date = new Date(str);
      var humanDate = new Date(Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(), date.getSeconds()));
      var unix_time = humanDate.getTime()/1000 - 8*60*60;
      return unix_time;
    }
    $('#search1').on('click',function () {
      // polyline.hide( );
      //  map.remove(markers);
      map.clearOverlays();
      init();
      completeEventHandler();
    })



    function changeX(){
      var ak = 'PmTFEuep7FmccxTrTn67TxRn';
      var service_id = 144064;
      // var point_list = '隔壁老王';
      var url = 'http://yingyan.baidu.com/api/v3/track/getlatestpoint?ak=gMtXC5ktlFpOFpRrrevVV' +
        'KhjbeUloFcb&service_id=142120&entity_name=0862631036609138&process_option=need_denoise=1,' +
        'radius_threshold=20,need_mapmatch=1,transport_mode=driving&coord_type_output=bd09ll&mcode=18:' +
        '1A:E7:83:7C:36:CF:CA:83:A8:C5:F6:6F:CA:CB:5C:5A:65:5C:DF;com.anyikang.fallalarm';
      var point_list = [
        {
          "entity_name": "entity1",
          "loc_time": 123,
          "latitude": 34.235939,
          "longitude": 108.924220,
          "coord_type_input": "wgs84",
          "speed":27.23,
          "direction":178,
          "height":173.3,
          "radius":32,
          "city": "guangzhou",
          "province": "guangdong",
        },
        {
          "entity_name": "entity2",
          "loc_time": "321",
          "latitude": "34.215939",
          "longitude": "108.924295",
          "coord_type_input": "wgs84",
          "speed" :28.82,
          "direction":174,
          "height":173.6,
          "radius":32,
          "city": "guangzhou",
          "province": "guangdong"
        }
      ]
      // var start= $('#start').val();
      // var end = $('#end').val();
      var result;
      // var paramms = {imeiCode:imeicode,startTime:start,endTime:end}
      // if(paramms.startTime==''){
      //   delete paramms['startTime'];
      // }
      // if(paramms.endTime==''){
      //   delete paramms['endTime'];
      // }
      // var uul = "http://yingyan.baidu.com/api/v3/track/addpoint"
      // $.ajax({
      //   type: "post",
      //   url: "http://yingyan.baidu.com/api/v3/track/addpoints",
      //   dataType: "json",
      //   data:{ak:'PmTFEuep7FmccxTrTn67TxRn',service_id:144064,point_list:JSON.stringify(point_list)},
      //   cache: false,
      //   async: false,
      //   success: function(data){
      //     result=data.objectbean;
      //     console.log(result)
      //   }
      // });
      $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        data:{ak:'PmTFEuep7FmccxTrTn67TxRn',service_id:144064,point_list:JSON.stringify(point_list)},
        cache: false,
        async: false,
        success: function(data){
          result=data.objectbean;
          console.log(result)
        }
      });
      pointList=result;
      console.log(pointList)
    }
    // 鹰眼获取轨迹
    function track(){
      var ak = 'gMtXC5ktlFpOFpRrrevVVKhjbeUloFcb';
      var service_id = 142120;
      var  entity_name = '0862631036609138';
      var process_option='need_denoise=1,radius_threshold=20,need_mapmatch=1,transport_mode=driving';
      var coord_type_output='bd09ll';
      var mcode='18:1A:E7:83:7C:36:CF:CA:83:A8:C5:F6:6F:CA:CB:5C:5A:65:5C:DF;com.anyikang.fallalarm';
      var start_time=changeTime('2017-06-22 12:00:00');
      var end_time=changeTime('2017-06-22 13:00:00');

      var url = 'http://yingyan.baidu.com/api/v3/track/gettrack?ak='+ak +
        '&service_id='+service_id+'&entity_name='+entity_name+'&process_option='+process_option+'&coord_type_output='+coord_type_output+'&mcode=' +
        mcode+'&start_time='+start_time+'&end_time='+end_time;

      // var start= $('#start').val();
      // var end = $('#end').val();


      $.ajax({
        type: "get",
        url: url,
        dataType: 'jsonp',
        success: function (res) {
          if (res.status === 0) {
            console.log(res);
            pointList=res.points;
            completeEventHandler();

            console.log(res.total);
          } else {
            console.log(res);
            console.log(res.status);
          }
        },
        error: function () {

        }
        // ,
        // complete: function (data) {
        //   console.log(data)
        // }
      });
    }


  }
  goBack(): void {
     this.location.back();
  }

}


