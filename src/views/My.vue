<template>
	<page-view class="my">
		<page-header title="我的"></page-header>
		<div class="box">
			<div class="bg" style="display: flex; justify-content: center; background-color: #e6e6e6">
				<img src="../assets/image/header.png" alt="" />
			</div>
			<div class="my-content">
				<UserInfo style="transform: translateY(-50%)"></UserInfo>
				<div class="assets">
					<div class="title">我的资产</div>
					<ul class="list">
						<li><span class="iconfont">&#xe649;</span><span>积分</span></li>
						<li><span class="iconfont">&#xe602;;</span><span>优惠券</span></li>
						<li><span class="iconfont">&#xe636;</span><span>余额</span></li>
						<li><span class="iconfont gift">&#xe686;</span><span>礼品卡</span></li>
					</ul>
				</div>
				<div class="function">
					<div class="title">我的功能</div>
					<ul class="list">
						<li><span class="iconfont">&#xfab3;</span><span>积分兑换</span></li>
						<li><span class="iconfont">&#xe667;</span><span>卡卷兑换</span></li>
						<li><span class="iconfont">&#xe60f;</span><span>会员储值</span></li>
						<li><span class="iconfont">&#xe63c;</span><span>我的地址</span></li>
						<li><span class="iconfont">&#xe605;</span><span>领4.8折券</span></li>
						<li><span class="iconfont">&#xe88f;</span><span>练习客服</span></li>
						<li><span class="iconfont">&#xe608;</span><span>用户协议</span></li>
						<li><span class="iconfont">&#xe789;</span><span>隐私条款</span></li>
					</ul>
				</div>
			</div>
		</div>
	</page-view>
</template>

<script setup>
import UserInfo from "@/components/UserInfo.vue";
</script>

<style lang="scss" scoped>
.my {
	.box {
		flex: 1;
		overflow: auto;
		margin-bottom: 60px;
		.my-content {
			background-color: #f7f7f7;
			padding: 0 10px;
			position: relative;
			.assets {
				background-color: #fff;
				border-radius: 15px;
				margin-top: -30px;
				padding: 10px;
				box-sizing: border-box;

				.title {
					font-size: 16px;
					font-weight: bold;
				}
				.list {
					display: flex;
					flex-wrap: wrap;

					li {
						width: 33.33%;
						height: 45px;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						span {
							font-size: 16px;
							font-weight: bold;
						}
						.iconfont {
							font-size: 18px;
						}
						.gift {
							color: #feb236;
						}
					}
				}
			}
			.function {
				background-color: #fff;
				border-radius: 15px;
				margin-top: 20px;
				padding: 10px;
				box-sizing: border-box;
				.title {
					font-size: 16px;
					font-weight: bold;
					margin-bottom: 15px;
				}
				.list {
					display: flex;
					flex-wrap: wrap;
					li {
						width: 25%;
						height: 65px;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-around;
						.iconfont {
							font-size: 22px;
						}
					}
				}
			}
		}
	}
}
</style>
