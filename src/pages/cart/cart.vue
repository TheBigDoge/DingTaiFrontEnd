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
			<scroll-view class="cart-list" scroll-y @scrolltolower="fetchCartItems">
				<view class="cart-item" v-for="(item, index) in cartList" :key="item.id" @click="goToProductDetail(item.product_id)">
					<view class="item-select">
						<checkbox :checked="item.selected" :color="'#333'" @click="toggleSelect(index)" />
					</view>
					<image class="item-image" :src="item.product.image" mode="aspectFill" />
					<view class="item-info">
						<view class="item-name text-ellipsis-2">{{ item.product.name }}</view>
						<view>
							<text>购买长度: {{ item.is_partial_sale ? item.stock : item.product.available_stock }}m</text>
							<text class="tag" v-if="!item.is_partial_sale"> 整块购买 </text>
						</view>
						<view class="item-bottom">
							<view class="item-price">
								<view v-if="isPremium">
									<view>
										<text class="price-label">会员价:</text>
										<text class="member-price">¥{{ (item.product.memberPrice).toFixed(2) }}/m</text>
									</view>
									<view style="text-decoration: line-through">
										<text class="price-label">原价:</text>
										<text class="original-price">¥{{ item.product.price.toFixed(2) }}/m</text>
									</view>
								</view>
								<view v-else>
									<view>
										<text class="price-label">单价:</text>
										<text class="original-price">¥{{ item.product.price.toFixed(2) }}/m</text>
									</view>
									<view>
										<text class="price-label">会员价:</text>
										<text class="member-price">¥{{ (item.product.memberPrice).toFixed(2) }}/m</text>
									</view>
								</view>

							</view>
						</view>
					</view>
					<!-- Add delete button that shows in management mode -->
					<view v-if="isManageMode" class="delete-icon" @click="handleDeleteItem(index)">
						<text class="iconfont icon-delete">×</text>
					</view>
				</view>
			</scroll-view>

			<!-- Bottom action bar -->
			<view class="cart-footer">
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
								<text class="price">¥{{ totalPrice() }}</text>
							</view>
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

