<template>
	<view class="product-detail">
		<!-- 商品轮播图 -->
		<swiper class="product-swiper" circular indicator-dots :autoplay="false" :duration="500">
			<swiper-item v-for="(item, index) in product?.media" :key="index">
				<image :src="item.image.url" mode="aspectFill" class="slide-media" v-if="item.type === 'image'" />
				<video
					v-if="item.type === 'video'"
					:src="item.video.url"
					controls
					autoplay
					loop
					muted
					objectFit='contain'
					class='slide-media'
				></video>
			</swiper-item>
		</swiper>

		<!-- 商品基本信息 -->
		<view class="product-info card">
			<view class="product-name">
				{{ product?.name }}
			</view>
			<view class="product-code">
				<text>
					商品编号：{{ product?.number }}
				</text>

				<text v-if="product?.vip_only" class="tag">
					会员专享
				</text>
			</view>
			<view class="price-row">
				<view class="price-info" v-if="product?.vip_only">
					<text class="price-label">会员价:</text>
					<text class="member-price">¥{{ product?.memberPrice }}<text class="price-unit">/m</text></text>
				</view>
				<view class="price-info" v-else>
					<view v-if="isPremium">
						<text class="member-price">
							<text class="price-label">会员价:</text>
							¥{{ product?.memberPrice }}<text class="price-unit">/m</text>
						</text>
						<text class="original-price-cancel" style="margin-left: 30rpx">
							<text class="price-label">原价:</text>
							¥{{ product?.price }}/m
						</text>
					</view>
					<view v-else>
						<text class="original-price">
							<text class="price-label">价格:</text>
							¥{{ product?.price }}/m
						</text>
						<text class="member-price" style="margin-left: 30rpx">
							<text class="price-label">会员价:</text>
							¥{{ product?.memberPrice }}<text class="price-unit">/m</text>
						</text>
					</view>
				</view>
				<view class="sales-info">销量 {{ product?.order_quantity }}</view>
			</view>
		</view>

		<!-- 长度选择 -->
		<view class="specs-section card">
			<view class="section-title">长度选择</view>
			<view class="specs-list">
				<view class="spec-group">
					<view class="spec-title">
						长度(m)
						<text
							v-if="!product?.allow_partial_sale"
							class="tag"
							style="margin-left: 40rpx; color: red; border: 1px solid red"
						> 非拆分售卖品
						</text>
					</view>
					<view class="length-input-container" :class="{ disabled: isWholePiece }">
						<view class="length-control" @click="decreaseLength" :class="{ disabled: isWholePiece }">-</view>
						<input type="digit" class="length-input" v-model="lengthInput" @blur="validateLength" :disabled="isWholePiece" />
						<view class="length-control" @click="increaseLength" :class="{ disabled: isWholePiece }">+</view>
					</view>
					<view class="length-tips">
						以0.1m为单位增减，最小{{product?.min_order_stock}}m，最大{{ product?.available_stock }}m
					</view>
					<view class="buy-whole-container">
						<view class="buy-whole-btn" :class="{ active: isWholePiece }" @click="toggleWholePiece">
							<text class="btn-text">整块购买</text>
						</view>
					</view>
				</view>

				<!-- 显示总价 -->
				<view class="total-price-section">
					<view class="spec-title">总价</view>
					<view class="total-price">{{ totalPriceDisplay() }}</view>
				</view>
			</view>
		</view>

		<!-- 商品详情 -->
		<view class="detail-section card">
			<view class="section-title">商品详情</view>
			<view class="detail-content">
				<view class="detail-text">{{ product?.description }}</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="action-bar safe-area-bottom">
			<view class="action-right">
				<view class="add-cart-btn" @click="handleAddToCart">加入购物车</view>
				<view class="buy-now-btn" @click="handleBuyNow">立即购买</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import { AddCartItem, AddCartItemRequest } from '@/api/cart';
	import { GetProductById, newProduct, Product } from '@/api/product';
