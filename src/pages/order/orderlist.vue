<template>
	<view class="order-list-page">
		<!-- Header -->
		<view class="page-header">
			<text class="header-title">我的订单</text>
		</view>

		<!-- Status Filter Bar -->
		<view class="status-filter">
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'shipping' }"
				@click="filterOrdersByType('shipping')"
			>
				待收货
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'pending' }"
				@click="filterOrdersByType('pending')"
			>
				待发货
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'completed' }"
				@click="filterOrdersByType('completed')"
			>
				已完成
			</view>
			<view 
				class="filter-item" 
				:class="{ active: currentFilter === 'all' }"
				@click="filterOrdersByType('all')"
			>
				全部
			</view>
		</view>

		<!-- Order List -->
		<view class="order-list" v-if="orderList.length > 0">
			<view class="order-item" v-for="(order, index) in orderList" :key="index">
				<view class="order-header">
					<text class="order-no">订单号：{{ order.orderNo }}</text>
					<text class="order-status" :class="order.status">{{ getStatusText(order.status) }}</text>
				</view>
				
				<view class="order-content" @click="goToOrderDetail(order)">
					<view class="product-list">
						<view class="product-item" v-for="(item, itemIndex) in order.items" :key="itemIndex">
							<image class="product-image" :src="item.image" mode="aspectFill" />
							<view class="product-info">
								<view class="product-name">{{ item.name }}</view>
								<view class="product-spec" v-if="item.color">颜色：{{ item.color }}</view>
								<view class="product-price">
									<text class="price">¥{{ item.unitPrice }}/m</text>
									<text class="length">×{{ item.length }}m</text>
									<text class="subtotal">小计：¥{{ item.subtotal }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="order-footer">
					<view class="order-total">
						<text>共{{ getTotalItems(order) }}件商品</text>
						<text>实付：</text>
						<text class="total-price">¥{{ Number(order.finalAmount).toFixed(2) }}</text>
					</view>
					<view class="order-actions">
						<template v-if="order.status === 'shipping'">
							<button class="action-btn" @click="viewLogistics(order)">查看物流</button>
							<button class="action-btn primary" @click="confirmReceive(order)">确认收货</button>
						</template>
						<template v-else-if="order.status === 'completed'">
							<button class="action-btn" @click="deleteOrder(order)">删除订单</button>
						</template>
					</view>
				</view>
			</view>
		</view>

		<!-- Empty State -->
		<view class="empty-state" v-else>
			<image class="empty-icon" src="/static/images/empty-order.png" mode="aspectFit" />
			<text class="empty-text">暂无订单</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentFilter: 'all',
				orderList: [],
				allOrders: [], // Store all orders for filtering
				loading: false,
				noMore: false
			}
		},
		onLoad(options) {
			// Load orders from storage
			this.loadOrdersFromStorage();
			
			// If there's a type parameter, set the filter
			if (options.type) {
				this.currentFilter = options.type;
				this.filterOrdersByType(options.type);
			}
		},
		onShow() {
			// Reload orders when page is shown
			this.loadOrdersFromStorage();
		},
		methods: {
			loadOrdersFromStorage() {
				const orderList = uni.getStorageSync('orderList') || [];
				console.log('Loading orders from storage:', orderList);
				this.allOrders = orderList;
				this.orderList = [...orderList];
			},
			initializeSampleOrders() {
				const sampleOrders = [
					{
						orderNo: 'DT202403150001',
						status: 'pending',
						items: [
							{
								id: 1,
								name: '意大利进口羊毛面料',
								image: '/static/images/products/fabric1.jpg',
								color: '深灰色',
								unitPrice: 150,
								length: 2,
								subtotal: 300
							}
						],
						totalAmount: 300,
						discount: 30,
						shippingFee: 0,
						finalAmount: 270,
						orderTime: '2024-03-15T10:30:00Z'
					},
					{
						orderNo: 'DT202403140002',
						status: 'shipping',
						items: [
							{
								id: 2,
								name: '英国进口哈里斯粗花呢面料',
								image: '/static/images/products/fabric2.jpg',
								color: '米色',
								unitPrice: 120,
								length: 3,
								subtotal: 360
							}
						],
						totalAmount: 360,
						discount: 36,
						shippingFee: 0,
						finalAmount: 324,
						orderTime: '2024-03-14T15:45:00Z'
					},
					{
						orderNo: 'DT202403130003',
						status: 'completed',
						items: [
							{
								id: 3,
								name: '日本进口棉麻混纺面料',
								image: '/static/images/products/fabric3.jpg',
								color: '浅蓝色',
								unitPrice: 80,
								length: 4,
								subtotal: 320
							}
						],
						totalAmount: 320,
						discount: 32,
						shippingFee: 0,
						finalAmount: 288,
						orderTime: '2024-03-13T09:20:00Z'
					}
				];
				
				// Save sample orders to storage
				uni.setStorageSync('orderList', sampleOrders);
				console.log('Sample orders saved to storage:', sampleOrders);
				
				// Update component data
				this.allOrders = sampleOrders;
				this.orderList = [...sampleOrders];
			},
			getStatusText(status) {
				const statusMap = {
					pending: '待发货',
					shipping: '待收货',
					completed: '已完成'
				};
				return statusMap[status] || status;
			},
			getTotalItems(order) {
				return order.items.reduce((total, item) => total + item.length, 0);
			},
			goToOrderDetail(order) {
				uni.navigateTo({
					url: `/pages/order/detail?orderNo=${order.orderNo}`
				});
			},
			viewLogistics(order) {
				uni.navigateTo({
					url: `/pages/order/logistics?orderNo=${order.orderNo}`
				});
			},
			confirmReceive(order) {
				uni.showModal({
					title: '提示',
					content: '确认已收到商品？',
					success: res => {
						if (res.confirm) {
							// 这里添加确认收货的逻辑
							uni.showToast({
								title: '确认收货成功',
								icon: 'success'
							});
						}
					}
				});
			},
			deleteOrder(order) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该订单吗？',
					success: res => {
						if (res.confirm) {
							// 这里添加删除订单的逻辑
							uni.showToast({
								title: '订单已删除',
								icon: 'success'
							});
						}
					}
				});
			},
			filterOrdersByType(type) {
				this.currentFilter = type;
				if (type === 'all') {
					this.orderList = [...this.allOrders];
				} else {
					this.orderList = this.allOrders.filter(order => order.status === type);
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.order-list-page {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 30rpx;
	}

	.page-header {
		background: #fff;
		padding: 20rpx 30rpx;
		border-bottom: 2rpx solid #eee;

		.header-title {
			font-size: 32rpx;
			font-weight: bold;
		}
	}

	.status-filter {
		display: flex;
		background: #fff;
		padding: 20rpx 0;
		margin-bottom: 20rpx;
		position: sticky;
		top: 0;
		z-index: 1;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

		.filter-item {
			flex: 1;
			text-align: center;
			font-size: 28rpx;
			color: #666;
			position: relative;
			padding: 10rpx 0;

			&.active {
				color: #333;
				font-weight: 600;

				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
					width: 40rpx;
					height: 4rpx;
					background: #333;
					border-radius: 2rpx;
				}
			}
		}
	}

	.order-list {
		padding: 0 20rpx;

		.order-item {
			background: #fff;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			overflow: hidden;

			.order-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 20rpx 30rpx;
				border-bottom: 2rpx solid #eee;

				.order-no {
					font-size: 24rpx;
					color: #666;
				}

				.order-status {
					font-size: 24rpx;

					&.shipping {
						color: #4a90e2;
					}

					&.completed {
						color: #52c41a;
					}
				}
			}

			.order-content {
				padding: 20rpx 30rpx;

				.product-list {
					.product-item {
						display: flex;
						margin-bottom: 20rpx;

						&:last-child {
							margin-bottom: 0;
						}

						.product-image {
							width: 160rpx;
							height: 160rpx;
							border-radius: 8rpx;
							margin-right: 20rpx;
						}

						.product-info {
							flex: 1;

							.product-name {
								font-size: 28rpx;
								color: #333;
								margin-bottom: 10rpx;
							}

							.product-spec {
								font-size: 24rpx;
								color: #666;
								margin-bottom: 10rpx;
							}

							.product-price {
								display: flex;
								align-items: center;

								.price {
									font-size: 28rpx;
									color: #333;
									font-weight: bold;
								}

								.length {
									font-size: 24rpx;
									color: #666;
									margin: 0 10rpx;
								}

								.subtotal {
									font-size: 24rpx;
									color: #666;
									margin-left: auto;
								}
							}
						}
					}
				}
			}

			.order-footer {
				padding: 20rpx 30rpx;
				border-top: 2rpx solid #eee;

				.order-total {
					display: flex;
					justify-content: flex-end;
					align-items: center;
					margin-bottom: 20rpx;
					font-size: 24rpx;
					color: #666;

					.total-price {
						font-size: 32rpx;
						color: #333;
						font-weight: bold;
						margin-left: 10rpx;
					}
				}

				.order-actions {
					display: flex;
					justify-content: flex-end;

					.action-btn {
						margin-left: 20rpx;
						padding: 10rpx 30rpx;
						border-radius: 30rpx;
						font-size: 24rpx;
						background: #f5f5f5;
						color: #666;
						border: none;

						&.primary {
							background: #333;
							color: #fff;
						}

						&.cancel {
							background: #fff;
							color: #666;
							border: 2rpx solid #ddd;
						}
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
			width: 200rpx;
			height: 200rpx;
			margin-bottom: 30rpx;
		}

		.empty-text {
			color: #999;
			font-size: 28rpx;
		}
	}
</style> 