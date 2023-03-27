<template>
	<page-view class="address">
		<page-header :back="true" title="地址列表"></page-header>
		<div class="address-content">
			<van-address-list v-model="chosenAddressId" :list="list" default-tag-text="默认" @add="onAdd" @edit="onEdit">
				<template #default>
					<div class="default-btn">
						<van-button type="primary" @click="addChoose">添加为当前收获地址</van-button>
					</div>
				</template>
			</van-address-list>
		</div>
	</page-view>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { showSuccessToast } from "vant";
import api from "@/api";
const router = useRouter();
const store = useStore();
const chosenAddressId = ref(0);
const list = reactive([]);
const getAddress = async () => {
	if (store.state.addressInfo === null) {
		let result = await api.address.findByUid();
		store.commit("setAddressInfo", result);
		result.forEach(item => {
			item.name = item.person_name;
			item.tel = item.phone;
			item.isDefault = item.isDefault == 1 ? true : false;
			list.push(item);
		});
	} else {
		store.state.addressInfo.forEach(item => {
			item.name = item.person_name;
			item.tel = item.phone;
			item.isDefault = item.isDefault == 1 ? true : false;
			list.push(item);
		});
	}
};
getAddress();

const addChoose = async () => {
	let choose = list.filter(item => item.id == chosenAddressId.value);
	store.commit("setCurrentAddress", choose[0]);
	showSuccessToast({
		message: "收货地址选择成功",
		duration: 1000,
		onClose: () => router.back(),
	});
};

const onAdd = () => router.push({ name: "addAddress" });
const onEdit = (item, index) => {
	router.push({
		name: "editAddress",
		query: {
			id: item.id,
		},
	});
};
</script>

<style lang="scss" scoped>
.address {
	.address-content {
		flex: 1;
		overflow: auto;
		.default-btn {
			position: fixed;
			bottom: 50px;
			left: 0px;
			width: 100vw;
			box-sizing: border-box;
			padding: 0px 16px;
			button {
				width: 100%;
				height: 40px;
				border-radius: 20px;
				margin-top: 5px;
			}
		}
	}
}

::v-deep(.van-button) {
	background-color: $primary;
}
</style>
