<template>
	<view class="address-page">
		<!-- Header -->
		<view class="page-header">
			<text class="header-title">收货地址</text>
		</view>

		<!-- Address List -->
		<view class="address-list" v-if="addressList.length > 0">
			<view class="address-item" v-for="(item, index) in addressList" :key="index">
				<view class="address-info" @click="selectAddress(item)">
					<view class="user-info">
						<text class="name">{{ item.name }}</text>
						<text class="phone">{{ item.phone }}</text>
						<text class="default-tag" v-if="item.isDefault">默认</text>
					</view>
					<view class="address-detail">{{ item.province }}{{ item.city }}{{ item.district }}{{ item.detail }}</view>
				</view>
				<view class="address-actions">
					<view class="action-item" @click="editAddress(item, index)">
						<text class="iconfont">✎</text>
						<text>编辑</text>
					</view>
					<view class="action-item" @click="deleteAddress(index)">
						<text class="iconfont">×</text>
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
		<view class="add-address safe-area-bottom" @click="showAddressForm">
			<text class="iconfont">+</text>
			<text>新增收货地址</text>
		</view>

		<!-- Address Form Popup -->
		<uni-popup ref="addressForm" type="bottom">
			<view class="form-popup">
				<view class="form-header">
					<text class="title">{{ isEdit ? '编辑地址' : '新增地址' }}</text>
					<text class="close" @click="closeForm">×</text>
				</view>
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
						<switch :checked="formData.isDefault" @change="handleDefaultChange" color="#333" />
					</view>
				</view>
				<view class="form-footer">
					<button class="submit-btn" @click="saveAddress">保存</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressList: [],
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
		onShow() {
			this.loadAddressList();
		},
		methods: {
			loadAddressList() {
				let addressList = uni.getStorageSync('addressList');
				if (!addressList || addressList.length === 0) {
					// Add sample address if no addresses exist
					addressList = [{
						name: '张三',
						phone: '13800138000',
						province: '广东省',
						city: '深圳市',
						district: '南山区',
						detail: '科技园南区科苑路1号',
						isDefault: true
					}];
					uni.setStorageSync('addressList', addressList);
				}
				this.addressList = addressList;
			},
			showAddressForm() {
				this.isEdit = false;
				this.editIndex = -1;
				this.formData = {
					name: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					detail: '',
					isDefault: false
				};
				this.$refs.addressForm.open();
			},
			editAddress(address, index) {
				this.isEdit = true;
				this.editIndex = index;
				this.formData = { ...address };
				this.$refs.addressForm.open();
			},
			closeForm() {
				this.$refs.addressForm.close();
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

				// If setting as default, remove default from other addresses
				if (this.formData.isDefault) {
					this.addressList.forEach(item => item.isDefault = false);
				}

				if (this.isEdit) {
					// Update existing address
					this.addressList[this.editIndex] = { ...this.formData };
				} else {
					// Add new address
					this.addressList.push({ ...this.formData });
				}

				// If this is the first address, set it as default
				if (this.addressList.length === 1) {
					this.addressList[0].isDefault = true;
				}

				// Save to storage
				uni.setStorageSync('addressList', this.addressList);

				uni.showToast({
					title: this.isEdit ? '地址修改成功' : '地址添加成功',
					icon: 'success'
				});

				this.closeForm();
			},
			deleteAddress(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该地址吗？',
					success: res => {
						if (res.confirm) {
							const wasDefault = this.addressList[index].isDefault;
							this.addressList.splice(index, 1);
							
							// If deleted address was default and there are other addresses,
							// set the first one as default
							if (wasDefault && this.addressList.length > 0) {
								this.addressList[0].isDefault = true;
							}
							
							uni.setStorageSync('addressList', this.addressList);
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						}
					}
				});
			},
			selectAddress(item) {
				// Store the selected address
				uni.setStorageSync('selectedAddress', item);
				// Emit event for order page
				uni.$emit('addressSelected', item);
				// Go back to previous page
				uni.navigateBack();
			}
		},
		computed: {
			// Remove hasAddresses computed property
		}
	}
</script>

