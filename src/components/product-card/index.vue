<template>
	<view class="product-card" @click="handleClick">
		<image :src="product.image" mode="aspectFill" class="product-image" />
		<view class="product-info">
			<text class="product-name">{{ product.name }}</text>
			<view class="price-row">
				<view class="member-price">
					<!-- <text class="label">会员价：</text> -->
					<text class="price">¥{{ product.memberPrice }}<text class="unit">/m</text></text>
				</view>
				<text class="original-price">¥{{ product.price }}/m</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ProductCard',
		props: {
			product: {
				type: Object,
				required: true,
				default: () => ({
					image: '',
					name: '',
					memberPrice: 0,
					price: 0
				})
			}
		},
		methods: {
			handleClick() {
				this.$emit('click', this.product)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.product-card {
		background: #fff;
		border-radius: 12rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
		box-sizing: border-box;
		width: 100%;

		.product-image {
			width: 100%;
			height: 320rpx;
		}

		.product-info {
			padding: 20rpx;

			.product-name {
				font-size: 28rpx;
				color: #333;
				line-height: 1.4;
				margin-bottom: 16rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
				height: 78rpx;
			}

			.price-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: nowrap;

				.member-price {
					display: flex;
					align-items: baseline;
					flex-shrink: 0;

					.label {
						font-size: 24rpx;
						color: #666;
					}

					.price {
						font-size: 32rpx;
						color: #FF6B35;
						font-weight: bold;
					}

					.unit {
						font-size: 22rpx;
						font-weight: normal;
					}
				}

				.original-price {
					font-size: 24rpx;
					color: #999;
					text-decoration: line-through;
					white-space: nowrap;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>