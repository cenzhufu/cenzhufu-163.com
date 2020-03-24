export const config = {
  version: "1.0.0",
  projectName: "flowdensity",
  systemName: "区域人群密度分析平台",
  environments: {
    localhost: {
      host: "localhost:3002",
      apiBaseURL: "http://192.168.11.208:10888"
    },
    internet: {
      // 外网环境
      host: "127.0.0.1:8067",
      apiBaseURL: "http://127.0.0.1:10888"
    }
  },
  mapServer: {
    mapType: "baiduOnline", // baiduOnline百度在线地图，baiduOffline百度离线地图，googleOnline谷歌在线地图，googleOffline谷歌离线地图
    mapDefaultZoom: 12,
    mapCenter: {
      lng: 114.102316, // 经度
      lat: 22.648365 // 纬度
    },
    mapZoom: {
      minZoom: 6,
      maxZoom: 18
    },
    serverUrl: {
      baiduOffline: {
        origin: "http://127.0.0.1/ifaas/mapapi/tiles/{z}/{x}/{y}.png" //注意IP和存放地图tile的路径以及离线地图的图片属性 jpg png
      },
      baiduOnline: {
        origin:
          "http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150518"
      },
      googleOnline: {
        origin:
          "http://mt{s}.google.cn/vt/lyrs=m@160000000&hl=zh-CN&gl=CN&src=app&y={y}&x={x}&z={z}&s=Ga",
        attribution: '&copy; <a href="javascript:;">googleMap</a>',
        transforCoordinate: {
          //其他地图和百度点位的经纬度差
          lat: -0.00604391488360179,
          lng: -0.00649039475300128
        }
      },
      googleOffline: {
        origin: "http://127.0.0.1/ifaas/mapapi/tiles/{z}/{x}/{y}.png", //注意IP和存放地图tile的路径以及离线地图的图片属性 jpg png
        attribution: '&copy; <a href="javascript:;">googleMap</a>',
        transforCoordinate: {
          //其他地图和百度点位的经纬度差
          lat: -0.00604391488360179,
          lng: -0.00649039475300128
        }
      }
    }
  },
  useHeatMap: false, // 2d模式下使用热力图而不是柱状图
  darkFilter:
    "sepia(100%) invert(100%) brightness(220%) contrast(100%) saturate(35%)", // 黑色滤镜
  useDarkFilter: true, // 是否使用黑色滤镜处理地图，如果使用的是浅色地图，打开此开关将会使地图变成深色，如果已经使用了深色地图，请勿打开此开关！
  split: [20, 50], // 颜色等级分割，密度小于第一个数用绿色，介于两个数之间用黄色，大于第二个数用红色
  mapLabelNum: 20, // 3d地图默认展示的label数量
  rankSize: 50, // 获取人流密度数据数量
  oneDayMinutes: 10, // 过去24小时数据的分段长度，单位为分钟
  rankInterval: 10, // 获取人流密度数据的频率，单位为秒
  oneDayInterval: 10 // 获取过去24小时数据的频率，单位为秒
};
