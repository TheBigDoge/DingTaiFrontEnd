<template>
	<view class="edit-address-page">
		<!-- Header -->
		<view class="page-header">
			<text class="header-title">{{ address.id ? '编辑地址' : '新增地址' }}</text>
		</view>

		<!-- Form -->
		<view class="form-content">
			<view class="form-item">
				<text class="label">收货人</text>
				<input type="text" v-model="address.name" placeholder="请输入收货人姓名" />
			</view>
			<view class="form-item">
				<text class="label">手机号码</text>
				<input type="number" v-model="address.phone" placeholder="请输入手机号码" maxlength="11" />
			</view>
			<view class="form-item">
				<text class="label">所在地区</text>
				<picker mode="region" @change="handleRegionChange" :value="[address.province, address.city, address.district]">
					<view class="picker-value">
						<text v-if="address.province || address.city || address.district">
							{{ address.province }} {{ address.city }} {{ address.district }}
						</text>
						<text v-else class="placeholder">请选择省市区</text>
					</view>
				</picker>
			</view>
			<view class="form-item">
				<text class="label">详细地址</text>
				<textarea v-model="address.address" placeholder="请输入详细地址，如街道、门牌号等"></textarea>
			</view>
			<view class="form-item switch-item">
				<text class="label">设为默认地址</text>
				<switch :checked="address.isDefault" @change="handleDefaultChange" color="#ff4d4f" />
			</view>
		</view>

		<!-- Save Button -->
		<view class="save-btn" @click="saveAddress">保存</view>
	</view>
</template>

<script lang="ts">
import { Address, createAddress, listAddresses, newAddress, updateAddress } from '@/api/address';

	export default {
		data() {
			return {
				address: {
					id: 0,
					name: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					address: '',
					isDefault: false,
					tags: [],
				} as Address,
			}
		},
		onLoad(options: any) {
			console.log('onload, opts', options)
			if (options?.id) {
				this.address.id = parseInt(options.id);
				this.loadAddress();
			}
		},
		methods: {
			loadAddress() {
				if (this.address.id) {
					listAddresses()
						.then(result => result.results)
						.then(addresses => addresses.filter(addr => addr.id === this.address.id))
						.then(addresses => {
							if (addresses) {
								const first = newAddress(addresses[0]);
								this.address = first;
							} else {
								this.address.id = 0;
							}
						})
				}
			},
			handleRegionChange(e: any) {
				const [province, city, district] = e.detail.value;
				this.address.province = province;
				this.address.city = city;
				this.address.district = district;
			},
			handleDefaultChange(e: any) {
				this.address.isDefault = e.detail.value;
			},
			validateForm() {
				if (!this.address.name) {
					uni.showToast({
						title: '请输入收货人姓名',
						icon: 'none'
					});
					return false;
				}
				if (!this.address.phone || !/^1\d{10}$/.test(this.address.phone)) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					});
					return false;
				}
				if (!this.address.province || !this.address.city || !this.address.district) {
					uni.showToast({
						title: '请选择所在地区',
						icon: 'none'
					});
					return false;
				}
				if (!this.address.address) {
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none'
					});
					return false;
				}
				return true;
			},
			saveAddress() {
				if (!this.validateForm()) return;

				if (this.address.id) {
					updateAddress(this.address)
						.then(() => uni.navigateBack())
				} else {
					createAddress(this.address)
						.then(() => uni.navigateBack())
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.edit-address-page {
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

	.form-content {
		background-color: #fff;
		padding: 30rpx;

		.form-item {
			margin-bottom: 30rpx;

			.label {
				display: block;
				margin-bottom: 20rpx;
				font-size: 28rpx;
				color: #333;
			}

			input, .picker-value {
				width: 100%;
				height: 88rpx;
				border: 2rpx solid $uni-border-color;
				border-radius: 8rpx;
				padding: 30rpx;
				font-size: 28rpx;
				background-color: #f8f8f8;
				transition: all 0.3s ease;

				&:focus {
					border-color: #ff4d4f;
					background-color: #fff;
				}
			}

			textarea {
				width: 100%;
				height: 200rpx;
				border: 2rpx solid $uni-border-color;
				border-radius: 8rpx;
				padding: 20rpx 30rpx;
				font-size: 28rpx;
				background-color: #f8f8f8;
				transition: all 0.3s ease;

				&:focus {
					border-color: #ff4d4f;
					background-color: #fff;
				}
			}

			&.switch-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.placeholder {
				color: #999;
			}
		}
	}

	.save-btn {
		position: fixed;
		left: 30rpx;
		right: 30rpx;
		bottom: 30rpx;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #ff4d4f;
		color: #fff;
		text-align: center;
		border-radius: 44rpx;
		font-size: 32rpx;
		font-weight: bold;

		&:active {
			opacity: 0.9;
		}
	}
</style> 