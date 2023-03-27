<template>
	<div class="coffeeList">
		<div class="title" v-if="title">{{ title }}</div>
		<div class="list" v-if="listInfo.length > 0">
			<van-card v-for="(item, index) in listInfo" :key="index" :desc="item.capacity + ',' + item.temperature" :title="item.food_name" :thumb="item.food_img">
				<template #num>
					<span style="font-size: 12px; color: #999; margin-right: 5px">￥{{ item.checkPrice * item.count }}</span>
					<span style="font-size: 16px; color: #000">￥{{ (item.checkPrice * item.count * 0.7).toFixed(1) }}</span>
				</template>
				<template #price>
					<span style="color: #999; font-size: 12px">X{{ item.count }}</span>
				</template>
			</van-card>
		</div>
		<div class="finalPrice">
			<span style="margin-right: 5px">共优惠{{ (total - total * 0.7).toFixed(1) }}</span>
			<span
				>合计￥<span style="font-size: 18px; font-weight: 500">{{ (total * 0.7).toFixed(1) }}</span></span
			>
		</div>
	</div>
</template>

<script setup>
let props = defineProps({
	title: {
		type: String,
	},
	listInfo: {
		type: Array,
		require: true,
	},
	total: {
		type: Number,
	},
});
</script>

<style lang="scss" scoped>
.coffeeList {
	background-color: #fff;
	margin-top: 20px;
	border-radius: 15px;
	.title {
		padding: 10px;
		font-size: 16px;
		color: $default;
	}
	.finalPrice {
		display: flex;
		justify-content: flex-end;
		box-sizing: border-box;
		padding: 10px 5px;
	}
}

::v-deep(.van-card) {
	background-color: #fff;
}
</style>
