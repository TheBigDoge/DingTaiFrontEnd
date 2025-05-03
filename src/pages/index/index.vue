<template>
  <view class="index-page">
    <!-- 搜索栏 -->
    <search-bar @search="handleSearch" />

    <!-- Search Results -->
    <view class="search-results" v-if="searchKeyword">
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
    </view>

    <!-- 轮播图 -->
    <swiper class="banner-swiper" circular autoplay interval="3000" duration="500">
      <swiper-item v-for="(item, index) in bannerList" :key="index" class="banner-item">
        <image :src="item.image" mode="aspectFill" class="banner-image" />
        <view class="banner-title" v-if="item.title">
          <text>{{ item.title }}</text>
          <text class="subtitle">{{ item.subtitle }}</text>
        </view>
      </swiper-item>
    </swiper>

    <!-- 分类导航 -->
    <view class="category-nav">
      <view class="nav-item" v-for="(item, index) in categoryList" :key="index" @tap="handleCategoryClick(item)">
        <view class="nav-icon-container"></view>
        <text class="nav-text">{{ item.name }}</text>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="product-section">
      <view class="section-header">
        <text class="title">热门面料</text>
        <text class="more" @click="handleViewMore">查看更多</text>
      </view>
      <view class="product-grid">
        <product-card v-for="(item, index) in productList" :key="index" :product="item"
          @click="handleProductClick(item)"></product-card>
      </view>
    </view>

    <!-- 会员专区 -->
    <view class="membership-section">
      <view class="section-header">
        <text class="title">会员专区</text>
        <text class="more">查看更多</text>
      </view>
      <view class="membership-content" @click="handleViewMembership">
        <view class="membership-card" :class="{ 'active': isTouching }" @touchstart="isTouching = true" @touchend="isTouching = false">
          <view class="membership-info">
            <text class="membership-title">开通会员</text>
            <text class="membership-desc">享受全场9折优惠</text>
          </view>
          <view class="membership-benefits">
            <view class="benefit-item">
              <text class="benefit-icon">✓</text>
              <text class="benefit-text">全场商品9折</text>
            </view>
            <view class="benefit-item">
              <text class="benefit-icon">✓</text>
              <text class="benefit-text">专属客服</text>
            </view>
            <view class="benefit-item">
              <text class="benefit-icon">✓</text>
              <text class="benefit-text">优先发货</text>
            </view>
          </view>
        </view>
      </view>
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
        bannerList: [
          {
            image: '/static/images/banner/banner1.jpg',
            title: '精选面料',
            subtitle: '臻选优质面料，专业定制体验'
          },
          {
            image: '/static/images/banner/banner2.jpg',
            title: '新品上市',
            subtitle: '2024春季新品系列'
          },
          {
            image: '/static/images/banner/banner3.jpg',
            title: '会员专享',
            subtitle: '新人首单立减100元'
          }
        ],
        categoryList: [
          {
            id: 1,
            name: '西装面料',
            icon: '/static/images/icons/suit-fabric.png',
            categoryId: 1  // 对应套装/裤子
          },
          {
            id: 2,
            name: '衬衫面料',
            icon: '/static/images/icons/shirt-fabric.png',
            categoryId: 3  // 对应衬衫
          },
          {
            id: 3,
            name: '裤装面料',
            icon: '/static/images/icons/pants-fabric.png',
            categoryId: 1  // 对应套装/裤子
          },
          {
            id: 4,
            name: '大衣面料',
            icon: '/static/images/icons/coat-fabric.png',
            categoryId: 5  // 对应大衣
          }
        ],
        allProducts: [
          {
            id: 1,
            image: '/static/images/products/italian-wool.jpg',
            name: '意大利进口羊毛面料 精选VBC面料',
            memberPrice: 100,
            price: 128
          },
          {
            id: 2,
            image: '/static/images/products/harris-tweed.jpg',
            name: '英国进口哈里斯粗花呢面料',
            memberPrice: 120,
            price: 150
          },
          {
            id: 3,
            image: '/static/images/products/japanese-linen.jpg',
            name: '日本进口棉麻混纺面料',
            memberPrice: 80,
            price: 98
          },
          {
            id: 4,
            image: '/static/images/products/italian-silk.jpg',
            name: '意大利进口真丝面料',
            memberPrice: 200,
            price: 258
          }
        ],
        productList: [],
        searchKeyword: '',
        isTouching: false
      }
    },
    computed: {
      filteredProducts() {
        if (!this.searchKeyword) return [];
        const keyword = this.searchKeyword.toLowerCase();
        return this.productList.filter(item => 
          item.name.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
        );
      }
    },
    created() {
      // Initialize product list with all products
      this.productList = [...this.allProducts];
    },
    methods: {
      handleSearch(keyword) {
        this.searchKeyword = keyword;
        // Navigate to category page with search tag
        uni.switchTab({
          url: `/pages/category/category?search=${encodeURIComponent(keyword)}`,
          success: () => {
            console.log('Successfully navigated to category page with search tag')
          },
          fail: (err) => {
            console.error('Navigation failed:', err)
          }
        })
      },
      handleCategoryClick(category) {
        console.log('Navigating to category:', category.name, 'with ID:', category.categoryId)
        uni.switchTab({
          url: `/pages/category/category?id=${category.categoryId}`,
          success: () => {
            console.log('Successfully navigated to category page')
          },
          fail: (err) => {
            console.error('Navigation failed:', err)
          }
        })
      },
      handleProductClick(product) {
        uni.navigateTo({
          url: `/pages/product/detail?id=${product.id}`
        })
      },
      handleViewMore() {
        uni.switchTab({
          url: '/pages/category/category'
        })
      },
      handleViewMembership() {
        uni.switchTab({
          url: '/pages/membership/membership',
          success: () => {
            console.log('Successfully navigated to membership page')
          },
          fail: (err) => {
            console.error('Navigation failed:', err)
          }
        })
      },
      onPullDownRefresh() {
        // TODO: 实现下拉刷新
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

  .category-nav {
    display: flex;
    justify-content: space-around;
    padding: $uni-spacing-md $uni-spacing-sm;
    background-color: #fff;
    margin-bottom: $uni-spacing-md;

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 25%;
      padding: 10rpx;
      transition: all 0.3s ease;

      &:active {
        opacity: 0.7;
        transform: scale(0.95);
      }

      .nav-icon-container {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background-color: #f5f5f5;
        border: 2rpx solid #ddd;
        margin-bottom: $uni-spacing-xs;
      }

      .nav-text {
        font-size: $uni-font-size-sm;
        color: $uni-text-color;
        text-align: center;
      }
    }
  }

  .product-section {
    padding: 0 $uni-spacing-sm;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $uni-spacing-md;

      .title {
        font-size: $uni-font-size-lg;
        font-weight: bold;
        color: $uni-text-color;
      }

      .more {
        font-size: $uni-font-size-sm;
        color: #999;
      }
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: $uni-spacing-sm;

      :deep(.product-card) {
        margin-bottom: 0;
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

  .membership-section {
    margin: $uni-spacing-md;
    background-color: #fff;
    border-radius: $uni-border-radius-lg;
    overflow: hidden;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $uni-spacing-md;
      border-bottom: 2rpx solid $uni-border-color;

      .title {
        font-size: $uni-font-size-lg;
        font-weight: bold;
      }

      .more {
        font-size: $uni-font-size-sm;
        color: #999;
      }
    }

    .membership-content {
      padding: $uni-spacing-md;
      cursor: pointer;
    }

    .membership-card {
      background: linear-gradient(135deg, #ff4d4f, #ff7875);
      border-radius: $uni-border-radius-lg;
      padding: $uni-spacing-lg;
      color: #fff;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &.active {
        transform: scale(0.98);
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
      }

      .membership-info {
        margin-bottom: $uni-spacing-md;

        .membership-title {
          font-size: $uni-font-size-lg;
          font-weight: bold;
          display: block;
          margin-bottom: $uni-spacing-xs;
        }

        .membership-desc {
          font-size: $uni-font-size-sm;
          opacity: 0.9;
        }
      }

      .membership-benefits {
        .benefit-item {
          display: flex;
          align-items: center;
          margin-bottom: $uni-spacing-sm;

          .benefit-icon {
            width: 36rpx;
            height: 36rpx;
            line-height: 36rpx;
            text-align: center;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            margin-right: $uni-spacing-sm;
          }

          .benefit-text {
            font-size: $uni-font-size-sm;
          }
        }
      }
    }
  }
</style>
