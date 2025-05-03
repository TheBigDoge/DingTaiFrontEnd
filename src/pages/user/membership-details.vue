<template>
  <view class="membership-details-page">
    <!-- 头部 -->
    <view class="header">
      <text class="header-title">会员详情</text>
    </view>

    <!-- 会员状态卡片 -->
    <view class="status-card">
      <view class="status-header">
        <image class="status-icon" :src="isMember ? '/static/images/member-active.png' : '/static/images/member-inactive.png'" mode="aspectFit" />
        <view class="status-info">
          <text class="status-title">{{ isMember ? '尊享会员' : '普通用户' }}</text>
          <text class="status-desc">{{ isMember ? `会员有效期至：${expireDate}` : '开通会员，享受专属优惠' }}</text>
        </view>
      </view>
    </view>

    <!-- 会员积分 -->
    <view class="points-card">
      <view class="card-title">我的积分</view>
      <view class="points-content">
        <text class="points-value">{{ userPoints }}</text>
        <text class="points-label">积分</text>
      </view>
      <view class="points-desc">每消费1元获得1积分</view>
    </view>

    <!-- 会员权益 -->
    <view class="benefits-card">
      <view class="card-title">会员权益</view>
      <view class="benefits-list">
        <view class="benefit-item">
          <image class="benefit-icon" src="/static/images/discount.png" mode="aspectFit" />
          <view class="benefit-info">
            <text class="benefit-title">专属折扣</text>
            <text class="benefit-desc">全场商品享受9折优惠</text>
          </view>
        </view>
        <view class="benefit-item">
          <image class="benefit-icon" src="/static/images/points.png" mode="aspectFit" />
          <view class="benefit-info">
            <text class="benefit-title">积分加倍</text>
            <text class="benefit-desc">会员消费获得双倍积分</text>
          </view>
        </view>
        <view class="benefit-item">
          <image class="benefit-icon" src="/static/images/service.png" mode="aspectFit" />
          <view class="benefit-info">
            <text class="benefit-title">专属客服</text>
            <text class="benefit-desc">一对一专属客服服务</text>
          </view>
        </view>
        <view class="benefit-item">
          <image class="benefit-icon" src="/static/images/shipping.png" mode="aspectFit" />
          <view class="benefit-info">
            <text class="benefit-title">优先发货</text>
            <text class="benefit-desc">订单优先处理发货</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 会员套餐（非会员显示） -->
    <view class="packages-card" v-if="!isMember">
      <view class="card-title">会员套餐</view>
      <view class="package-list">
        <view class="package-item" :class="{ active: selectedPackage === 'monthly' }" @click="selectPackage('monthly')">
          <view class="package-header">
            <text class="package-name">月度会员</text>
            <text class="package-price">¥29.9</text>
          </view>
          <view class="package-desc">30天会员权益</view>
        </view>
        <view class="package-item" :class="{ active: selectedPackage === 'quarterly' }" @click="selectPackage('quarterly')">
          <view class="package-header">
            <text class="package-name">季度会员</text>
            <text class="package-price">¥79.9</text>
          </view>
          <view class="package-desc">90天会员权益</view>
        </view>
        <view class="package-item" :class="{ active: selectedPackage === 'yearly' }" @click="selectPackage('yearly')">
          <view class="package-header">
            <text class="package-name">年度会员</text>
            <text class="package-price">¥299.9</text>
          </view>
          <view class="package-desc">365天会员权益</view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="bottom-container" v-if="!isMember">
      <button class="purchase-btn" @click="handlePurchase">立即开通会员</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isMember: false,
      userPoints: 0,
      expireDate: '',
      selectedPackage: 'monthly'
    }
  },
  onLoad() {
    this.checkMembershipStatus();
    this.getUserPoints();
  },
  methods: {
    checkMembershipStatus() {
      const membershipStatus = uni.getStorageSync('membershipStatus');
      this.isMember = membershipStatus && membershipStatus.expiresAt > new Date().getTime();
      if (this.isMember) {
        const expireDate = new Date(membershipStatus.expiresAt);
        this.expireDate = `${expireDate.getFullYear()}-${String(expireDate.getMonth() + 1).padStart(2, '0')}-${String(expireDate.getDate()).padStart(2, '0')}`;
      }
    },
    getUserPoints() {
      // 从本地存储获取用户积分
      const userInfo = uni.getStorageSync('userInfo') || {};
      this.userPoints = userInfo.points || 0;
    },
    selectPackage(packageType) {
      this.selectedPackage = packageType;
    },
    handlePurchase() {
      uni.showLoading({
        title: '处理中...'
      });

      setTimeout(() => {
        uni.hideLoading();
        
        const now = new Date();
        let expiresAt;
        switch (this.selectedPackage) {
          case 'monthly':
            expiresAt = now.setMonth(now.getMonth() + 1);
            break;
          case 'quarterly':
            expiresAt = now.setMonth(now.getMonth() + 3);
            break;
          case 'yearly':
            expiresAt = now.setFullYear(now.getFullYear() + 1);
            break;
        }

        uni.setStorageSync('membershipStatus', {
          isMember: true,
          expiresAt: expiresAt,
          packageType: this.selectedPackage
        });

        this.isMember = true;
        const expireDate = new Date(expiresAt);
        this.expireDate = `${expireDate.getFullYear()}-${String(expireDate.getMonth() + 1).padStart(2, '0')}-${String(expireDate.getDate()).padStart(2, '0')}`;

        uni.showToast({
          title: '开通成功',
          icon: 'success',
          duration: 2000
        });
      }, 1500);
    }
  }
}
</script>

