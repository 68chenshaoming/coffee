<template>
	<div class="user-info" @click="toEdit">
		<div class="header">
			<img :src="photo" alt="" />
		</div>
		<div class="info" v-if="isLogin">
			<div class="left">HI,{{ userInfo.nickName }}</div>
			<div class="qrCode">
				<img :src="userInfo.qeCode" alt="" />
				<span>会员码</span>
			</div>
		</div>
		<div class="info-f" v-else @click="$router.push({ name: 'login' })">请登录</div>
	</div>
</template>

<script setup>
import api from "@/api";
import { ref, inject, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();
const baseUrl = inject("baseUrl");
const isLogin = ref(false);
const store = useStore();
const photo = ref("");
const userInfo = reactive({
	id: "",
	nickName: "",
	user_sex: "",
	user_phone: "",
	user_photo: "",
	qeCode: "",
	password: "",
});

const getUserInfo = async () => {
	if (!store.state.token) {
		photo.value = require("../assets/image/header.png");
	} else {
		isLogin.value = true;
		let res = await api.user.findById(store.state.userInfo.id);
		userInfo.nickName = res[0].nickName;
		userInfo.user_sex = res[0].user_sex;
		userInfo.user_phone = res[0].user_phone;
		userInfo.user_photo = baseUrl + res[0].user_photo;
		userInfo.qeCode = baseUrl + res[0].qeCode;
		userInfo.password = res[0].password;
		photo.value = userInfo.user_photo;
	}
};
getUserInfo();

const toEdit = () => {
	if (!store.state.token) {
		router.push({ name: "login" });
	} else {
		router.push({ name: "editUserInfo", params: { id: store.state.userInfo.id } });
	}
};
</script>

<style lang="scss" scoped>
.user-info {
	display: flex;

	border-radius: 15px;
	box-sizing: border-box;
	align-items: center;
	padding: 20px 15px;

	background-color: #fff;
	.header {
		height: 65px;
		width: 65px;
		border-radius: 50%;
		overflow: hidden;
		img {
			height: 100%;
			width: 100%;
			object-fit: cover;
		}
	}

	.info {
		flex: 1;
		display: flex;
		justify-content: space-between;
		.left {
			font-weight: bold;
			font-size: 18px;
			margin-left: 10px;
			align-self: center;
		}
		.qrCode {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			img {
				width: 35px;
				height: 35px;
			}
		}
	}
	.info-f {
		font-weight: bold;
		font-size: 18px;
		margin-left: 10px;
	}
}
</style>
