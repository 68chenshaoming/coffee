<template>
	<page-view class="edit-address">
		<page-header title="编辑地址" :back="true"></page-header>
		<div class="content-box">
			<van-address-edit
				:area-list="areaList"
				:area-columns-placeholder="['请选择', '请选择', '请选择']"
				@save="onSave"
				:is-saving="isSubmiting"
				:is-deleting="isSubmiting"
				show-delete
				@delete="onDelete"
				:address-info="addressEditInfo"
			>
				<van-field v-model="tag" label="标签" placeholder="给地址一个标签" :rules="[{ required: true, message: '标签必须有' }]" />
			</van-address-edit>
		</div>
	</page-view>
</template>

<script setup>
import { areaList } from "@vant/area-data";
import { reactive, ref } from "vue";
import api from "@/api";
import { showSuccessToast, showConfirmDialog } from "vant";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const store = useStore();
const isSubmiting = ref(false);
const tag = ref("");
const addressEditInfo = reactive({
	name: "",
	tel: "",
	province: "",
	city: "",
	county: "",
	addressDetail: "",
});

const findByUid = async id => {
	let result = await api.address.findById(id);
	result = result[0];
	addressEditInfo.name = result.person_name;
	addressEditInfo.tel = result.phone;
	tag.value = result.tag;
	let addressSplitArr = result.address.split(" ");
	addressEditInfo.province = addressSplitArr[0];
	addressEditInfo.city = addressSplitArr[1];
	addressEditInfo.county = addressSplitArr[2];
	addressEditInfo.addressDetail = addressSplitArr[3];
	//   通过对区的编码查询，可以推断出省和市
	let countyCode = [];
	let cityCode;
	for (let key in areaList.county_list) {
		if (areaList.county_list[key] === addressSplitArr[2]) {
			countyCode.push(key);
		}
	}
	if (countyCode.length === 1) {
		addressEditInfo.areaCode = countyCode[0];
	} else {
		for (let key in areaList.city_list) {
			if (areaList.city_list[key] === addressSplitArr[1]) {
				cityCode = key;
				break;
			}
		}
		let temp = countyCode.filter(item => item.startsWith(cityCode.substr(0, 4)));
		addressEditInfo.areaCode = temp[0];
	}
};
findByUid(route.query.id);

const onSave = async content => {
	console.log(content);
	isSubmiting.value = true;
	let addressInfo = {
		address: [content.province, content.city, content.county, content.addressDetail].join(" "),
		person_name: content.name,
		phone: content.tel,
		tag: tag.value,
	};
	await api.address.edit(route.query.id, addressInfo);
	let result = await api.address.findByUid();
	store.commit("setAddressInfo", result);
	isSubmiting.value = false;
	showSuccessToast({
		message: "地址编辑成功",
		duration: 1000,
		onClose: () => {
			router.back();
		},
	});
};

const onDelete = async () => {
	showConfirmDialog({
		title: "警告",
		message: "确认要删除吗？",
	})
		.then(async () => {
			isSubmiting.value = true;
			await api.address.delete(route.query.id);
			let result = await api.address.findByUid();
			store.commit("setAddressInfo", result);
			isSubmiting.value = false;
			showSuccessToast({
				message: "地址删除成功",
				duration: 1000,
				onClose: () => {
					router.back();
				},
			});
		})
		.catch(() => {
			// on cancel
		});
};
</script>

<style lang="scss" scoped>
::v-deep(.van-button--primary) {
	background-color: $primary;
}
</style>
