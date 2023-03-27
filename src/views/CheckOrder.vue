<template>
	<page-view>
		<page-header :back="true" title="确认订单"></page-header>
		<div class="content">
			<div class="top">
				<van-tabs v-model:active="active" class="pickUpMealsType" color="#e7e7e7" line-height="0" background="#ccc">
					<van-tab title="自取">
						<div class="address">
							<Map></Map>
						</div>
						<div class="time">
							<div class="makeAnAppointment">
								<span>预约时间</span>
								<span><span class="now">立即就餐</span><van-icon name="arrow" /></span>
							</div>
							<van-radio-group v-model="checked" direction="horizontal" checked-color="#009342" class="radioGroup">
								<van-radio name="1">店内用餐</van-radio>
								<van-radio name="2">外带</van-radio>
							</van-radio-group>
						</div>
						<CoffeeList :listInfo="coffeeList" :total="total"></CoffeeList>
						<div class="bottom-selfFetching">
							<div class="phoneInfo">
								<div>预留电话</div>
								<div class="phone">
									<van-field v-model="reservePhone" :placeholder="placeholder" input-align="right" @change="checkPhone()" />
									<div class="getPhone">获取号码</div>
								</div>
							</div>
							<div class="remarks" @click="showRemarksPopup">
								<span style="white-space: nowrap">备注</span>
								<van-field readonly v-model="message" placeholder="口味、偏好等要求" input-align="right" />
								<van-icon name="arrow" />
							</div>
						</div>
					</van-tab>
					<van-tab title="外卖">
						<div class="shipToAddress">
							<div class="choiceAddress" @click="toAddress">
								<div v-if="!isAddress" class="isAddressFalse"><span>请选择收货地址</span> <van-icon name="arrow" /></div>
								<div v-else class="isAddressTrue">
									<div class="addressName">
										<span>{{ addressInfo.addressName }}</span>
										<van-icon name="arrow" />
									</div>
									<div class="userInfo">{{ addressInfo.userName }}&nbsp;&nbsp;{{ addressInfo.userPhone }}</div>
								</div>
							</div>
							<div class="serviceTime">
								<span>送达时间</span>
								<span class="asSoonAsPossible">{{ serviceTime }}<van-icon name="arrow" /></span>
							</div>
						</div>
						<CoffeeList title="武汉金融港店" :listInfo="coffeeList" :total="total"></CoffeeList>
						<div class="bottom-selfFetching">
							<div class="remarks" @click="showRemarksPopup2">
								<span style="white-space: nowrap">备注</span>
								<van-field readonly v-model="message2" placeholder="点击选择无接触配送" input-align="right" />
								<van-icon name="arrow" />
							</div>

							<div class="tableware phone" style="display: flex; align-items: center">
								<span style="white-space: nowrap">餐具数量</span>
								<van-field readonly placeholder="未选择" input-align="right" />
								<van-icon name="arrow" />
							</div>
						</div>
					</van-tab>
				</van-tabs>
			</div>
		</div>
		<div class="bottom">
			<div class="left">
				<div class="totalPrice">
					<div class="total-top">
						<span>共{{ piece }}件</span>
						<span>
							合计:<span class="symbol">￥</span><span class="money"> {{ (total * 0.7).toFixed(1) }}</span></span
						>
					</div>
					<div class="total-bottom">
						共优惠<span class="symbol">￥</span>
						<span class="primaryColor" style="font-size: 16px">{{ (total - total * 0.7).toFixed(1) }}</span>
					</div>
				</div>
			</div>
			<div class="right" @click="submitPay">提交支付</div>
		</div>
		<van-popup v-model:show="showRemarks" position="bottom" :style="{ height: '35%', borderRadius: '15px 15px 0 0' }" style="display: flex; flex-direction: column; justify-content: space-between">
			<div class="textarea-box">
				<div class="title" style="font-size: 18px; font-weight: bold; text-align: center; margin-top: 20px">备注</div>
				<van-cell-group inset>
					<van-field v-model="message" rows="2" autosize type="textarea" maxlength="35" placeholder="请输入口味、偏好等要求" show-word-limit />
				</van-cell-group>
			</div>
			<van-button type="success" style="width: 90%; margin-left: 5%; font-size: 16px; border-radius: 15px" @click="showRemarks = false">确认</van-button>
		</van-popup>
		<van-popup v-model:show="showRemarks2" position="bottom" :style="{ height: '35%', borderRadius: '15px 15px 0 0' }" style="display: flex; flex-direction: column; justify-content: space-between">
			<div class="textarea-box">
				<div class="title" style="font-size: 18px; font-weight: bold; text-align: center; margin-top: 20px">备注</div>
				<van-cell-group inset>
					<van-field v-model="message2" rows="2" autosize type="textarea" maxlength="35" placeholder="请输入口味、偏好等要求" show-word-limit />
				</van-cell-group>
			</div>
			<van-button type="success" style="width: 90%; margin-left: 5%; font-size: 16px; border-radius: 15px" @click="showRemarks2 = false">确认</van-button>
		</van-popup>
	</page-view>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import CoffeeList from "@/components/CoffeeList.vue";
import Map from "@/components/Map.vue";
import { showToast, showConfirmDialog } from "vant";
import api from "@/api";
const router = useRouter();
const route = useRoute();
const store = useStore();
const reservePhone = ref("");
reservePhone.value = store.state.userInfo.user_phone;
const active = ref(0);
active.value = store.state.type;
const coffeeList = JSON.parse(route.query.coffeeItemList);
//获取时间
const Time = computed(() => {
	let time;
	let timeStamp = Date.now();
	timeStamp = timeStamp + 1000 * 60 * 30;
	let currentTime = new Date(timeStamp);
	let hour = currentTime.getHours();
	let minutes = currentTime.getMinutes();
	minutes = (minutes + "").padStart(2, "0");
	time = hour + ":" + minutes;
	return time;
});
const checked = ref("1");
let total = 0;
//件数
let piece = 0;
const getTotal = () => {
	coffeeList.forEach(item => {
		total += item.checkPrice * item.count;
		piece += item.count;
	});
};
getTotal();

