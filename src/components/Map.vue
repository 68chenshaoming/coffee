<!-- vue 3 引入百度api -->
<template>
	<div id="container" style="width: 100%; height: 100%"></div>
</template>

<script setup>
import { nextTick, onMounted } from "vue";
onMounted(() => {
	nextTick(() => {
		initMap();
	});
});
const initMap = () => {
	// 创建地图实例
	let map = new BMapGL.Map("container");
	// 创建点坐标
	let point = new BMapGL.Point(114.31758025926678, 30.592459257290017);
	map.centerAndZoom(point, 15);
	//启用滚轮放大缩小，默认禁用。
	map.enableScrollWheelZoom(true);
	// 添加比例尺控件
	let scaleCtrl = new BMapGL.ScaleControl();
	let zoomCtrl = new BMapGL.ZoomControl();
	map.addControl(scaleCtrl);
	map.addControl(zoomCtrl);
	// 添加城市列表控件
	let cityCtrl = new BMapGL.CityListControl();
	map.addControl(cityCtrl);
	// 添加标记点
	let marker = new BMapGL.Marker(point);
	map.addOverlay(marker);
	//地图单击事件
	map.addEventListener("click", function (e) {
		// 清除覆盖物
		map.clearOverlays();
		// 重设标记点
		let point = new BMapGL.Point(e.latlng.lng, e.latlng.lat);
		let marker = new BMapGL.Marker(point);
		map.addOverlay(marker);
		let opts = {
			width: 250, // 宽度
			height: 100, // 高度
			title: "经纬度信息", //标题
		};
		let info = `当前位置经度为${e.latlng.lng}，纬度为${e.latlng.lat}`;
		// 创建信息窗口对象
		let infoWindow = new BMapGL.InfoWindow(info, opts);
		// 打开信息窗口
		map.openInfoWindow(infoWindow, point);
	});
};
</script>
<style scoped lang="scss"></style>