<script lang="ts">
	import { CartItem, DeleteCartItem, DeleteCartItems, ListCartItems, newCartItem } from '@/api/cart'
	import { GlobalData } from '@/store';
	import { PricePerMeter } from '@/utils/price';

	interface CartItemExtra {
		selected: boolean,
	}

	type MyCartItem = CartItem & CartItemExtra;

	export default {
		data() {
			return {
				isManageMode: false,
				cartList: [] as MyCartItem[],
				page_size: 10,
				page: 1,
				loading: false,
				has_more: true,
			}
		},
		computed: {
			isAllSelected() {
				return this.cartList.length > 0 && this.cartList.every(item => item.selected)
			},
			selectedCount() {
				return this.cartList.filter(item => item.selected).length
			},
			isPremium() {
				return GlobalData.is_premium();
			}
		},
		onLoad() {
			this.reset();
			this.fetchCartItems();
		},
		onShow() {
			console.log('on show');
			this.reset();
			this.fetchCartItems();
		},
		methods: {
			reset() {
				this.isManageMode = false;
				this.cartList = [];
				this.loading = false;
				this.has_more = true;
				this.page = 1;
			},
			fetchCartItems() {
				if (!this.loading && this.has_more) {
					console.log('fetch cart items');
					this.loading = true;
					ListCartItems(this.page, this.page_size)
						.then(response => {
							console.log(response);
							const list = [] as MyCartItem[];
							for (const item of response.results) {
								const cartItem = newCartItem(item);
								list.push({
									...cartItem,
									selected: false,
								});
							}

							if (list.length > 0) {
								console.log('has list', list);
								const newList = [
									...this.cartList,
									...list,
								];

								// 移除同id的元素
								const existsIds = new Set();
								const toSet = newList.filter(item => {
									if (existsIds.has(item.id)) {
										return false;
									}

									existsIds.add(item.id);
									return true;
								});
								console.log('toSet', toSet);
								this.cartList = toSet;
								this.has_more = true;
								this.page += 1;
							} else {
								console.log('no list');
								this.has_more = false;
							}

							this.loading = false;
						})
				}
			},

			totalPrice(): PricePerMeter {
				const isPremium = this.isPremium;

				return this.cartList
					.filter(item => item.selected)
					.map(item => {
						if (isPremium) {
							return item.product.memberPrice * (item.is_partial_sale ? item.stock : item.product.available_stock)
						} else {
							return item.product.price * (item.is_partial_sale ? item.stock : item.product.available_stock)
						}
					})
					.reduce((a, b) => a + b, 0)
			},
			toggleSelect(index: number) {
				this.cartList[index].selected = !this.cartList[index].selected;
			},
			toggleSelectAll() {
				const newStatus = !this.isAllSelected;
				this.cartList.forEach(item => item.selected = newStatus);
			},
			handleCheckout() {
				// const selectedItems = this.cartList.filter(item => item.selected);
				
				// if (selectedItems.length === 0) {
				// 	uni.showToast({
				// 		title: '请选择要结算的商品',
				// 		icon: 'none'
				// 	});
				// 	return;
				// }

				// // 构建订单数据
				// const orderData = {
				// 	items: selectedItems.map(item => ({
				// 		id: item.id,
				// 		name: item.name,
				// 		image: item.image,
				// 		color: item.color,
				// 		length: item.length,
				// 		unitPrice: item.unitPrice,
				// 		subtotal: item.length * item.unitPrice
				// 	})),
				// 	totalAmount: selectedItems.reduce((sum, item) => sum + item.length * item.unitPrice, 0),
				// 	discount: this.discount,
				// 	finalAmount: selectedItems.reduce((sum, item) => sum + item.length * item.unitPrice, 0) - this.discount
				// };

				// try {
				// 	// 保存订单数据到本地存储
				// 	uni.setStorageSync('currentOrder', orderData);
					
				// 	// 跳转到订单页面
				// 	uni.navigateTo({
				// 		url: '/pages/order/order',
				// 		success: () => {
				// 			console.log('Navigation successful');
				// 		},
				// 		fail: (err) => {
				// 			console.error('Navigation failed:', err);
				// 			uni.showToast({
				// 				title: '页面跳转失败',
				// 				icon: 'error'
				// 			});
				// 		}
				// 	});
				// } catch (e) {
				// 	console.error('处理订单失败:', e);
				// 	uni.showToast({
				// 		title: '处理订单失败，请重试',
				// 		icon: 'error'
				// 	});
				// }
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
							const toDeleteItems = this.cartList.filter(item => item.selected);
							const toDeleteIds = toDeleteItems.map(item => item.id);

							uni.showLoading({ title: '删除中' });
							DeleteCartItems(toDeleteIds)
								.then(() => uni.hideLoading())
								.then(() => {
									this.reset();
									return this.fetchCartItems();
								})
								.then(() => uni.showToast({title: '删除成功'}))
						}
					}
				});
			},
			handleDeleteItem(index: number) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该商品吗？',
					success: res => {
						if (res.confirm) {
							const item = this.cartList[index];

							uni.showLoading({ title: '删除中' });
							DeleteCartItem(item.id)
								.then(() => uni.hideLoading())
								.then(() => {
									this.reset();
									return this.fetchCartItems();
								})
								.then(() => uni.showToast({title: '删除成功'}))
						}
					}
				});
			},
			goToProductDetail(productId: number) {
				if (this.isManageMode) {
					return;
				}
				uni.navigateTo({
					url: `/pages/product/detail?id=${productId}`
				});
			},
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

	.price-label {
		color: $uni-text-color-light;
		font-size: $uni-font-size-xs;
		margin-right: 8rpx;
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

	.tag {
		font-size: 24rpx;
		color: #4d71ff;
		border: 1rpx solid #4d71ff;
		padding: 0rpx 10rpx;
		border-radius: 4rpx;
		margin-left: 20rpx;
		text-align: center;
	}

	.cart-content {
		// margin-bottom: 140rpx;
		height: calc(100vh - 100rpx); // 减去 header/footer 的高度
		overflow: hidden;
	}

	.cart-list {
		background-color: #fff;
		margin-bottom: $uni-spacing-md;
		height: 100%;

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
							text-decoration: none;
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
