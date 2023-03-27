<template>
	<page-view class="add-address">
		<page-header title="收货地址" :back="true"></page-header>
		<div class="content-box">
			<van-address-edit :area-list="areaList" :area-columns-placeholder="['请选择', '请选择', '请选择']" @save="onSave" :is-saving="isSubmiting">
				<van-field v-model="tag" label="标签" placeholder="给地址一个标签" :rules="[{ required: true, message: '标签必须有' }]" />
			</van-address-edit>
		</div>
	</page-view>
</template>

<script setup>
import { areaList } from "@vant/area-data";
import { ref } from "vue";
import api from "@/api";
import { showSuccessToast } from "vant";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useStore();
const isSubmiting = ref(false);
const tag = ref("");
const onSave = async content => {
	console.log(content);
	isSubmiting.value = true;
	let addressInfo = {
		address: [content.province, content.city, content.county, content.addressDetail].join(" "),
		person_name: content.name,
		phone: content.tel,
		tag: tag.value,
	};
	await api.address.add(addressInfo);
	isSubmiting.value = false;
	showSuccessToast("地址保存成功");
	let result = await api.address.findByUid();
	store.commit("setAddressInfo", result);
	router.back();
};
</script>

<style lang="scss" scoped>
::v-deep(.van-button--primary) {
	background-color: $primary;
}
</style>
