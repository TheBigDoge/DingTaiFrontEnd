<template>
	<view class="address-page">
		<!-- Header -->
		<view class="page-header">
			<text class="header-title">收货地址</text>
		</view>

		<!-- Address List -->
		<view class="address-list" v-if="addressList.length > 0">
			<view class="address-item" v-for="(item, index) in addressList" :key="index">
				<view class="address-info">
					<view class="user-info">
						<text class="name">{{ item.name }}</text>
						<text class="phone">{{ item.phone }}</text>
						<text class="default-tag" v-if="item.isDefault">默认</text>
					</view>
					<view class="address-detail">
						<text>{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</text>
					</view>
				</view>
				<view class="address-actions">
					<view class="action-btn" @click="setDefault(index)">
						<text :class="['iconfont', item.isDefault ? 'icon-check' : 'icon-circle']"></text>
						<text>{{ item.isDefault ? '默认地址' : '设为默认' }}</text>
					</view>
					<view class="action-btn" @click="editAddress(index)">
						<text class="iconfont icon-edit"></text>
						<text>编辑</text>
					</view>
					<view class="action-btn" @click="deleteAddress(index)">
						<text class="iconfont icon-delete"></text>
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>

		<!-- Empty State -->
		<view class="empty-state" v-else>
			<image class="empty-icon" src="/static/images/empty-address.png" mode="aspectFit" />
			<text class="empty-text">暂无收货地址</text>
		</view>

		<!-- Add Address Button -->
		<view class="add-btn" @click="addAddress">
			<text class="iconfont icon-plus"></text>
			<text>添加新地址</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: []
			}
		},
		onShow() {
			// 从本地存储获取地址列表
			this.loadAddressList();
		},
		methods: {
			loadAddressList() {
				const addressList = uni.getStorageSync('addressList') || [];
				this.addressList = addressList;
			},
			addAddress() {
				uni.navigateTo({
					url: '/pages/address/edit'
				});
			},
			editAddress(index) {
				uni.navigateTo({
					url: `/pages/address/edit?index=${index}`
				});
			},
			deleteAddress(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该地址吗？',
					success: res => {
						if (res.confirm) {
							this.addressList.splice(index, 1);
							this.saveAddressList();
						}
					}
				});
			},
			setDefault(index) {
				this.addressList.forEach((item, i) => {
					item.isDefault = i === index;
				});
				this.saveAddressList();
			},
			saveAddressList() {
				uni.setStorageSync('addressList', this.addressList);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.address-page {
		min-height: 100vh;
		background-color: $uni-bg-color-grey;
		padding-bottom: 120rpx;
	}

	.page-header {
		background-color: #fff;
		padding: 20rpx 30rpx;
		border-bottom: 2rpx solid $uni-border-color;

		.header-title {
			font-size: 32rpx;
			font-weight: bold;
		}
	}

	.address-list {
		padding: 20rpx;

		.address-item {
			background-color: #fff;
			border-radius: 12rpx;
			padding: 30rpx;
			margin-bottom: 20rpx;

			.address-info {
				margin-bottom: 30rpx;

				.user-info {
					display: flex;
					align-items: center;
					margin-bottom: 10rpx;

					.name {
						font-size: 28rpx;
						font-weight: bold;
						margin-right: 20rpx;
					}

					.phone {
						font-size: 28rpx;
						color: #666;
					}

					.default-tag {
						font-size: 24rpx;
						color: #ff4d4f;
						border: 2rpx solid #ff4d4f;
						padding: 4rpx 10rpx;
						border-radius: 4rpx;
						margin-left: 20rpx;
					}
				}

				.address-detail {
					font-size: 28rpx;
					color: #333;
					line-height: 1.5;
				}
			}

			.address-actions {
				display: flex;
				justify-content: space-between;
				border-top: 2rpx solid $uni-border-color;
				padding-top: 20rpx;

				.action-btn {
					display: flex;
					align-items: center;
					font-size: 28rpx;
					color: #666;

					.iconfont {
						font-size: 32rpx;
						margin-right: 10rpx;
					}

					&:active {
						opacity: 0.7;
					}
				}
			}
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 100rpx 0;

		.empty-icon {
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 30rpx;
		}

		.empty-text {
			font-size: 28rpx;
			color: #999;
		}
	}

	.add-btn {
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		bottom: 30rpx;
		height: 88rpx;
		background-color: #ff4d4f;
		color: #fff;
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-weight: bold;

		.iconfont {
			font-size: 36rpx;
			margin-right: 10rpx;
		}
	}
</style> 