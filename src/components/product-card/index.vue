<template>
	<view class="product-card" @click="handleClick">
		<image :src="product.image" mode="aspectFill" class="product-image" />
		<view class="product-info">
			<text class="product-name">{{ product.name }}</text>
			<view class="price-row">
				<view>
					会员价：
					<text class="price"> ¥{{ product.memberPrice }}</text> 
					<text class="unit">/m</text>
				</view>
				<view>
					原价:
					<text class="original-price-cancel" v-if="isPremium"> ¥{{ product.price }}/m </text>
					<text class="original-price" v-if="!isPremium"> ¥{{ product.price }}/m </text>
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	import { Product } from '@/api/product';
	import { GlobalData } from '@/store';
	import { PropType } from 'vue';

	export default {
		name: 'ProductCard',
		props: {
			product: {
				type: Object as () => Product,
				required: true,
			},
			onclick: {
				type: Function as PropType<(product: Product) => void>,
				required: false,
			}
		},
		data() {
			return {
				user: GlobalData.get_user(),
				isPremium: GlobalData.is_premium(),
			}
		},
		methods: {
			handleClick() {
				if (this.onclick) {
					this.onclick(this.product);
				} else {
					uni.navigateTo({
						url: `/pages/product/detail?id=${this.product.id}`
					})
				}
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

				.original-price-cancel {
					font-size: 24rpx;
					color: #999;
					text-decoration: line-through;
					white-space: nowrap;
					margin-left: 10rpx;
				}

				.original-price {
					font-size: 24rpx;
					color: black;
					text-decoration: none;
					white-space: nowrap;
					margin-left: 10rpx;
				}
			}
		}
	}
</style>