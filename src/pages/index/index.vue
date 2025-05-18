<template>
  <view class="index-page">
    <!-- 搜索栏 -->
    <!-- <search-bar @search="handleSearch" /> -->

    <!-- Search Results -->
    <!-- <view class="search-results" v-if="searchKeyword">
      <view class="results-header">
        <text class="results-title">搜索结果</text>
        <text class="results-count">共{{ filteredProducts.length }}个商品</text>
      </view>
      <view class="product-list">
        <view class="product-item" v-for="(item, index) in filteredProducts" :key="index" @click="goToDetail(item)">
          <image :src="item.image" mode="aspectFill" class="product-image" />
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text class="product-price">¥{{ item.price }}</text>
          </view>
        </view>
      </view>
      <view class="no-results" v-if="filteredProducts.length === 0">
        <text>没有找到相关商品</text>
      </view>
    </view> -->

    <!-- 轮播图 -->
    <!-- <swiper class="banner-swiper" circular autoplay interval="3000" duration="500">
      <swiper-item v-for="(item, index) in bannerList" :key="index" class="banner-item">
        <image :src="item.image" mode="aspectFill" class="banner-image" />
        <view class="banner-title" v-if="item.title">
          <text>{{ item.title }}</text>
          <text class="subtitle">{{ item.subtitle }}</text>
        </view>
      </swiper-item>
    </swiper> -->

    <!-- Category Navigation -->
    <view class="category-section">
      <view class="category-title">分类导航</view>
      <view class="category-list">
        <view class="category-item" v-for="(item, index) in categoryList" :key="index" @click="handleCategoryClick(item)">
          <image class="category-icon" :src="item.icon" mode="aspectFit" />
          <text class="category-name">{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- Product List -->
    <view class="product-section">
      <view class="section-header">
        <text class="section-title">新品推荐</text>
        <text class="view-more" @click="handleViewMore">查看更多</text>
      </view>
      <view class="product-list">
        <view class="product-item" v-for="(product, index) in productList" :key="index">
          <ProductCard :product="product"/>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
  import SearchBar from '@/components/search-bar/index.vue'
  import ProductCard from '@/components/product-card/index.vue'
  import { startup } from '@/api/login'
  import { Category, newCategory } from '@/api/category'
  import { newProduct, Product } from '@/api/product'
import { GlobalData } from '@/store'

  export default {
    components: {
      SearchBar,
      ProductCard
    },

    mounted() {
      startup()
        .then(res => {
          this.categoryList = res.high_light_categories
            .slice(0, 4) // 只拿前四个
            .map(newCategory) 

          this.productList = res.recommend_products.map(newProduct)
        })
    },

    data() {
      return {
        // bannerList: [
        //   {
        //     image: '/static/images/banner/banner1.jpg',
        //     title: '精选面料',
        //     subtitle: '臻选优质面料，专业定制体验'
        //   },
        //   {
        //     image: '/static/images/banner/banner2.jpg',
        //     title: '新品上市',
        //     subtitle: '2024春季新品系列'
        //   },
        //   {
        //     image: '/static/images/banner/banner3.jpg',
        //     title: '会员专享',
        //     subtitle: '新人首单立减100元'
        //   }
        // ],

        categoryList: [] as Category[],
        productList: [] as Product[],
        // searchKeyword: '',
        // showSearchResults: false,
        // searchResults: []
      }
    },
    methods: {
      // handleSearch(keyword) {
      //   this.searchKeyword = keyword;
      //   // Navigate to category page with search tag
      //   uni.switchTab({
      //     url: `/pages/category/category?search=${encodeURIComponent(keyword)}`,
      //     success: () => {
      //       console.log('Successfully navigated to category page with search tag')
      //     },
      //     fail: (err) => {
      //       console.error('Navigation failed:', err)
      //     }
      //   })
      // },
      handleCategoryClick(category: Category) {
        console.log('Navigating to category:', category.name, 'with ID:', category.categoryId)
        
        GlobalData.set_redirect_id(category.id);
        uni.switchTab({
          url: `/pages/category/category`,
          success: () => {
            console.log('Successfully navigated to category page')
          },
          fail: (err) => {
            console.error('Navigation failed:', err)
          }
        })
      },
      handleProductClick(product: Product) {
        uni.navigateTo({
          url: `/pages/product/detail?id=${product.id}`
        })
      },
      handleViewMore() {
        uni.switchTab({
          url: '/pages/product/list'
        })
      },
      onPullDownRefresh() {
        setTimeout(() => {
          uni.stopPullDownRefresh()
        }, 1000)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .index-page {
    padding-bottom: 120rpx;
  }

  .banner-swiper {
    height: 400rpx;
    margin-bottom: $uni-spacing-md;

    .banner-item {
      position: relative;

      .banner-image {
        width: 100%;
        height: 100%;
      }

      .banner-title {
        position: absolute;
        left: $uni-spacing-md;
        bottom: $uni-spacing-md;
        color: #fff;
        text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);

        text {
          display: block;
          font-size: $uni-font-size-lg;
          font-weight: bold;
          margin-bottom: $uni-spacing-xs;
        }

        .subtitle {
          font-size: $uni-font-size-sm;
          opacity: 0.8;
        }
      }
    }
  }

  .category-section {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;

    .category-title {
      font-size: 32rpx;
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .category-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .category-item {
        width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20rpx;

        .category-icon {
          width: 100rpx;
          height: 100rpx;
          margin-bottom: 10rpx;
        }

        .category-name {
          font-size: 24rpx;
          color: #333;
        }
      }
    }
  }

  .product-section {
    background-color: #fff;
    padding: 30rpx;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .section-title {
        font-size: 32rpx;
        font-weight: bold;
      }

      .view-more {
        font-size: 24rpx;
        color: #666;
      }
    }

    .product-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .product-item {
        width: 48%;
        margin-bottom: 20rpx;
        background-color: #f8f8f8;
        border-radius: 10rpx;
        overflow: hidden;

        .product-image {
          width: 100%;
          height: 300rpx;
        }

        .product-info {
          padding: 20rpx;

          .product-name {
            font-size: 24rpx;
            color: #333;
            margin-bottom: 10rpx;
          }

          .product-price {
            display: flex;
            align-items: baseline;

            .member-price {
              font-size: 28rpx;
              color: #ff4d4f;
              font-weight: bold;
              margin-right: 10rpx;
            }

            .original-price {
              font-size: 24rpx;
              color: #999;
              text-decoration: line-through;
            }
          }
        }
      }
    }
  }

  .search-results {
    padding: 20rpx;
    
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      
      .results-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }
      
      .results-count {
        font-size: 24rpx;
        color: #999;
      }
    }
    
    .product-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20rpx;
      
      .product-item {
        background: #fff;
        border-radius: 12rpx;
        overflow: hidden;
        
        .product-image {
          width: 100%;
          height: 300rpx;
        }
        
        .product-info {
          padding: 20rpx;
          
          .product-name {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 10rpx;
          }
          
          .product-price {
            font-size: 32rpx;
            color: #ff4d4f;
            font-weight: bold;
          }
        }
      }
    }
    
    .no-results {
      text-align: center;
      padding: 100rpx 0;
      color: #999;
      font-size: 28rpx;
    }
  }
</style>
