<template>
	<view class="search-bar">
		<view class="search-box">
			<text class="iconfont icon-search"></text>
			<input type="text" v-model="searchText" :placeholder="placeholder" placeholder-class="placeholder"
				@confirm="handleSearch" />
		</view>
		<!-- Search History Tags -->
		<view class="search-tags" v-if="showTags && searchHistory.length > 0">
			<view class="tags-header">
				<text class="tags-title">搜索历史</text>
				<text class="clear-history" @click="clearHistory">清空</text>
			</view>
			<view class="tags-container">
				<view class="tag-item" v-for="(tag, index) in searchHistory" :key="index" @click="selectTag(tag)">
					{{ tag }}
				</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts">
	export default {
		name: 'SearchBar',
		props: {
			placeholder: {
				type: String,
				default: '搜索商品'
			},
			showTags: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				searchText: '',
				searchHistory: [] as string[],
			}
		},
		created() {
			// Load search history from storage
			this.loadSearchHistory();
		},
		methods: {
			handleSearch() {
				this.searchText = this.searchText.trim();

				if (this.searchText) {
					// Add to search history
					this.addToHistory(this.searchText);
				}
				
				// Emit search event
				this.$emit('search', this.searchText);
			},
			selectTag(tag: string) {
				this.searchText = tag;
				this.handleSearch();
			},
			addToHistory(keyword: string) {
				// Remove if already exists
				this.searchHistory = this.searchHistory.filter(item => item !== keyword);
				// Add to beginning
				this.searchHistory.unshift(keyword);
				// Keep only last 10 searches
				if (this.searchHistory.length > 10) {
					this.searchHistory = this.searchHistory.slice(0, 10);
				}
				// Save to storage
				uni.setStorageSync('searchHistory', this.searchHistory);
			},
			clearHistory() {
				this.searchHistory = [];
				uni.removeStorageSync('searchHistory');
			},
			loadSearchHistory() {
				this.searchHistory = uni.getStorageSync('searchHistory') || [];
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search-bar {
		padding: 20rpx;
		background-color: #fff;

		.search-box {
			display: flex;
			align-items: center;
			height: 72rpx;
			padding: 0 30rpx;
			background-color: #F5F5F5;
			border-radius: 36rpx;

			.icon-search {
				font-size: 32rpx;
				color: #999;
				margin-right: 20rpx;
			}

			input {
				flex: 1;
				height: 100%;
				font-size: 28rpx;
			}

			.placeholder {
				color: #999;
			}
		}

		.search-tags {
			margin-top: 20rpx;

			.tags-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20rpx;

				.tags-title {
					font-size: 28rpx;
					color: #333;
					font-weight: bold;
				}

				.clear-history {
					font-size: 24rpx;
					color: #999;
				}
			}

			.tags-container {
				display: flex;
				flex-wrap: wrap;
				gap: 20rpx;

				.tag-item {
					padding: 10rpx 30rpx;
					background-color: #F5F5F5;
					border-radius: 30rpx;
					font-size: 24rpx;
					color: #666;
				}
			}
		}
	}
</style>