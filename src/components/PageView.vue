<template>
	<div class="page-view">
		<slot></slot>
	</div>
</template>

<script setup></script>

<style lang="scss" scoped>
.page-view {
	width: 100vw;
	height: 100vh;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	overflow: auto;
}
</style>
