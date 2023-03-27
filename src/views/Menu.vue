<template>
	<page-view class="menu">
		<page-header title="点单"></page-header>
		<div class="menu-content" @scroll="contentScroll($event)" ref="content">
			<div class="recommend" ref="recommend">
				<div class="title">商家推荐</div>
				<ul class="recommend-list" v-if="recommendList.length > 0">
					<li class="recommend-item" v-for="item in recommendList" :key="item.id" @click="showPopup(item)">
						<div class="img-box">
							<img v-lazy="item.food_img" alt="" />
						</div>
						<div class="name">{{ item.food_name }}</div>
						<div class="bottom">
							<div class="price">
								<span class="discount">￥{{ discount(item.food_price[0]) }}</span>
								<span class="originalPrice">￥{{ item.food_price[0] }}</span>
							</div>
							<van-icon name="add" class="add" />
						</div>
					</li>
				</ul>
			</div>

			<div class="menu-list">
				<van-tabs v-model:active="topActive" sticky :offset-top="45" line-width="20" :animated="true" color="#009341" title-active-color="black" style="z-index: 100">
					<van-tab title="经典菜单">
						<van-sidebar ref="left" @change="onChange" v-model="rightActive" v-if="cateList.length > 0">
							<van-sidebar-item v-for="item in cateList" :key="item.id" :title="item.category_name" class="rightItem">
								<template #title>
									<span
										class="iconfont"
										:class="item.icon"
										:style="{
											color: '#fcb4c7',
											fontSize: '24px',
										}"
									></span>
									<span>{{ item.category_name }}</span>
								</template>
							</van-sidebar-item>
						</van-sidebar>
						<div class="cateItem" ref="cateItem" @scroll="scrollItem($event)">
							<CoffeeCate v-for="item in cateList" :key="item.id" :cateId="item.id" :title="item.category_name" @showPopupCoffeeItem="showPopupCoffeeItem"></CoffeeCate>
						</div>
					</van-tab>
					<van-tab title="热销排行">
						<ul class="coffeeList" v-if="popularity.length > 0">
							<li v-for="item in popularity" :key="item.id" @click="showPopup(item)">
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
					</van-tab>
					<van-tab title="人气推荐"
						><ul class="coffeeList" v-if="recommendList.length > 0">
							<li v-for="item in recommendList" :key="item.id" @click="showPopup(item)">
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
						</ul></van-tab
					>
				</van-tabs>
			</div>

			<div class="settlement-btn" v-if="num > 0">
				<div class="left" @click="showPopupShopCart">
					<van-badge :content="num">
						<van-icon name="bag-o" color="#fff" size="32" />
					</van-badge>
					<div class="price">
						<span class="estimate"> <span>预估</span> ￥{{ estimateTotal }}</span>
						<span class="originalPrice"> ￥{{ originalPriceTotal }}</span>
					</div>
				</div>
				<div class="right" @click="toOrder"><van-button> 去结算 </van-button></div>
			</div>
		</div>
	</page-view>
	<van-popup v-model:show="showBottom" position="bottom" :style="{ height: '80%', borderRadius: '15px 15px 0 0' }">
		<OrderInfo @addShopCart="addShopCart" :item="itemInfo" v-if="showBottom" @getShopCartInfoEmits="getShopCartInfoEmits"></OrderInfo>
	</van-popup>
	<van-popup v-model:show="showShopCart" position="bottom" :style="{ height: 'fit-content', borderRadius: '15px 15px 0 0' }" z-index="300">
		<div class="shopList" v-if="coffeeItemList.length > 0">
			<div class="title">已享受折扣优惠，共减免<span></span></div>
			<div class="selectAll">
				<!-- <van-checkbox checked-color="#009342" v-model="checkedAll" @click="checkedAllHandler">全选</van-checkbox> -->
				<span @click="clearShopCart"><van-icon name="delete-o" />清空</span>
			</div>
			<div class="shop-item" v-for="item in coffeeItemList" :key="item.id">
				<!-- <div class="check-box">
					<van-checkbox checked-color="#009342" v-model="item.isCheck" @click="checkedHandler(item.id, item.isCheck)"></van-checkbox>
				</div> -->
				<div class="info">
					<div class="left">
						<div class="img-box">
							<img v-lazy="item.food_img" alt="" />
						</div>
						<div class="shop-info">
							<div class="name">{{ item.food_name }}</div>
							<div class="capacity">{{ item.capacity }}ml,{{ item.temperature }}</div>
							<div class="price">
								<span>￥{{ (item.checkPrice * 0.7).toFixed(1) }}</span>
								<span> ￥{{ item.checkPrice }} </span>
							</div>
						</div>
					</div>
					<div class="right">
						<van-stepper button-size="20px" theme="round" min="0" v-model="item.count" @plus="shopCountPlus(item.id, item.count + 1)" @minus="shopCountMinus(item.id, item.count - 1, item)" />
					</div>
				</div>
			</div>
		</div>
		<div style="height: 130px"></div>
	</van-popup>
