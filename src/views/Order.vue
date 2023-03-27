<template>
	<page-view class="order">
		<page-header title="我的订单"></page-header>
		<div class="order-content">
			<div class="orderList" v-if="orderList.length > 0">
				<OrderItem v-for="(item, index) in orderList" :key="index" :item="item"></OrderItem>
			</div>
		</div>
	</page-view>
</template>

<script setup>
import OrderItem from "@/components/OrderItem.vue";
import api from "@/api";
import { ref, reactive } from "vue";
const pageIndex = ref(1);

const orderList = reactive([]);
const getOrderList = async () => {
	let res = await api.orderInfo.findByUid(pageIndex.value);
	res.list.forEach(item => orderList.push(item));
};
getOrderList();
</script>

<style lang="scss" scoped>
.order {
	margin-bottom: 60px;
	.order-content {
		flex: 1;
		overflow: auto;
		background-color: #f7f7f7;
		padding: 0 10px;
	}
}
</style>