<style lang="scss" scoped>
	.address-page {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 120rpx;
	}

	.page-header {
		background: #fff;
		padding: 24rpx 30rpx;
		border-bottom: 1rpx solid #eee;
		position: sticky;
		top: 0;
		z-index: 10;

		.header-title {
			font-size: 34rpx;
			font-weight: 600;
			color: #333;
		}
	}

	.address-list {
		padding: 20rpx;

		.address-item {
			background: #fff;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 20rpx;
			box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

			.address-info {
				margin-bottom: 16rpx;

				.user-info {
					display: flex;
					align-items: center;
					margin-bottom: 12rpx;

					.name {
						font-size: 30rpx;
						font-weight: 600;
						color: #333;
						margin-right: 16rpx;
					}

					.phone {
						color: #666;
						font-size: 28rpx;
					}

					.default-tag {
						background: #333;
						color: #fff;
						font-size: 22rpx;
						padding: 4rpx 12rpx;
						border-radius: 20rpx;
						margin-left: 16rpx;
					}
				}

				.address-detail {
					color: #333;
					font-size: 28rpx;
					line-height: 1.5;
				}
			}

			.address-actions {
				display: flex;
				justify-content: flex-end;
				border-top: 1rpx solid #eee;
				padding-top: 16rpx;

				.action-item {
					display: flex;
					align-items: center;
					margin-left: 24rpx;
					color: #666;
					font-size: 26rpx;

					.iconfont {
						font-size: 30rpx;
						margin-right: 6rpx;
					}
				}
			}
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 200rpx;

		.empty-icon {
			width: 180rpx;
			height: 180rpx;
			margin-bottom: 24rpx;
			opacity: 0.6;
		}

		.empty-text {
			color: #999;
			font-size: 28rpx;
		}
	}

	.add-address {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background: #333;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

		.iconfont {
			margin-right: 8rpx;
			font-size: 36rpx;
		}
	}

	.form-popup {
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;
		max-height: 80vh;
		overflow-y: auto;

		.form-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24rpx 30rpx;
			border-bottom: 1rpx solid #eee;
			position: sticky;
			top: 0;
			background: #fff;
			z-index: 1;

			.title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}

			.close {
				font-size: 36rpx;
				color: #999;
				padding: 0 16rpx;
				line-height: 1;
			}
		}

		.form-content {
			padding: 24rpx 30rpx;

			.form-item {
				margin-bottom: 24rpx;

				.label {
					display: block;
					margin-bottom: 12rpx;
					font-size: 28rpx;
					color: #333;
				}

				input, .picker-value {
					width: 100%;
					height: 80rpx;
					border: 1rpx solid #eee;
					border-radius: 8rpx;
					padding: 0 24rpx;
					font-size: 28rpx;
					background: #f8f8f8;
					transition: all 0.3s ease;

					&:focus {
						border-color: #333;
						background: #fff;
					}
				}

				textarea {
					width: 100%;
					height: 160rpx;
					border: 1rpx solid #eee;
					border-radius: 8rpx;
					padding: 20rpx 24rpx;
					font-size: 28rpx;
					background: #f8f8f8;
					transition: all 0.3s ease;

					&:focus {
						border-color: #333;
						background: #fff;
					}
				}

				&.switch-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
		}

		.form-footer {
			padding: 24rpx 30rpx;
			border-top: 1rpx solid #eee;
			position: sticky;
			bottom: 0;
			background: #fff;
			z-index: 1;

			.submit-btn {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				background: #333;
				color: #fff;
				border-radius: 40rpx;
				font-size: 32rpx;
				transition: all 0.3s ease;

				&:active {
					transform: scale(0.98);
					opacity: 0.9;
				}
			}
		}
	}

	.picker-value {
		width: 100%;
		height: 80rpx;
		border: 1rpx solid #eee;
		border-radius: 8rpx;
		padding: 0 24rpx;
		font-size: 28rpx;
		background: #f8f8f8;
		display: flex;
		align-items: center;
		transition: all 0.3s ease;

		&:focus {
			border-color: #333;
			background: #fff;
		}

		.placeholder {
			color: #999;
		}
	}

	// Add custom styles for the region picker popup
	::v-deep .uni-picker-view-wrapper {
		background: #fff;
		border-radius: 24rpx 24rpx 0 0;
		overflow: hidden;

		.uni-picker-view-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 24rpx 30rpx;
			border-bottom: 1rpx solid #eee;

			.uni-picker-view-header-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #333;
			}

			.uni-picker-view-header-cancel,
			.uni-picker-view-header-confirm {
				font-size: 28rpx;
				padding: 10rpx 20rpx;
			}

			.uni-picker-view-header-cancel {
				color: #999;
			}

			.uni-picker-view-header-confirm {
				color: #333;
				font-weight: 600;
			}
		}

		.uni-picker-view-content {
			height: 500rpx;

			.uni-picker-view-column {
				height: 100%;
			}

			.uni-picker-view-column-item {
				height: 80rpx;
				line-height: 80rpx;
				font-size: 28rpx;
				color: #333;
				text-align: center;
			}

			.uni-picker-view-column-item-selected {
				color: #333;
				font-weight: 600;
			}
		}
	}
</style> 