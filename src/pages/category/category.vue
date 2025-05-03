<template>
	<view class="category-page">
		<!-- 搜索栏 -->
		<search-bar placeholder="搜索面料" @search="handleSearch" />

		<!-- 分类筛选 -->
		<view class="filter-tabs">
			<view v-for="(tab, index) in filterTabs" :key="index" class="tab-item"
				:class="{ active: activeTabIndex === index }" @click="handleTabClick(index)">
				{{ tab.name }}
			</view>
		</view>

		<!-- 主体内容 -->
		<view class="content">
			<!-- 左侧分类 -->
			<scroll-view scroll-y class="category-menu" ref="categoryMenu" :scroll-top="scrollTop">
				<view v-for="(item, index) in categoryList" :key="index" class="menu-item"
					:class="{ active: activeCategoryIndex === index }" @click="handleCategoryClick(index)">
					{{ item.name }}
				</view>
			</scroll-view>

			<!-- 右侧商品 -->
			<scroll-view scroll-y class="product-list" @scrolltolower="loadMore">
				<view class="grid-container">
					<view class="grid-item" v-for="(item, index) in productList" :key="index">
						<product-card :product="item" @click="handleProductClick(item)" />
					</view>
				</view>
				<view class="loading" v-if="loading">加载中...</view>
				<view class="no-more" v-if="noMore">没有更多了</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import SearchBar from '@/components/search-bar/index.vue'
	import ProductCard from '@/components/product-card/index.vue'

	export default {
		components: {
			SearchBar,
			ProductCard
		},
		data() {
			return {
				filterTabs: [
					{ name: '综合', type: 'all' },
					{ name: '价格', type: 'price' },
					{ name: '销量', type: 'sales' },
					{ name: '推荐', type: 'recommend' }
				],
				activeTabIndex: 0,
				categoryList: [
					{ id: 0, name: '全部' },
					{ id: 1, name: '套装/裤子' },
					{ id: 2, name: '上衣' },
					{ id: 3, name: '衬衫' },
					{ id: 4, name: '马甲' },
					{ id: 5, name: '大衣' },
					{ id: 6, name: '休闲夹克/风衣' },
					{ id: 7, name: '休闲裤' },
					{ id: 8, name: '针织' }
				],
				activeCategoryIndex: 0,
				productList: [],
				page: 1,
				loading: false,
				noMore: false,
				keyword: '',
				scrollTop: 0
			}
		},
		onLoad(options) {
			console.log('Category page loaded with options:', options)
			// 从url参数中获取分类id
			if (options.id) {
				const categoryId = parseInt(options.id)
				console.log('Looking for category with ID:', categoryId)
				const categoryIndex = this.categoryList.findIndex(item => item.id === categoryId)
				console.log('Found category at index:', categoryIndex)
				
				if (categoryIndex !== -1) {
					this.activeCategoryIndex = categoryIndex
					console.log('Set active category index to:', categoryIndex)
					
					// 确保分类菜单滚动到选中项
					this.$nextTick(() => {
						this.scrollToCategory(categoryIndex)
					})
				}
			}

			// 处理搜索标签
			if (options.search) {
				this.keyword = decodeURIComponent(options.search)
				// 设置搜索标签为活动状态
				this.activeTabIndex = 0 // 设置为综合标签
				// 重置分类为全部
				this.activeCategoryIndex = 0
				// 确保滚动到顶部
				this.$nextTick(() => {
					this.scrollToCategory(0)
				})
			}

			this.loadProducts()
		},
		methods: {
			scrollToCategory(index) {
				const query = uni.createSelectorQuery().in(this)
				query.select('.category-menu').boundingClientRect()
				query.select(`.menu-item:nth-child(${index + 1})`).boundingClientRect()
				query.exec((res) => {
					if (res[0] && res[1]) {
						const menu = res[0]
						const menuItem = res[1]
						// 计算滚动位置，确保选中项在可视区域中间
						const scrollTop = menuItem.top - menu.top - (menu.height - menuItem.height) / 2
						console.log('Scrolling to position:', scrollTop)
						this.scrollTop = scrollTop
					}
				})
			},
			handleSearch(keyword) {
				this.keyword = keyword
				this.page = 1
				this.productList = []
				this.noMore = false
				this.loadProducts()
			},
			handleTabClick(index) {
				if (this.activeTabIndex === index) return
				this.activeTabIndex = index
				this.page = 1
				this.productList = []
				this.noMore = false
				this.loadProducts()
			},
			handleCategoryClick(index) {
				if (this.activeCategoryIndex === index) return
				this.activeCategoryIndex = index
				this.page = 1
				this.productList = []
				this.noMore = false
				this.loadProducts()
			},
			handleProductClick(product) {
				uni.navigateTo({
					url: `/pages/product/detail?id=${product.id}`
				})
			},
			loadMore() {
				if (this.loading || this.noMore) return
				this.page++
				this.loadProducts()
			},
			loadProducts() {
				if (this.loading) return
				this.loading = true

				// 模拟接口请求
				setTimeout(() => {
					const mockProducts = [
						{
							id: 1,
							image: '/static/images/products/fabric1.jpg',
							name: '意大利进口羊毛面料 精选VBC面料',
							memberPrice: 100,
							price: 128
						},
						{
							id: 2,
							image: '/static/images/products/fabric2.jpg',
							name: '英国进口哈里斯粗花呢面料',
							memberPrice: 120,
							price: 150
						},
						{
							id: 3,
							image: '/static/images/products/fabric3.jpg',
							name: '日本进口棉麻混纺面料',
							memberPrice: 80,
							price: 98
						},
						{
							id: 4,
							image: '/static/images/products/fabric4.jpg',
							name: '意大利进口真丝面料',
							memberPrice: 200,
							price: 258
						}
					]

					// 根据分类过滤
					// 实际项目中这里应该是接口过滤

					if (this.page >= 3) {
						this.noMore = true
					} else {
						this.productList = [...this.productList, ...mockProducts]
					}

					this.loading = false
				}, 800)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.category-page {
		min-height: 100vh;
		background-color: $uni-bg-color-grey;
		display: flex;
		flex-direction: column;
	}

	.filter-tabs {
		display: flex;
		justify-content: space-around;
		background-color: #fff;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #f5f5f5;

		.tab-item {
			font-size: $uni-font-size-sm;
			color: $uni-text-color-light;
			position: relative;
			padding: 0 20rpx;

			&.active {
				color: $uni-text-color;
				font-weight: bold;

				&::after {
					content: '';
					position: absolute;
					bottom: -10rpx;
					left: 50%;
					transform: translateX(-50%);
					width: 40rpx;
					height: 4rpx;
					background-color: $uni-color-primary;
					border-radius: 2rpx;
				}
			}
		}
	}

	.content {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.category-menu {
		width: 180rpx;
		min-width: 180rpx;
		flex: 0 0 180rpx;
		height: calc(100vh - 200rpx);
		background-color: #f8f8f8;
		box-sizing: border-box;
		overflow-x: hidden;

		.menu-item {
			padding: 30rpx 15rpx;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-light;
			text-align: center;
			border-left: 6rpx solid transparent;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			box-sizing: border-box;
			transition: all 0.2s ease;

			&.active {
				color: $uni-text-color;
				font-weight: bold;
				background-color: #fff;
				border-left-color: $uni-color-primary;
			}
		}
	}

	.product-list {
		flex: 1;
		height: calc(100vh - 200rpx);
		padding: 20rpx 15rpx 20rpx 20rpx;
		box-sizing: border-box;
		width: calc(100% - 180rpx);
		overflow-x: hidden;

		.grid-container {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			width: 100%;

			.grid-item {
				width: calc(50% - 8rpx);
				margin-bottom: 16rpx;
				box-sizing: border-box;
			}
		}

		.loading,
		.no-more {
			text-align: center;
			padding: 20rpx 0;
			color: $uni-text-color-light;
			font-size: $uni-font-size-sm;
		}
	}

	/* 在这里添加全局覆盖样式，确保所有product-card宽度一致 */
	:deep(.product-card) {
		width: 100%;
		box-sizing: border-box;
	}
</style>