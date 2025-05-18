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

		<!-- 登录按钮 -->
		<view class="auth-button-wrapper">
			<button
				class="auth-button"
				type="button"
				open-type="getPhoneNumber"
				@getphonenumber="handleLogin"
			>
				授权登录/注册
			</button>
		</view>


		<!-- 底部协议 -->
		<view class="agreement">
			<text class="agree-text">登录/注册表示您同意《用户协议》和《隐私政策》</text>
		</view>
	</view>
</template>

<script lang="ts">
import { handleAfterLogin, WechatRegister, WechatRegisterRequest } from '@/api/login';

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
			handleLogin(e: any) {
				console.log('授权信息', e);
				if (e) {
					uni.login()
						.then(loginRes => {
							return this.customLogin(e, loginRes)
						})
						.then(() => uni.navigateBack())
				}
			},

			async customLogin(e: any, loginRes: UniApp.LoginRes) {
				if (import.meta.env.UNI_PLATFORM === 'mp-weixin') {
					if (e.detail?.errMsg === 'getPhoneNumber:ok') {
						const payload: WechatRegisterRequest = {
							code: loginRes.code,
							encrypted_data: e.detail?.encryptedData,
							iv: e.detail?.iv,
						};

						console.log('微信注册payload', payload);

						const response = await WechatRegister(payload);
						console.log('微信注册结果', response);
						handleAfterLogin(response);
					}
				} else {
					uni.showToast({title: '未知平台'});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.auth-button-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.auth-button {
		padding: 20rpx 40rpx;
		font-size: 32rpx;
		border-radius: 8rpx;
	}

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
		background-color: #fff;

		.brand-logo {
			display: flex;
			flex-direction: column;
			align-items: center;

			.logo-text {
				font-size: 60rpx;
				font-weight: 900;
				color: #333;
				letter-spacing: 10rpx;
				margin-bottom: 16rpx;
			}

			.chinese-name {
				display: flex;
				flex-direction: column;
				align-items: center;

				text {
					font-size: 60rpx;
					line-height: 1.5;
					color: #666;
				}

				text:first-child {
					font-weight: 300;
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