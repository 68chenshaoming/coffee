<template>
	<page-view>
		<router-view v-slot="{ Component }">
			<component :is="Component"></component>
		</router-view>
		<div class="footer">
			<router-link to="/main/home" class="nav-i">
				<div class="iconfont icon">&#xe64f;</div>
				<span>首页</span>
			</router-link>
			<router-link to="/main/menu" class="nav-i">
				<div class="iconfont icon">&#xe80f;</div>
				<span>点单</span>
			</router-link>
			<router-link to="/main/order" class="nav-i">
				<div class="iconfont icon">&#xe789;</div>
				<span>订单</span>
			</router-link>
			<router-link to="/main/my" class="nav-i">
				<div class="iconfont icon">&#xe601;</div>
				<span>我的</span>
			</router-link>
		</div>
	</page-view>
</template>
<script setup>
document.addEventListener("contextmenu", e => e.preventDefault());
</script>
<style lang="scss" scoped>
.footer {
	display: flex;
	position: fixed;
	background-color: #fff;
	z-index: 999;
	bottom: 0;
	width: 100%;
	align-items: center;
	justify-content: space-around;
	border-top: 1px solid #ccc;

	.nav-i {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 59px;
		&:hover {
			text-decoration: none;
			color: unset;
		}
		.iconfont {
			color: $default;
			font-size: 24px;
		}
		> span {
			font-size: 12px;
		}
	}
	.router-link-active {
		color: $active;
		text-decoration: none;

		> .iconfont {
			color: $active;
		}
	}
}
</style>
