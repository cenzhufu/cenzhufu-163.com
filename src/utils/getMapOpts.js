import * as maptalks from "maptalks";
// import { mapServer, darkFilter, useDarkFilter } from "./config";
// import { config } from "./config";
// const { mapServer, darkFilter, useDarkFilter } = config;
// const mapServer = config.mapServer;
// const darkFilter = config.darkFilter;
// const useDarkFilter = config.useDarkFilter;
// console.log("czf", { mapServer, darkFilter, useDarkFilter });
// console.log("czf", config);
export default () => {
  // const type = mapServer.mapType;
  let opts = {
    // center: [114.102316, 22.648365],
    center: [114.0570164407, 22.5621017225],
    zoom: 12,
    minZoom: 6,
    maxZoom: 18,
    pitch: 45,
    baseLayer: new maptalks.TileLayer("base", {
      urlTemplate:
        "http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150518",
      subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      attribution: '&copy; <a href="http://map.baidu.com/">Baidu</a>'

      // cssFilter:
      //   "sepia(100%) invert(100%) brightness(220%) contrast(100%) saturate(35%)" // 黑色滤镜
    }),
    spatialReference: {
      projection: "baidu"
    }
  };
  // if (type.includes("baidu")) {
  //   opts = {
  //     ...opts,
  //     spatialReference: {
  //       projection: "baidu"
  //     }
  //   };
  // } else {
  //   opts = {
  //     ...opts,
  //     spatialReference: maptalks.CRS.GCJ02
  //   };
  // }
  // opts = {
  //   ...opts,
  //   spatialReference: {
  //     projection: "baidu"
  //   }
  // };
  return opts;
};
