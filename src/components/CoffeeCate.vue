<template>
	<div class="coffee-item">
		<div class="title">{{ title }}</div>
		<ul class="coffeeList" v-if="coffeeListItem.length > 0">
			<li v-for="item in coffeeListItem" :key="item.id" @click="showPopup(item)">
				<div class="img-box">
					<img v-lazy="item.food_img" alt="" />
				</div>
				<div class="coffee-info">
					<div class="name">{{ item.food_name }}</div>
					<div class="desc">{{ item.food_desc }}</div>
					<div class="bottom">
						<div class="price">
							<span class="discount">￥{{ discount(item.food_price[0]) }}</span>
							<span class="originalPrice">￥{{ item.food_price[0] }}</span>
						</div>
						<div class="add">选规格</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<script setup>
import api from "@/api/index";
import { ref, reactive, inject, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const baseUrl = inject("baseUrl");
const router = useRouter();
const store = useStore();
let props = defineProps({
	cateId: {
		type: Number,
		require: true,
	},
	title: {
		type: String,
	},
});
let emits = defineEmits(["showPopupCoffeeItem"]);

let coffeeListItem = reactive([]);
const getCoffeeList = async () => {
	let res = await api.coffee.findByCateId(props.cateId);
	res.forEach(item => {
		item.food_img = baseUrl + item.food_img;
		item.food_price = item.price.split(",");
		item.price = item.price.split(",");
		item.capacity = item.capacity.split(",");
		coffeeListItem.push(item);
	});
};
getCoffeeList();
const discount = computed(() => {
	return price => (price * 0.7).toFixed(1);
});

const showPopup = item => {
	emits("showPopupCoffeeItem", item);
};
</script>

<style lang="scss" scoped>
.coffee-item {
	.title {
		font-size: 12px;
		color: $default;
		background-color: #fff;
	}
	.coffeeList {
		> li {
			display: flex;
			justify-content: space-between;
			margin-bottom: 30px;
			.img-box {
				width: 80px;
				height: 80px;
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			.coffee-info {
				display: flex;
				flex: 1;
				box-sizing: border-box;
				padding: 0 5px;
				flex-direction: column;
				justify-content: space-between;
				.name {
					font-size: 16px;
					font-weight: bold;
				}
				.desc {
					display: -webkit-box;
					overflow: hidden;
					font-size: 12px;
					color: $default;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					text-overflow: ellipsis;
				}
			}
			.bottom {
				display: flex;
				justify-content: space-between;
				.price {
					.discount {
						font-size: 16px;
						font-weight: bold;
					}
					.originalPrice {
						font-size: 12px;
						color: $default;
						text-decoration: line-through;
					}
				}
				.add {
					background-color: $primary;
					padding: 3px 7px;
					color: #fff;
					border-radius: 5px;
				}
			}
		}
	}
}
</style>