<style lang="scss" scoped>
.membership-details-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.header {
  background: #fff;
  padding: 30rpx 40rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);

  .header-title {
    font-size: 36rpx;
    font-weight: bold;
  }
}

.status-card {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 12rpx;
  color: #fff;

  .status-header {
    display: flex;
    align-items: center;

    .status-icon {
      width: 100rpx;
      height: 100rpx;
      margin-right: 20rpx;
    }

    .status-info {
      flex: 1;

      .status-title {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 10rpx;
        display: block;
      }

      .status-desc {
        font-size: 24rpx;
        opacity: 0.9;
      }
    }
  }
}

.points-card {
  background: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 12rpx;

  .card-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .points-content {
    display: flex;
    align-items: baseline;
    margin-bottom: 10rpx;

    .points-value {
      font-size: 48rpx;
      font-weight: bold;
      color: #ff4d4f;
      margin-right: 10rpx;
    }

    .points-label {
      font-size: 24rpx;
      color: #666;
    }
  }

  .points-desc {
    font-size: 24rpx;
    color: #999;
  }
}

.benefits-card {
  background: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 12rpx;

  .card-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .benefits-list {
    .benefit-item {
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 2rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .benefit-icon {
        width: 80rpx;
        height: 80rpx;
        margin-right: 20rpx;
      }

      .benefit-info {
        flex: 1;

        .benefit-title {
          font-size: 28rpx;
          font-weight: bold;
          margin-bottom: 10rpx;
          display: block;
        }

        .benefit-desc {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}

.packages-card {
  background: #fff;
  margin: 20rpx;
  padding: 30rpx;
  border-radius: 12rpx;

  .card-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }

  .package-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;

    .package-item {
      padding: 30rpx;
      border: 2rpx solid #ddd;
      border-radius: 12rpx;
      transition: all 0.3s ease;

      &.active {
        border-color: #ff4d4f;
        background-color: #fff5f5;
      }

      .package-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10rpx;

        .package-name {
          font-size: 32rpx;
          font-weight: bold;
        }

        .package-price {
          font-size: 36rpx;
          color: #ff4d4f;
          font-weight: bold;
        }
      }

      .package-desc {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}

.bottom-container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 20rpx 40rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .purchase-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background: #ff4d4f;
    color: #fff;
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: bold;
    text-align: center;
    border: none;

    &::after {
      border: none;
    }
  }
}
</style> 