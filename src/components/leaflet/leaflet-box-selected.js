import L from "leaflet";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

/**
 *  1、rectangleSel事件-->监听click，mousemove, mouseup事件，设置地图拖动为false
 *  2、click-->画一个点p1
 *  3.mousemove-->依据当前的点p2 和 click时画的点p1,在地图上画矩形框
 *  4、mouseup --> 添加面积信息label, 取消click,mousemove, mouseup的事件监听，恢复地图拖动为true
 *
 * */

const BatchSelected = L.Handler.extend({
  options: {
    polygon: {
      color: "#00C3FF",
      weight: 2
    },
    cursor: "crosshair"
  },

  initialize(map, options) {
    this.map = map;
    this.onMouseUpBound = this.onMouseUp.bind(this);
    L.Util.setOptions(this, options);
  },

  addHooks() {
    this.map.on("mousedown", this.onMouseDown, this);
    this.map.on("mouseup", this.onMouseUp, this);
    document.addEventListener("mouseup", this.onMouseUpBound, true);

    const mapContainer = this.map.getContainer();
    mapContainer.style.cursor = this.options.cursor || "";
    mapContainer.style.userSelect = "none";
    mapContainer.style.msUserSelect = "none";
    mapContainer.style.mozUserSelect = "none"; // missing typings
    mapContainer.style.webkitUserSelect = "none";

    this.map.dragging.disable(); //设置地图不允许拖动
    this.map.fire("batchSelected.enabled");
  },

  removeHooks() {
    this.map.off("mousedown", this.onMouseDown, this);
    this.map.off("mousemove", this.onMouseMove, this);
    this.map.off("mouseup", this.onMouseUp, this);
    document.removeEventListener("mouseup", this.onMouseUpBound);

    const mapContainer = this.map.getContainer();
    mapContainer.style.cursor = "";
    mapContainer.style.userSelect = "";
    mapContainer.style.msUserSelect = "";
    mapContainer.style.mozUserSelect = ""; // missing typings
    mapContainer.style.webkitUserSelect = "";

    this.map.dragging.enable(); //设置地图允许拖动
    this.map.fire("batchSelected.disabled");
  },

  /**
   * 按下鼠标按钮执， 开始绘制长方形
   * @param {*} event
   */
  onMouseDown(event) {
    // 开始绘制长方形
    this.polygon = L.rectangle(
      [event.latlng, event.latlng],
      this.options.polygon
    ).addTo(this.map);
    this.start = event.latlng;
    this.map.on("mousemove", this.onMouseMove, this);
  },

  /**
   * 鼠标拖动时间
   * @param {*} event
   */
  onMouseMove(event) {
    if (!this.polygon) {
      return;
    }

    this.polygon.setBounds([this.start, event.latlng]);
  },

  /**
   *鼠标松开时间
   */
  onMouseUp() {
    if (!this.polygon) {
      return;
    }

    const selectedFeatures = this.getSelectedLayers(this.polygon);
    //派发框选结束事假
    this.map.fire("onBatchSelectedDone", {
      latLngs: this.polygon.getLatLngs()[0], //长方形四个角的点位位置j经纬度
      layers: selectedFeatures
    });
    this.map.removeLayer(this.polygon);
    this.polygon = undefined;

    // this.disable();   //按钮控制取消框选
  },

  getSelectedLayers(polygon) {
    const lassoPolygonGeometry = polygon.toGeoJSON().geometry;

    const selectedLayers = [];
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.MarkerCluster) {
        var layerGeometry = layer.toGeoJSON().geometry;
        var include = booleanPointInPolygon(
          layerGeometry,
          lassoPolygonGeometry
        );

        if (include) {
          selectedLayers.push(layer);
        }
      }
    });

    return selectedLayers;
  }
});

// L.Lasso = Lasso;
L.batchSelected = (map, options) => {
  return new BatchSelected(map, options);
};
