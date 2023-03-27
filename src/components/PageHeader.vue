<template>
	<div class="header">
		<div class="leftIcon iconfont" v-if="back" @click="backFn"><van-icon name="arrow-left" /></div>
		<div class="title">{{ title }}</div>
	</div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
defineProps({
	back: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: "首页",
	},
});
const emits = defineEmits(["generateOrder"]);

const backFn = () => {
	if (route.path == "/orderDetail") {
		emits("generateOrder");
		setTimeout(() => {
			router.back();
		}, 200);
	} else router.back();
};
</script>

<style lang="scss" scoped>
.header {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 45px;
	height: 45px;
	background-color: $primary;
	color: #fff;
	position: relative;
	.leftIcon {
		position: absolute;
		left: 10px;
	}
	.title {
		font-size: 20px;
	}
}
</style>
