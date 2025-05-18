<template>
	<view class="membership-page">
		<view class="header">
			<text class="header-title">会员中心</text>
		</view>

		<view class="membership-status card">
			<view class="status-header">
				<image class="status-icon" :src="isMember ? '/static/images/member-active.png' : '/static/images/member-inactive.png'" mode="aspectFit" />
				<view class="status-info">
					<text class="status-title">{{ isMember ? '尊享会员' : '普通用户' }}</text>
					<text class="status-desc">{{ isMember ? '您已开通会员，享受专属优惠' : '开通会员，享受专属优惠' }}</text>
				</view>
			</view>
			<view class="status-benefits" v-if="isMember">
				<view class="benefit-item">
					<text class="benefit-icon">✓</text>
					<text class="benefit-text">全场商品8折优惠</text>
				</view>
				<view class="benefit-item">
					<text class="benefit-icon">✓</text>
					<text class="benefit-text">专属客服服务</text>
				</view>
				<view class="benefit-item">
					<text class="benefit-icon">✓</text>
					<text class="benefit-text">优先发货</text>
				</view>
			</view>
		</view>

		<view class="membership-packages card" v-if="!isMember">
			<view class="section-title">会员套餐</view>
			<view class="package-list">
				<view class="package-item" :class="{ active: selectedPackage === 'monthly' }" @click="selectPackage('monthly')">
					<view class="package-header">
						<text class="package-name">月度会员</text>
						<text class="package-price">¥29.9</text>
					</view>
					<view class="package-desc">30天会员权益</view>
				</view>
				<view class="package-item" :class="{ active: selectedPackage === 'quarterly' }" @click="selectPackage('quarterly')">
					<view class="package-header">
						<text class="package-name">季度会员</text>
						<text class="package-price">¥79.9</text>
					</view>
					<view class="package-desc">90天会员权益</view>
				</view>
				<view class="package-item" :class="{ active: selectedPackage === 'yearly' }" @click="selectPackage('yearly')">
					<view class="package-header">
						<text class="package-name">年度会员</text>
						<text class="package-price">¥299.9</text>
					</view>
					<view class="package-desc">365天会员权益</view>
				</view>
			</view>
		</view>

		<view class="membership-benefits card">
			<view class="section-title">会员权益</view>
			<view class="benefits-list">
				<view class="benefit-card">
					<image class="benefit-image" src="/static/images/discount.png" mode="aspectFit" />
					<view class="benefit-content">
						<text class="benefit-title">专属折扣</text>
						<text class="benefit-desc">全场商品享受8折优惠</text>
					</view>
				</view>
				<view class="benefit-card">
					<image class="benefit-image" src="/static/images/service.png" mode="aspectFit" />
					<view class="benefit-content">
						<text class="benefit-title">专属客服</text>
						<text class="benefit-desc">一对一专属客服服务</text>
					</view>
				</view>
				<view class="benefit-card">
					<image class="benefit-image" src="/static/images/shipping.png" mode="aspectFit" />
					<view class="benefit-content">
						<text class="benefit-title">优先发货</text>
						<text class="benefit-desc">订单优先处理发货</text>
					</view>
				</view>
			</view>
		</view>

		<view class="bottom-container" v-if="!isMember">
			<button class="purchase-btn" @click="handlePurchase">立即开通会员</button>
		</view>
	</view>
</template>

<script lang="ts">
	export default {
		data() {
			return {
				isMember: false,
				selectedPackage: 'monthly'
			}
		},
		onLoad() {
			// 检查用户会员状态
			this.checkMembershipStatus();
		},
		methods: {
			checkMembershipStatus() {
				// 从本地存储获取会员状态
				const membershipStatus = uni.getStorageSync('membershipStatus');
				this.isMember = membershipStatus && membershipStatus.expiresAt > new Date().getTime();
			},
			selectPackage(packageType) {
				this.selectedPackage = packageType;
			},
			handlePurchase() {
				// 显示加载中
				uni.showLoading({
					title: '处理中...'
				});

				// 模拟购买流程
				setTimeout(() => {
					uni.hideLoading();
					
					// 计算会员到期时间
					const now = new Date();
					let expiresAt;
					switch (this.selectedPackage) {
						case 'monthly':
							expiresAt = now.setMonth(now.getMonth() + 1);
							break;
						case 'quarterly':
							expiresAt = now.setMonth(now.getMonth() + 3);
							break;
						case 'yearly':
							expiresAt = now.setFullYear(now.getFullYear() + 1);
							break;
					}

					// 保存会员状态
					uni.setStorageSync('membershipStatus', {
						isMember: true,
						expiresAt: expiresAt,
						packageType: this.selectedPackage
					});

					// 更新页面状态
					this.isMember = true;

					uni.showToast({
						title: '开通成功',
						icon: 'success',
						duration: 2000
					});
				}, 1500);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.membership-page {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	}

	.header {
		background: #fff;
		padding: 30rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

		.header-title {
			font-size: 36rpx;
			font-weight: bold;
		}
	}

	.card {
		background: #fff;
		margin: 20rpx;
		padding: 30rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.membership-status {
		.status-header {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			.status-icon {
				width: 100rpx;
				height: 100rpx;
				margin-right: 20rpx;
			}

			.status-info {
				flex: 1;

				.status-title {
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
					display: block;
				}

				.status-desc {
					font-size: 24rpx;
					color: #666;
				}
			}
		}

		.status-benefits {
			.benefit-item {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;

				.benefit-icon {
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					background-color: #ff4d4f;
					color: #fff;
					border-radius: 50%;
					margin-right: 20rpx;
				}

				.benefit-text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}

	.membership-packages {
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}

		.package-list {
			display: flex;
			flex-direction: column;
			gap: 20rpx;

			.package-item {
				padding: 30rpx;
				border: 2rpx solid #ddd;
				border-radius: 12rpx;
				transition: all 0.3s ease;

				&.active {
					border-color: #ff4d4f;
					background-color: #fff5f5;
				}

				.package-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10rpx;

					.package-name {
						font-size: 32rpx;
						font-weight: bold;
					}

					.package-price {
						font-size: 36rpx;
						color: #ff4d4f;
						font-weight: bold;
					}
				}

				.package-desc {
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}

	.membership-benefits {
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}

		.benefits-list {
			display: flex;
			flex-direction: column;
			gap: 30rpx;

			.benefit-card {
				display: flex;
				align-items: center;
				padding: 20rpx;
				background-color: #f8f8f8;
				border-radius: 12rpx;

				.benefit-image {
					width: 80rpx;
					height: 80rpx;
					margin-right: 20rpx;
				}

				.benefit-content {
					flex: 1;

					.benefit-title {
						font-size: 28rpx;
						font-weight: bold;
						margin-bottom: 10rpx;
						display: block;
					}

					.benefit-desc {
						font-size: 24rpx;
						color: #666;
					}
				}
			}
		}
	}

	.bottom-container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		padding: 20rpx 40rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

		.purchase-btn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			background: #ff4d4f;
			color: #fff;
			border-radius: 40rpx;
			font-size: 32rpx;
			font-weight: bold;
			text-align: center;
			border: none;

			&::after {
				border: none;
			}
		}
	}
</style> 