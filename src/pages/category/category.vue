<template>
	<view class="category-page">
		<!-- 搜索栏 -->
		<search-bar placeholder="搜索面料" @search="handleSearch" />

		<!-- 分类筛选 -->
		<view class="filter-tabs">
			<view v-for="tab, index in filterTabs" :key="tab.type" class="tab-item"
				:class="{ active: activeTabIndex === index }" @click="handleTabClick(index)">
				{{ tab.name }}
			</view>
		</view>

		<!-- 主体内容 -->
		<view class="content">
			<!-- 左侧分类 -->
			<scroll-view scroll-y class="category-menu" ref="categoryMenu">
				<view v-for="(item, index) in categoryList" :key="index" class="menu-item"
					:class="{ active: activeCategoryIndex === index }" @click="handleCategoryClick(index)">
					{{ item.name }}
				</view>
			</scroll-view>

			<!-- 右侧商品 -->
			<scroll-view scroll-y class="product-list">
				<view class="grid-container">
					<view class="grid-item" v-for="(item, index) in productList[categoryList[activeCategoryIndex]?.id]" :key="`c${categoryList[activeCategoryIndex].id}p${item.id}i${index}`">
						<product-card :product="item" />
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script lang="ts">
	import SearchBar from '@/components/search-bar/index.vue'
	import ProductCard from '@/components/product-card/index.vue'
	import { CateogryAndProductList, GetProducts, newProduct, Product, ProductListSorting } from '@/api/product'
	import { Category, newCategory } from '@/api/category'
import { GlobalData } from '@/store'

	export default {
		components: {
			SearchBar,
			ProductCard
		},
		data() {
			return {
				filterTabs: [
					{ name: '综合', type: ProductListSorting.General },
					{ name: '价格', type: ProductListSorting.Price },
					{ name: '销量', type: ProductListSorting.Sell },
					{ name: '推荐', type: ProductListSorting.Recommend },
				],
				activeTabIndex: 0,
				categoryList: [] as Category[],
				activeCategoryIndex: 0,
				productList: {} as {[key: number]: Product[]}, // cateogry id to products
				keyword: '',
				fetch_done: false,
			}
		},
		onLoad(options: any) {
			// 处理搜索标签
			if (options?.search) {
				this.keyword = decodeURIComponent(options.search)
			}
		},
		onShow() {
			this.fetchProductList()
		},
		methods: {
			fetchProductList(force?: boolean) {
				if (!this.fetch_done || !this.productList || force) {
					GetProducts(this.keyword, this.filterTabs[this.activeTabIndex].type)
						.then(response => {
							console.log('products', response);
							this.parseResponse(response.data);
							this.trySwitchToStoreCategory();
						})
					this.fetch_done = true;
				} else {
					this.trySwitchToStoreCategory();
				}
			},

			trySwitchToStoreCategory() {
				const redirectId = GlobalData.get_redirect_id();
				if (redirectId) {
					console.log('trying to redirect to id', redirectId);
					for (const idx in this.categoryList) {
						console.log(this.categoryList[idx]);
						if (this.categoryList[idx].id === redirectId) {
							console.log('matched');
							this.activeCategoryIndex = parseInt(idx) || 0;
							break;
						}
					}
				}
			},

			parseResponse(data: CateogryAndProductList[]) {
				this.categoryList = data.map(item => {
					return newCategory(item.category)
				})

				if (this.activeCategoryIndex < 0 || this.activeCategoryIndex >= this.categoryList.length) {
					this.activeCategoryIndex = 0;
				}

				const newList = {} as {[key: number]: Product[]};

				for (const {category, products} of data) {
					const productList = products.map(newProduct);
					newList[category.id] = productList;
				}
				console.log(newList);
				this.productList = newList;
			},
			handleSearch(keyword: string) {
				if (this.keyword !== keyword) {
					this.keyword = keyword
					this.fetchProductList(true)
				}
			},
			handleTabClick(index: number) {
				console.log('click index', index);
				console.log('current', this.activeTabIndex);
				if (this.activeTabIndex === index) {
					return
				}
				
				this.activeTabIndex = index;
				this.fetchProductList(true);
			},
			handleCategoryClick(index: number) {
				if (this.activeCategoryIndex === index) {
					return
				}

				this.activeCategoryIndex = index;
				this.fetchProductList(true)
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