<template>
	<view class="order-page">
		<view class="header">
			<text class="header-title">确认订单</text>
		</view>

		<view class="address-section" @click="changeAddress">
			<view class="address-info" v-if="address.name">
				<view class="address-name">{{ address.name }} {{ address.phone }}</view>
				<view class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</view>
			</view>
			<view class="no-address" v-else>
				<text class="no-address-text">请选择收货地址</text>
			</view>
			<view class="change-address">更换地址</view>
		</view>

		<view class="items-section">
			<view class="item" v-for="(item, index) in orderItems" :key="index">
				<image :src="item.image" mode="aspectFill" class="item-image" />
				<view class="item-info">
					<view class="item-title">{{ item.name }}</view>
					<view class="item-price">
						<text class="member-price">¥{{ (item.unitPrice * 0.9).toFixed(2) }}</text>
						<text class="original-price">¥{{ item.unitPrice.toFixed(2) }}</text>
					</view>
					<view class="item-details">
						<view class="item-size">规格：{{ item.length }}米</view>
						<view class="quantity-control" :class="{ disabled: item.isWholePiece }">
							<text class="quantity-btn" @click="updateQuantity(index, -0.1)" :class="{ disabled: item.isWholePiece }">-</text>
							<text class="quantity">{{ item.length }}</text>
							<text class="quantity-btn" @click="updateQuantity(index, 0.1)" :class="{ disabled: item.isWholePiece }">+</text>
						</view>
						<view class="buy-whole-container">
							<view class="buy-whole-btn" :class="{ active: item.isWholePiece }" @click="toggleWholePiece(index)">
								<text class="btn-text">整块购买</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="delivery-section">
			<view class="section-title">配送方式</view>
			<view class="delivery-options">
				<view 
					class="delivery-option" 
					:class="{ selected: deliveryMethod === '快递配送' }"
					@click="selectDelivery('快递配送')"
				>快递配送</view>
				<view 
					class="delivery-option"
					:class="{ selected: deliveryMethod === '到店自提' }"
					@click="selectDelivery('到店自提')"
				>到店自提</view>
			</view>
		</view>

		<view class="memo-section">
			<view class="section-title">商品备注</view>
			<textarea 
				class="memo-input" 
				v-model="orderNote" 
				placeholder="请输入备注信息（选填）" 
				maxlength="200"
				:show-count="false"
			/>
			<view class="memo-count">{{ orderNote.length }}/200</view>
		</view>

		<view class="bottom-container">
			<view class="order-summary">
				<view class="summary-item">
					<text>商品总额</text>
					<text>¥{{ totalAmount.toFixed(2) }}</text>
				</view>
				<view class="summary-item">
					<text>运费</text>
					<text>¥{{ shippingFee.toFixed(2) }}</text>
				</view>
				<view class="summary-item">
					<text>会员优惠</text>
					<text>-¥{{ discount.toFixed(2) }}</text>
				</view>
				<view class="summary-total">
					<text>实付金额</text>
					<text>¥{{ finalAmount.toFixed(2) }}</text>
				</view>
				<view class="discount-notice">会员享受9折优惠</view>
			</view>

			<button class="submit-btn safe-area-bottom" :class="{ disabled: !address.name }" @click="submitOrder">提交订单</button>
		</view>
	</view>
</template>

