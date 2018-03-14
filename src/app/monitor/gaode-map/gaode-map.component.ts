import { Component, OnInit, DoCheck, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LeftNavComponent } from '../../left-nav/left-nav.component';
import {isNullOrUndefined} from "util";
declare var BMap: any;
declare var $:any;
declare var BMapLib:any;
declare var videojs:any;
declare var layer:any;

@Component({
  selector: 'app-gaode-map',
  templateUrl: './gaode-map.component.html',
  styleUrls: ['./gaode-map.component.css']
})
export class GaodeMapComponent implements OnInit {
  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    var tokenId = localStorage.getItem("urtokenId");
    var userId = localStorage.getItem("userId");
    var mapaddress;
    var defaultIconStyle = 'red', //默认的图标样式
      hoverIconStyle = 'green', //鼠标hover时的样式
      selectedIconStyle = 'purple'; //选中时的图标样式
    var volunteerList;
    var deviceList;
    var changeXyList=[];
    var sosList ;

    // var warningList=[];//报警列表
    var warningDeviceList=[];
    var  markers,infoWindows = [];
    var map = new BMap.Map("container");            // 创建Map实例
    //获取下拉数据
    var X = $('#container').width();
    var Y = $('#container').height();
    // var point = new BMap.Point(108.924295,34.235939); // 创建点坐标
    var myIcon = new BMap.Icon("assets/img/baojing.gif", new BMap.Size(30,30));
    var myIcon2 = new BMap.Icon("assets/img/mark_b.png", new BMap.Size(30,30));
    var myIcon3 = new BMap.Icon("assets/img/rescue.png", new BMap.Size(45,45));
    map.enableScrollWheelZoom();  //启用滚轮放大缩小
    // map.enableInertialDragging();
    // map.centerAndZoom(point,11);
    map.addControl(new BMap.NavigationControl());

    drawMap();
    setTimeout( ()=> {
      init();
      startRun();
    },1000)

     // var awp = setTimeout(xunhuan,5000);
    var interval = setInterval(xunhuan,20000);
    var xuanhuanobj = true;
    //打开气泡延迟20秒刷新

