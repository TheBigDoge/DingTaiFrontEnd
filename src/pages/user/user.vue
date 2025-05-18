<template>
	<view class="user-page">
		<view class="user-header">
			<view class="header-bg"></view>
			<view class="user-info">
				<view class="avatar-box">
					<image v-if="user?.avatar" class="avatar" :src="user.avatar" mode="aspectFill"></image>
					<view class="avatar-placeholder" v-else @click="toLogin">登录</view>
				</view>
				<view class="info-right">
					<view class="username" v-if="user">{{ user.nickname }}</view>
					<view class="login-btn" v-else @click="toLogin">点击登录</view>
				</view>
				<view class="settings" @click="toSettings">
					<text class="iconfont icon-settings">⚙️</text>
				</view>
			</view>
		</view>

		<!-- 会员信息卡片 -->
		<view class="membership-card" @click="handleViewMembership">
			<view class="membership-header">
				<image class="membership-icon" :src="isPremium ? `/static/images/member-active.png` : '/static/images/member-inactive.png'" mode="aspectFit" />
				<view class="membership-info">
					<text class="membership-title">
						{{ membershipTitle() }}
					</text>
					<text class="membership-desc">
						{{ membershipDesc() }}
					</text>
				</view>
				<text class="arrow-icon">></text>
			</view>
		</view>

		<view class="order-section card">
			<view class="section-header">
				<text class="title">我的订单</text>
				<text class="more" @click="toOrderList('all')">查看全部</text>
			</view>
			<view class="order-types">
				<view class="type-item" @click="toOrderList('shipping')">
					<text class="iconfont icon-shipping">🚚</text>
					<text class="label">待收货</text>
				</view>
				<view class="type-item" @click="toOrderList('completed')">
					<text class="iconfont icon-completed">✅</text>
					<text class="label">已完成</text>
				</view>
			</view>
		</view>

		<view class="service-section card">
			<view class="section-header">
				<text class="title">我的服务</text>
			</view>
			<view class="service-list">
				<view class="service-item" @click="toAddressList">
					<text class="iconfont icon-address">📍</text>
					<text class="label">收货地址</text>
				</view>
				<view class="service-item" @click="toCustomService">
					<text class="iconfont icon-service">💬</text>
					<text class="label">联系客服</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script lang="ts">
	import { GlobalData } from '@/store';
	import { displayDate } from '@/utils/datetime';

	export default {
		data() {
			return {
				user: GlobalData.get_user(),
				premium_status: GlobalData.get_premium_status(),
			}
		},

		computed: {
			isPremium() {
				return GlobalData.is_premium();
			}
		},

		methods: {
			membershipTitle(): string {
				if (this.isPremium) {
					return "尊享VIP"
				} else {
					return "普通用户"
				}
			},

			membershipDesc(): string {
				if (this.isPremium) {
					if (this.premium_status?.end_date)	{
						return `会员到期日: ${displayDate(this.premium_status.end_date)}`
					} else {
						return `欢迎您，尊敬的永久会员` // ?
					}
				} else {
					if (this.premium_status?.end_date) {
						return `您的会员已于 ${displayDate(this.premium_status?.end_date)} 到期`
					} else {
						return `开通会员，享受专属优惠`
					}
				}
			},

			toLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			toSettings() {
				uni.navigateTo({
					url: '/pages/settings/index'
				})
			},
			toMemberCenter() {
				uni.navigateTo({
					url: '/pages/member/index'
				})
			},
			toOrderList(type: string) {
				uni.navigateTo({
					url: `/pages/order/orderlist?type=${type}`
				})
			},
			toAddressList() {
				uni.navigateTo({
					url: '/pages/address/address'
				})
			},
			toCustomService() {
				// 打开客服聊天窗口
				uni.showToast({
					title: '正在连接客服...',
					icon: 'none'
				})
			},
			handleViewMembership() {
				uni.navigateTo({
					url: '/pages/user/membership-details',
					success: () => {
						console.log('Successfully navigated to membership details page')
					},
					fail: (err) => {
						console.error('Navigation failed:', err)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.user-page {
		min-height: 100vh;
		background-color: $uni-bg-color-grey;
		padding-bottom: 30rpx;
	}

	.user-header {
		position: relative;
		height: 300rpx;
		margin-bottom: 20rpx;

		.header-bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 200rpx;
			background: linear-gradient(to right, #E3C5A9, #D4B596);
		}

		.user-info {
			position: absolute;
			top: 80rpx;
			left: 30rpx;
			right: 30rpx;
			height: 200rpx;
			background-color: #fff;
			border-radius: $uni-border-radius-lg;
			box-shadow: $uni-box-shadow;
			display: flex;
			align-items: center;
			padding: 0 30rpx;

			.avatar-box {
				margin-right: 30rpx;

				.avatar {
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
					border: 4rpx solid #fff;
				}

				.avatar-placeholder {
					width: 140rpx;
					height: 140rpx;
					border-radius: 50%;
					background-color: #f5f5f5;
					border: 4rpx solid #fff;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-light;
				}
			}

			.info-right {
				flex: 1;

				.username {
					font-size: $uni-font-size-lg;
					font-weight: bold;
					color: $uni-text-color;
					margin-bottom: 10rpx;
				}

				.login-btn {
					font-size: $uni-font-size-md;
					color: $uni-text-color-light;
				}

				.member-level {
					font-size: $uni-font-size-sm;
					color: #D4B596;
				}
			}

			.settings {
				width: 60rpx;
				height: 60rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				.icon-settings {
					font-size: 36rpx;
					color: $uni-text-color-light;
				}
			}
		}
	}

	.card {
		margin: 0 30rpx 30rpx;
		background-color: #fff;
		border-radius: $uni-border-radius-md;
		padding: 30rpx;
		box-shadow: $uni-box-shadow;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;

		.title {
			font-size: $uni-font-size-md;
			font-weight: bold;
			color: $uni-text-color;
		}

		.more {
			font-size: $uni-font-size-sm;
			color: $uni-text-color-light;
		}
	}

	.member-info {
		.member-card {
			height: 160rpx;
			background: linear-gradient(to right, #E3C5A9, #D4B596);
			border-radius: $uni-border-radius-md;
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.brand-logo {
				font-size: 36rpx;
				font-weight: bold;
				color: #fff;
			}

			.member-statistics {
				display: flex;

				.stat-item {
					margin-right: 60rpx;

					.num {
						font-size: $uni-font-size-lg;
						color: #fff;
						font-weight: bold;
						margin-right: 10rpx;
					}

					.label {
						font-size: $uni-font-size-sm;
						color: rgba(255, 255, 255, 0.8);
					}
				}
			}
		}
	}

	.order-types {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 30rpx;
		padding: 10rpx 0;

		.type-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20rpx;
			background: #f8f8f8;
			border-radius: 12rpx;
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.98);
				background: #f0f0f0;
			}

			.iconfont {
				font-size: 50rpx;
				margin-bottom: 16rpx;
			}

			.label {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
			}
		}
	}

	.service-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 30rpx;
		padding: 10rpx 0;

		.service-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20rpx;
			background: #f8f8f8;
			border-radius: 12rpx;
			transition: all 0.3s ease;

			&:active {
				transform: scale(0.98);
				background: #f0f0f0;
			}

			.iconfont {
				font-size: 50rpx;
				margin-bottom: 16rpx;
			}

			.label {
				font-size: 28rpx;
				color: #333;
				font-weight: 500;
			}
		}
	}

	.membership-card {
		background: #fff;
		margin: 20rpx;
		padding: 30rpx;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.membership-header {
			display: flex;
			align-items: center;
			margin-bottom: 20rpx;

			.membership-icon {
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;
			}

			.membership-info {
				flex: 1;

				.membership-title {
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 10rpx;
					display: block;
				}

				.membership-desc {
					font-size: 24rpx;
					color: #666;
				}
			}

			.arrow-icon {
				font-size: 32rpx;
				color: #999;
			}
		}

		.membership-points {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-top: 20rpx;
			border-top: 2rpx solid #f5f5f5;

			.points-label {
				font-size: 28rpx;
				color: #666;
			}

			.points-value {
				font-size: 32rpx;
				font-weight: bold;
				color: #ff4d4f;
			}
		}
	}
</style>