<script lang="ts">
	export default {
		data() {
			return {
				orderData: null,
				address: {
					name: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					detail: '',
					isDefault: false
				},
				orderItems: [],
				deliveryMethod: '快递配送',
				orderNote: '',
				shippingFee: 0
			}
		},
		computed: {
			totalAmount() {
				return this.orderItems.reduce((total, item) => {
					return total + item.unitPrice * item.length;
				}, 0);
			},
			discount() {
				// 会员8折优惠
				return this.totalAmount * 0.2;
			},
			finalAmount() {
				return this.totalAmount - this.discount + this.shippingFee;
			}
		},
		onLoad(options) {
			// Load default address from storage
			this.loadDefaultAddress();
			// Load order items
			this.loadOrderItems();
		},
		onShow() {
			// Reload address when returning from address page
			this.loadDefaultAddress();
		},
		onHide() {
			// Remove event listener when page is hidden
			uni.$off('addressSelected');
		},
		methods: {
			loadDefaultAddress() {
				// First try to get selected address
				let selectedAddress = uni.getStorageSync('selectedAddress');
				if (selectedAddress) {
					this.address = selectedAddress;
					return;
				}

				// If no selected address, try to get default address from address list
				const addressList = uni.getStorageSync('addressList') || [];
				const defaultAddress = addressList.find(addr => addr.isDefault);
				if (defaultAddress) {
					this.address = defaultAddress;
					return;
				}

				// If no default address, use the first address in the list
				if (addressList.length > 0) {
					this.address = addressList[0];
				}
			},
			loadOrderItems() {
				try {
					const orderData = uni.getStorageSync('currentOrder');
					if (orderData) {
						this.orderItems = orderData.items;
					}
				} catch (e) {
					console.error('加载订单数据失败:', e);
					uni.showToast({
						title: '加载订单失败',
						icon: 'error'
					});
				}
			},
			changeAddress() {
				uni.navigateTo({
					url: '/pages/address/address',
					success: () => {
						console.log('Navigation to address page successful');
					},
					fail: (err) => {
						console.error('Navigation to address page failed:', err);
						uni.showToast({
							title: '页面跳转失败',
							icon: 'error'
						});
					}
				});
			},
			updateQuantity(index, change) {
				const item = this.orderItems[index];
				if (item.isWholePiece) return; // If whole piece mode is on, don't allow quantity changes
				const newLength = parseFloat((item.length + change).toFixed(1));
				if (newLength >= 0.85) {
					item.length = newLength;
				}
			},
			toggleWholePiece(index) {
				const item = this.orderItems[index];
				item.isWholePiece = !item.isWholePiece;
				if (item.isWholePiece) {
					item.length = 10.0; // Set to maximum length when whole piece is selected
				} else {
					item.length = 2.0; // Reset to default length when whole piece is deselected
				}
			},
			selectDelivery(method) {
				this.deliveryMethod = method;
			},
			submitOrder() {
				// Check if address is selected
				if (!this.address.name || !this.address.phone || !this.address.detail) {
					uni.showToast({
						title: '请选择收货地址',
						icon: 'none'
					});
					return;
				}

				if (this.orderItems.length === 0) {
					uni.showToast({
						title: '请选择商品',
						icon: 'none'
					});
					return;
				}

				const order = {
					items: this.orderItems,
					receiver: this.address,
					note: this.orderNote,
					deliveryMethod: this.deliveryMethod,
					totalAmount: this.totalAmount,
					discount: this.discount,
					finalAmount: this.finalAmount,
					orderTime: new Date().toISOString()
				};

				// Show loading
				uni.showLoading({
					title: '提交中...'
				});

				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '下单成功',
						icon: 'success',
						duration: 2000,
						success: () => {
							setTimeout(() => {
								this.handleSubmitOrder();
							}, 1500);
						}
					});
				}, 1500);
			},
			handleSubmitOrder() {
				// 显示加载中
				uni.showLoading({
					title: '提交订单中...'
				});

				// 模拟订单提交
				setTimeout(() => {
					uni.hideLoading();
					
					// 从购物车中移除已结算的商品
					const cartList = uni.getStorageSync('cartList') || [];
					const currentOrder = uni.getStorageSync('currentOrder');
					const orderItemIds = currentOrder.items.map(item => item.id);
					const updatedCartList = cartList.filter(item => !orderItemIds.includes(item.id));
					uni.setStorageSync('cartList', updatedCartList);
					
					// 生成订单数据
					const orderData = {
						orderNo: 'DT' + new Date().getTime(),
						status: 'pending',
						items: currentOrder.items,
						totalAmount: this.totalAmount,
						discount: this.discount,
						shippingFee: this.shippingFee,
						finalAmount: this.finalAmount,
						orderTime: new Date().toISOString()
					};

					// 保存订单到订单列表
					const orderList = uni.getStorageSync('orderList') || [];
					orderList.unshift(orderData); // 添加到列表开头
					uni.setStorageSync('orderList', orderList);
					
					// 清除当前订单数据
					uni.removeStorageSync('currentOrder');
					
					// 跳转到成功页面，并传递订单号
					uni.redirectTo({
						url: `/pages/order/success?orderNo=${orderData.orderNo}`
					});
				}, 1500);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order-page {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: calc(240rpx + env(safe-area-inset-bottom));
		box-sizing: border-box;
		position: relative;
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

	.address-section {
		background: #fff;
		margin: 20rpx 0;
		padding: 30rpx 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.address-info {
			flex: 1;

			.address-name {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
			}

			.address-detail {
				color: #666;
				font-size: 28rpx;
			}
		}

		.no-address {
			flex: 1;
			display: flex;
			align-items: center;

			.no-address-text {
				color: #999;
				font-size: 28rpx;
			}
		}

		.change-address {
			color: #666;
			font-size: 28rpx;
			padding: 10rpx 20rpx;
			border: 2rpx solid #ddd;
			border-radius: 30rpx;
		}
	}

	.items-section {
		background: #fff;
		margin: 20rpx 0;
		padding: 30rpx 40rpx;

		.item {
			display: flex;
			padding: 30rpx 0;
			border-bottom: 2rpx solid #f5f5f5;

			&:last-child {
				border-bottom: none;
			}

			.item-image {
				width: 160rpx;
				height: 160rpx;
				border-radius: 10rpx;
				margin-right: 30rpx;
			}

			.item-info {
				flex: 1;
				display: flex;
				flex-direction: column;

				.item-title {
					font-size: 28rpx;
					margin-bottom: 10rpx;
				}

				.item-price {
					display: flex;
					flex-direction: column;
					align-items: flex-end;
					gap: 8rpx;
					margin-bottom: 10rpx;

					.member-price {
						color: #ff4d4f;
						font-weight: bold;
						font-size: 36rpx;
					}

					.original-price {
						color: #999;
						font-size: 24rpx;
						text-decoration: line-through;
					}
				}

				.item-details {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-top: auto;

					.item-size {
						color: #666;
						font-size: 24rpx;
					}

					.quantity-control {
						display: flex;
						align-items: center;
						margin-left: 20rpx;

						&.disabled {
							opacity: 0.5;
							pointer-events: none;
						}

						.quantity-btn {
							width: 50rpx;
							height: 50rpx;
							line-height: 50rpx;
							text-align: center;
							background-color: #f5f5f5;
							border-radius: 25rpx;

							&.disabled {
								opacity: 0.5;
								pointer-events: none;
							}
						}

						.quantity {
							margin: 0 20rpx;
							min-width: 60rpx;
							text-align: center;
						}
					}

					.buy-whole-container {
						display: flex;
						align-items: center;
						margin-left: 20rpx;

						.buy-whole-btn {
							padding: 8rpx 20rpx;
							border: 2rpx solid #ddd;
							border-radius: 30rpx;
							font-size: 28rpx;
							transition: all 0.3s ease;

							&.active {
								background-color: #ff4d4f;
								border-color: #ff4d4f;
								color: #fff;
							}

							&:active {
								opacity: 0.8;
							}

							.btn-text {
								font-size: 24rpx;
							}
						}
					}
				}
			}
		}
	}

	.delivery-section {
		background: #fff;
		margin: 20rpx 0;
		padding: 30rpx 40rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 30rpx;
		}

		.delivery-options {
			display: flex;
			gap: 30rpx;

			.delivery-option {
				flex: 1;
				padding: 20rpx;
				border: 2rpx solid #ddd;
				border-radius: 10rpx;
				text-align: center;
				font-size: 28rpx;

				&.selected {
					border-color: #ff4d4f;
					color: #ff4d4f;
				}
			}
		}
	}

	.memo-section {
		background: #fff;
		margin: 20rpx 0;
		padding: 30rpx 40rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
		}

		.memo-input {
			width: 100%;
			height: 160rpx;
			padding: 20rpx;
			background: #f8f8f8;
			border-radius: 12rpx;
			font-size: 28rpx;
			line-height: 1.5;
		}

		.memo-count {
			text-align: right;
			font-size: 24rpx;
			color: #999;
			margin-top: 10rpx;
		}
	}

	.bottom-container {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
		z-index: 99;
	}

	.order-summary {
		padding: 30rpx 40rpx;
		background: #fff;
		border-top: 2rpx solid #f5f5f5;

		.summary-item {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			color: #666;
			font-size: 28rpx;
		}

		.summary-total {
			display: flex;
			justify-content: space-between;
			margin-top: 20rpx;
			padding-top: 20rpx;
			border-top: 2rpx solid #f5f5f5;
			font-size: 32rpx;
			font-weight: bold;
		}

		.discount-notice {
			color: #ff4d4f;
			font-size: 24rpx;
			margin-top: 10rpx;
		}
	}

	.submit-btn {
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		background: #ff4d4f;
		color: #fff;
		border: none;
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin: 0;
		padding-bottom: env(safe-area-inset-bottom);

		&.disabled {
			background: #ccc;
			opacity: 0.7;
		}

		&::after {
			border: none;
		}
	}
</style> 