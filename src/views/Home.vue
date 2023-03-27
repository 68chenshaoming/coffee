<template>
	<page-view>
		<page-header></page-header>
		<div class="home-content">
			<div class="swiper-box">
				<van-swipe :autoplay="2000" lazy-render>
					<van-swipe-item v-for="item in bannerList" :key="item.id">
						<van-image width="100%" height="350" fit="cover center" :src="item.banner_img" />
					</van-swipe-item>
				</van-swipe>
			</div>
			<UserInfo />

			<div class="mode">
				<div class="top">
					<div class="selfLifting">
						<img :src="outFood" alt="" />
					</div>
					<div class="splitLine"></div>
					<div class="take-outFood">
						<img :src="selfLifting" alt="" />
					</div>
				</div>
				<div class="bottom">
					<img :src="collate" alt="" />
				</div>
			</div>
			<ul class="exchange">
				<li><span class="name">积分兑换</span><span class="iconfont">&#xfab3;</span></li>
				<li><span class="name">卡券兑换</span><span class="iconfont">&#xe612; </span></li>
				<li><span class="name">充值有礼</span><span class="iconfont">&#xe60f;</span></li>
			</ul>
			<ul class="imgList" v-if="homeInfoList.length > 0">
				<li v-for="item in homeInfoList" :key="item.id"><img v-lazy="item.home_img" @click="toUrl(item.url)" /></li>
			</ul>
		</div>
	</page-view>
</template>

<script setup>
import api from "@/api/index";
import { ref, reactive, inject } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { showToast } from "vant";
import UserInfo from "@/components/UserInfo.vue";
const baseUrl = inject("baseUrl");
const bannerList = reactive([]);
const router = useRouter();
const store = useStore();
const getBannerList = async () => {
	let res = await api.bannerInfo.get();
	if (res.length == 0) {
		bannerList.push({ id: "1", banner_img: require("@/assets/image/lunbo1.png") });
	} else {
		res.forEach(item => {
			item.banner_img = baseUrl + item.banner_img;
			bannerList.push(item);
		});
	}
};
getBannerList();

const outFood = require("@/assets/image/waimai.png");
const selfLifting = require("@/assets/image/ziti.png");
const collate = require("@/assets/image/bottom.png");
const homeInfoList = reactive([]);
const getHomeInfo = async () => {
	let res = await api.homeInfo.get();
	res.forEach(item => {
		item.home_img = baseUrl + item.home_img;
		homeInfoList.push(item);
	});
};
getHomeInfo();

const toUrl = url => {
	if (!store.state.token) {
		showToast("请登录");
		router.push({ name: "login" });
	} else router.push({ name: url, params: { id: store.state.userInfo.id } });
};
</script>

<style lang="scss" scoped>
.home-content {
	flex: 1;
	overflow: auto;
	margin-bottom: 60px;
	.mode {
		background-color: #efefef;
		border-radius: 10px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 90%;
		margin-left: 5%;
		.top {
			display: flex;
			width: 100%;
			justify-content: space-around;
			align-items: center;
			padding: 20px 0;

			.splitLine {
				width: 1px;
				height: 50px;
				background-color: $default;
			}
		}
		.bottom {
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 10px;
			border-top: 1px solid $default;
			width: 280px;
			img {
				width: 100%;
			}
		}
	}

	.exchange {
		display: flex;
		justify-content: space-around;
		width: 90%;
		margin-left: 5%;
		border-radius: 10px;
		background-color: #efefef;
		margin-top: 15px;
		box-sizing: border-box;
		padding: 15px;
		li {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: $active;
			.iconfont {
				font-size: 36px;
			}
		}
	}

	.imgList {
		margin-top: 15px;
		width: 90%;
		margin-left: 5%;
		li {
			width: 100%;
			margin-bottom: 10px;
			&:last-child {
				margin-bottom: 0;
			}
			img {
				width: 100%;
				border-radius: 10px;
			}
		}
	}
}
</style>
