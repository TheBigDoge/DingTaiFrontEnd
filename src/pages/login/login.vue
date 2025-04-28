<template>
	<view class="login-page">
		<!-- 顶部品牌标识 -->
		<view class="brand-header">
			<view class="brand-logo">
				<text class="logo-text">DINGTAI</text>
				<view class="chinese-name">
					<text>鼎泰</text>
					<text>布料商店</text>
				</view>
			</view>
		</view>

		<!-- 登录表单 -->
		<view class="login-form">
			<view class="form-item">
				<input type="text" v-model="form.phone" placeholder="输入手机号/邮箱" placeholder-class="placeholder" />
			</view>
			<view class="form-item">
				<input :type="showPassword ? 'text' : 'password'" v-model="form.password" placeholder="输入密码"
					placeholder-class="placeholder" />
			</view>

			<!-- 登录按钮 -->
			<view class="login-btn" :class="{ active: form.phone && form.password }" @click="handleLogin">
				登录/注册
			</view>

			<!-- 其他登录方式 -->
			<view class="other-login">
				<view class="divider">
					<text>其他登录方式</text>
				</view>
				<view class="login-methods">
					<view class="method-item">
						<text class="iconfont icon-wechat">🔄</text>
						<text>短信验证码登录</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部协议 -->
		<view class="agreement">
			<text class="agree-text">登录/注册表示您同意《用户协议》和《隐私政策》</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					phone: '',
					password: ''
				},
				showPassword: false
			}
		},
		methods: {
			handleLogin() {
				if (!this.form.phone || !this.form.password) {
					uni.showToast({
						title: '请输入手机号和密码',
						icon: 'none'
					})
					return
				}

				// 模拟登录
				uni.showLoading({
					title: '登录中...'
				})

				setTimeout(() => {
					uni.hideLoading()
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})

					// 跳转回用户中心
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/user/index'
						})
					}, 1500)
				}, 1500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-page {
		min-height: 100vh;
		background-color: #fff;
		display: flex;
		flex-direction: column;
	}

	.brand-header {
		height: 400rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.brand-logo {
			display: flex;
			flex-direction: column;
			align-items: center;

			.logo-text {
				font-size: 48rpx;
				font-weight: bold;
				letter-spacing: 6rpx;
				margin-bottom: 20rpx;
			}

			.chinese-name {
				display: flex;
				flex-direction: column;
				align-items: center;

				text {
					font-size: 32rpx;
					line-height: 1.4;
				}
			}
		}
	}

	.login-form {
		padding: 0 60rpx;

		.form-item {
			height: 100rpx;
			border-bottom: 2rpx solid $uni-border-color;
			margin-bottom: 40rpx;

			input {
				height: 100%;
				font-size: $uni-font-size-md;
			}

			.placeholder {
				color: $uni-text-color-light;
			}
		}

		.login-btn {
			height: 90rpx;
			background-color: #f5f5f5;
			color: $uni-text-color-light;
			font-size: $uni-font-size-md;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 45rpx;
			margin-top: 60rpx;

			&.active {
				background-color: $uni-color-primary;
				color: #fff;
			}
		}
	}

	.other-login {
		margin-top: 80rpx;

		.divider {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 40rpx;

			&::before,
			&::after {
				content: '';
				flex: 1;
				height: 2rpx;
				background-color: $uni-border-color;
			}

			text {
				color: $uni-text-color-light;
				font-size: $uni-font-size-sm;
				padding: 0 20rpx;
			}
		}

		.login-methods {
			display: flex;
			justify-content: center;

			.method-item {
				display: flex;
				flex-direction: column;
				align-items: center;

				.iconfont {
					font-size: 64rpx;
					margin-bottom: 16rpx;
				}

				text {
					font-size: $uni-font-size-sm;
					color: $uni-text-color;
				}
			}
		}
	}

	.agreement {
		margin-top: auto;
		padding: 30rpx 0;
		display: flex;
		justify-content: center;

		.agree-text {
			font-size: $uni-font-size-xs;
			color: $uni-text-color-light;
		}
	}
</style>