<template>
	<view class="success-page">
		<view class="success-icon">
			<text class="iconfont">✓</text>
		</view>
		<view class="success-title">下单成功</view>
		<view class="success-info">感谢您的购买，我们会尽快为您发货</view>
		<view class="action-buttons">
			<button class="view-order" @click="viewOrder">查看订单</button>
			<button class="continue-shopping" @click="continueShopping">继续购物</button>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			viewOrder() {
				uni.navigateTo({
					url: '/pages/order/orderlist',
					success: () => {
						console.log('Successfully navigated to order list')
					},
					fail: (err) => {
						console.error('Navigation failed:', err)
					}
				})
			},
			continueShopping() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.success-page {
		min-height: 100vh;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 200rpx;
	}

	.success-icon {
		width: 160rpx;
		height: 160rpx;
		background: #52c41a;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 40rpx;

		.iconfont {
			color: #fff;
			font-size: 80rpx;
		}
	}

	.success-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.success-info {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 60rpx;
	}

	.action-buttons {
		display: flex;
		gap: 30rpx;

		button {
			width: 240rpx;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 40rpx;
			font-size: 28rpx;
			font-weight: normal;
		}

		.view-order {
			background: #fff;
			color: #333;
			border: 2rpx solid #ddd;
		}

		.continue-shopping {
			background: #333;
			color: #fff;
		}
	}
</style> 