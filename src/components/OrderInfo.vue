<template>
	<div class="orderInfo">
		<div class="content">
			<div class="img-box">
				<img v-lazy="item.food_img" alt="" />
			</div>
			<div class="coffee-info">
				<div class="name">{{ item.food_name }}</div>
				<div class="desc">{{ item.food_desc }}</div>
			</div>
			<div class="coffee-type">
				<div class="cup-shaped">
					<span>杯型</span>
					<van-radio-group ref="checkBox" v-model="checked" class="tag-group">
						<van-radio class="tag" v-for="(capa, index) in item.capacity" @click="checkedValue" :key="index" :name="index">
							<span class="capa">{{ capa }}ml</span>
							<span class="price">￥{{ item.food_price[index] }}</span>
						</van-radio>
					</van-radio-group>
					<!-- <div class="tag-group">
						<div class="tag" v-for="(capa, index) in item.capacity" :key="index">{{ capa }}ml ￥{{ item.food_price[index] }}</div>
					</div> -->
				</div>
				<div class="temperature">
					<span>温度</span>
					<van-radio-group ref="checkBox2" v-model="checked2" class="tag-group">
						<van-radio class="tag" @click="checkedTemperature" name="0">正常冰</van-radio>
						<van-radio class="tag" @click="checkedTemperature" name="1">少冰(人气)</van-radio>
						<van-radio class="tag" @click="checkedTemperature" name="2">热</van-radio>
					</van-radio-group>
				</div>
			</div>
		</div>
		<div class="shop-cart">
			<div class="priceInfo">
				<div class="left">
					<div class="price">
						<span>￥{{ (buyInfo.price * 0.7).toFixed(1) }}</span>
						<span> ￥{{ buyInfo.price }} </span>
					</div>
					<div class="capacity">{{ buyInfo.capacity }}ml,{{ buyInfo.temperature }}</div>
				</div>
				<div class="right"><van-stepper v-model="stepper" /></div>
			</div>
			<div class="button-group">
				<van-button plain type="success" class="buyNow">立即购买</van-button>
				<van-button type="success" @click="addShopCart">加入购物袋</van-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";
let props = defineProps({
	item: {
		type: Object,
	},
});
let emits = defineEmits(["addShopCart", "getShopCartInfoEmits"]);
const buyInfo = reactive({
	id: props.item.id,
	price: "",
	capacity: "",
	temperature: "",
});
const checked = ref(0);
const checked2 = ref(0);
const checkBox = ref(null);
const checkBox2 = ref(null);
const stepper = ref(1);
let arr;
onMounted(() => {
	arr = Array.from(checkBox2.value.$el.children);
	checkBox.value.$el.children[0].classList.add("activeCheck");
	checkBox2.value.$el.children[0].classList.add("activeCheck");
	buyInfo.capacity = props.item.capacity[checked.value];
	buyInfo.price = props.item.food_price[checked.value];
	buyInfo.temperature = arr[checked2.value].innerText;
});
const checkedValue = () => {
	Array.from(checkBox.value.$el.children).forEach((item, index, arr) => {
		buyInfo.capacity = props.item.capacity[checked.value];
		buyInfo.price = props.item.food_price[checked.value];
		item.classList.remove("activeCheck");
		arr[checked.value].classList.add("activeCheck");
	});
};

const checkedTemperature = () => {
	arr.forEach((item, index, arr) => {
		buyInfo.temperature = arr[checked2.value].innerText;
		item.classList.remove("activeCheck");
		arr[checked2.value].classList.add("activeCheck");
	});
};

const addShopCart = async () => {
	await api.shopCart.add({ fid: props.item.id, count: stepper.value, checkPrice: buyInfo.price, temperature: buyInfo.temperature, capacity: buyInfo.capacity });
	emits("getShopCartInfoEmits");
	emits("addShopCart");
};
</script>

<style lang="scss" scoped>
.orderInfo {
	display: flex;
	flex-direction: column;
	> .content {
		flex: 1;
		overflow: auto;
		margin-bottom: 120px;
		> .img-box {
			width: 100%;
			height: 150px;
			background-color: #f4e8da;
			img {
				width: 100%;
				height: 100%;
				object-fit: contain;
			}
		}
		.coffee-info {
			padding: 0 15px;
			box-sizing: border-box;
			margin-top: 10px;
			.name {
				font-size: 16px;
				font-weight: bold;
			}
			.desc {
				font-size: 12px;
				color: $default;
				line-height: 1.6;
				padding: 15px 0;
				border-bottom: 1px solid $default;
			}
		}
		.coffee-type {
			margin-top: 20px;
			padding: 0 15px;
			box-sizing: border-box;
			.cup-shaped,
			.temperature {
				.tag-group {
					margin: 10px 0;
					display: flex;

					.tag {
						margin-right: 10px;
						padding: 8px;
						box-sizing: border-box;
						background-color: #f8f8f8;
						border-radius: 10px;
						font-size: 12px;
						&:last-child {
							margin-left: unset;
						}
					}
				}
			}
		}
	}
	.shop-cart {
		padding: 0 15px;
		box-sizing: border-box;
		height: 120px;
		width: 100%;
		box-shadow: 0 0 5px #ccc;
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		.priceInfo {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.left {
				.price {
					span {
						&:first-child {
							font-weight: bold;
							font-size: 16px;
						}
						&:last-child {
							font-size: 12px;
							text-decoration: line-through;
							color: $default;
						}
					}
				}
				.capacity {
					color: $default;
					font-size: 12px;
				}
			}
			.right {
				> .van-stepper {
					border-radius: 20px;
					overflow: hidden;
				}
			}
		}
		.button-group {
			display: flex;
			> button {
				flex: 1;
				border-radius: 45px;
				&:first-child {
					margin-right: 10px;
				}
			}
		}
	}
}

.activeCheck {
	background-color: $primary !important;
	color: #fff;
}

::v-deep(.van-radio__label) {
	color: unset;
	margin-left: unset;
}
::v-deep(.van-radio__icon.van-radio__icon--round) {
	display: none;
}
</style>