</template>

<script setup>
import api from "@/api/index";
import { ref, reactive, inject, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { showToast } from "vant";
import CoffeeCate from "../components/CoffeeCate.vue";
import OrderInfo from "../components/OrderInfo.vue";
const baseUrl = inject("baseUrl");
const bannerList = reactive([]);
const router = useRouter();
const recommendList = reactive([]);
const getRecommendList = async () => {
	let res = await api.coffee.getRecommendGoods();

	res.forEach(item => {
		item.food_img = baseUrl + item.food_img;
		item.food_price = item.price.split(",");
		item.capacity = item.capacity.split(",");
		recommendList.push(item);
	});
};
getRecommendList();

const discount = computed(() => {
	return price => (price * 0.7).toFixed(1);
});

//菜单模块
const topActive = ref(0);
const rightActive = ref(0);
const recommend = ref(null);
const cateItem = ref(null);
const left = ref(null);
const content = ref(null);

const onChange = () => {
	let arr = Array.from(cateItem.value.children).map(item => item.clientHeight);
	cateItem.value.style = "overflow: auto; height: 800px";
	content.value.scrollTop = recommend.value.clientHeight;

	cateItem.value.scrollTop = totalHeight(arr, rightActive.value);
	// console.log(cateItem.value.scrollTop);
};
const contentScroll = e => {
	if (e.target.scrollTop >= recommend.value.clientHeight) {
		cateItem.value.style = "overflow: auto; height: 800px";
	} else {
		cateItem.value.style = "overflow: unset; height: unset";
	}
};
const totalHeight = (arr, num) => {
	if (num == 0) return 0;
	else return arr.slice(0, num).reduce((pre, cur) => pre + cur) + 30 * num;
};

const scrollItem = e => {
	let arr = Array.from(cateItem.value.children).map(item => item.clientHeight);
	arr.forEach((item, index) => {
		if (e.target.scrollTop > totalHeight(arr, index)) {
			rightActive.value = index;
		}
	});
};
//获取分类
const cateList = reactive([]);
const getCategoryAll = async () => {
	let res = await api.category.findAll();
	res.forEach(item => {
		cateList.push(item);
	});
};
getCategoryAll();

//底部弹出模块
const itemInfo = ref("");
const showBottom = ref(false);
const showPopup = item => {
	showBottom.value = true;
	// console.log(item);
	itemInfo.value = item;
};

const showPopupCoffeeItem = item => {
	showBottom.value = true;
	itemInfo.value = item;
	// console.log(itemInfo.value);
};
//购买列表信息
const estimateTotal = ref(0);
const originalPriceTotal = ref(0);
const num = ref(0);
const getTotal = async () => {
	let res = await api.shopCart.findAllByUid();
	num.value = res[0].totalCount;
	originalPriceTotal.value = res[0].price;
	estimateTotal.value = (res[0].price * 0.7).toFixed(1);
};
getTotal();
const addShopCart = async () => {
	showBottom.value = false;
	getTotal();
};

//购物车列表
const coffeeItemList = reactive([]);
const showShopCart = ref(false);
const pageIndex = ref(1);

const getShopCartInfo = async () => {
	let res = await api.shopCart.findByUid(pageIndex.value);
	// console.log(res, "xxxx");
	res.list.forEach(item => {
		item.food_img = baseUrl + item.food_img;
		coffeeItemList.push(item);
	});
};
getShopCartInfo();
const showPopupShopCart = async () => {
	if (!showShopCart.value) {
		showShopCart.value = true;
		coffeeItemList.length = 0;
		getShopCartInfo();
	} else {
		showShopCart.value = false;
	}
};

//全选

// const checkedAll = ref(true);

// const checkedAllHandler = () => {
// 	coffeeItemList.forEach(item => {
// 		if (checkedAll.value) item.isCheck = 1;
// 		else item.isCheck = 0;
// 	});
// };

// const checkedHandler = async () => {
// 	checkedAll.value = coffeeItemList.every(item => item.isCheck == 1);
// };

//数量加减
const shopCountPlus = async (id, count) => {
	await api.shopCart.edit(id, count);
	getTotal();
};
const shopCountMinus = async (id, count) => {
	if (count != 0) {
		await api.shopCart.edit(id, count);
		getTotal();
	} else {
		await api.shopCart.delete(id);
		coffeeItemList.forEach(item => {
			if (item.id == id) {
				let index = coffeeItemList.indexOf(item);
				if (index !== -1) coffeeItemList.splice(index, 1);
			}
		});
		if (coffeeItemList.length == 0) showShopCart.value = false;
		getTotal();
	}
};

//结算
const toOrder = async () => {
	router.push({ name: "checkOrder", query: { coffeeItemList: JSON.stringify(coffeeItemList) } });
};

const getShopCartInfoEmits = () => {
	coffeeItemList.length = 0;
	getShopCartInfo();
};

//清空购物车
const clearShopCart = () => {
	coffeeItemList.forEach(async item => {
		await api.shopCart.delete(item.id);
		showShopCart.value = false;
		num.value = 0;
	});
};

//热销
const popularity = reactive([]);
const getPopularity = async () => {
	let res = await api.coffee.getPopularity();
	res.forEach(item => {
		item.food_img = baseUrl + item.food_img;
		item.food_price = item.price.split(",");
		item.price = item.price.split(",");
		item.capacity = item.capacity.split(",");
		popularity.push(item);
	});
	// console.log(popularity);
};
getPopularity();
</script>

<style lang="scss" scoped>
.menu {
	.menu-content {
		margin-bottom: 60px;
		flex: 1;
		overflow: auto;

		.recommend {
			.title {
				font-size: 16px;
				font-weight: bold;
			}
			.recommend-list {
				display: flex;
				overflow: auto;
				box-sizing: border-box;
				padding: 10px 0;
				height: 210px;
				.recommend-item {
					flex-direction: column;
					justify-content: space-between;
					margin: 7px;
					display: flex;

					.img-box {
						width: 120px;
						height: 120px;
						img {
							width: 100%;
							height: 100%;
							object-fit: cover;
						}
					}
					.bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.price {
							.discount {
								color: red;
								font-weight: bold;
							}
							.originalPrice {
								color: $default;
								font-size: 12px;
								text-decoration: line-through;
							}
						}

						.add {
							color: $primary;
							font-size: 24px;
						}
					}
				}
			}
		}
		.menu-list {
			.coffeeList {
				background-color: #f6f6f6;
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				> li {
					display: flex;
					flex-direction: column;
					width: 45%;
					margin: 2.5%;
					background-color: #fff;

					.img-box {
						width: 150px;
						margin: 5%;
						height: 145px;
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
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
							text-overflow: ellipsis;
						}
					}
					.bottom {
						margin-top: 15px;
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
			.cateItem {
				width: 280px;
			}
		}

		.settlement-btn {
			position: fixed;
			z-index: 666;
			bottom: 80px;
			left: 0;
			width: 90%;
			margin-left: 5%;
			height: 50px;
			border-radius: 50px;
			background-color: #323232;
			display: flex;
			justify-content: space-between;
			overflow: hidden;
			.left {
				margin-left: 25px;
				display: flex;
				align-items: center;
				.price {
					color: #fff;
					margin-left: 15px;
					.estimate {
						font-size: 16px;
						span {
							font-size: 12px;
						}
					}
					.originalPrice {
						font-size: 12px;
						text-decoration: line-through;
						margin-left: 5px;
						color: $default;
					}
				}
			}
			.right {
				color: #fff;
				button {
					height: 100%;
					background-color: $primary;
					border: none;
					outline: none;
					font-size: 16px;
					color: #fff;
				}
			}
		}
	}
}

.shopList {
	box-sizing: border-box;
	.title {
		background-color: #fff7e1;
		text-align: center;
		line-height: 1.8;
		font-size: 12px;
		span {
			color: #ff8f0f;
		}
	}
	.selectAll {
		display: flex;
		justify-content: flex-end;
		line-height: 2;
		padding: 0 10px;
		box-sizing: border-box;
		background-color: #f2f2f2;
		span {
			color: $default;
			font-size: 12px;
			line-height: 2;
		}
	}
	.shop-item {
		display: flex;
		align-items: center;
		margin: 10px;
		.check-box {
			width: 20px;
		}
		.info {
			display: flex;
			flex: 1;
			justify-content: space-between;
			align-items: center;
			.left {
				display: flex;
				.img-box {
					width: 50px;
					height: 50px;
					margin: 0 10px;
					img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
				.shop-info {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.name {
						font-size: 16px;
						font-weight: bold;
					}
					.capacity {
						font-size: 12px;
						color: $default;
					}
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
				}
			}
			.right {
				align-self: flex-end;
				color: $primary;
			}
		}
	}
}
::v-deep(.van-sidebar-item.van-sidebar-item--select)::before {
	background-color: #fff;
}
::v-deep(.van-badge__wrapper.van-sidebar-item__text) {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

::v-deep(.van-tab__panel) {
	display: flex;
	justify-content: space-between;
}

::v-deep(.van-stepper__plus.van-haptics-feedback) {
	background-color: $primary;
}

::v-deep(.van-stepper__minus.van-stepper) {
	color: $primary;
}
</style>
