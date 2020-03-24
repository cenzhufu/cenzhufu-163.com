import React, { Component } from "react";
import L from "leaflet";
import HeatmapOverlay from "heatmap.js/plugins/leaflet-heatmap/leaflet-heatmap";
import "proj4leaflet";
import "leaflet.markercluster";
import "./leaflet-box-selected";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

import axios from "axios";
// import * as proj4leaflet from "proj4leaflet";
// import getMapOpts from "../../utils/getMapOpts";

import "./index.css";

import cameraIcon from "./camera.png";
import { message } from "antd";

export default class Leaflet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      points: [], //摄像头信息以及点位
      isBoxSelected: false, //是否框选
      isHeatMap: false //是否显示热力图
    };

    this.map = null; //地图
    this.markersLayer = null; //点聚合图层
    this.heatmapLayer = null; //热力图层
  }

  componentDidMount() {
    this.initBaiduMap();
    // this.initGoogleAndGaodeMap();

    this.getAllCameras();
  }

  /**
   * 加载百度地图
   */
  initBaiduMap = () => {
    console.log("12");
    //   以下是百度的各种模式地图
    L.CRS.Baidu = new L.Proj.CRS(
      "EPSG:900913",
      "+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
      {
        resolutions: (function() {
          let level = 19;
          let res = [];
          res[0] = Math.pow(2, 18);
          for (var i = 1; i < level; i++) {
            res[i] = Math.pow(2, 18 - i);
          }
          return res;
        })(),
        origin: [0, 0],
        bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
      }
    );

    L.tileLayer.baidu = function(option) {
      option = option || {};

      var layer;
      var subdomains = [0, 1, 2];
      switch (option.layer) {
        //单图层
        case "vec":
        default:
          //'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&b=0&limit=60&scaler=1&udt=20170525'
          layer = L.tileLayer(
            "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=" +
              (option.bigfont ? "ph" : "pl") +
              "&scaler=1&p=1",
            {
              ...option,
              name: option.name,
              subdomains: subdomains,
              tms: true
            }
          );
          break;
        case "img_d":
          layer = L.tileLayer(
            "http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46",
            {
              name: option.name,
              subdomains: subdomains,
              tms: true,
              ...option
            }
          );
          break;
        case "img_z":
          layer = L.tileLayer(
            "http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=" +
              (option.bigfont ? "sh" : "sl") +
              "&v=020",
            {
              name: option.name,
              subdomains: subdomains,
              tms: true,
              ...option
            }
          );
          break;

        case "custom": //Custom 各种自定义样式
          //可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
          option.customid = option.customid || "midnight";
          layer = L.tileLayer(
            "http://api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid=" +
              option.customid,
            {
              name: option.name,
              subdomains: "012",
              tms: true,
              ...option
            }
          );
          break;

        case "time": //实时路况
          var time = new Date().getTime();
          layer = L.tileLayer(
            "http://its.map.baidu.com:8002/traffic/TrafficTileService?x={x}&y={y}&level={z}&time=" +
              time +
              "&label=web2D&v=017",
            {
              name: option.name,
              subdomains: subdomains,
              tms: true
            }
          );
          break;

        //合并
        case "img":
          layer = L.layerGroup([
            L.tileLayer.baidu({
              name: "底图",
              layer: "img_d",
              bigfont: option.bigfont
            }),
            L.tileLayer.baidu({
              name: "注记",
              layer: "img_z",
              bigfont: option.bigfont
            })
          ]);
          break;
      }
      return layer;
    };

    //实例化地图对象
    this.map = L.map("leaflet", {
      crs: L.CRS.Baidu,
      fullscreenControl: true,
      zoomControl: false
    }).setView([22.648365, 114.102316], 12);

    L.tileLayer
      .baidu(
        // {  },
        {
          layer: "voc",
          maxZoom: 18,
          minZoom: 6,
          subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        }
      )
      .addTo(this.map);

    //添加监听事件
    this.addEventListener();

    //添加控制器
    this.addControl();
  };

  /**
   * 添加地图监听事件
   */
  addEventListener = () => {
    const map = this.map;

    //缩放事件
    map.on("zoomend", () => {
      // 缩放结束后记录状态
      console.log("缩放参数", {
        zoom: map.getZoom(),
        center: [map.getCenter().lat, map.getCenter().lng]
      });
      map.closePopup(); //点击地图标记时展开的弹出框，在缩放结束时关闭
    });

    //移动事件
    map.on("moveend", () => {
      // 拖动结束后记录状态
      console.log("缩放参数", {
        zoom: map.getZoom(),
        center: [map.getCenter().lat, map.getCenter().lng]
      });
    });

    //点击事件
    map.on("click", e => {
      // 缩放结束后记录状态
      console.log("点击位置", {
        position: e.latlng,
        center: [map.getCenter().lat, map.getCenter().lng]
      });

      map.closePopup(); //点击地图标记时展开的弹出框，在缩放结束时关闭
    });

    //框选事件
    map.on("onBatchSelectedDone", e => {
      this._batchHandleCamera(e);
      // 缩放结束后记录状态
      console.log("框选成功", {
        bound: e

        // center: [map.getCenter().lat, map.getCenter().lng]
      });
    });
  };

  /**
   * 添加控制器
   */
  addControl = () => {
    L.control
      .scale({
        position: "bottomleft",
        imperial: false
      })
      .addTo(this.map);

    L.control
      .zoom({
        zoomInTitle: "放大",
        zoomOutTitle: "缩小"
      })
      .addTo(this.map);
  };

  /**
   * 加载 谷歌、高德地图
   */
  initGoogleAndGaodeMap = () => {
    let url =
      // "http://mt0.google.cn/vt/lyrs=m@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga";
      "http://webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";
    //初始化 地图
    this.map = L.map("leaflet").setView([22.531962, 113.984871], 12);
    //将图层加载到地图上，并设置最大的聚焦还有map样式
    L.tileLayer(url, {
      maxZoom: 18,
      minZoom: 6,
      zoomControl: false,
      subdomains: url.includes("google")
        ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        : ["01", "02", "03", "04"], //高德特有
      attribution: '&copy; <a href="http://www.gaode.com/">Gaode.com</a>'
    }).addTo(this.map);

    // 增加一个marker ，地图上的标记，并绑定了一个popup，默认打开
    // L.marker([41, 123])
    //   .addTo(leafletMap)
    //   .bindPopup("<b>Hello world!</b><br />I am a popup.")
    //   .openPopup();
    // //增加一个圈，设置圆心、半径、样式
    // L.circle([41, 123], 500, {
    //   color: "red",
    //   fillColor: "#f03",
    //   fillOpacity: 0.5
    // })
    //   .addTo(leafletMap)
    //   .bindPopup("I am a circle.");
    // //增加多边形
    // L.polygon([
    //   [41, 123],
    //   [39, 121],
    //   [41, 126]
    // ])
    //   .addTo(leafletMap)
    //   .bindPopup("I am a polygon.");
    // //为点击地图的事件 增加popup
    // var popup = L.popup();
    // function onMapClick(e) {
    //   popup
    //     .setLatLng(e.latlng)
    //     .setContent("You clicked the map at " + e.latlng.toString())
    //     .openOn(leafletMap);
    // }
    // leafletMap.on("click", onMapClick);
  };

  getAllCameras = () => {
    axios.defaults.headers.common["Authorization"] =
      "Bearer d8444390-76a2-4dc2-bb04-aca22286c7ab";
    const param = {
      queryBy: "nameAndCode",
      query: "",
      id: "3",
      nodeType: "district",
      inStation: "0",
      captureBankId: "1", // 库id

      starttime: "2019-09-27 00:00:00",
      endtime: "2019-12-26 23:59:59",
      dayStartTime: "00:00:00",
      dayEndTime: "23:59:59",
      weekDay: "0",
      concernStatus: false, //区分是否关注摄像头
      online: "",
      tagIds: []
    };

    axios
      .post(
        "http://192.168.2.27:8083/api/intellif/camera/page/1/pagesize/100000",
        {
          ...param
        }
      )
      .then(res => {
        console.log("czf_res", res);

        if (res.data.data) {
          let position = convertPoint(res.data.data);
          console.log({ position });
          this.setState(
            {
              points: position
            },
            () => {
              this._rendLayer();
            }
          );
        }
      });
  };

  /**
   * 加载图层
   */
  _rendLayer = () => {
    this._removeLayer();
    if (this.state.isHeatMap) {
      this.renderHeatMap();
    } else {
      this.renderCameras();
    }
  };

  /**
   * 移除图层
   */
  _removeLayer = () => {
    if (this.heatmapLayer) {
      this.map.removeLayer(this.heatmapLayer);
      this.heatmapLayer = null;
    }
    if (this.markersLayer) {
      this.map.removeLayer(this.markersLayer);
      this.markersLayer = null;
    }
  };

  /**
   * 加载热力图
   */
  renderHeatMap = () => {
    const { points } = this.state;
    // const _this = this;

    const cfgValueField = "captureCount"; //摄像头抓拍数量的key

    if (!points.some(item => item[cfgValueField] > 0)) {
      //如果所有摄像头抓拍数量都为0，则不加载热力图
      //因为leaflet hotmap count全0 也会显示热力图
      this.heatmapLayer = null;
      return;
    }

    /**
     * 创建热力图的方法
     * 传一个参数，从后台获取到的热力图的点的数据
     * 数据结构
         var heatmapData={
            max: 1000,
            data: [
                {lngField:67.89,latitude:21.5,count:100,radius:0.002},
                {lngField:67.869,latitude:21.551,count:19,radius:0.002}
            ]
        };
      */
    let max = 0,
      min = 0,
      data = [];
    for (let i = 0, len = points.length; i < len; i++) {
      const camera = points[i];

      const count = Number(camera[cfgValueField]);
      data.push({
        lng: camera.lng,
        lat: camera.lat,
        count: Number(camera[cfgValueField]),
        radius: 0.002
      });

      if (max < count) {
        max = count;
      }

      if (min > count) {
        min = count;
      }
    }

    const heatmapData = {
      max,
      min,
      data
    };

    if (this.heatmapLayer) {
      /*这个方法是在每一次刷新热力图之前把前一次创建的热力图对象清除,
       *如果不对这个对象进行重置，会在每一刷新的时候给这个对象添加数据上去，
       *会导致这个对象内存增长
       */
      this.map.removeLayer(this.heatmapLayer);
      this.heatmapLayer = null; //重置热力图对象为null
    }

    const config = {
      //热力图的配置项
      radius: 30, //  "radius", //设置每一个热力点的半径
      maxOpacity: 0.8, //设置最大的不透明度
      // minOpacity: 0.3,     //设置最小的不透明度
      scaleRadius: true, //设置热力点是否平滑过渡
      // blur: 0.95, //系数越高，渐变越平滑，默认是0.85,
      //滤镜系数将应用于所有热点数据。
      useLocalExtrema: true, //使用局部极值
      latField: "lat", //维度
      lngField: "lng", //经度
      valueField: "count" //热力点的值
      // gradient: {  //过渡，颜色过渡和过渡比例,范例：
      //   "0.99": "rgba(255,0,0,1)",
      //   "0.9": "rgba(255,255,0,1)",
      //   "0.8": "rgba(0,255,0,1)",
      //   "0.5": "rgba(0,255,255,1)",
      //   "0": "rgba(0,0,255,1)"
      // }
      // backgroundColor: 'rgba(27,34,44,0.5)'    //热力图Canvas背景
    };

    this.heatmapLayer = new HeatmapOverlay(config); //重新创建热力图对象
    this.map.addLayer(this.heatmapLayer); //将热力图图层添加在地图map对象上
    this.heatmapLayer.setData(heatmapData); //设置热力图的的数据
  };

  /**
   * 加载摄像头到地图上
   */
  renderCameras = () => {
    const { points } = this.state;
    const _this = this;

    //集群所包含的标注物
    let markerArr = [];
    //创建标注物集群对象
    this.markersLayer = L.markerClusterGroup({
      showCoverageOnHover: false, //悬停集群是否显示集群边界
      zoomToBoundsOnClick: false, //点击集群是否放大
      maxClusterRadius: 30, //集群的边界
      //创建集群自定义地图标记icon
      iconCreateFunction: function(cluster) {
        const layers = cluster.getAllChildMarkers();
        const count = layers.length;
        const first = layers[0];

        console.log("czf_layers", layers);
        return L.divIcon({
          html: `<i class="leaflet-markers-camera" title="当前点位包含${count}个重叠的摄像头"></i>`,
          className: `leaflet-marker-wrap`
          // iconAnchor: [14, 14]
        });
      }
    });

    //标注物集群添加具体标注物图层
    for (let i = 0, len = points.length; i < len; i++) {
      const point = points[i];
      const pointLatLng = [point.lat, point.lng];

      let myIcon = L.icon({
        iconUrl: cameraIcon, //必需）图标图像的URL（绝对或相对于脚本路径）。
        iconSize: [28, 28],
        point //将改摄像头信息传递
        // iconAnchor: [22, 94],
        // popupAnchor: [-3, -76],
        // // shadowUrl: "my-icon-shadow.png",
        // shadowSize: [68, 95],
        // shadowAnchor: [22, 94]
      });

      let markerObj = {
        cluster: null,
        id: point.id,
        name: point.name,
        src: point.searchSrc || "",
        count: point.searchResult || "",
        online: point.online,
        point: point
      };

      let marker = L.marker(pointLatLng, {
        //创建单摄像头的地图标注物icon
        // icon: myIcon
        icon: _this._renderMarkerIcon(markerObj)
      });

      this.markersLayer.addLayer(marker);
      // markerArr.push(markers);
    }

    //不修改原有逻辑，暂时还取最后一个摄像头点位作为集群的坐标
    // markers.latlng = {
    //   lat: resPointArr[resPointArr.length - 1].lat,
    //   lng: resPointArr[resPointArr.length - 1].lng
    // };
    // markers.cameraId = resPointArr[resPointArr.length - 1].id;

    //添加点击事件
    this._addeClickEvent();

    //将集群添加至地图上
    this.map.addLayer(this.markersLayer);
  };

  /**
   * 自定义点集群图标
   * @param {*} obj
   */
  _renderMarkerIcon = obj => {
    let html = `
        <div class="leaflet-marker-container">
            <i class="leaflet-marker-camera online" title="${obj.name}"></i>
            <p>${obj.name}</p>
        </div>
    `;
    if (obj.online === 3) {
      //离线摄像头
      html = `
        <div class="leaflet-marker-container">
            <i class="leaflet-marker-camera offline" title="${obj.name}"></i>
            <p>${obj.name}</p>
        </div>
    `;
    }
    return L.divIcon({
      html,
      point: obj.point
      // iconAnchor: [48, 48]
    });
  };

  /**
   * 为标注集群添和单个点加监听事件
   * @param {*} markers 聚合集群
   */
  _addeClickEvent = () => {
    const markers = this.markersLayer;
    const _this = this;
    //集群点击
    markers.on("clusterclick", e => {
      // console.log(
      //   "clusterclick ",
      //   e.layer.getAllChildMarkers()[0].options.icon.options.point
      // );
      let allChildMarker = e.layer.getAllChildMarkers(); //获取所有摄像头

      const cameras = allChildMarker.map(item => {
        return item.options.icon.options.point;
      });

      _this._handlePopup(cameras, e.layer._latlng);
      // console.log("camera", cameras);
    });

    //单点点击
    markers.on("click", e => {
      console.log(
        "click ",
        e.layer
        // e.layer.getAllChildMarkers().options.icon.options.point
      );
    });
  };

  /**
   * 点击摄像头聚合后弹窗处理
   * @param {*} cameras  点聚合的摄像头
   */
  _handlePopup = (cameras, latlng) => {
    console.log("弹层", cameras);
    if (cameras.length > 1) {
      let lis = "";
      for (let i = 0, len = cameras.length; i < len; i++) {
        const camera = cameras[i];
        let classname = "camera-online";
        if (camera.online === 3) {
          classname = "camera-offline";
        }

        lis += `
            <li class="camera-li-container" title=${camera.name}>
            <i
              class=${classname}
            ></i>
            <span data-cameraId=${camera.id}  class='camera-name'>${camera.name}</span>
          </li>
        `;
      }

      let ul = document.createElement("ul");
      ul.className = "camera-ul";
      ul.innerHTML = lis;
      ul.onclick = function(e) {
        e.stopPropagation();
        if (e.target.className === "camera-name") {
          //TODO:
          console.log("点击摄像头", e.target.getAttribute("data-cameraId"));
          const id = e.target.getAttribute("data-cameraId");
          const cameraName = e.target.innerText;
          message.success(`点击了id为${id},名字为 ${cameraName}的摄像头`);
        }
      };

      let div = document.createElement("div");
      div.innerHTML = "<h3 class='popup-title'>请选择</h3>";
      div.appendChild(ul);

      this.popup = L.popup()
        .setLatLng(latlng)
        .setContent(div)
        .openOn(this.map);
    }
  };

  /**
   * 是否显示热力图
   */
  handleChangeLayer = () => {
    this.setState(
      {
        isHeatMap: !this.state.isHeatMap
      },
      () => {
        this._rendLayer();
      }
    );
  };

  /**
   * 是否款选操作
   */
  handleBoxSelect = () => {
    if (!this.state.isBoxSelected) {
      //关闭地图上的所有弹窗
      this.map.closePopup();
      this.batchSelectedLayer = L.batchSelected(this.map);
      this.batchSelectedLayer.enable();
    } else {
      //取消框选
      this.batchSelectedLayer.disable();
      this.batchSelectedLayer = null;
    }

    this.setState({
      isBoxSelected: !this.state.isBoxSelected
    });
  };

  /**
   * 获取框选的摄像头
   * @param {*} bound 框选的长方形边界
   */
  _batchHandleCamera = e => {
    const bound = e.latLngs;
    const { points } = this.state;

    console.log("bound", { bound, points });
    let startLng = bound[0].lng; //经度
    let startLat = bound[0].lat; //纬度
    let endLng = bound[2].lng;
    let endLat = bound[2].lat;

    const selectedPoint = points.filter(item => {
      //选中的点
      return (
        item.lng >= startLng &&
        item.lng <= endLng &&
        item.lat >= startLat &&
        item.lat <= endLat
      );
    });

    console.log("框选结果", { selectedPoint });
    // if (this.state.isBoxSelected) {
    //   lasso.enable();
    // } else {
    //   message.success("22222222222");
    //   lasso.disable();
    // }
  };

  render() {
    const { isHeatMap, isBoxSelected } = this.state;
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <h3>Leaflet</h3>
        <div className="leaflet-button-container">
          <div className="leaflet-button-item" onClick={this.handleChangeLayer}>
            {isHeatMap ? "显示摄像头" : "显示热力图"}
          </div>
          <div onClick={this.handleBoxSelect} className="leaflet-button-item">
            {isBoxSelected ? "取消框选" : "框选"}
          </div>
        </div>

        <div id="leaflet" className="leaflet"></div>
      </div>
    );
  }
}

/**
 * 对点位坐标进行转换，过滤geoString为空和包含null的点位，并对非百度地图点位做修正
 * @param  {Array}  points   点位数组
 * @param  {string}  key    可选，点位坐标值的key，默认geoString
 * @return {Array}          处理后的点位
 */
function convertPoint(points, isBaidu = false, key = "geoString") {
  let list = [];

  let transfLng = 0; //经度
  let transfLat = 0; //纬度

  if (!isBaidu) {
    //非百度地图
    transfLng = -0.00649039475300128;
    transfLat = -0.00604391488360179;
  }

  let reg = /point\(([\d.-]+)\s([\d.-]+)\)/i;

  if (Array.isArray(points) && points.length) {
    for (let i = 0, len = points.length; i < len; i++) {
      const camera = points[i];
      if (camera[key] && !camera[key].includes(null)) {
        const arr = camera[key].match(reg);
        list.push({
          ...camera,
          lat: Number(arr[2]) + Number(transfLat),
          lng: Number(arr[1]) + Number(transfLng)
        });
      }
    }
  }

  return list;
}
