<template>
	<view class="tab-bar">
		<view v-for="(item, index) in tabs" :key="index" class="tab-item" :class="{ active: current === index }"
			@click="handleClick(index)">
			<image :src="current === index ? item.selectedIcon : item.icon" class="tab-icon" />
			<text class="tab-text">{{ item.text }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'TabBar',
		data() {
			return {
				current: 0,
				tabs: [
					{
						icon: '/static/images/tabbar/home.png',
						selectedIcon: '/static/images/tabbar/home-active.png',
						text: '首页'
					},
					{
						icon: '/static/images/tabbar/category.png',
						selectedIcon: '/static/images/tabbar/category-active.png',
						text: '选料'
					},
					{
						icon: '/static/images/tabbar/cart.png',
						selectedIcon: '/static/images/tabbar/cart-active.png',
						text: '购物车'
					},
					{
						icon: '/static/images/tabbar/user.png',
						selectedIcon: '/static/images/tabbar/user-active.png',
						text: '我的'
					}
				]
			}
		},
		methods: {
			handleClick(index) {
				if (this.current === index) return
				this.current = index
				const pages = [
					'/pages/index/index',
					'/pages/category/index',
					'/pages/cart/index',
					'/pages/user/index'
				]
				uni.switchTab({
					url: pages[index]
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tab-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 100rpx;
		background: #fff;
		display: flex;
		padding-bottom: env(safe-area-inset-bottom);
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

		.tab-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.tab-icon {
				width: 48rpx;
				height: 48rpx;
				margin-bottom: 6rpx;
			}

			.tab-text {
				font-size: 24rpx;
				color: #999;
			}

			&.active {
				.tab-text {
					color: #333;
				}
			}
		}
	}
</style>