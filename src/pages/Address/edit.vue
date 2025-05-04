<template>
	<view class="edit-address-page">
		<!-- Header -->
		<view class="page-header">
			<text class="header-title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
		</view>

		<!-- Form -->
		<view class="form-content">
			<view class="form-item">
				<text class="label">收货人</text>
				<input type="text" v-model="formData.name" placeholder="请输入收货人姓名" />
			</view>
			<view class="form-item">
				<text class="label">手机号码</text>
				<input type="number" v-model="formData.phone" placeholder="请输入手机号码" maxlength="11" />
			</view>
			<view class="form-item">
				<text class="label">所在地区</text>
				<picker mode="region" @change="handleRegionChange" :value="[formData.province, formData.city, formData.district]">
					<view class="picker-value">
						<text v-if="formData.province || formData.city || formData.district">
							{{ formData.province }} {{ formData.city }} {{ formData.district }}
						</text>
						<text v-else class="placeholder">请选择省市区</text>
					</view>
				</picker>
			</view>
			<view class="form-item">
				<text class="label">详细地址</text>
				<textarea v-model="formData.detail" placeholder="请输入详细地址，如街道、门牌号等" />
			</view>
			<view class="form-item switch-item">
				<text class="label">设为默认地址</text>
				<switch :checked="formData.isDefault" @change="handleDefaultChange" color="#ff4d4f" />
			</view>
		</view>

		<!-- Save Button -->
		<view class="save-btn" @click="saveAddress">保存</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isEdit: false,
				editIndex: -1,
				formData: {
					name: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					detail: '',
					isDefault: false
				}
			}
		},
		onLoad(options) {
			if (options.index !== undefined) {
				this.isEdit = true;
				this.editIndex = parseInt(options.index);
				this.loadAddress();
			}
		},
		methods: {
			loadAddress() {
				const addressList = uni.getStorageSync('addressList') || [];
				if (this.editIndex >= 0 && this.editIndex < addressList.length) {
					this.formData = { ...addressList[this.editIndex] };
				}
			},
			handleRegionChange(e) {
				const [province, city, district] = e.detail.value;
				this.formData.province = province;
				this.formData.city = city;
				this.formData.district = district;
			},
			handleDefaultChange(e) {
				this.formData.isDefault = e.detail.value;
			},
			validateForm() {
				if (!this.formData.name) {
					uni.showToast({
						title: '请输入收货人姓名',
						icon: 'none'
					});
					return false;
				}
				if (!this.formData.phone || !/^1\d{10}$/.test(this.formData.phone)) {
					uni.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					});
					return false;
				}
				if (!this.formData.province || !this.formData.city || !this.formData.district) {
					uni.showToast({
						title: '请选择所在地区',
						icon: 'none'
					});
					return false;
				}
				if (!this.formData.detail) {
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

				let addressList = uni.getStorageSync('addressList') || [];

				// If setting as default, remove default from other addresses
				if (this.formData.isDefault) {
					addressList.forEach(item => item.isDefault = false);
				}

				if (this.isEdit) {
					// Update existing address
					addressList[this.editIndex] = { ...this.formData };
				} else {
					// Add new address
					addressList.push({ ...this.formData });
				}

				// If this is the first address, set it as default
				if (addressList.length === 1) {
					addressList[0].isDefault = true;
				}

				// Save to storage
				uni.setStorageSync('addressList', addressList);

				uni.showToast({
					title: this.isEdit ? '地址修改成功' : '地址添加成功',
					icon: 'success'
				});

				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
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
				padding: 0 30rpx;
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