<template>
	<div id="app">
		<router-view v-slot="{ Component }">
			<transition :name="transitionName">
				<keep-alive exclude="CheckOrder,Address,AddAddress,EditAddress,OrderDetail">
					<component :is="Component"></component>
				</keep-alive>
			</transition>
		</router-view>
	</div>
</template>
<script setup>
import { ref, watch, provide } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
let transitionName = ref("slide");
let currentIndex = route.meta.index;
watch(route, () => {
	transitionName.value = currentIndex < route.meta.index ? "left" : "right";
	currentIndex = route.meta.index;
});
document.addEventListener("contextmenu", e => e.preventDefault());
provide("baseUrl", "http://127.0.0.1:3000");
</script>
<style lang="scss" scoped>
#app {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
.left-enter-from {
	transform: translateX(100%);
}

.left-leave-to {
	transform: translateX(0%);
}
.left-enter-active,
.left-leave-active {
	transition: all 200ms;
	position: absolute;
	width: 100%;
	height: 100%;
}
.right-enter-from {
	transform: translateX(-100%);
}

.right-leave-to {
	transform: translateX(0%);
}
.right-enter-active,
.right-leave-active {
	transition: all 200ms;
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>