import { GlobalData } from '@/store';

	export default {
		data() {
			return {
				id: null as null | number,
				product: null as null | Product,
				lengthInput: 0.0,
				isWholePiece: false
			}
		},
		computed: {
			isPremium(): boolean {
				return GlobalData.is_premium();
			},
		},
		onLoad(options: any) {
			if (options?.id) {
				this.id = options.id
				this.loadProductDetail();
			}
		},
		methods: {
			loadProductDetail() {
				if (this.id) {
					GetProductById(this.id)
						.then(newProduct)
						.then(product => {
							this.product = product;
							this.isWholePiece = !this.product.allow_partial_sale;
							this.lengthInput = this.isWholePiece ? this.product.available_stock : this.product.min_order_stock;
						});
				}
			},
			calculateTotalPrice() {
				if (!this.product) {
					return 0;
				}

				if (this.product.vip_only && !this.isPremium) {
					// 不允许购买
					return 0;
				}

				const price = this.isPremium ? this.product.memberPrice : this.product.price;
				const total = parseFloat((price * this.lengthInput).toFixed(2));
				return total;
			},

			totalPriceDisplay(): string {
				const price = this.calculateTotalPrice();
				if (!price) {
					return "无法购买"
				} else {
					return `¥${price}`;
				}
			},

			decreaseLength() {
				if (this.isWholePiece) return;
				if (!this.product) return;

				let currentValue = this.lengthInput;
				if (currentValue > this.product.min_order_stock) {
					// 减少0.1m并保留一位小数
					currentValue = Math.max(this.product.min_order_stock, parseFloat((currentValue - 0.1).toFixed(1)));
					this.lengthInput = currentValue;
				}
			},
			increaseLength() {
				if (this.isWholePiece) return;
				if (!this.product) return;

				let currentValue = this.lengthInput;
				if (currentValue < this.product.available_stock) {
					// 增加0.1m并保留一位小数
					currentValue = Math.min(this.product.available_stock, parseFloat((currentValue + 0.1).toFixed(1)));
					this.lengthInput = currentValue;
				}
			},
			validateLength() {
				if (!this.product) {
					uni.showToast({ title: '产品不存在'});
					return;
				}

				if (this.isWholePiece) {
					this.lengthInput = this.product?.available_stock;
					return;
				}
				// 确保输入是有效数字
				let value = this.lengthInput;

				// 如果不是有效数字，设置为最小值
				if (isNaN(value)) {
					value = this.product.min_order_stock;
				}

				// 限制在允许范围内
				value = Math.max(this.product.min_order_stock, Math.min(this.product.available_stock, value));

				// 四舍五入到最接近的0.1
				value = Math.round(value * 10) / 10;

				// 格式化为一位小数
				this.lengthInput = parseFloat(value.toFixed(1));
			},
			handleAddToCart() {
				if (!this.product) {
					return;
				}

				if (!this.lengthInput) {
					uni.showToast({
						title: '请输入长度',
						icon: 'none'
					})
					return
				}

				uni.showLoading({ title: '正在加入购物车' })

				// 构建购物车项目数据
				const cartItem = {
					product_id: this.product.id,
					is_partial_sale: !this.isWholePiece,
					stock: (this.isWholePiece ? 0 : this.lengthInput) * 100,
				} as AddCartItemRequest;

				AddCartItem(cartItem)
					.then(() => {
						uni.hideLoading();
						uni.showToast({title: '加入购物车成功'});
					});
			},
			handleBuyNow() {
				if (!this.lengthInput) {
					uni.showToast({
						title: '请输入长度',
						icon: 'none'
					});
					return;
				}

				// 构建订单数据
				// const orderData = {
				// 	items: [{
				// 		id: this.product.id || this.id,
				// 		name: this.product.name,
				// 		image: this.product.images[0],
				// 		length: parseFloat(this.lengthInput),
				// 		unitPrice: this.product.memberPrice,
				// 		subtotal: parseFloat(this.calculateTotalPrice)
				// 	}],
				// 	totalAmount: parseFloat(this.calculateTotalPrice),
				// 	discount: 0,
				// 	finalAmount: parseFloat(this.calculateTotalPrice)
				// };

				// try {
				// 	// 保存订单数据到本地存储
				// 	uni.setStorageSync('currentOrder', orderData);
					
				// 	// Update the order page path
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
			toggleWholePiece() {
				if (!this.product) {
					return;
				}

				if (!this.product.allow_partial_sale) {
					return;
				}

				this.isWholePiece = !this.isWholePiece;
				if (this.isWholePiece) {
					this.lengthInput = parseFloat(this.product.available_stock.toFixed(1));
					uni.showToast({
						title: '已设置为整块购买',
						//icon: 'success'
						icon: 'none'
					});
				} else {
					this.lengthInput = parseFloat(this.product.min_order_stock.toFixed(1));
					uni.showToast({
						title: '已取消整块购买',
						icon: 'none'
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.product-detail {
		padding-bottom: 140rpx;
	}

	.tag {
		font-size: 24rpx;
		color: #4d71ff;
		border: 1rpx solid #4d71ff;
		padding: 2rpx 10rpx 3rpx 10rpx;
		border-radius: 4rpx;
		margin-left: 30rpx;
		text-align: center;
	}

	.price-label {
		color: $uni-text-color-light;
		font-size: $uni-font-size-xs;
		margin-right: 8rpx;
	}

	.product-swiper {
		width: 100%;
		height: 750rpx;

		.slide-media {
			width: 100%;
			height: 100%;
		}
	}

	.card {
		margin: 20rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: $uni-border-radius-md;
		box-shadow: $uni-box-shadow;
	}

	.product-info {
		.product-name {
			font-size: $uni-font-size-lg;
			font-weight: bold;
			color: $uni-text-color;
			margin-bottom: 16rpx;
		}

		.product-code {
			font-size: $uni-font-size-xs;
			color: $uni-text-color-light;
			margin-bottom: 20rpx;
		}

		.price-row {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.price-info {
				.member-price {
					font-size: 40rpx;
					color: $uni-price-color;
					font-weight: bold;
					margin-right: 16rpx;

					.price-unit {
						font-size: 24rpx;
						font-weight: normal;
					}
				}

				.original-price-cancel {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-light;
					text-decoration: line-through;
				}

				.original-price {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-light;
					text-decoration: none;
				}
			}

			.sales-info {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-light;
			}
		}
	}

	.section-title {
		font-size: $uni-font-size-md;
		font-weight: bold;
		color: $uni-text-color;
		margin-bottom: 30rpx;
		position: relative;

		&::after {
			content: '';
			position: absolute;
			left: 0;
			bottom: -10rpx;
			width: 40rpx;
			height: 4rpx;
			background-color: $uni-color-primary;
		}
	}

	.specs-list {
		.spec-group {
			margin-bottom: 30rpx;

			.spec-title {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-secondary;
				margin-bottom: 20rpx;
			}

			.length-input-container {
				display: flex;
				align-items: center;
				width: 100%;
				height: 70rpx;
				border: 1rpx solid $uni-border-color;
				border-radius: 8rpx;
				overflow: hidden;

				&.disabled {
					opacity: 0.5;
					background-color: #f5f5f5;
				}

				.length-control {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 70rpx;
					height: 70rpx;
					font-size: 32rpx;
					background-color: #f5f5f5;
					color: $uni-text-color;

					&.disabled {
						background-color: #e0e0e0;
						color: $uni-text-color-light;
					}
				}

				.length-input {
					flex: 1;
					height: 70rpx;
					text-align: center;
					font-size: 28rpx;

					&:disabled {
						background-color: #f5f5f5;
						color: $uni-text-color-light;
					}
				}
			}

			.length-tips {
				margin-top: 10rpx;
				font-size: 24rpx;
				color: $uni-text-color-light;
			}

			.buy-whole-container {
				margin-top: 20rpx;
				display: flex;
				justify-content: flex-end;

				.buy-whole-btn {
					display: flex;
					align-items: center;
					padding: 10rpx 20rpx;
					background-color: rgba($uni-color-primary, 0.1);
					color: $uni-color-primary;
					border-radius: 30rpx;
					font-size: 24rpx;
					transition: all 0.3s ease;

					&.active {
						background-color: $uni-color-primary;
						color: #fff;
					}

					.btn-text {
						text-align: center;
					}
				}
			}
		}

		.total-price-section {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 30rpx;
			padding-top: 20rpx;
			border-top: 1rpx dashed $uni-border-color;

			.total-price {
				font-size: 36rpx;
				color: $uni-price-color;
				font-weight: bold;
			}
		}
	}

	.detail-section {
		.section-title {
			font-size: $uni-font-size-md;
			font-weight: bold;
			color: $uni-text-color;
			margin-bottom: 20rpx;
		}

		.detail-content {
			.detail-image {
				width: 100%;
				margin-bottom: 20rpx;
			}

			.detail-text {
				font-size: $uni-font-size-sm;
				color: $uni-text-color;
				line-height: 1.6;
			}
		}
	}

	.action-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		background-color: #fff;
		display: flex;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

		.action-right {
			flex: 1;
			display: flex;
			align-items: center;
			padding: 0 20rpx;
			height: 120rpx;

			.add-cart-btn,
			.buy-now-btn {
				flex: 1;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				border-radius: 35rpx;
				font-size: $uni-font-size-sm;
			}

			.add-cart-btn {
				background-color: rgba($uni-price-color, 0.1);
				color: $uni-price-color;
				margin-right: 20rpx;
			}

			.buy-now-btn {
				background-color: $uni-price-color;
				color: #fff;
			}
		}
	}
</style>