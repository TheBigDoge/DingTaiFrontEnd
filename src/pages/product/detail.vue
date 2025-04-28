<template>
	<view class="product-detail">
		<!-- 商品轮播图 -->
		<swiper class="product-swiper" circular indicator-dots :autoplay="false" :duration="500">
			<swiper-item v-for="(item, index) in product.images" :key="index">
				<image :src="item" mode="aspectFill" class="slide-image" />
			</swiper-item>
		</swiper>

		<!-- 商品基本信息 -->
		<view class="product-info card">
			<view class="product-name">{{ product.name }}</view>
			<view class="product-code">商品编号：{{ product.code }}</view>
			<view class="price-row">
				<view class="price-info">
					<text class="member-price">¥{{ product.memberPrice }}<text class="price-unit">/m</text></text>
					<text class="original-price">¥{{ product.price }}/m</text>
				</view>
				<view class="sales-info">销量 {{ product.sales }}</view>
			</view>
		</view>

		<!-- 长度选择 -->
		<view class="specs-section card">
			<view class="section-title">长度选择</view>
			<view class="specs-list">
				<view class="spec-group">
					<view class="spec-title">长度(m)</view>
					<view class="length-input-container" :class="{ disabled: isWholePiece }">
						<view class="length-control" @click="decreaseLength" :class="{ disabled: isWholePiece }">-</view>
						<input type="digit" class="length-input" v-model="lengthInput" @blur="validateLength" :disabled="isWholePiece" />
						<view class="length-control" @click="increaseLength" :class="{ disabled: isWholePiece }">+</view>
					</view>
					<view class="length-tips">以0.1m为单位增减，最小0.85m，最大{{ maxLength }}m</view>
					<view class="buy-whole-container">
						<view class="buy-whole-btn" :class="{ active: isWholePiece }" @click="toggleWholePiece">
							<text class="btn-text">整块购买</text>
						</view>
					</view>
				</view>

				<!-- 显示总价 -->
				<view class="total-price-section">
					<view class="spec-title">总价</view>
					<view class="total-price">¥{{ calculateTotalPrice }}</view>
				</view>
			</view>
		</view>

		<!-- 商品详情 -->
		<view class="detail-section card">
			<view class="section-title">商品详情</view>
			<view class="detail-content">
				<image v-for="(item, index) in product.detailImages" :key="index" :src="item" mode="widthFix"
					class="detail-image" />
				<view class="detail-text">{{ product.description }}</view>
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

