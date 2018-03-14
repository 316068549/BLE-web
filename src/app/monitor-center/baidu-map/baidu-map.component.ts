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
  selector: 'app-baidu-map',
  templateUrl: './baidu-map.component.html',
  styleUrls: ['./baidu-map.component.css']
})
export class BaiduMapComponent implements OnInit {
  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    var loading;
    var tokenId = localStorage.getItem("urtokenId");
    var userId = localStorage.getItem("userId");
    localStorage.setItem('code','0')
    var mapaddress;
    var defaultIconStyle = 'red', //默认的图标样式
      hoverIconStyle = 'green', //鼠标hover时的样式
      selectedIconStyle = 'purple'; //选中时的图标样式
    var volunteerList;
    var deviceList;
    var provinceList;
    var changeXyList=[];
    var taskList;

    var warningDeviceList=[];
    var  markers,infoWindows = [];
    var map = new BMap.Map("container");            // 创建Map实例
    //获取下拉数据
    var X = $('#container').width();
    var Y = $('#container').height();
    var point = new BMap.Point(108.924295,34.235939); // 创建点坐标
    var myIcon = new BMap.Icon("assets/img/baojing.gif", new BMap.Size(30,30));
    var myIcon2 = new BMap.Icon("assets/img/mark_b.png", new BMap.Size(30,30));
    var myIcon3 = new BMap.Icon("assets/img/rescue.png", new BMap.Size(45,45));
    map.enableScrollWheelZoom();  //启用滚轮放大缩小
    map.enableInertialDragging();
    // map.centerAndZoom(point,6);
    map.addControl(new BMap.NavigationControl());
    map.enableContinuousZoom();
    var geoc = new BMap.Geocoder();

    // 显示省份polygon
    var provinces = [{"province":"北京市","provinceid":"110000"},{"province":"天津市","provinceid":"120000"},
      {"province":"河北省","provinceid":"130000"},{"province":"山西省","provinceid":"140000"},{"province":"内蒙古自治区","provinceid":"150000"},
      {"province":"辽宁省","provinceid":"210000"},{"province":"吉林省","provinceid":"220000"},{"province":"黑龙江省","provinceid":"230000"},
      {"province":"上海市","provinceid":"310000"},{"province":"江苏省","provinceid":"320000"},{"province":"浙江省","provinceid":"330000"},
      {"province":"安徽省","provinceid":"340000"},{"province":"福建省","provinceid":"350000"},{"province":"江西省","provinceid":"360000"},
      {"province":"山东省","provinceid":"370000"},{"province":"河南省","provinceid":"410000"},{"province":"湖北省","provinceid":"420000"},
      {"province":"湖南省","provinceid":"430000"},{"province":"广东省","provinceid":"440000"},{"province":"广西壮族自治区","provinceid":"450000"},
      {"province":"海南省","provinceid":"460000"},{"province":"重庆市","provinceid":"500000"},{"province":"四川省","provinceid":"510000"},
      {"province":"贵州省","provinceid":"520000"},{"province":"云南省","provinceid":"530000"},{"province":"西藏自治区","provinceid":"540000"},
      {"province":"陕西省","provinceid":"610000"},{"province":"甘肃省","provinceid":"620000"},{"province":"青海省","provinceid":"630000"},
      {"province":"宁夏回族自治区","provinceid":"640000"},{"province":"新疆维吾尔自治区","provinceid":"650000"},{"province":"台湾","provinceid":"910000"},
      {"province":"香港","provinceid":"810000"},{"province":"澳门","provinceid":"820000"}];
    var provinceList = count();
    //option数据
    var html='<option  value="0" >中国</option>';
    $.each(provinces,function (j,m) {
      html+='<option  value='+m.provinceid+'>'+m.province+'</option>'
    })
    $('#goSection').append(html);
    getBoundary2();

