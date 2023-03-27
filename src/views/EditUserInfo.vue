<template>
	<page-view class="editUserInfo">
		<page-header :back="true" title="个人资料"></page-header>
		<div class="content">
			<div class="title">生日特权</div>
			<div class="form-user">
				<div class="header-photo">
					<!-- <van-field class="headPortrait" name="uploader" v-model="userInfo.user_photo">
						<template #input>
							<van-uploader :deletable="false" v-model="fileList" :before-read="beforeRead" accept="image/*" :max-size="10240 * 1024"></van-uploader>
						</template>
					</van-field> -->
					<img :src="userInfo.user_photo" alt="" />
				</div>
				<van-form class="form">
					<van-cell-group inset>
						<van-field label="昵称" v-model="userInfo.nickName" name="nickName" placeholder="请填写" input-align="right" :rules="[{ required: true, message: '请填写昵称', trigger: 'onblur' }]" />
						<van-field label="手机号" name="phone" input-align="right">
							<template #input>{{ encryptionPhone }}&nbsp;&nbsp;<van-button size="mini" @click="changePhone">更换手机</van-button></template>
						</van-field>
						<van-field label="性别" name="radio" input-align="right">
							<template #input>
								<van-radio-group v-model="userInfo.user_sex" direction="horizontal">
									<van-radio name="男">男</van-radio>
									<van-radio name="女">女</van-radio>
								</van-radio-group>
							</template>
						</van-field>
						<van-field v-model="userInfo.birthday" is-link readonly name="datePicker" label="生日" placeholder="请选择" input-align="right" @click="showPicker = true"> </van-field>
						<van-popup v-model:show="showPicker" position="bottom">
							<van-date-picker :min-date="minDate" :max-date="maxDate" @confirm="onConfirm" @cancel="showPicker = false" />
						</van-popup>
					</van-cell-group>
				</van-form>
				<van-field class="switch" label="切换账号" @click="switchUser" input-align="right">
					<template #input>
						<van-icon name="arrow" />
					</template>
				</van-field>
				<div style="margin-top: 16px">
					<van-button block type="success" @click="preservation()"> 保存 </van-button>
				</div>
			</div>
		</div>
		<van-dialog v-model:show="show" title="请输入手机号" show-cancel-button @confirm="confirmChangePhone">
			<van-field label="手机号" placeholder="请输入手机号" name="phone" v-model="confirmPhone"> </van-field>
		</van-dialog>
	</page-view>
</template>

<script setup>
import { ref, reactive, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showConfirmDialog, showSuccessToast, showToast } from "vant";
import api from "@/api";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
const baseUrl = inject("baseUrl");
const route = useRoute();
const userInfo = reactive({
	id: "",
	nickName: "",
	user_sex: "",
	user_phone: "",
	user_photo: "",
	birthday: "",
});
let encryptionPhone = ref("");

const fileList = ref([]);
const getUserInfo = async () => {
	let res = await api.user.findById(route.params.id);
	userInfo.id = route.params.id;
	userInfo.nickName = res[0].nickName;
	userInfo.user_sex = res[0].user_sex;
	userInfo.user_phone = res[0].user_phone;
	userInfo.user_photo = baseUrl + res[0].user_photo;
	encryptionPhone.value = res[0].user_phone;
	let head = encryptionPhone.value.substring(0, 3);
	let footer = encryptionPhone.value.substring(9, 11);
	encryptionPhone.value = head + "******" + footer;

	if (store.state.birthday) {
		userInfo.birthday = store.state.birthday;
	}
	store.commit("setInfo", userInfo);
};
getUserInfo();

//生日
const minDate = new Date(1990, 0, 1);
const maxDate = new Date(2023, 0, 1);
const showPicker = ref(false);
const onConfirm = ({ selectedValues }) => {
	userInfo.birthday = selectedValues.join("-");
	showPicker.value = false;
};

//更换手机号
let show = ref(false);
const changePhone = async () => {
	try {
		await showConfirmDialog({
			message: "重新授权将清除当前已绑定的手机号,是否确认操作?",
		});
		show.value = true;
	} catch (error) {}
};
let confirmPhone = ref("");
const confirmChangePhone = async () => {
	let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
	if (reg.test(confirmPhone.value)) {
		await api.user.editUser({ id: route.params.id, user_phone: confirmPhone.value });
		getUserInfo();
	} else showToast("请输入正确的手机号码");
};

//切换账号

const switchUser = () => {
	store.commit("setToken", null);
	store.commit("setInfo", null);
	router.push("/login");
};

//头像上传
// const beforeRead = async file => {
// 	await api.user.uploadUserPhoto(file);
// 	console.log(userInfo.user_photo);
// };
//保存
const preservation = async () => {
	await api.user.editUser({ id: route.params.id, nickName: userInfo.nickName, user_phone: userInfo.user_phone, user_sex: userInfo.user_sex });
	showSuccessToast("保存成功");
	if (userInfo.birthday) {
		store.commit("setBirthday", userInfo.birthday);
	}
	router.back();
};
</script>

<style lang="scss" scoped>
.editUserInfo {
	.content {
		background-color: #f7f7f7;
		.title {
			color: $primary;
			background-color: #deede5;
			padding-left: 10px;
			box-sizing: border-box;
			height: 35px;
			line-height: 35px;
		}

		.form-user {
			position: relative;
			width: 90%;
			margin-left: 5%;
			border-radius: 10px;
			margin-top: 70px;
			.form {
				padding-top: 50px;
				background-color: #fff;
				box-sizing: border-box;
			}
			.switch {
				margin-top: 10px;
			}
			.header-photo {
				position: absolute;
				left: 50%;
				top: 0;
				transform: translateX(-50%) translateY(-50%);
				height: 80px;
				width: 80px;
				border-radius: 50%;
				overflow: hidden;
				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}

::v-deep(.van-cell-group.van-cell-group--inset) {
	margin: unset;
}
</style>