const showRemarks = ref(false);
const showRemarks2 = ref(false);
const message = ref("");
const message2 = ref("");
const showRemarksPopup = () => {
	showRemarks.value = true;
};
const showRemarksPopup2 = () => {
	showRemarks2.value = true;
};

const placeholder = ref("请输入您预留的手机号");
const checkPhone = () => {
	if (reservePhone.value.trim() == "") return (placeholder.value = "手机号不能为空");
	const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
	if (!reg.test(reservePhone.value)) showToast("请输入正确的手机号!");
};

const toAddress = () => {
	router.push({ name: "address" });
};

onUnmounted(() => {
	store.commit("setType", active.value);
});
//送达时间
const serviceTime = ref("尽快送达");
//是否已有地址
const isAddress = ref(false);
let addressInfo = reactive({
	addressName: "",
	userName: "",
	userPhone: "",
});
const getAddress = () => {
	if (store.state.currentAddress) {
		isAddress.value = true;
		addressInfo.addressName = store.state.currentAddress.address;
		addressInfo.userName = store.state.currentAddress.name;
		addressInfo.userPhone = store.state.currentAddress.phone;
		serviceTime.value = `大约${Time.value}送达`;
	}
};
getAddress();
const foodList = reactive([]);
const submitPay = () => {
	//外送
	if (active.value == 1) {
		if (isAddress.value) {
			let time = computed(() => new Date().toLocaleString());
			showConfirmDialog({
				title: "确认支付",
				message: "如果解决方法是丑陋的，那就肯定还有更好的解决方法，只是还没有发现而已。",
			})
				.then(async () => {
					// on confirm
					coffeeList.forEach(item => {
						foodList.push({ fid: item.fid, price: item.checkPrice, count: item.count, state: 2 });
					});
					await api.orderInfo.add({ aid: store.state.currentAddress.id, foodList: foodList });
					router.push({ name: "order" });
					coffeeList.forEach(async item => {
						await api.shopCart.delete(item.id);
					});
				})
				.catch(async () => {
					// on cancel
					router.push({ name: "orderDetail", query: { coffeeList: JSON.stringify(coffeeList), total: total, time: time.value, remarks: message2.value } });
					// coffeeList.forEach(item => {
					// 	foodList.push({ fid: item.fid, price: item.checkPrice, count: item.count, state: 0 });
					// });
					// await api.orderInfo.add({ aid: store.state.currentAddress.id, foodList: foodList });
					// coffeeList.forEach(async item => {
					// 	await api.shopCart.delete(item.id);
					// });
				});
		} else {
			showToast("请选择地址");
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	display: flex;
	overflow: auto;
	box-sizing: border-box;
	padding: 20px 10px;
	background-color: #f7f7f7;
	margin-bottom: 5px;
	.top {
		width: 100%;
		.pickUpMealsType {
			background-color: #fff;
			margin-bottom: 10px;
			border-radius: 10px;
			overflow: hidden;
			.address {
				height: 200px;
			}
			.time {
				background-color: #fff;
				margin-bottom: 20px;
				.makeAnAppointment {
					margin: 10px 0;
					padding: 10px;
					box-sizing: border-box;
					display: flex;
					justify-content: space-between;

					span {
						color: #000;
						font-size: 16px;
						.now {
							color: $primary;
						}
					}
				}
			}
			.bottom-selfFetching {
				margin: 10px 0;
				.phoneInfo,
				.remarks {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 5px;
					.phone {
						display: flex;
						align-items: center;
						.getPhone {
							border: 1px solid $primary;
							padding: 5px;
							white-space: nowrap;
							box-sizing: border-box;
							height: fit-content;
						}
					}
				}
				.remarks {
					&:last-child {
						color: $default;
					}
				}
			}
		}
		.radioGroup {
			display: flex;
			> div {
				flex: 1;
				display: flex;
				justify-content: center;
				font-size: 16px;
			}
		}

		.shipToAddress {
			.choiceAddress {
				.isAddressFalse {
					display: flex;
					justify-content: space-between;
					padding: 10px;
					span {
						font-size: 16px;
						font-weight: bold;
					}
				}
				.isAddressTrue {
					padding: 10px;
					.addressName {
						display: flex;
						justify-content: space-between;
						font-size: 16px;
						font-weight: bold;
						margin-bottom: 10px;
					}
				}
			}
			.serviceTime {
				display: flex;
				justify-content: space-between;
				padding: 10px;
				.asSoonAsPossible {
					color: $primary;
					i {
						color: $default;
					}
				}
			}
		}
	}
}
.bottom {
	background-color: #fff;
	display: flex;
	position: fixed;
	bottom: 0;
	width: 100%;
	box-sizing: border-box;
	justify-content: space-between;
	padding: 10px;
	box-shadow: 0 0 5px #ccc;
	.left {
		.totalPrice {
			.total-top {
				span {
					&:first-child {
						margin-right: 5px;
					}
					&:last-child {
						.money {
							color: $primary;
							font-size: 18px;
						}
					}
				}
			}
		}
	}
	.right {
		color: #ccc;
		font-size: 18px;
		padding: 10px 15px;
		border-radius: 30px;
		background-color: $primary;
	}
}
.symbol {
	color: $primary;
	margin-right: unset;
}
.primaryColor {
	color: $primary;
}

::v-deep(.van-tab--active) {
	background-color: #fff;
}
</style>