    //地图鼠标悬浮省份统计数据
    function count(){
      var countUrl ='web/query/rescueCount?pageIndex=1&pageSize=40&tokenId='+tokenId;
      var countResult;
      $.ajax({
        type: "get",
        url: countUrl,
        async: false,
        success: function (res) {
          $('#result2 .devicess2').text(res.data.list[0].alarmNumber);
          $('#result2 .volunters2').text(res.data.list[0].rescueNumber);
          res.data.list.splice(0,1);
          $.each(res.data.list,function (i,n) {
            $.each(provinces,function (j,m) {
                if(n.rescueCityCode==m.provinceid){
                  n.rescueCity = m.province;
                }
            })
          })
          countResult = res.data.list;
        }
      });
      console.log(countResult)
      return countResult;
    }

    //鼠标点击转区域码
    // map.addEventListener('dbclick',changeCode);
    // function changeCode(e){
    //   var pt = e.point;
    //   change(pt);
    // }
    // function change(point){
    //   var ak = 'nsOyvRLrIMthoLm9M4OUK0nv8aNObxTv';
    //   var url = 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&ak='+ak +
    //     '&location='+point.lat+','+point.lng+'&output=json';
    //   $.ajax({
    //     type: "get",
    //     url: url,
    //     dataType: 'jsonp',
    //     success: function (res) {
    //       if (res.status === 0) {
    //         console.log(res);
    //         // completeEventHandler();
    //         console.log(res.result.addressComponent.adcode);
    //         console.log(res.result.addressComponent.province);
    //         getBoundary(res.result.addressComponent.province);
    //         map.clearOverlays();
    //         map.setMinZoom(8);
    //          init();
    //          startRun();
    //          var awp = setTimeout(xunhuan,5000);
    //       } else {
    //         console.log(res);
    //       }
    //     },
    //     error: function () {
    //        alert('转区域码错误')
    //     }
    //   });
    // }

    // drawMap()
    // init(610000);
    // startRun();
    function xunHuan(code){
      return function(){
        xunhuan(code);
        localStorage.setItem('code',code);
      }
    }
    // var awp = setTimeout(xunhuan,5000);
    var interval;
    var xuanhuanobj;
    //打开气泡延迟20秒刷新

