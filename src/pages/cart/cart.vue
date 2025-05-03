<template>
	<view class="cart-page">
		<!-- Add header with cart count and management button -->
		<view class="page-header">
			<view class="header-title">
				购物车<text v-if="cartList.length > 0">({{ cartList.length }})</text>
			</view>
			<view class="header-right">
				<text class="manage-text" @click="toggleManageMode">{{ isManageMode ? '退出管理' : '管理' }}</text>
			</view>
		</view>

		<view class="cart-content" v-if="cartList.length > 0">
			<view class="cart-list">
				<view class="cart-item" v-for="(item, index) in cartList" :key="index">
					<view class="item-select">
						<checkbox :checked="item.selected" :color="'#333'" @click="toggleSelect(index)" />
					</view>
					<image class="item-image" :src="item.image" mode="aspectFill" />
					<view class="item-info">
						<view class="item-name text-ellipsis-2">{{ item.name }}</view>
						<view class="item-spec" v-if="item.color">颜色：{{ item.color }}</view>
						<view class="item-bottom">
							<view class="item-price">
								<text class="member-price">¥{{ (item.unitPrice * 0.9).toFixed(2) }}/m</text>
								<text class="original-price">¥{{ item.unitPrice }}/m</text>
							</view>
							<view class="item-count">
								<text class="count-btn" @click="decreaseLength(index)">-</text>
								<text class="count-num">{{ item.length }}</text>
								<text class="count-btn" @click="increaseLength(index)">+</text>
							</view>
						</view>
					</view>
					<!-- Add delete button that shows in management mode -->
					<view v-if="isManageMode" class="delete-icon" @click="handleDeleteItem(index)">
						<text class="iconfont icon-delete">×</text>
					</view>
				</view>
			</view>

			<view class="promotion-section">
				<view class="promotion-item">
					<text class="tag">满减</text>
					<text class="promo-text">每200减30</text>
				</view>
			</view>

			<!-- Bottom action bar -->
			<view class="cart-footer safe-area-bottom">
				<view class="footer-left">
					<checkbox :checked="isAllSelected" :color="'#333'" @click="toggleSelectAll" />
					<text class="select-all">全选</text>
				</view>
				<view class="footer-right">
					<template v-if="isManageMode">
						<view class="delete-btn" @click="handleDeleteSelected">删除</view>
					</template>
					<template v-else>
						<view class="price-section">
							<view class="total-price">
								<text>合计：</text>
								<text class="price">¥{{ totalPrice }}</text>
							</view>
							<view class="discount-info" v-if="discount > 0">已优惠：¥{{ discount }}</view>
							<view class="member-discount-info">会员享受9折优惠</view>
						</view>
						<view class="checkout-btn" @click="handleCheckout">
							结算({{ selectedCount }}件)
						</view>
					</template>
				</view>
			</view>
		</view>

		<view class="empty-cart" v-else>
			<image class="empty-icon" src="/static/images/empty-cart.png" mode="aspectFit" />
			<text class="empty-text">购物车还是空的</text>
			<view class="go-shopping" @click="goShopping">去选购</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isManageMode: false,
				cartList: []
			}
		},
		computed: {
			isAllSelected() {
				return this.cartList.length > 0 && this.cartList.every(item => item.selected)
			},
			selectedCount() {
				return this.cartList.filter(item => item.selected).length
			},
			totalPrice() {
				return this.cartList
					.filter(item => item.selected)
					.reduce((total, item) => {
						const itemTotal = item.unitPrice * item.length * 0.9; // Apply member discount
						return total + itemTotal;
					}, 0).toFixed(2)
			},
			discount() {
				const totalPriceNum = parseFloat(this.totalPrice);
				if (totalPriceNum >= 200) {
					return Math.floor(totalPriceNum / 200) * 30
				}
				return 0
			}
		},
		onShow() {
			// 从本地存储获取购物车数据
			const cartList = uni.getStorageSync('cartList') || [];
			this.cartList = cartList.map(item => ({
				...item,
				selected: false // 初始化选中状态为false
			}));
		},
		methods: {
			toggleSelect(index) {
				this.cartList[index].selected = !this.cartList[index].selected;
				this.saveCartList();
			},
			toggleSelectAll() {
				const newStatus = !this.isAllSelected;
				this.cartList.forEach(item => item.selected = newStatus);
				this.saveCartList();
			},
			decreaseLength(index) {
				const currentItem = this.cartList[index];
				if (currentItem.length > 0.85) {
					currentItem.length = parseFloat((currentItem.length - 0.1).toFixed(1));
					this.saveCartList();
				} else {
					uni.showModal({
						title: '提示',
						content: '确定要删除该商品吗？',
						success: res => {
							if (res.confirm) {
								this.cartList.splice(index, 1);
								this.saveCartList();
							}
						}
					});
				}
			},
			increaseLength(index) {
				const currentItem = this.cartList[index];
				currentItem.length = parseFloat((currentItem.length + 0.1).toFixed(1));
				this.saveCartList();
			},
			handleCheckout() {
				const selectedItems = this.cartList.filter(item => item.selected);
				
				if (selectedItems.length === 0) {
					uni.showToast({
						title: '请选择要结算的商品',
						icon: 'none'
					});
					return;
				}

				// 构建订单数据
				const orderData = {
					items: selectedItems.map(item => ({
						id: item.id,
						name: item.name,
						image: item.image,
						color: item.color,
						length: item.length,
						unitPrice: item.unitPrice,
						subtotal: item.length * item.unitPrice
					})),
					totalAmount: selectedItems.reduce((sum, item) => sum + item.length * item.unitPrice, 0),
					discount: this.discount,
					finalAmount: selectedItems.reduce((sum, item) => sum + item.length * item.unitPrice, 0) - this.discount
				};

				try {
					// 保存订单数据到本地存储
					uni.setStorageSync('currentOrder', orderData);
					
					// 跳转到订单页面
					uni.navigateTo({
						url: '/pages/order/order',
						success: () => {
							console.log('Navigation successful');
						},
						fail: (err) => {
							console.error('Navigation failed:', err);
							uni.showToast({
								title: '页面跳转失败',
								icon: 'error'
							});
						}
					});
				} catch (e) {
					console.error('处理订单失败:', e);
					uni.showToast({
						title: '处理订单失败，请重试',
						icon: 'error'
					});
				}
			},
			goShopping() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			toggleManageMode() {
				this.isManageMode = !this.isManageMode;
				// 退出管理模式时，重置所有选中状态
				if (!this.isManageMode) {
					this.cartList.forEach(item => item.selected = false);
					this.saveCartList();
				}
			},
			handleDeleteSelected() {
				const selectedItems = this.cartList.filter(item => item.selected);
				if (selectedItems.length === 0) {
					uni.showToast({
						title: '请选择要删除的商品',
						icon: 'none'
					});
					return;
				}

				uni.showModal({
					title: '提示',
					content: `确定要删除选中的${selectedItems.length}件商品吗？`,
					success: res => {
						if (res.confirm) {
							this.cartList = this.cartList.filter(item => !item.selected);
							this.saveCartList();
							if (this.cartList.length === 0) {
								this.isManageMode = false;
							}
						}
					}
				});
			},
			handleDeleteItem(index) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该商品吗？',
					success: res => {
						if (res.confirm) {
							this.cartList.splice(index, 1);
							this.saveCartList();
							if (this.cartList.length === 0) {
								this.isManageMode = false;
							}
						}
					}
				});
			},
			saveCartList() {
				// 保存购物车数据到本地存储
				uni.setStorageSync('cartList', this.cartList);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/uni.scss';
	.cart-page {
		min-height: 100vh;
		background-color: $uni-bg-color-grey;
		padding-bottom: 200rpx;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #fff;
		border-bottom: 2rpx solid $uni-border-color;

		.header-title {
			font-size: 32rpx;
			font-weight: bold;
		}

		.header-right {
			.manage-text {
				font-size: 28rpx;
				color: #666;
			}
		}
	}

	.cart-content {
		margin-bottom: 140rpx;
	}

	.cart-list {
		background-color: #fff;
		margin-bottom: $uni-spacing-md;

		.cart-item {
			display: flex;
			padding: $uni-spacing-md;
			border-bottom: 2rpx solid $uni-border-color;
			position: relative;

			.item-select {
				display: flex;
				align-items: center;
				margin-right: $uni-spacing-sm;
			}

			.item-image {
				width: 160rpx;
				height: 160rpx;
				border-radius: $uni-border-radius-sm;
				margin-right: $uni-spacing-md;
			}

			.item-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.item-name {
					font-size: $uni-font-size-sm;
					color: $uni-text-color;
					margin-bottom: $uni-spacing-xs;
				}

				.item-spec {
					font-size: $uni-font-size-xs;
					color: $uni-text-color-light;
					margin-bottom: $uni-spacing-xs;
				}

				.item-bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.item-price {
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						gap: 4rpx;

						.member-price {
							color: $uni-price-color;
							font-size: $uni-font-size-md;
							font-weight: bold;
						}

						.original-price {
							color: $uni-text-color-light;
							font-size: $uni-font-size-xs;
							text-decoration: line-through;
						}
					}

					.item-count {
						display: flex;
						align-items: center;

						.count-btn {
							width: 60rpx;
							height: 60rpx;
							line-height: 60rpx;
							text-align: center;
							border: 2rpx solid $uni-border-color;
							background-color: #f8f8f8;
						}

						.count-num {
							min-width: 100rpx;
							height: 60rpx;
							line-height: 60rpx;
							text-align: center;
							border-top: 2rpx solid $uni-border-color;
							border-bottom: 2rpx solid $uni-border-color;
						}
					}
				}
			}

			.delete-icon {
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 44rpx;
				height: 44rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.iconfont {
					font-size: 44rpx;
					color: #999;
				}
			}
		}
	}

	.promotion-section {
		background-color: #fff;
		padding: $uni-spacing-md;
		margin-bottom: $uni-spacing-md;

		.promotion-item {
			display: flex;
			align-items: center;

			.tag {
				font-size: $uni-font-size-xs;
				color: #fff;
				background-color: $uni-price-color;
				padding: 4rpx 10rpx;
				border-radius: 4rpx;
				margin-right: $uni-spacing-sm;
			}

			.promo-text {
				font-size: $uni-font-size-sm;
				color: $uni-text-color;
			}
		}
	}

	.cart-footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100rpx;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
		z-index: 100;

		.footer-left {
			display: flex;
			align-items: center;

			.select-all {
				margin-left: 10rpx;
				font-size: 28rpx;
				color: #333;
			}
		}

		.footer-right {
			display: flex;
			align-items: center;

			.price-section {
				margin-right: 20rpx;
				text-align: right;

				.total-price {
					font-size: 28rpx;
					color: #333;

					.price {
						font-size: 32rpx;
						font-weight: bold;
						color: #ff4d4f;
					}
				}

				.discount-info {
					font-size: 24rpx;
					color: #ff4d4f;
				}

				.member-discount-info {
					font-size: 24rpx;
					color: #666;
				}
			}

			.checkout-btn {
				width: 200rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: #ff4d4f;
				color: #fff;
				text-align: center;
				border-radius: 40rpx;
				font-size: 28rpx;
				font-weight: bold;
			}

			.delete-btn {
				width: 200rpx;
				height: 80rpx;
				line-height: 80rpx;
				background: #ff4d4f;
				color: #fff;
				text-align: center;
				border-radius: 40rpx;
				font-size: 28rpx;
				font-weight: bold;
			}
		}
	}

	.safe-area-bottom {
		padding-bottom: env(safe-area-inset-bottom);
	}

	.empty-cart {
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
			font-size: $uni-font-size-sm;
			color: $uni-text-color-light;
			margin-bottom: 30rpx;
		}

		.go-shopping {
			width: 200rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: $uni-price-color;
			color: #fff;
			border-radius: 40rpx;
			font-size: $uni-font-size-sm;
		}
	}
</style>