    function xunhuan(){
      map.clearOverlays();
      changePlace();
      startRun();
    }
    function getLocalTime(nS) {
    return new Date(parseInt(nS)).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    };
     //初始化画框
    function drawMap(){
      // $.ajax({
      //   type: "get",
      //   cache: false,
      //   async: false, //同步请求外面才能获取到*
      //   url: "admin/query/adminUserId?usersId="+userId+"&tokenId="+tokenId,
      //   success: function(data1){
      //     mapaddress=data1.data.rescueTeam.address;
      //     console.log(data1.data.rescueTeam.name)
      //     // if(data1.data.rescueTeam.rescueCenterId==0){
      //     //    map.setMinZoom(8);
      //     // }else
      //       if(data1.data.rescueTeam.code.substring(2,6)=='0000'){
      //       map.setMinZoom(8);
      //     }
      //   }
      // });
      mapaddress = '陕西省';
      map.setMinZoom(8);
      getBoundary(mapaddress);
    }
    // 地图初始化位置
    function init(){
      var resul;
      $.ajax({
        type: "get",
        cache: false,
        async: false, //同步请求外面才能获取到*
        url: "indata?tokenId="
          +tokenId
        ,
        success: function(data){
            resul=data.data;
        }
      });
      // volunteerList=resul.volunteerList;
      // deviceList=resul.deviceList;
      // taskList=resul.taskList;
      if(!resul){
        return
      }
      // if(resul.guardianList){
      //   volunteerList=resul.guardianList;
      // }else{
      //   volunteerList=[];
      // }
      if(resul.deviceList){
        deviceList=resul.deviceList;
      }else{
        deviceList=[];
      }
      if(resul.sosList){
        sosList=resul.sosList;
      }
      // if(deviceList){
      //   $.each(deviceList,function (i,n) {
      //     if(n['is_alarm']==1){
      //       $('.panel').show();
      //       var html = "<li><a href='javascript:;' class="+n.deviceIMEI+">"+n.NAME+"<span class='warnings' style='margin-left: 15px'>（正在报警）</span></a></li>"
      //       $('.panel ul').append(html)
      //       warningList.push(n.deviceIMEI);
      //     }
      //   })
      // }
      //任务状态表格
      if(sosList){
        if(sosList.length>0){
          $.each(sosList,function (i,n) {
            $.each(deviceList,function (a,obj) {
              if(obj.deviceIMEI==n.deviceIMEI){
                if(!obj.active){
                  obj.isCall = n.isCall;
                  obj.active = true;
                }else {

                }
                // obj.isCreat = true;
              }
              // if(n.status==3){
              //   $.each(deviceList,function (a,obj) {
              //     if(obj.alarmId==n.alarmId){
              //       obj.isCreat = false;
              //     }
              //   })
              // }
            })
          })
          $.each(sosList,function (i,n) {
            $('.panel').show();
            var html = "<li><a href='javascript:;' id="+n.alarmId+" class=" + n.deviceIMEI + ">";
            // var html2 = "<span style='margin-left: 15px'>任务状态（等待接单，报警地址："+item.address+")</span>"
            // var html2 = "<span style='margin-left: 15px'>任务状态（救援中，接单人："+obj.NAME+"，电话："+obj.mobile+")</span>"
            // var html3 = "<span style='margin-left: 15px'>任务状态（已结束，接单人："+obj.NAME+"，电话："+obj.mobile+")</span>"
            if(n.isCall==1){
              // warningList.push(n.deviceIMEI);
              // warningTaskList.push(n.task_id);
              warningDeviceList.push({
                deviceImei:n.deviceIMEI,
                taskId:n.alarmId
              })
              $.each(deviceList,function (a,obj) {
                if(obj.deviceIMEI==n.deviceIMEI){
                  html+=obj.NAME+"<span class='warningTask'>（正在报警，报警地址："+n.alarmAddr+")</span></a></li>"
                }
              })
            }
            // else if(n.status==2){
            //   $.each(deviceList,function (a,obj) {
            //     if(obj.deviceIMEI==n.deviceIMEI){
            //       html+=obj.NAME;
            //     }
            //   })
            //   html+="<span>（救援中，接单人：";
            //   $.each(volunteerList,function (c,vol) {
            //     if(vol['userId']==n['userId']){
            //       html+=vol.name+"，电话："+vol.mobile+")</span></a></li>"
            //     }
            //   })
            // }
            else {
              $.each(deviceList,function (a,obj) {
                if(obj.deviceIMEI==n.deviceIMEI){
                  html+=obj.NAME;
                }
              })
              html+="<span>（已结束）";
              // html+="<span>（已结束，接单人：";
              // $.each(volunteerList,function (c,vol) {
              //   if(vol['volunteer_id']==n['volunteer_id']){
              //     html+=vol.name+"，电话："+vol.mobile+")</span></a></li>"
              //   }
              // })
            }
            $('.panel ul').append(html)
          })
        }
      }

    }
    // 地图刷新位置
    function changePlace(){
      changeXyList=[];
      if(!localStorage.getItem("urtokenId")){
        window.clearInterval(interval);
        return;
      }
      var result;
      $.ajax({
        type: "get",
        cache: false,
        async: false, //同步请求外面才能获取到*
        url: "indata?tokenId="
           +tokenId
        ,
        success: function(data){
          if (data.code == 0) {
          } else if (data.code == 5) {
            var ak = layer.open({
              content: data.error + '，请重新登录'
              , btn: ['确定']
              , yes: () => {
                // this.router.navigate(['login']);
                loginFull(window.location);
                layer.close(ak);
              }
            })
          } else {
            window.clearInterval(interval);
            layer.open({
              title: '提示'
              , content: data.error
            });
          }
           result=data.data;
        }
      });
      // volunteerList=result.volunteerList;
      // deviceList=result.deviceList;
      // taskList=result.taskList;
      // if(result.guardianList){
      //   volunteerList=result.guardianList;
      // }
      // else{
      //   volunteerList=[];
      // }
      if(result.deviceList){
        deviceList=result.deviceList;
        // if(warningList.length>0){
        //   $.each(warningList, function (i, n) {
        //     $.each(deviceList, function (a, obj) {
        //       if(n == obj.deviceIMEI){
        //         // if(obj.is_alarm==0){
        //         //   $('.'+ n +' .warnings').remove();
        //         //   var index = warningList.indexOf(n);
        //         //   warningList.splice(index, 1);
        //         // }
        //       }
        //     })
        //   })
        // }
        if(warningDeviceList.length>0){
          $.each(warningDeviceList, function (i, n) {
            $.each(deviceList, function (a, obj) {
              if(n.deviceImei == obj.deviceIMEI){
                // if(obj.is_alarm==0){
                //   $('.'+ n +' .warnings').remove();
                //   var index = warningList.indexOf(n);
                //   warningList.splice(index, 1);
                // }
              }
            })
          })
        }
      }
      if(result.sosList){
        sosList=result.sosList;
      }
      // volunteerList=result.data.volunteerList;
      // deviceList=result.data.deviceList;
      // taskList=result.data.taskList;
      if(sosList) {
        if (sosList.length > 0) {
          $.each(sosList, function (i, n) {
            $.each(deviceList, function (a, obj) {
              if (obj.deviceIMEI == n.deviceIMEI) {
                if(!obj.active){
                  obj.isCall = n.isCall;
                  obj.active = true;
                }else {

                }
                // if (n.status == 1 || n.status == 2) {
                //   obj.isCreat = true;
                // } else {
                //   obj.isCreat = false;
                // }
              }
            })
          })
          $.each(sosList, function (s, sss) {
            var html = "<span>（";
             var html2 = "<li><a href='javascript:;' id="+sss.alarmId+" class="+ sss.deviceIMEI + ">";
            var warningList=[];
            if (sss.isCall == 1) {

                 // warningList.push(sss.deviceIMEI);
                 console.log('开始：报警列表'+warningDeviceList.length)
                // $.each(deviceList, function (aa, oobj) {
                //   if (oobj.deviceIMEI == sss.deviceIMEI) {
                //     html2 += oobj.NAME+"<span class='warningTask'>（等待接单，报警地址：" + oobj.address + ")</span></a></li>"
                //   }
                // })
                // $('.panel ul').append(html2)
                //
              if(warningDeviceList){

                warningList=[];
                if(warningDeviceList.length>0){
                  $.each(warningDeviceList,function (b,devicr) {
                    warningList.push(devicr.deviceImei);
                  })
                }
                console.log('报警列表'+warningDeviceList.length)
                console.log(warningList)
                  if(warningList.indexOf(sss.deviceIMEI)==-1){

                  // warningList.push(sss.deviceIMEI);
                  // warningTaskList.push(sss.task_id);
                  warningDeviceList.push({
                    deviceImei:sss.deviceIMEI,
                    taskId:sss.alarmId
                  })
                    console.log('结束：报警列表'+warningDeviceList.length)
                    console.log(warningList)
                  $.each(deviceList, function (aa, oobj) {
                    if (oobj.deviceIMEI == sss.deviceIMEI) {
                      html2 += oobj.NAME+"<span class='warningTask'>（正在报警，报警地址：" + sss.alarmAddr + ")</span></a></li>"
                    }
                  })
                    console.log('生成'+$('.panel ul #'+sss.alarmId).length)
                    if($('.panel ul #'+sss.alarmId).length==0){
                      $('.panel ul').prepend(html2)
                    }
                }
                if(warningList.indexOf(sss.deviceIMEI)>-1){
                  var nowDate = new Date().getTime();
                  // console.log(nowDate-sss.createTime)
                  if(nowDate-sss.alarmTime>300000){
                    $.each(warningDeviceList,function (b,devicr) {
                      if(devicr.deviceImei==sss.deviceIMEI){
                        if(!devicr.alerted){
                          $.each(deviceList, function (aa, oobj) {
                            if (oobj.deviceIMEI == sss.deviceIMEI) {
                              var ak = layer.open({
                                content: '求救人'+oobj.NAME+' 救援任务长时间无人接单，请指定人员接单！'
                                , btn: ['确定']
                                , yes: () => {

                                  layer.close(ak);
                                }
                              })
                              devicr.alerted=true;
                              console.log(xuanhuanobj);
                              if(xuanhuanobj){
                                window.clearInterval(interval);
                                xuanhuanobj=false;
                                setTimeout(() => {
                                  interval = setInterval(xunhuan,20000);
                                  xuanhuanobj=true;
                                },10000);
                              }
                              $('.'+sss.deviceIMEI).click();
                            }
                          })

                        }
                      }
                    })
                  }
                }
              }
            }
            // else if (sss.status == 2) {
            //   if(warningDeviceList.length>=0) {
            //     warningList = [];
            //     if (warningDeviceList.length > 0) {
            //       $.each(warningDeviceList, function (b, devicr) {
            //         warningList.push(devicr.deviceImei);
            //       })
            //     }
            //     if(warningList.indexOf(sss.deviceIMEI)>-1){
            //       $.each(warningDeviceList, function (i, n) {
            //         if(n.taskId == sss.task_id){
            //           warningDeviceList.splice(i,1);
            //         }
            //       })
            //     }
            //   }
            //
            //   $.each(deviceList, function (aa, oobj) {
            //     if (oobj.deviceIMEI == sss.deviceIMEI) {
            //       html += "救援中，接单人："
            //     }
            //   })
            //   $.each(volunteerList, function (c, vol) {
            //     if (vol['userId'] == sss['userId']) {
            //       html += vol.name + "，电话：" + vol.mobile + "）</span>"
            //     }
            //   })
            //   $('#' + sss['task_id'] + ' span').remove();
            //   $('#' + sss['task_id']).append(html);
            // }
            else {
              if(warningDeviceList.length>=0) {
                warningList = [];
                if (warningDeviceList.length > 0) {
                  $.each(warningDeviceList, function (b, devicr) {
                    warningList.push(devicr.deviceImei);
                  })
                  if(warningList.indexOf(sss.deviceIMEI)>-1){
                    $.each(warningDeviceList, function (i, n) {
                      if(n.taskId == sss.alarmId){
                        // var index = warningList.indexOf(n);
                        // if(sss.task_id==warningTaskList[index]){
                        //   warningList.splice(index, 1);
                        //   warningTaskList.splice(index,1);
                        // }
                        warningDeviceList.splice(i,1);
                      }
                    })
                  }
                }

              }
              // if(warningList.indexOf(sss.deviceIMEI)>-1){
              //   $.each(warningList, function (i, n) {
              //     if(n == sss.deviceIMEI){
              //       var index = warningList.indexOf(n);
              //       if(sss.task_id==warningTaskList[index]){
              //         warningList.splice(index, 1);
              //         warningTaskList.splice(index,1);
              //       }
              //     }
              //   })
              // }
              $.each(deviceList, function (aa, oobj) {
                if (oobj.deviceIMEI == sss.deviceIMEI) {
                  // html += "已结束，接单人："
                  html += "已结束）"
                }
              })
              // $.each(volunteerList, function (c, vol) {
              //   if (vol['volunteer_id'] == sss['volunteer_id']) {
              //     html += vol.name + "，电话：" + vol.mobile + ")</span>"
              //   }
              // })
              $('#' + sss['alarmId'] + ' span').remove();
              $('#' + sss['alarmId']).append(html);
            }
          })
        }
      }

    }
    //转换代码
    function getPoints(pointList){
      var points =[];
      for(var i=0;i<pointList.length;i++){
        var pt = new BMap.Point(pointList[i].longitude,pointList[i].latitude);
        points.push(pt);
        changeXyList.push(pointList[i]);
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
    //地图坐标转换，添加marker
    function completeEventHandler(){
      var lngX ;
      var latY ;
      markers = [];
      var lineArr=[];
      // var devicess = volunteerList.length;
       var volunters = deviceList.length;
      $('#result .devicess').text(volunters);
      // $('#result .volunters').text(devicess);
      var posIndex = 0;
      var pointsArray = new Array();
      var maxCnt = 10;
      if(volunters>0){
        for(var a = 0,marker,poiny;a<volunters;a++){
          lngX = deviceList[a].longitude;
          latY = deviceList[a].latitude;
          changeXyList.push(deviceList[a]);
          var myIcon = new BMap.Icon("markers.png");
          var point = new BMap.Point(lngX, latY);
          var marker = new BMap.Marker(point,{icon:myIcon});
          addMarker(point,changeXyList[a].isCall,changeXyList[a].deviceIMEI,changeXyList[a].NAME,changeXyList[a].famillyPhones);
        }
      }
      //设备的GPS转百度坐标代码
      // if(volunters>0){
      //   var gpsPouints = getPoints(deviceList);
      //   pointsArray = fengzhuang(gpsPouints);
      //   console.log(pointsArray);
      //   var convertor = new BMap.Convertor();
      //   var points=[];
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
      //       console.log(changeXyList);
      //       for(var d = 0,marker;d<lineArr.length;d++){
      //         if(lineArr.length == 0){
      //           return;
      //         }
      //         var myIcon = new BMap.Icon("markers.png");
      //         var marker = new BMap.Marker(lineArr[d],{icon:myIcon});
      //         addMarker(lineArr[d],changeXyList[d].status,changeXyList[d].deviceIMEI,changeXyList[d].NAME);
      //         points.push(lineArr[d])
      //       }
      //
      //     }
      //   }
      //   convertor.translate(pointsArray[posIndex], 1, 5, translateCallback);
      // }
      console.log(deviceList);
      // if(devicess>0) {
      //   for (var i = 0, marker, poiny; i < devicess; i++) {
      //     lngX = volunteerList[i].longitude;
      //     latY = volunteerList[i].latitude;
      //     var myIcon = new BMap.Icon("markers.png");
      //     var point = new BMap.Point(volunteerList[i].longitude, volunteerList[i].latitude);
      //     var marker = new BMap.Marker(point, {title: '志愿者'});
      //     var content = '<div class="personIcon">' +
      //       '<img src="web/file/downloadFile/' + volunteerList[i]['image_url'] + '" id="imgDemo" alt="暂无头像" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
      //       '<p style="margin: 15px 0 15px 0">志愿者:' + volunteerList[i].name + '</p>' +
      //       '<div  class="rescuesta">定位时间：' + getLocalTime(volunteerList[i].locationTime) + '</div>'
      //     '</div>';
      //      map.addOverlay(marker);
      //      addClickHandler(content, marker);
      //   }
      // }
      // console.log(changgeUrl);
      // $.ajax({
      //   type: "get",
      //   url: changgeUrl+"&from=1&to=5&ak=nsOyvRLrIMthoLm9M4OUK0nv8aNObxTv",
      //   dataType: 'jsonp',
      //   success: function(data){
      //     if(data.status === 0) {
      //         console.log(data.result)
      //       for(var a = 0,marker;a<data.result.length;a++){
              // if(data.result.length == 0){
              //   return;
              // }
              // var myIcon = new BMap.Icon("markers.png");
              // var point = new BMap.Point(data.result[a].x, data.result[a].y);
              // var marker = new BMap.Marker(point,{title:'志愿者'});
              // var content = '<div class="personIcon">' +
              //   '<img src="'+volunteerList[a]['image_url']+'" id="imgDemo" alt="暂无头像" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
              //   '<p style="margin: 15px 0 15px 0">志愿者:' +volunteerList[a].NAME+'</p>'+
              //   '<div  class="rescuesta">定位时间：'+volunteerList[a].locationTime+'</div>'
              // '</div>';
              // var content = '<div style="margin:0;line-height:20px;padding:2px;height: auto;">志愿者:' +volunteerList[a].NAME+
              //   '<br/>定位时间：'+volunteerList[a].locationTime;
              // var iw = createInfoWindow(a);
              // map.addOverlay(marker);
              // addClickHandler(content,marker);
              // (function () {
              //   var index = a;
              //   var _iw = createInfoWindow(a);
              //   var _marker = marker;
              //   _marker.addEventListener("click", function () {
              //     this.openInfoWindow(_iw);
              //
              //   });
              // })()
            // }
          // }
        // }
      // });


      // for(var b = 0,marker;b<volunters;b++){
      //   if(deviceList[b].longitude){
      //     lngX = deviceList[b].longitude;
      //   }else{
      //     lngX= 100.883;
      //   }
      //   if(deviceList[b].latitude){
      //     latY = deviceList[b].latitude;
      //   }else{
      //     latY=1.852;
      //   }
      //   if(b<(volunters-1)){
      //     changgeUrl2+= lngX+","+latY+";"
      //   }
      //   if (b==(volunters-1)){
      //     changgeUrl2+= lngX+","+latY
      //   }
      //   changeXyList.push(deviceList[b]);
      // }

      // $.ajax({
      //   type: "get",
      //   url: changgeUrl2+"&from=1&to=5&ak=nsOyvRLrIMthoLm9M4OUK0nv8aNObxTv",
      //   dataType: 'jsonp',
      //   success: function(data){
      //     if(data.status === 0) {
      //       // console.log(data.result)
      //       var points=[];
      //       for(var c = 0,marker;c<data.result.length;c++){
      //         if(data.result.length == 0){
      //           return;
      //         }
      //         var myIcon = new BMap.Icon("markers.png");
      //         var point = new BMap.Point(data.result[c].x, data.result[c].y);
      //         addMarker(point,changeXyList[c].status,changeXyList[c].deviceIMEI,changeXyList[c].NAME);
      //         points.push(point)
      //          // if(changeXyList[c].isCreat){
      //          //   addMarker(point,statuses[c],changeXyList[c].isCreat,changeXyList[c].deviceIMEI,changeXyList[c].NAME,changeXyList[c].alarmId);
      //          // }else {
      //          //   addMarker(point,statuses[c],changeXyList[c].isCreat,changeXyList[c].deviceIMEI,changeXyList[c].NAME,changeXyList[c].alarmId);
      //          // }
      //       }
      //       //调整视野
      //       // var view = map.getViewport(points);
      //       // var mapZoom = view.zoom;
      //       // var centerPoint = view.center;
      //       // map.centerAndZoom(centerPoint,mapZoom);
      //     }
      //   }
      // });
    }
    function startRun(){
      // if(volunteerList.length>1){
      //   var x=volunteerList[0].locationLongitude;
      //   var y=volunteerList[0].locationLatitude;
      // }
      completeEventHandler();
    }
    function addClickHandler(content,marker){
      marker.addEventListener("click",function(e){
        if(xuanhuanobj){
          window.clearInterval(interval);
          xuanhuanobj=false;
          setTimeout(() => {
            interval = setInterval(xunhuan,20000);
            xuanhuanobj=true;
          },10000);
        }
        openInfo(content,e)}
      );
    }
    function openInfo(content,e){
      var p = e.target;
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var infoWindow = new BMap.InfoWindow(content);  // 创建信息窗口对象
      map.openInfoWindow(infoWindow,point); //开启信息窗口
    }



    // 编写自定义函数,创建标注
    function addMarker(point,status,deviceIMEI,name,famillyPhones){
      var infoWindow;
      var marker;
      // console.log(point);
      // console.log(status);
      if(status==1){
        // $('.panel').show();
        // var imgUrl;
        // $.each(deviceList,function (i,obj) {
        //   if(obj.deviceIMEI == deviceIMEI){
        //     imgUrl = obj['image_url'];
        //   }
        // })
        // var content = '<div class="personIcon">' +
        //   '<img src="web/file/downloadFile/'+imgUrl+'" id="imgDemo" alt="暂无头像" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
        //   '<p style="margin: 15px 0 15px 0">需要救援人:' +name+'</p>'+
        //    '<div  class="rescuesta">状态：<span>救援中</span></div>'+
        //   '</div>';
        // //创建检索信息窗口对象
        // var searchInfoWindow = null;
        // infoWindow = new BMap.InfoWindow(content);
        // marker = new BMap.Marker(point,{icon:myIcon3,title:deviceIMEI});
        // map.addOverlay(marker,{title:deviceIMEI});
        // markers.push(marker);
      // }else if(status==1){
        $('.panel').show();
        // 在添加marker时附加一个id属性
        // 获取marker时
        // var markers = map.getOverlays();
        // for (var i = 0; i < markers.length; i++) {
        //   if (markers[i].toString() == "[object Marker]") {
        //     if (markers[i].id == 你附加的id属性值) {
        //       处理自己的业务
        //     }
        //   }
        // }
        // var imgUrl;
        // $.each(deviceList,function (i,obj) {
        //   if(obj.deviceIMEI == deviceIMEI){
        //     imgUrl = obj['image_url'];
        //   }
        // })
        var content = '<div class="personIcon">' +
          // '<img src="" id="imgDemo" alt="暂无头像" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
          '<p style="margin: 10px 0 10px 0">需要救援人:' +name+'</p>'+
          '<p style="margin: 10px 0 10px 0">亲情号:';
        $.each(famillyPhones,(i,val)=>{
          if(i==(famillyPhones.length-1)){
            content+=val+'</p>'
          }else{
            content+=val+'，'
          }
        })
        content+= '<button class="btn btn-red" id="startRescue">确定</button>' +
        '</div>';

          //  '<input  type="text" id="phoneBox" placeholder="请输入接单人员手机号">'
          // +'<button class="btn btn-red" id="startRescue">接单</button>' +
          // '</div>';
        //创建检索信息窗口对象
        var searchInfoWindow = null;
        infoWindow = new BMap.InfoWindow(content);
        infoWindow.addEventListener("open", function(e){
        $('#startRescue').on("click", function(){
          // if(!$('#phoneBox').val().trim()){
          //   layer.open({
          //       title: '提示'
          //       ,content: '必须指定一个接单人员！'
          //     });
          //   return
          // }

          var goUrl = 'web/update/alarmStatus?alarmId='+$('.panel .'+deviceIMEI+' .warningTask').parent().attr('id');
            $.ajax({
              type: "get",
              url: goUrl,
              cache: false,
              async: false,
              success: function(data){
                if(data.status==1){
                  layer.open({
                    title: '提示'
                    ,content: '处理成功！'
                  });
                  infoWindow.close();
                }else{
                  layer.open({
                    title: '提示'
                    ,content: data.error
                  });
                }
              }
            });

        })
        })
        marker = new BMap.Marker(point,{icon:myIcon,title:deviceIMEI});
        map.addOverlay(marker,{title:deviceIMEI});
        markers.push(marker);
      }
      else {
        // var imgUrl;
        marker = new BMap.Marker(point,{icon:myIcon2,title:deviceIMEI});
        map.addOverlay(marker,{title:deviceIMEI});
        markers.push(marker);
        // $.each(deviceList,function (i,obj) {
        //   if(obj.deviceIMEI == deviceIMEI){
        //     imgUrl = obj['image_url'];
        //   }
        // })
        var content = '<div class="personIcon">' +
          // '<img src="" id="imgDemo" alt="暂无头像" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
          '<p style="margin: 15px 0 15px 0">设备使用者:' +name+'</p>'+
          // '<div  class="rescuesta">救援状态：<span></span></div>'+
          '</div>';
        //创建检索信息窗口对象
        var searchInfoWindow = null;
        infoWindow = new BMap.InfoWindow(content);
      }
      marker.addEventListener("click", function(e){
        this.openInfoWindow(infoWindow);
        console.log(xuanhuanobj)
        if(xuanhuanobj){
          window.clearInterval(interval);
          xuanhuanobj=false;
          setTimeout(() => {
            interval = setInterval(xunhuan,20000);
            xuanhuanobj=true;
          },10000);
        }
        //图片加载完毕重绘infowindow
        // document.getElementById('imgDemo').onload = function (){
        //   infoWindow.redraw();
        // }
        // searchInfoWindow.open(marker);
      })
      //列表绑定
      $('.'+deviceIMEI).on('click',function () {
        $(this).parent().addClass('active').siblings().removeClass('active');
        // var markers = map.getOverlays();
        // for (var i = 0; i < markers.length; i++) {
        //   if (markers[i].toString() == "[object Marker]") {
        //     if (markers[i].getTitle() == deviceIMEI) {
        //       alert(deviceIMEI)
        //     }
        //   }
        // }
        console.log(markers)
        for (var i = 0; i < markers.length; i++) {
          console.log(markers[i].getTitle())
          if (markers[i].getTitle() == deviceIMEI) {
            markers[i].openInfoWindow(infoWindow);
          }
        }
      })
    }


    // 全屏
    $('.video_link').on('click',()=>{
        alert(2)
        this.router.navigate(['video']);
      }
    )


    $('.quanping').on('click',function () {
      $(this).hide()
      $('.back').show();
      var showMap = document.getElementById("container");
      $('#page-wrapper').removeClass('marg220').addClass('fullscreen');

      showMap.style.width = screen.width + "px";
      showMap.style.height = screen.height + "px";
      requestFullScreen(document.documentElement);
    })
    $('.back').on('click',function () {
      $(this).hide()
      $('.quanping').show();
      var showMap = document.getElementById("container");
      $('#page-wrapper').addClass('marg220').removeClass('fullscreen');
      showMap.style.width = X;
      showMap.style.height = Y;
      exitFull(document);
    })
    //区域标出
    function getBoundary(ak){
      var bdary = new BMap.Boundary();
      bdary.get(ak, function(rs){       //获取行政区域
        // map.clearOverlays();        //清除地图覆盖物
        var count = rs.boundaries.length; //行政区域的点有多少个 ACABF4  E4F6F8
        if (count === 0) {
          alert('未能获取当前输入行政区域');
          return ;
        }
        var pointArray = [];
        for (var i = 0; i < count; i++) {
          var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000",fillColor:"#F7AD9E",fillOpacity:"0.05"}); //建立多边形覆盖物
          map.addOverlay(ply);  //添加覆盖物
          ply.disableMassClear();
          pointArray = pointArray.concat(ply.getPath());
        }
        map.setViewport(pointArray);    //调整视野
      });
    }


    //全屏
    function requestFullScreen(element) {
      // 判断各种浏览器，找到正确的方法
      var requestMethod = element.requestFullScreen || //W3C
        element.webkitRequestFullScreen ||  //Chrome等
        element.mozRequestFullScreen || //FireFox
        element.msRequestFullScreen; //IE11
      if (requestMethod) {
        requestMethod.call(element);
      }
      else if (element.msRequestFullscreen) {

        element.msRequestFullscreen();

      }

      // else if (typeof $(window).ActiveXObject !== "undefined") {//for Internet Explorer
      //   var wscript = $(window).   ("WScript.Shell");
      //   if (wscript !== null) {
      //     wscript.SendKeys("{F11}");
      //   }
      // }
    }
    //退出全屏
    function exitFull(element) {
      //判断各种浏览器，找到正确的方法
      var exitMethod = element.exitFullscreen || //W3C
         element.mozCancelFullScreen ||  //Chrome等
        element.webkitExitFullscreen || //FireFox
        element.msExitFullscreen; //IE11
      if (exitMethod) {
        exitMethod.call(element);
      }
    }

    //重新登录
    function loginFull(element) {
      //判断各种浏览器，找到正确的方法
      if (element) {
        element.href="http://47.95.218.144:9000";
      }
    }


  }


}