    function xunhuan(code){
      map.clearOverlays();
      changePlace(code);
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
      //     mapaddress=data1.data.rescueTeam.addr;
      //     console.log(data1.data.rescueTeam.name)
      //     if(data1.data.rescueTeam.rescueTeamId==0){
      //       map.setMinZoom(8);
      //     }else if(data1.data.rescueTeam.name.indexOf('大队')>-1){
      //       map.setMinZoom(9);
      //     }
      //     else {
      //       map.setMinZoom(11);
      //     }
      //   }
      // });
      getBoundary(mapaddress);
    }
    // 地图初始化位置
    function init(code){
      $('#result2').hide();
      $('#result').show();
      $('#goChina').show();
      xuanhuanobj = true;
      var resul;
      volunteerList= null;
      deviceList = null;
      taskList = null;
      var url = 'indatas?cityCode='+code+'&tokenId='+tokenId;
      $.ajax({
        type: "get",
        cache: false,
        async: false, //同步请求外面才能获取到*
        url: url,
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
      if(resul.guardianList){
        volunteerList=resul.guardianList;
      }
      if(resul.deviceList){
        deviceList=resul.deviceList;
      }
      interval = setInterval(xunHuan(code),20000);
      $('.panel').show();
      if(resul.taskList){
        taskList=resul.taskList;
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
      if(taskList){
        if(taskList.length>0){
          $.each(taskList,function (i,n) {
            $.each(deviceList,function (a,obj) {
              if(obj.deviceIMEI==n.deviceIMEI){
                if(!obj.active){
                  obj.status = n.status;
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
          $.each(taskList,function (i,n) {
            $('.panel').show();
            var html = "<li><a href='javascript:;' id="+n.task_id+" class=" + n.deviceIMEI + ">";
            // var html2 = "<span style='margin-left: 15px'>任务状态（等待接单，报警地址："+item.address+")</span>"
            // var html2 = "<span style='margin-left: 15px'>任务状态（救援中，接单人："+obj.NAME+"，电话："+obj.mobile+")</span>"
            // var html3 = "<span style='margin-left: 15px'>任务状态（已结束，接单人："+obj.NAME+"，电话："+obj.mobile+")</span>"
            if(n.status==1){
              // warningList.push(n.deviceIMEI);
              // warningTaskList.push(n.task_id);
              warningDeviceList.push({
                deviceImei:n.deviceIMEI,
                taskId:n.task_id
              })
              $.each(deviceList,function (a,obj) {
                if(obj.deviceIMEI==n.deviceIMEI){
                  html+=obj.NAME+"<span class='warningTask'>（等待接单，报警地址："+n.address+")</span></a></li>"
                }
              })
            }else if(n.status==2){
              $.each(deviceList,function (a,obj) {
                if(obj.deviceIMEI==n.deviceIMEI){
                  html+=obj.NAME;
                }
              })
              html+="<span>（救援中，接单人：";
              $.each(volunteerList,function (c,vol) {
                if(vol['userId']==n['userId']){
                  html+=vol.name+"，电话："+vol.mobile+")</span></a></li>"
                }
              })
            }else {
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
    function changePlace(code){
      changeXyList=[];
      var result;
      var url = 'indatas?cityCode='+code+'&tokenId='+tokenId;
      $.ajax({
        type: "get",
        cache: false,
        async: false, //同步请求外面才能获取到*
        url: url,
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
      if(result.guardianList){
        volunteerList=result.guardianList;
      }
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
      if(result.taskList){
        taskList=result.taskList;
      }
      // volunteerList=result.data.volunteerList;
      // deviceList=result.data.deviceList;
      // taskList=result.data.taskList;
      if(taskList) {
        if (taskList.length > 0) {
          $.each(taskList, function (i, n) {
            $.each(deviceList, function (a, obj) {
              if (obj.deviceIMEI == n.deviceIMEI) {
                if(!obj.active){
                  obj.status = n.status;
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
          $.each(taskList, function (s, sss) {
            var html = "<span>（";
            var html2 = "<li><a href='javascript:;' id="+sss.task_id+" class="+ sss.deviceIMEI + ">";
            var warningList=[];
            if (sss.status == 1) {

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
                    taskId:sss.task_id
                  })
                  console.log('结束：报警列表'+warningDeviceList.length)
                  console.log(warningList)
                  $.each(deviceList, function (aa, oobj) {
                    if (oobj.deviceIMEI == sss.deviceIMEI) {
                      html2 += oobj.NAME+"<span class='warningTask'>（等待接单，报警地址：" + sss.address + ")</span></a></li>"
                    }
                  })
                  console.log('生成'+$('.panel ul #'+sss.task_id).length)
                  if($('.panel ul #'+sss.task_id).length==0){
                    $('.panel ul').prepend(html2)
                  }
                }
                if(warningList.indexOf(sss.deviceIMEI)>-1){
                  var nowDate = new Date().getTime();
                  // console.log(nowDate-sss.createTime)
                  if(nowDate-sss.createTime>300000){
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
                                  var secCode = localStorage.getItem('code');
                                  interval = setInterval(xunHuan(secCode),20000);
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
            } else if (sss.status == 2) {
              if(warningDeviceList.length>=0) {
                warningList = [];
                if (warningDeviceList.length > 0) {
                  $.each(warningDeviceList, function (b, devicr) {
                    warningList.push(devicr.deviceImei);
                  })
                }
                if(warningList.indexOf(sss.deviceIMEI)>-1){
                  $.each(warningDeviceList, function (i, n) {
                    if(n.taskId == sss.task_id){
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

              $.each(deviceList, function (aa, oobj) {
                if (oobj.deviceIMEI == sss.deviceIMEI) {
                  html += "救援中，接单人："
                }
              })
              $.each(volunteerList, function (c, vol) {
                if (vol['userId'] == sss['userId']) {
                  html += vol.name + "，电话：" + vol.mobile + "）</span>"
                }
              })
              $('#' + sss['task_id'] + ' span').remove();
              $('#' + sss['task_id']).append(html);
            } else {
              if(warningDeviceList.length>=0) {
                warningList = [];
                if (warningDeviceList.length > 0) {
                  $.each(warningDeviceList, function (b, devicr) {
                    warningList.push(devicr.deviceImei);
                  })
                  if(warningList.indexOf(sss.deviceIMEI)>-1){
                    $.each(warningDeviceList, function (i, n) {
                      if(n.taskId == sss.task_id){
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
              $('#' + sss['task_id'] + ' span').remove();
              $('#' + sss['task_id']).append(html);
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
      var devicess = volunteerList.length;
      var volunters = deviceList.length;
      $('#result .devicess').text(volunters);
      $('#result .volunters').text(devicess);
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
          addMarker(point,changeXyList[a].status,changeXyList[a].deviceIMEI,changeXyList[a].NAME);
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
      for(var i = 0,marker,poiny;i<devicess;i++){
        lngX = volunteerList[i].longitude;
        latY = volunteerList[i].latitude;
        var myIcon = new BMap.Icon("markers.png");
        var point = new BMap.Point(volunteerList[i].longitude, volunteerList[i].latitude);
        var marker = new BMap.Marker(point,{title:'志愿者'});
        var content = '<div class="personIcon">' +
          '<img src="web/file/downloadFile/'+volunteerList[i]['image_url']+'" id="imgDemo" alt="暂无头像" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
          '<p style="margin: 15px 0 15px 0">志愿者:' +volunteerList[i].name+'</p>'+
          '<div  class="rescuesta">定位时间：'+getLocalTime(volunteerList[i].locationTime)+'</div>'
        '</div>';
        map.addOverlay(marker);
        addClickHandler(content,marker);
      }
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
      if(!volunteerList){
        return
      }
      if(!deviceList){
        return
      }
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
            var secCode = localStorage.getItem('code');
            interval = setInterval(xunHuan(secCode),20000);
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
    function addMarker(point,status,deviceIMEI,name){
      var infoWindow;
      var marker;
      // console.log(point);
      // console.log(status);
      if(status==2){
        // if(jiedan){
        $('.panel').show();
        var imgUrl;
        $.each(deviceList,function (i,obj) {
          if(obj.deviceIMEI == deviceIMEI){
            imgUrl = obj['image_url'];
          }
        })
        var content = '<div class="personIcon">' +
          '<img src="web/file/downloadFile/'+imgUrl+'" id="imgDemo" alt="暂无头像" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
          '<p style="margin: 15px 0 15px 0">需要救援人:' +name+'</p>'+
          '<div  class="rescuesta">状态：<span>救援中</span></div>'+
          '</div>';
        //创建检索信息窗口对象
        var searchInfoWindow = null;
        infoWindow = new BMap.InfoWindow(content);
        marker = new BMap.Marker(point,{icon:myIcon3,title:deviceIMEI});
        map.addOverlay(marker,{title:deviceIMEI});
        markers.push(marker);
        // 查询接单壮态,如果接单传志愿者电话给后台  志愿者status 1 创建任务无人接单 2 救援中 3 结束
        // $.each(taskList,function (index,obj) {
        //     if(obj.status==2){
        //       var html2 = "<span style='margin-left: 15px'>任务状态（救援中，接单人："+obj.NAME+"，电话："+obj.mobile+")</span>"
        //       $('#'+obj['task_id']+' span').remove();
        //       $('#'+obj['task_id']).append(html2);
        //       var content2 = '<div class="personIcon">' +
        //         // '<img src="assets/img/profile_small.jpg" id="imgDemo" alt="" style="float:right;zoom:1;overflow:hidden;' +
        //         // 'width:100px;height:100px;margin-left:3px;"/>' +
        //         '需要救援人:' +name+
        //         '<br/><div class="rescuesta">救援状态：救援中<span></span></div>'
        //         // '地址：'+deviceIMEI
        //         +
        //         '</div>';
        //       var infoWindow = new BMap.InfoWindow(content2);
        //     }else if(obj.status==3){
        //       var html3 = "<span style='margin-left: 15px'>任务状态（已结束，接单人："+obj.NAME+"，电话："+obj.mobile+")</span>"
        //       $('#'+obj['task_id']+' span').remove();
        //       $('#'+obj['task_id']).append(html3);
        //       var content3 = '<div class="personIcon">' +
        //         // '<img src="assets/img/profile_small.jpg" id="imgDemo" alt="" style="float:right;zoom:1;overflow:hidden;width:100px;' +
        //         // 'height:100px;margin-left:3px;"/>' +
        //         '需要救援人:' +name+
        //         '<br/><div class="rescuesta">救援状态：已结束<span></span></div>'
        //         // '地址：'+deviceIMEI
        //         +
        //         '</div>';
        //       var infoWindow = new BMap.InfoWindow(content3);
        //     }
        //
        // })
      }else if(status==1){
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
        var imgUrl;
        $.each(deviceList,function (i,obj) {
          if(obj.deviceIMEI == deviceIMEI){
            imgUrl = obj['image_url'];
          }
        })
        var content = '<div class="personIcon">' +
          '<img src="web/file/downloadFile/'+imgUrl+'" id="imgDemo" alt="暂无头像" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
          '<p style="margin: 10px 0 10px 0">需要救援人:' +name+'</p>'+
          // '<div style="display: none" class="rescuesta">救援状态：<span></span></div>'
          // '地址：'+deviceIMEI
          '<input  type="text" id="phoneBox" placeholder="请输入接单人员手机号">'
          +'<button class="btn btn-red" id="startRescue">接单</button>' +
          // '<button class="btn btn-red ml10" id="cancelRescue">取消救援</button>'+
          '</div>';
        //创建检索信息窗口对象
        var searchInfoWindow = null;
        infoWindow = new BMap.InfoWindow(content);
        infoWindow.addEventListener("open", function(e){
          $('#startRescue').on("click", function(){
            if(!$('#phoneBox').val().trim()){
              layer.open({
                title: '提示'
                ,content: '必须指定一个接单人员！'
              });
              return
            }
            var goUrl = 'web/task/receive?mobile='+$('#phoneBox').val()+'&itemId='+$('.panel .'+deviceIMEI+' .warningTask').parent().attr('id');
            $.ajax({
              type: "get",
              url: goUrl,
              cache: false,
              async: false,
              success: function(data){
                if(data.status==1){
                  layer.open({
                    title: '提示'
                    ,content: '接单成功'
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
        var imgUrl;
        marker = new BMap.Marker(point,{icon:myIcon2,title:deviceIMEI});
        map.addOverlay(marker,{title:deviceIMEI});
        markers.push(marker);
        $.each(deviceList,function (i,obj) {
          if(obj.deviceIMEI == deviceIMEI){
            imgUrl = obj['image_url'];
          }
        })
        var content = '<div class="personIcon">' +
          '<img src="web/file/downloadFile/'+imgUrl+'" id="imgDemo" alt="暂无头像" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>' +
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
            var secCode = localStorage.getItem('code');
            interval = setInterval(xunHuan(secCode),20000);
            xuanhuanobj=true;
          },10000);
        }
        //图片加载完毕重绘infowindow
        document.getElementById('imgDemo').onload = function (){
          infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
        }
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
    //返回中国
      $('#goChina').on('click',function () {
        loading = layer.msg('加载中...');
        $('#goSection').val('0');
        $(this).hide();
        $('#result').hide();
        $('.panel').hide();
        $('#result2').show();
        var ak = map.getOverlays();
        for (var i = 0; i < ak.length; i++) {
          map.removeOverlay(ak[i])
          //ak[i].hide();
        }
        map.setMinZoom(5);
        window.clearInterval(interval);
        xuanhuanobj=true;
        getBoundary2();
        localStorage.setItem('code','0');
      })
    //选择城市
    $('#goSection').on('change',function () {
      $('#goChina').hide();
      var $num = $(this).val();
      var code = localStorage.getItem('code');
      // if($num==code){
      //  return;
      if($num==0 && $('#result2').is(':visible')){
        return;
      }else if($num==0){
        loading = layer.msg('加载中...');
        $('#result').hide();
        $('#result2').show();
        $('.panel').hide();
        var ak = map.getOverlays();
        for (var i = 0; i < ak.length; i++) {
          map.removeOverlay(ak[i])
        }
        map.setMinZoom(5);
        window.clearInterval(interval);
        xuanhuanobj=true;
        getBoundary2();
      }else {
        loading = layer.msg('加载中...');
        $('#result2').hide();
        $('#result').show();
        $('#result .devicess').text(0);
        $('#result .volunters').text(0);
        window.clearInterval(interval);
        xuanhuanobj=true;
        var ak = map.getOverlays();
        for (var i = 0; i < ak.length; i++) {
          map.removeOverlay(ak[i])
        }
        var resData;
        var slecTxt = $(this).find("option:selected").text();
        getBoundary(slecTxt);
        map.setMinZoom(8);
        $.each(provinceList,function (i,n) {
          if(n.rescueCity==slecTxt){
            resData = n;
          }
        })
        console.log(resData);
        $('.panel ul').empty();
        if(resData){
          $('.panel').show();
          init($num);
          startRun();
        }else{
          // $('#result .devicess').text(0);
          // $('#result .volunters').text(0);
          $('.panel').hide();
        }
      }

    })
    // 全屏
    $('.video_link').on('click',()=>{
        this.router.navigate(['video']);
      }
    )


    $('.full-scr').on('click',function () {
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
      $('.full-scr').show();
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
          layer.close(loading);
          ply.disableMassClear();
          pointArray = pointArray.concat(ply.getPath());
        }
         map.setViewport(pointArray);    //调整视野
        map.setMinZoom(8);
        // map.removeEventListener('click',changeCode)
      });
    }
    //区域标出2
    function getBoundary2(){
      var bdary = new BMap.Boundary();
      bdary.get('中国', function(rs){       //获取行政区域
        map.clearOverlays();
        var count = rs.boundaries.length; //行政区域的点有多少个 ACABF4  E4F6F8
        var pointArray = [];
        for (var i = 0; i < count; i++) {
          var ply2 = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#A4D0E8",fillColor:"#F7AD9E",fillOpacity:"0.1"}); //建立多边形覆盖物
          map.addOverlay(ply2);  //添加覆盖物
          layer.close(loading);
          ply2.addEventListener("click", function(e){
            var pt = e.point;

            geoc.getLocation(pt, function(rs){
              var addComp = rs.addressComponents;
              var rescueData;
              console.log(addComp.province)
              console.log(provinceList)
              $.each(provinceList,function (i,n) {
                if(n.rescueCity==addComp.province){
                  rescueData = n;
                }
              })
              console.log(rescueData)
              if(rescueData){
                var content = '<div class="personIcon">' +
                  '<p>报警数量:' +rescueData.alarmNumber+'&nbsp;&nbsp;&nbsp;&nbsp;救助人数:'+rescueData.rescueNumber+'</p>'+
                  '<button class="btn btn-red" id="goProvince">进入省内地图</button></div>';
                var info = new BMap.InfoWindow(content, {width:220});
                info.addEventListener("open", function(e){
                  $('#goProvince').on("click", ()=>{
                    console.log(rescueData);
                    getBoundary(rescueData.rescueCity);
                    map.clearOverlays();
                    $('#goSection').val(rescueData.rescueCityCode);
                    init(rescueData.rescueCityCode);
                    startRun();
                  })
                })
                map.openInfoWindow(info, pt);
              }else{
                var content = '<div class="personIcon" style="width: 200px">' +
                  '<p>暂无统计数据（救援队没有覆盖到该区域，敬请期待）'+'</p>' +
                  // '<p style="margin: 15px 0 15px 0">报警数量:暂无</p>'+
                  // '<p style="margin: 15px 0 15px 0">救助人数:暂无</p>'+
                  '</div>';
                var info = new BMap.InfoWindow(content, {width:220});
                map.openInfoWindow(info, pt);
              }
            });
          });
           pointArray = pointArray.concat(ply2.getPath());
        }
         map.setViewport(pointArray);    //调整视野
      });
      map.addEventListener("zoomstart", function () {
        map.closeInfoWindow();
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


