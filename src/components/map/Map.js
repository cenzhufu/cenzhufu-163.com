import React, { Component } from "react";
import * as maptalks from "maptalks";
import { HeatLayer } from "maptalks.heatmap";
import { ClusterLayer } from "maptalks.markercluster";
import getMapOpts from "../../utils/getMapOpts";
import * as THREE from "three";
import { ThreeLayer } from "maptalks.three";

import { message, Button } from "antd";
import "./map.css";

export default class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      is3D: false,
      eventList: []
    };
    this.map = null;
  }

  componentDidMount() {
    this.mapInit();
  }

  mapInit = () => {
    //谷歌
    // this.map = new maptalks.Map("map", {
    //   center: [114.0504531361, 22.5563328675],
    //   zoom: 12,
    //   minZoom: 6,
    //   maxZoom: 18,
    //   pitch: 45,
    //   spatialReference: maptalks.CRS.GCJ02,
    //   baseLayer: new maptalks.TileLayer("base", {
    //     urlTemplate:
    //       "http://mt{s}.google.cn/vt/lyrs=m@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga",
    //     subdomains: [0, 1, 2]
    //   })
    // });

    //百度
    // this.map = new maptalks.Map("map", {
    //   ...getMapOpts(),
    //   center: [114.0570164407, 22.5621017225],
    //   zoom: 12,
    //   minZoom: 2,
    //   maxZoom: 18,
    //   pitch: 0, //控制视图3D。2D  45 0
    //   //常用控件
    //   zoomControl: true, // add zoom control
    //   scaleControl: true // add scale control
    //   // overviewControl: true // add overview control
    // });

    // 高德地图
    // this.map = new maptalks.Map("map", {
    //   center: [114.0570164407, 22.5621017225],
    //   zoom: 12,
    //   minZoom: 6,
    //   maxZoom: 18,
    //   pitch: 0, //控制视图3D。2D  45 0
    //   spatialReference: maptalks.CRS.GCJ02,
    //   baseLayer: new maptalks.TileLayer("base", {
    //     cssFilter: "sepia(100%) invert(90%)",
    //     // opacity: 0.6, // TileLayer's opacity, 0-1
    //     // cssFilter:
    //     //   "sepia(100%) invert(100%) brightness(220%) contrast(100%) saturate(35%)", // 黑色滤镜
    //     urlTemplate:
    //       "http://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    //     subdomains: ["01", "02", "03", "04"],
    //     attribution: '&copy; <a href="http://www.gaode.com/">Gaode.com</a>'
    //   }),
    //   //常用控件
    //   zoomControl: true, // add zoom control
    //   scaleControl: true // add scale control
    // });

    var c = new maptalks.Coordinate(114.0570164407, 22.5621017225);
    // 百度地图
    this.map = new maptalks.Map("map", {
      // center: [114.0570164407, 22.5621017225],
      center: c,
      zoom: 12,
      minZoom: 6,
      maxZoom: 18,
      pitch: 0, //控制视图3D。2D  45 0
      spatialReference: {
        projection: "baidu"
      },

      //涂岑选择切换
      // layerSwitcherControl: {
      //   position: "top-right",
      //   // title of base layers
      //   baseTitle: "Base Layers",
      //   // title of layers
      //   // overlayTitle: "Layers",
      //   // layers you don't want to manage with layer switcher
      //   excludeLayers: [],
      //   // css class of container element, maptalks-layer-switcher by default
      //   containerClass: "maptalks-layer-switcher"
      // },
      // baseLayer: new maptalks.GroupTileLayer("Base TileLayer", [
      //   new maptalks.TileLayer("极光白", {
      //     visible: false,
      //     urlTemplate:
      //       "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1",
      //     subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      //   }),
      //   new maptalks.TileLayer("暗夜黑", {
      //     // visible: false,
      //     urlTemplate:
      //       "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1",
      //     subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      //   })
      // ])

      baseLayer: new maptalks.TileLayer("base", {
        // cssFilter: "sepia(100%) invert(90%)",
        // opacity: 0.6, // TileLayer's opacity, 0-1
        // cssFilter:
        //   "sepia(100%) invert(100%) brightness(220%) contrast(100%) saturate(35%)", // 黑色滤镜
        urlTemplate:
          "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1",
        subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        attribution: '&copy; <a href="http://www.gaode.com/">Gaode.com</a>'
      }),
      //常用控件
      // zoomControl: true, // add zoom control
      // scaleControl: true // add scale control
      layers: [new maptalks.VectorLayer("v")]
    });

    var zoomControl = new maptalks.control.Zoom({
      position: "top-left",
      slider: true,
      zoomLevel: true
    }).addTo(this.map);

    // new maptalks.VectorLayer(
    //   "v",
    //   new maptalks.Marker(this.map.getCenter())
    // ).addTo(this.map);

    this.addCluster();

    // this.addHeatLayer();

    this.GeoJSONToGeometry();

    this.handleToolbar(zoomControl);

    // this.openMarkerInfoWindow();

    // this.openInfoWindow(); //地图信息弹窗

    this.animate(); //动画

    // this.addToMap(c); //地图上添加

    // this.onListenMap(); //监听地图事件
  };

  /**
   * 点聚合
   */
  addCluster = () => {
    const _this = this;

    let list = [];
    const center = this.map.getCenter();
    for (let i = 0; i < 1000; i++) {
      const num = Number(Math.random());
      // console.log(num > 0.5);
      if (num > 0.5) {
        list.push(center.add(num, num));
      } else if (num < 0.3) {
        list.push([114.0570164407 + (1 - num), 22.5621017225]);
      } else {
        list.push([114.0570164407 - (1 + num), 22.5621017225]);
      }
    }

    window.list = list;

    const markers = list.map(item => {
      return new maptalks.Marker(item, {
        // visible: true,
        // editable: true,
        // cursor: "pointer",
        // shadowBlur: 0,
        // shadowColor: "black",
        // draggable: false,
        // dragShadow: false, // display a shadow during dragging
        // drawOnAxis: null, // force dragging stick on a axis, can be: x, y
        // symbol: {
        //   textFaceName: "sans-serif",
        //   textName: "MapTalks",
        //   textFill: "#34495e",
        //   textHorizontalAlignment: "right",
        //   textSize: 40
        // }
      });
    });

    // const markers = list.map(item => {
    //   return maptalks.GeoJSON.toGeometry(item).addTo(_this.map.getLayer("v"));
    // });

    console.log("markers", markers);
    // new maptalks.VectorLayer(
    //   "v",
    //   new maptalks.Marker(this.map.getCenter())
    // ).addTo(this.map);

    // var data = [marker1, marker2, marker3];
    var clusterLayer = new ClusterLayer("cluster", markers).addTo(_this.map);
  };

  /**
   * 添加热力如
   */
  addHeatLayer = () => {
    let data = window.list || [
      [114.1570164407, 22.6621017225],
      [114.2570164407, 22.6621017225],
      [114.2570164407, 22.5621017225],
      [114.4570164407, 22.6621017225],
      [114.5570164407, 22.6621017225]
    ];

    const heatLayer = new HeatLayer("heat", data).addTo(this.map);
  };

  /**
   *
   * GeoJSON转化为Geometry
   */
  GeoJSONToGeometry = () => {
    const _this = this;
    var json = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: _this.map.getCenter().add(0.1, 0.008)
      },
      properties: {
        name: "point marker"
      }
    };
    var marker = maptalks.GeoJSON.toGeometry(json).addTo(
      _this.map.getLayer("v")
    );
  };

  /**
   * 工具条
   */
  handleToolbar = zoomControl => {
    const map = this.map;
    const _this = this;
    // horizonal one on top left
    new maptalks.control.Toolbar({
      position: "top-left",
      items: [
        {
          item: "menu",
          click: function() {
            info("menu");
          },
          children: [
            {
              item: "导出图片",
              click: function() {
                // info("child 1");
                _this.exportImagFromMap();
              }
            },
            {
              item: "child 2",
              click: function() {
                info("child 2");
              }
            }
          ]
        },
        {
          item: "显示缩放工具",
          click: function() {
            if (zoomControl.getMap()) {
              zoomControl.show();
            } else {
              map.addControl(zoomControl);
            }
            // info("item 2");
          }
        },
        {
          item: "隐藏缩放工具",
          click: function() {
            // info("item 3");
            zoomControl.hide();
          }
        }
      ]
    }).addTo(map);
  };

  //_________________________

  /**
   * 标记物信息弹窗
   */
  openMarkerInfoWindow = () => {
    var layer = new maptalks.VectorLayer("vector").addTo(this.map);
    var marker = new maptalks.Marker([114.0570164407, 22.5621017225]).addTo(
      layer
    );

    marker.setInfoWindow({
      title: "Marker's InfoWindow",
      content: "Click on marker to open."

      // 'autoPan': true,
      // 'width': 300,
      // 'minHeight': 120,
      // 'custom': false,
      //'autoOpenOn' : 'click',  //set to null if not to open when clicking on marker
      //'autoCloseOn' : 'click'
    });

    marker.openInfoWindow();
  };

  /**
   *  地图信息弹窗
   */
  openInfoWindow = () => {
    var options = {
      title: "Map' InfoWindow",
      content: "Click on map to reopen"
      // content: '<div> ' +
      // '<h3>' + this.map.
      // '</div>'

      // 'autoPan': true,
      // 'width': 300,
      // 'minHeight': 120,
      // 'custom': false,
      //'autoOpenOn' : 'click',  //set to null if not to open window when clicking on map
      //'autoCloseOn' : 'click'
    };
    var infoWindow = new maptalks.ui.InfoWindow(options);
    infoWindow.addTo(this.map).show();
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++
  /**
   * 动画
   */
  animate = () => {
    const map = this.map;
    //1 点的沿线动画
    var layer = new maptalks.VectorLayer("vector", {
      forceRenderOnMoving: true
    }).addTo(map);

    var marker = new maptalks.Marker(map.getCenter()).addTo(layer);

    var start = map.getCenter(),
      // offset from line start to line end.
      offset = this.getOffset(marker),
      end = start.add(offset);

    var arrow = new maptalks.LineString([start, end], {
      id: "arrow",
      arrowStyle: "classic",
      arrowPlacement: "vertex-last" //vertex-first, vertex-last, vertex-firstlast, point
    }).addTo(layer);

    this.replay(marker, start, offset);
  };

  /**
   * 点位移动
   * @param {*} marker
   * @param {*} start
   * @param {*} offset
   */
  replay = (marker, start, offset) => {
    marker.setCoordinates(start);
    marker.bringToFront().animate(
      {
        //animation translate distance
        translate: [offset["x"], offset["y"]]
      },
      {
        duration: 2000,
        //let map focus on the marker
        focus: true
      }
    );
  };

  getOffset = marker => {
    const map = this.map;
    var center = map.getCenter();
    var extent = map.getExtent();
    marker.setCoordinates(center);
    return extent
      .getMax()
      .sub(map.getCenter())
      .multi(1 / 2);
  };

  //__________________________________________________________

  /**
   * 添加
   */
  addToMap = c => {
    //1 Marker  标记
    // const point = new maptalks.Marker([114.0570164407, 22.56210172], {
    //   visible: true,
    //   editable: true,
    //   cursor: "pointer",
    //   shadowBlur: 0,
    //   shadowColor: "black",
    //   draggable: false,
    //   dragShadow: false, // display a shadow during dragging
    //   drawOnAxis: null, // force dragging stick on a axis, can be: x, y
    //   symbol: {
    //     textFaceName: "sans-serif",
    //     textName: "MapTalks",
    //     textFill: "#34495e",
    //     textHorizontalAlignment: "right",
    //     textSize: 20
    //   }
    // });
    // new maptalks.VectorLayer("vector", point).addTo(this.map);

    //2 LineString  直线
    // var line = new maptalks.LineString(
    //   [
    //     [114.0570164407, 22.56210172],
    //     [114.0670164407, 22.56210172]
    //   ],
    //   {
    //     arrowStyle: null, // arrow-style : now we only have classic
    //     arrowPlacement: "vertex-last", // arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
    //     visible: true,
    //     editable: true,
    //     cursor: null,
    //     shadowBlur: 0,
    //     shadowColor: "black",
    //     draggable: false,
    //     dragShadow: false, // display a shadow during dragging
    //     drawOnAxis: null, // force dragging stick on a axis, can be: x, y
    //     symbol: {
    //       lineColor: "#1bbc9b",
    //       lineWidth: 3
    //     }
    //   }
    // );
    // new maptalks.VectorLayer("vector", line).addTo(this.map);

    //3 Polygon 多边形
    // var polygon = new maptalks.Polygon(
    //   [
    //     [
    //       [114.0570164407, 22.56210172],
    //       [114.0670164407, 22.56210172],
    //       [114.0670164407, 22.56010172],
    //       [114.0570164407, 22.5600172]
    //       // [114.0570164407, 22.55210172]
    //     ]
    //   ],
    //   {
    //     visible: true,
    //     editable: true,
    //     cursor: "pointer",
    //     shadowBlur: 0,
    //     shadowColor: "black",
    //     draggable: false,
    //     dragShadow: false, // display a shadow during dragging
    //     drawOnAxis: null, // force dragging stick on a axis, can be: x, y
    //     symbol: {
    //       lineColor: "#34495e",
    //       lineWidth: 2,
    //       polygonFill: "rgb(135,196,240)",
    //       polygonOpacity: 0.6
    //     }
    //   }
    // );
    // new maptalks.VectorLayer("vector", polygon).addTo(this.map);

    //4 MultiPoint 多点位
    // var multipoint = new maptalks.MultiPoint(
    //   [
    //     [114.0570164407, 22.56210172],
    //     [114.0670164407, 22.56210172],
    //     [114.0670164407, 22.56010172],
    //     [114.0570164407, 22.5600172],
    //     [114.0570164407, 22.56210172]
    //   ],
    //   {
    //     visible: true,
    //     editable: true,
    //     cursor: "pointer",
    //     shadowBlur: 0,
    //     shadowColor: "black",
    //     draggable: false,
    //     dragShadow: false, // display a shadow during dragging
    //     drawOnAxis: null, // force dragging stick on a axis, can be: x, y
    //     symbol: {
    //       textFaceName: "sans-serif",
    //       textName: "point",
    //       textFill: "#34495e",
    //       textHorizontalAlignment: "right",
    //       textSize: 40
    //     }
    //   }
    // );
    // new maptalks.VectorLayer("vector", multipoint).addTo(this.map);

    //6 MultiLineString 多线条
    // var multiline = new maptalks.MultiLineString(
    //   [
    //     [
    //       [114.0570164407, 22.56210172],
    //       [114.0970164407, 22.56210172]
    //     ],
    //     [
    //       [114.0570164407, 22.54210172],
    //       [114.0970164407, 22.54210172]
    //     ],
    //     [
    //       [114.0570164407, 22.52210172],
    //       [114.0970164407, 22.52210172]
    //     ]
    //   ],
    //   {
    //     arrowStyle: null, // arrow-style : now we only have classic
    //     arrowPlacement: "vertex-last", // arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
    //     visible: true,
    //     editable: true,
    //     cursor: null,
    //     shadowBlur: 0,
    //     shadowColor: "black",
    //     draggable: false,
    //     dragShadow: false, // display a shadow during dragging
    //     drawOnAxis: null, // force dragging stick on a axis, can be: x, y
    //     symbol: {
    //       lineColor: "red",
    //       lineWidth: 3
    //     }
    //   }
    // );
    // new maptalks.VectorLayer("vector", multiline).addTo(this.map);

    //7 图形监听事件
    // var layer = new maptalks.VectorLayer("vector").addTo(this.map);
    // var marker = new maptalks.Marker([114.0670164407, 22.56010172], {
    //   symbol: [
    //     {
    //       markerType: "square",
    //       markerFill: "rgba(216,115,149,0.8)",
    //       markerWidth: 20,
    //       markerHeight: 20
    //     },
    //     {
    //       textName: "Click\non Me",
    //       textSize: 18
    //     }
    //   ]
    // }).addTo(layer);
    // marker.on(
    //   "click",
    //   // "mousedown mouseup click dblclick contextmenu touchstart touchend",
    //   param => {
    //     console.log("czf_图像监听", param);
    //   }
    // );

    // 8 点位闪烁
    var marker = new maptalks.Marker([114.0670164407, 22.56010172], {
      symbol: {
        textFaceName: "sans-serif",
        textName: "FLASH\nME",
        textFill: "#34495e",
        textSize: 40,
        textHaloColor: "white",
        textHaloRadius: 8
      }
    });
    const layer = new maptalks.VectorLayer("vector", marker).addTo(this.map);
    marker.flash(
      200, //flash interval in ms
      2, // count
      function() {
        message.success("闪烁完成");
        // callback when flash end
        // alert("flash ended");
      }
    );

    //  图层隐藏、显示
    setTimeout(() => {
      // layer.show();
      layer.hide();
    }, 5000);
  };

  //____________________________________________________
  /**
   * 附图监听事件
   */
  onListenMap = () => {
    const { is3D } = this.state;
    const _this = this;
    if (this.map) {
      const Map = this.map;
      //地图点击事件
      Map.on("click", mapInfo => {
        console.log("地图点击事件", { mapInfo });
      });

      //地图移动事件
      Map.on("moving moveend", function(e) {
        console.log("地图移动事件", e.target.getCenter());
      });

      //地图缩放事件
      Map.on("zooming zoomend", function(e) {
        console.log("地图缩放事件", {
          center: e.target.getCenter(),
          zoom: e.target.getZoom()
        });
      });

      Map.on("pitch", function(e) {
        console.log("地图pitch事件", e.target.getPitch());
      });

      Map.on("rotate", function(e) {
        console.log("地图rotate事件", e.target.getBearing());
      });

      new maptalks.control.Toolbar({
        position: "top-right",
        items: [
          {
            item: "click me",
            click: function(e) {
              console.log("点我", e.target);
              _this.exportImagFromMap();
            }
          }
        ]
      }).addTo(Map);
    }
  };

  /**
   * 导出图片
   */
  exportImagFromMap = () => {
    var data = this.map.toDataURL({
      mimeType: "image/jpeg", // or 'image/png'
      save: true, // to pop a save dialog
      fileName: "map" // file name
    });
  };

  render() {
    const { eventList } = this.state;
    return (
      <div className="map-container">
        <div className="map-item">
          <spam>地图demon</spam>
          <div id="map" className="map"></div>
          <div id="heat" style={{ width: "100%", height: "100%" }}></div>
          <div id="cluster" style={{ width: "100%", height: "100%" }}></div>
          <div id="three" style={{ width: "100%", height: "100%" }}></div>
        </div>

        <div className="map-event">
          <Button> 点我</Button>
          <h4>事件流</h4>
          <div>
            {eventList.map(item => {
              return <h5>{item}</h5>;
            })}
          </div>
        </div>
      </div>
    );
  }
}

function info(info) {
  alert(info);
}