<script>
	export default {
		data() {
			return {
				id: null,
				product: {
					name: '意大利进口羊毛面料 精选VBC面料',
					code: 'VBC20240001',
					memberPrice: 100,
					price: 128,
					sales: 359,
					images: [
						'/static/images/products/italian-wool-main.jpg',
						'/static/images/products/italian-wool-texture.jpg',
						'/static/images/products/italian-wool-detail.jpg'
					],
					detailImages: [
						'/static/images/products/italian-wool-usage1.jpg',
						'/static/images/products/italian-wool-usage2.jpg'
					],
					description: '意大利VBC面料，100%羊毛，适合定制高级西装、外套等服装。面料手感柔软，垂顺度好，清晰的格纹图案彰显品味。'
				},
				lengthInput: '2.0',
				minLength: 0.85,
				maxLength: 10.0,
				isWholePiece: false
			}
		},
		computed: {
			// 计算总价
			calculateTotalPrice() {
				const length = parseFloat(this.lengthInput) || 0;
				const unitPrice = this.product.memberPrice || 0;
				return (length * unitPrice).toFixed(2);
			}
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				// 实际项目中，这里应该根据id请求商品详情
				// this.loadProductDetail(this.id)
			}
		},
		methods: {
			loadProductDetail(id) {
				// 实际项目中，这里应该请求接口获取商品详情
				console.log('加载商品详情，ID：', id)
			},
			decreaseLength() {
				if (this.isWholePiece) return;
				let currentValue = parseFloat(this.lengthInput);
				if (currentValue > this.minLength) {
					// 减少0.1m并保留一位小数
					currentValue = Math.max(this.minLength, (currentValue - 0.1).toFixed(1));
					this.lengthInput = currentValue.toString();
				}
			},
			increaseLength() {
				if (this.isWholePiece) return;
				let currentValue = parseFloat(this.lengthInput);
				if (currentValue < this.maxLength) {
					// 增加0.1m并保留一位小数
					currentValue = Math.min(this.maxLength, (currentValue + 0.1).toFixed(1));
					this.lengthInput = currentValue.toString();
				}
			},
			validateLength() {
				if (this.isWholePiece) {
					this.lengthInput = this.maxLength.toFixed(1);
					return;
				}
				// 确保输入是有效数字
				let value = parseFloat(this.lengthInput);

				// 如果不是有效数字，设置为最小值
				if (isNaN(value)) {
					value = this.minLength;
				}

				// 限制在允许范围内
				value = Math.max(this.minLength, Math.min(this.maxLength, value));

				// 四舍五入到最接近的0.1
				value = Math.round(value * 10) / 10;

				// 格式化为一位小数
				this.lengthInput = value.toFixed(1);
			},
			handleAddToCart() {
				if (!this.lengthInput) {
					uni.showToast({
						title: '请输入长度',
						icon: 'none'
					})
					return
				}

				uni.showLoading({
					title: '正在加入...'
				})

				// 构建购物车项目数据
				const cartItem = {
					id: this.product.id || this.id,
					name: this.product.name,
					image: this.product.images[0],
					length: parseFloat(this.lengthInput),
					unitPrice: this.product.memberPrice,
					selected: false
				};

				try {
					// 获取现有购物车数据
					const cartList = uni.getStorageSync('cartList') || [];
					
					// 检查是否已存在相同商品（相同ID和长度）
					const existingItemIndex = cartList.findIndex(item => 
						item.id === cartItem.id && item.length === cartItem.length
					);

					if (existingItemIndex !== -1) {
						// 如果已存在，增加数量
						cartList[existingItemIndex].selected = true;
					} else {
						// 如果不存在，添加新项目
						cartList.push(cartItem);
					}

					// 保存更新后的购物车数据
					uni.setStorageSync('cartList', cartList);

					uni.hideLoading();
					uni.showToast({
						title: '加入购物车成功',
						icon: 'success',
						success: () => {
							// Update the cart page path
							// uni.switchTab({
							//     url: '/pages/cart/cart'
							// });
						}
					});
				} catch (e) {
					console.error('添加到购物车失败:', e);
					uni.hideLoading();
					uni.showToast({
						title: '添加失败，请重试',
						icon: 'error'
					});
				}
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
				const orderData = {
					items: [{
						id: this.product.id || this.id,
						name: this.product.name,
						image: this.product.images[0],
						length: parseFloat(this.lengthInput),
						unitPrice: this.product.memberPrice,
						subtotal: parseFloat(this.calculateTotalPrice)
					}],
					totalAmount: parseFloat(this.calculateTotalPrice),
					discount: 0,
					finalAmount: parseFloat(this.calculateTotalPrice)
				};

				try {
					// 保存订单数据到本地存储
					uni.setStorageSync('currentOrder', orderData);
					
					// Update the order page path
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
			buyWholePiece() {
				// Set the length to the maximum allowed value
				this.lengthInput = this.maxLength.toFixed(1);
				uni.showToast({
					title: '已设置为整块购买',
					icon: 'success'
				});
			},
			toggleWholePiece() {
				this.isWholePiece = !this.isWholePiece;
				if (this.isWholePiece) {
					this.lengthInput = this.maxLength.toFixed(1);
					uni.showToast({
						title: '已设置为整块购买',
						icon: 'success'
					});
				} else {
					this.lengthInput = this.minLength.toFixed(1);
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

	.product-swiper {
		width: 100%;
		height: 750rpx;

		.slide-image {
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

				.original-price {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-light;
					text-decoration: line-through;
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
						margin-right: 8rpx;
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