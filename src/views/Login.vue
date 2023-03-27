<template>
	<page-view class="login">
		<page-header :back="true" title="登录"></page-header>
		<div class="content">
			<van-form @submit="onSubmit">
				<van-cell-group inset>
					<van-field
						v-model="user_phone"
						name="user_phone"
						label="用户名"
						placeholder="用户名"
						:rules="[
							{ required: true, message: '请填写用户名' },
							{ validator: phoneValidator, message: '用户名格式错误' },
						]"
					/>
					<van-field
						v-model="password"
						type="password"
						name="password"
						label="密码"
						placeholder="密码"
						autocomplete
						:rules="[
							{ required: true, message: '请填写密码' },
							{ validator: passwordValidator, message: '密码格式' },
						]"
					/>
				</van-cell-group>
				<div style="margin: 16px">
					<van-button round block :loading="loading" type="success" native-type="submit" loading-text="正在登陆"> 登陆 </van-button>
				</div>
			</van-form>
			<div class="register">
				<span>还没有账号去</span>
				<router-link :to="{ path: `/register` }">注册</router-link>
			</div>
		</div>
	</page-view>
</template>

<script setup>
import { ref } from "vue";
import { showSuccessToast, showFailToast } from "vant";
import MD5 from "md5.js";
import api from "@/api/index";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
const store = useStore();
const route = useRoute();
const router = useRouter();
const user_phone = ref("");
const password = ref("");
const loading = ref(false);
const phoneValidator = val => {
	let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
	if (!reg.test(val)) return false;
};
const passwordValidator = val => {
	let reg = /^[0-9]{6,18}$/;
	if (!reg.test(val)) return false;
};

const onSubmit = async value => {
	value.password = new MD5().update(value.password).digest("hex");
	loading.value = true;
	let res = await api.user.login(value);
	if (res.token) {
		showSuccessToast("登录成功");
		loading.value = false;
		store.commit("setToken", res.token);
		store.commit("setInfo", res.user_info);
		if (route.query.redirect) {
			router.push(route.query.redirect);
		} else {
			router.back();
		}
	} else {
		showFailToast("账号或密码错误");
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped>
.login {
	.content {
		flex: 1;
		overflow: auto;

		.register {
			text-align: center;
			a {
				color: red;
			}
		}
	}
}
</style>
