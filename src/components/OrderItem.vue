<template>
	<div class="order-item">
		<div class="title">武汉金融股店</div>
		<div class="order-box">
			<div class="left">
				<div class="left-list" v-for="coffee in coffeeList" :key="coffee.id">
					<img v-lazy="coffee.food_img" alt="" />
					<span>{{ coffee.food_name }}</span>
				</div>
			</div>
			<div class="right">
				<div class="price">￥{{ ((item.order_money / 100) * 0.7).toFixed(1) }}</div>
				<div class="piece">共{{ totalPiece }}件</div>
				<div class="stateInfo">
					<span v-if="state == 2">已完成</span>
					<span v-else>已取消</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import api from "@/api";
import { reactive, ref, inject, onMounted } from "vue";
const baseUrl = inject("baseUrl");
const props = defineProps({
	item: {
		type: Object,
		require: true,
	},
});
const state = ref(0);
const totalPiece = ref(0);
state.value = props.item.orderDetailList[0].state;

const coffeeList = reactive([]);
const getCoffeeInfo = () => {
	let arr = props.item.orderDetailList.map(item => {
		totalPiece.value += +item.count;
		return item.fid;
	});
	arr.forEach(async item2 => {
		let res = await api.coffee.findById(item2);
		res[0].food_img = baseUrl + res[0].food_img;
		coffeeList.push(res[0]);
	});
};
getCoffeeInfo();
</script>

<style lang="scss" scoped>
.order-item {
	background-color: #fff;
	margin-top: 10px;
	border-radius: 10px;
	.order-box {
		height: 120px;
		position: relative;
		.left {
			height: 100%;
			display: flex;
			.left-list {
				margin-left: 8px;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				align-items: center;
				img {
					width: 80px;
					height: 80px;
					border-radius: 5px;
				}
			}
		}
		.right {
			height: 100%;
			position: absolute;
			top: 0;
			right: 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-end;
			padding-right: 10px;
			box-sizing: border-box;
			.price {
				font-weight: bold;
				font-size: 18px;
				margin-bottom: 5px;
			}
			.stateInfo {
				position: absolute;
				bottom: 5px;
				border: 1px solid #ccc;
				padding: 3px 5px;
				white-space: nowrap;
			}
		}
	}
}
</style>
