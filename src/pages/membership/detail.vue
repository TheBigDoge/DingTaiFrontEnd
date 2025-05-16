<template>
	<view class="membership-detail-container">
		<!-- 会员信息卡片 -->
		<view class="member-card">
			<view class="member-info">
				<image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill" />
				<view class="info-content">
					<text class="nickname">{{ userInfo.nickname || '未登录' }}</text>
					<text class="member-level">{{ userInfo.memberLevel || '普通会员' }}</text>
				</view>
			</view>
		</view>

		<!-- 会员权益列表 -->
		<view class="benefits-list">
			<view class="section-title">会员权益</view>
			<view class="benefit-item" v-for="(benefit, index) in benefits" :key="index">
				<image class="benefit-icon" :src="benefit.icon" mode="aspectFit" />
				<view class="benefit-info">
					<text class="benefit-name">{{ benefit.name }}</text>
					<text class="benefit-desc">{{ benefit.description }}</text>
				</view>
			</view>
		</view>

		<!-- 会员等级说明 -->
		<view class="level-description">
			<view class="section-title">等级说明</view>
			<view class="level-item" v-for="(level, index) in levels" :key="index">
				<text class="level-name">{{ level.name }}</text>
				<text class="level-condition">{{ level.condition }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				benefits: [
					{
						icon: '/static/images/benefit-discount.png',
						name: '会员折扣',
						description: '享受商品专属折扣'
					},
					{
						icon: '/static/images/benefit-points.png',
						name: '积分加速',
						description: '消费获得更多积分'
					},
					{
						icon: '/static/images/benefit-service.png',
						name: '专属客服',
						description: '享受优先客服服务'
					}
				],
				levels: [
					{
						name: '普通会员',
						condition: '注册即可成为普通会员'
					},
					{
						name: '银卡会员',
						condition: '累计消费满1000元'
					},
					{
						name: '金卡会员',
						condition: '累计消费满5000元'
					},
					{
						name: '钻石会员',
						condition: '累计消费满20000元'
					}
				]
			}
		},
		onLoad() {
			this.getUserInfo()
		},
		methods: {
			getUserInfo() {
				const userInfo = uni.getStorageSync('userInfo')
				if (userInfo) {
					this.userInfo = userInfo
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.membership-detail-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 20rpx;
	}

	.member-card {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.member-info {
			display: flex;
			align-items: center;

			.avatar {
				width: 120rpx;
				height: 120rpx;
				border-radius: 60rpx;
				margin-right: 20rpx;
			}

			.info-content {
				.nickname {
					font-size: 32rpx;
					font-weight: bold;
					color: #333;
					margin-bottom: 10rpx;
					display: block;
				}

				.member-level {
					font-size: 26rpx;
					color: #666;
				}
			}
		}
	}

	.benefits-list {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30rpx;
		}

		.benefit-item {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.benefit-icon {
				width: 80rpx;
				height: 80rpx;
				margin-right: 20rpx;
			}

			.benefit-info {
				flex: 1;

				.benefit-name {
					font-size: 28rpx;
					color: #333;
					margin-bottom: 6rpx;
					display: block;
				}

				.benefit-desc {
					font-size: 24rpx;
					color: #999;
				}
			}
		}
	}

	.level-description {
		background-color: #fff;
		border-radius: 20rpx;
		padding: 30rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 30rpx;
		}

		.level-item {
			margin-bottom: 20rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.level-name {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 6rpx;
				display: block;
			}

			.level-condition {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
</style> 