<template>
	<page-view class="order-detail">
		<page-header :back="true" title="订单详情" @generateOrder="generateOrder"></page-header>
		<div class="order-detail-content">
			<div class="toBePaid" v-if="toBePaid">
				<div class="title">待支付</div>
				<div class="time"><span>剩余支付时间</span><van-count-down :time="CountDownTime" style="margin-left: 5px; font-size: 16px" /></div>
				<div class="button-group">
					<div class="cancel" @click="cancelOrder">取消订单</div>
					<div class="confirm" @click="toPay">立即支付</div>
				</div>
			</div>
			<div v-else style="font-size: 18px; font-weight: bold; line-height: 3; border-radius: 15px; text-align: center; background-color: #fff">已取消</div>
			<div class="order-info">
				<CoffeeList title="武汉金融港店" :listInfo="coffeeList" :total="total"></CoffeeList>
			</div>
			<div class="shippingInformation">
				<span class="title">配送信息</span>
				<ul class="shippingList">
					<li class="time">
						<span>配送时间</span>
						<span>{{ getTime }}</span>
					</li>
					<li class="address">
						<span>配送地址</span>
						<span>{{ addressInfo.address }}</span>
					</li>
				</ul>
			</div>
			<div class="orderInformation">
				<span class="title">订单信息</span>
				<ul class="orderList">
					<li class="order-number">
						<span>订单编号</span>
						<span></span>
					</li>
					<li class="placeAnOrder-time">
						<span>下单时间</span>
						<span>{{ orderTime }}</span>
					</li>
					<li class="remarks">
						<span>备注信息</span>
						<span>{{ remarks }}</span>
					</li>
				</ul>
			</div>
		</div>
	</page-view>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import CoffeeList from "@/components/CoffeeList.vue";
import api from "@/api";
const router = useRouter();
const route = useRoute();
const store = useStore();
const coffeeList = JSON.parse(route.query.coffeeList);
const total = Number(route.query.total);
const addressInfo = store.state.currentAddress;

const getTime = computed(() => {
	let time1 = Date.now();
	time1 = time1 + 1000 * 60 * 30;
	return new Date(time1).toLocaleString();
});
const remarks = ref("无");
const orderTime = route.query.time;
if (route.query.remarks !== "") remarks.value = route.query.remarks;

const CountDownTime = ref(10 * 60 * 1000);

//取消订单
let toBePaid = ref(true);
const foodList = reactive([]);
const cancelOrder = async () => {
	toBePaid.value = false;
	coffeeList.forEach(item => {
		foodList.push({ fid: item.fid, price: item.checkPrice, count: item.count, state: 1 });
	});
	await api.orderInfo.add({ aid: store.state.currentAddress.id, foodList: foodList });
	coffeeList.forEach(async item => {
		await api.shopCart.delete(item.id);
	});
};

//支付
const toPay = async () => {
	coffeeList.forEach(item => {
		foodList.push({ fid: item.fid, price: item.checkPrice, count: item.count, state: 2 });
	});
	await api.orderInfo.add({ aid: store.state.currentAddress.id, foodList: foodList });
	router.push({ name: "order" });
	coffeeList.forEach(async item => {
		await api.shopCart.delete(item.id);
	});
};

//直接退出
const generateOrder = async () => {
	coffeeList.forEach(item => {
		foodList.push({ fid: item.fid, price: item.checkPrice, count: item.count, state: 1 });
	});
	await api.orderInfo.add({ aid: store.state.currentAddress.id, foodList: foodList });
	coffeeList.forEach(async item => {
		await api.shopCart.delete(item.id);
	});
};
</script>

<style lang="scss" scoped>
.order-detail {
	.order-detail-content {
		flex: 1;
		background-color: #f5f5f5;
		padding: 10px;
		box-sizing: border-box;
		.toBePaid {
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #fff;
			border-radius: 15px;
			.title {
				font-size: 18px;
				font-weight: bold;
				padding: 10px 0;
			}
			.time {
				font-size: 16px;
				padding-bottom: 10px;
				display: flex;
				align-items: center;
			}
			.button-group {
				display: flex;
				padding: 10px 0;
				.cancel {
					border-radius: 5px;
					border: 1px solid $default;
					padding: 5px 8px;
					margin-right: 8px;
				}
				.confirm {
					border-radius: 3px;
					padding: 5px 8px;
					background-color: $primary;
					color: #fff;
				}
			}
		}
		.shippingInformation,
		.orderInformation {
			margin: 15px 0;
			background-color: #fff;
			border-radius: 15px;
			padding: 10px;
			.title {
				font-size: 16px;
				font-weight: bold;
				line-height: 1.8;
			}
			.shippingList,
			.orderList {
				li {
					line-height: 1.8;
					display: flex;
					span {
						&:first-child {
							color: $default;
						}
						&:last-child {
							text-align: right;
							flex: 1;
						}
					}
				}
			}
		}
	}
}
</style>
