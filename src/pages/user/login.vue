<template>
	<view class="login-container">
		<!-- Logo and Title -->
		<view class="header">
			<image src="/static/images/logo.png" mode="aspectFit" class="logo" />
			<text class="title">鼎泰面料</text>
		</view>

		<!-- Login/Register Form -->
		<view class="form-container">
			<!-- Tab Switch -->
			<view class="tab-switch">
				<view class="tab-item" :class="{ active: activeTab === 'login' }" @click="switchTab('login')">登录</view>
				<view class="tab-item" :class="{ active: activeTab === 'register' }" @click="switchTab('register')">注册</view>
			</view>

			<!-- Login Form -->
			<view v-if="activeTab === 'login'" class="form-content">
				<view class="input-group">
					<input type="text" v-model="loginForm.phone" placeholder="请输入手机号" maxlength="11" />
				</view>
				<view class="input-group">
					<input type="password" v-model="loginForm.password" placeholder="请输入密码" />
				</view>
				<view class="forgot-password" @click="handleForgotPassword">忘记密码？</view>
				<button class="submit-btn" @click="handleLogin">登录</button>
			</view>

			<!-- Register Form -->
			<view v-if="activeTab === 'register'" class="form-content">
				<view class="input-group">
					<input type="text" v-model="registerForm.phone" placeholder="请输入手机号" maxlength="11" />
				</view>
				<view class="input-group verification-group">
					<input type="text" v-model="registerForm.verificationCode" placeholder="请输入验证码" maxlength="6" />
					<button class="verification-btn" :disabled="isCountingDown" @click="handleSendVerification">
						{{ countDownText }}
					</button>
				</view>
				<view class="input-group">
					<input type="password" v-model="registerForm.password" placeholder="请设置密码" />
				</view>
				<view class="input-group">
					<input type="password" v-model="registerForm.confirmPassword" placeholder="请确认密码" />
				</view>
				<button class="submit-btn" @click="handleRegister">注册</button>
			</view>
		</view>

		<!-- Third Party Login -->
		<view class="third-party-login">
			<view class="divider">
				<text class="divider-text">其他登录方式</text>
			</view>
			<view class="third-party-icons">
				<view class="icon-item" @click="handleWechatLogin">
					<image src="/static/images/wechat.png" mode="aspectFit" class="icon" />
					<text>微信</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 'login',
				loginForm: {
					phone: '',
					password: ''
				},
				registerForm: {
					phone: '',
					verificationCode: '',
					password: '',
					confirmPassword: ''
				},
				countdown: 0,
				isCountingDown: false
			}
		},
		computed: {
			countDownText() {
				return this.isCountingDown ? `${this.countdown}s后重新获取` : '获取验证码'
			}
		},
		methods: {
			switchTab(tab) {
				this.activeTab = tab
			},
			handleLogin() {
				if (!this.loginForm.phone || !this.loginForm.password) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none',
						duration: 2000
					})
					return
				}

				// 验证手机号格式
				if (!/^1[3-9]\d{9}$/.test(this.loginForm.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none',
						duration: 2000
					})
					return
				}

				console.log('Login attempt with:', {
					phone: this.loginForm.phone,
					password: this.loginForm.password
				})

				uni.showLoading({
					title: '登录中...',
					mask: true
				})

				// 调用登录API
				uni.request({
					url: '{{prefix}}/api/v1/login',
					method: 'POST',
					header: {
						'Content-Type': 'application/json'
					},
					data: {
						phone: this.loginForm.phone,
						password: this.loginForm.password
					},
					success: (res) => {
						console.log('Login response:', res.data)
						if (res.data.code === 200) {
							// 保存登录状态和token
							uni.setStorageSync('token', res.data.data.token)
							uni.setStorageSync('userInfo', res.data.data.userInfo)
							
							uni.hideLoading()
							uni.showToast({
								title: '登录成功',
								icon: 'success',
								duration: 2000
							})
							
							// 登录成功后跳转到首页
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/index/index'
								})
							}, 2000)
						} else {
							uni.hideLoading()
							uni.showToast({
								title: res.data.message || '登录失败',
								icon: 'none',
								duration: 2000
							})
						}
					},
					fail: (err) => {
						console.error('Login request failed:', err)
						uni.hideLoading()
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			handleRegister() {
				if (!this.registerForm.phone || !this.registerForm.verificationCode || 
					!this.registerForm.password || !this.registerForm.confirmPassword) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					})
					return
				}

				if (this.registerForm.password !== this.registerForm.confirmPassword) {
					uni.showToast({
						title: '两次密码输入不一致',
						icon: 'none'
					})
					return
				}

				// 验证手机号格式
				if (!/^1[3-9]\d{9}$/.test(this.registerForm.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					return
				}

				// 验证密码长度
				if (this.registerForm.password.length < 6 || this.registerForm.password.length > 20) {
					uni.showToast({
						title: '密码长度应为6-20位',
						icon: 'none'
					})
					return
				}

				uni.showLoading({
					title: '注册中...'
				})

				// 调用注册API
				uni.request({
					url: '{{prefix}}/api/v1/register',
					method: 'POST',
					data: {
						phone: this.registerForm.phone,
						code: this.registerForm.verificationCode,
						password: this.registerForm.password
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.hideLoading()
							uni.showToast({
								title: '注册成功',
								icon: 'success'
							})
							// 注册成功后切换到登录页
							this.activeTab = 'login'
							// 清空注册表单
							this.registerForm = {
								phone: '',
								verificationCode: '',
								password: '',
								confirmPassword: ''
							}
						} else {
							uni.hideLoading()
							uni.showToast({
								title: res.data.message || '注册失败',
								icon: 'none'
							})
						}
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						})
						console.error('注册请求失败:', err)
					}
				})
			},
			handleSendVerification() {
				if (!this.registerForm.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return
				}

				// 验证手机号格式
				if (!/^1[3-9]\d{9}$/.test(this.registerForm.phone)) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					})
					return
				}

				// 开始倒计时
				this.isCountingDown = true
				this.countdown = 60

				const timer = setInterval(() => {
					this.countdown--
					if (this.countdown <= 0) {
						clearInterval(timer)
						this.isCountingDown = false
					}
				}, 1000)

				// 调用发送验证码API
				uni.request({
					url: '{{prefix}}/api/v1/sendCode',
					method: 'POST',
					data: {
						phone: this.registerForm.phone
					},
					success: (res) => {
						if (res.data.code === 200) {
							uni.showToast({
								title: '验证码已发送',
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: res.data.message || '发送失败',
								icon: 'none'
							})
							// 发送失败时重置倒计时
							this.isCountingDown = false
							this.countdown = 0
							clearInterval(timer)
						}
					},
					fail: (err) => {
						uni.showToast({
							title: '网络错误，请重试',
							icon: 'none'
						})
						// 发送失败时重置倒计时
						this.isCountingDown = false
						this.countdown = 0
						clearInterval(timer)
						console.error('发送验证码请求失败:', err)
					}
				})
			},
			handleForgotPassword() {
				uni.showToast({
					title: '功能开发中',
					icon: 'none'
				})
			},
			handleWechatLogin() {
				console.log('Starting WeChat login process')
				
				// 检查是否支持微信登录
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						console.log('Available providers:', res.providers)
						if (!res.providers || res.providers.indexOf('weixin') === -1) {
							uni.showToast({
								title: '当前环境不支持微信登录',
								icon: 'none',
								duration: 2000
							})
							return
						}
						
						// 获取微信登录凭证
						uni.login({
							provider: 'weixin',
							success: (loginRes) => {
								console.log('WeChat login success:', loginRes)
								if (loginRes.code) {
									uni.showLoading({
										title: '登录中...',
										mask: true
									})
									
									// 调用微信注册/登录API
									uni.request({
										url: '{{prefix}}/api/v1/login/wechat/register',
										method: 'POST',
										header: {
											'Content-Type': 'application/json'
										},
										data: {
											code: loginRes.code,
											encryptedData: loginRes.encryptedData,
											iv: loginRes.iv
										},
										success: (res) => {
											console.log('WeChat login API response:', res.data)
											if (res.data.code === 200) {
												// 保存登录状态和token
												uni.setStorageSync('token', res.data.data.token)
												uni.setStorageSync('userInfo', res.data.data.userInfo)
												
												uni.hideLoading()
												uni.showToast({
													title: '登录成功',
													icon: 'success',
													duration: 2000
												})
												
												// 登录成功后跳转到首页
												setTimeout(() => {
													uni.switchTab({
														url: '/pages/index/index'
													})
												}, 2000)
											} else {
												uni.hideLoading()
												uni.showToast({
													title: res.data.message || '登录失败',
													icon: 'none',
													duration: 2000
												})
											}
										},
										fail: (err) => {
											console.error('WeChat login API request failed:', err)
											uni.hideLoading()
											uni.showToast({
												title: '网络错误，请重试',
												icon: 'none',
												duration: 2000
											})
										}
									})
								} else {
									uni.showToast({
										title: '获取微信登录凭证失败',
										icon: 'none',
										duration: 2000
									})
								}
							},
							fail: (err) => {
								console.error('WeChat login failed:', err)
								uni.showToast({
									title: '微信登录失败',
									icon: 'none',
									duration: 2000
								})
							}
						})
					},
					fail: (err) => {
						console.error('Failed to get providers:', err)
						// 直接尝试微信登录，因为某些平台可能不支持getProvider
						uni.login({
							provider: 'weixin',
							success: (loginRes) => {
								console.log('WeChat login success:', loginRes)
								if (loginRes.code) {
									uni.showLoading({
										title: '登录中...',
										mask: true
									})
									
									// 调用微信注册/登录API
									uni.request({
										url: '{{prefix}}/api/v1/login/wechat/register',
										method: 'POST',
										header: {
											'Content-Type': 'application/json'
										},
										data: {
											code: loginRes.code,
											encryptedData: loginRes.encryptedData,
											iv: loginRes.iv
										},
										success: (res) => {
											console.log('WeChat login API response:', res.data)
											if (res.data.code === 200) {
												// 保存登录状态和token
												uni.setStorageSync('token', res.data.data.token)
												uni.setStorageSync('userInfo', res.data.data.userInfo)
												
												uni.hideLoading()
												uni.showToast({
													title: '登录成功',
													icon: 'success',
													duration: 2000
												})
												
												// 登录成功后跳转到首页
												setTimeout(() => {
													uni.switchTab({
														url: '/pages/index/index'
													})
												}, 2000)
											} else {
												uni.hideLoading()
												uni.showToast({
													title: res.data.message || '登录失败',
													icon: 'none',
													duration: 2000
												})
											}
										},
										fail: (err) => {
											console.error('WeChat login API request failed:', err)
											uni.hideLoading()
											uni.showToast({
												title: '网络错误，请重试',
												icon: 'none',
												duration: 2000
											})
										}
									})
								} else {
									uni.showToast({
										title: '获取微信登录凭证失败',
										icon: 'none',
										duration: 2000
									})
								}
							},
							fail: (err) => {
								console.error('WeChat login failed:', err)
								uni.showToast({
									title: '微信登录失败',
									icon: 'none',
									duration: 2000
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-container {
		min-height: 100vh;
		padding: 40rpx;
		background-color: #fff;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 60rpx 0;

		.logo {
			width: 160rpx;
			height: 160rpx;
			margin-bottom: 20rpx;
		}

		.title {
			font-size: 36rpx;
			font-weight: bold;
			color: $uni-text-color;
		}
	}

	.form-container {
		margin-top: 40rpx;
	}

	.tab-switch {
		display: flex;
		justify-content: center;
		margin-bottom: 40rpx;

		.tab-item {
			position: relative;
			padding: 20rpx 40rpx;
			font-size: 32rpx;
			color: $uni-text-color-light;

			&.active {
				color: $uni-color-primary;
				font-weight: bold;

				&::after {
					content: '';
					position: absolute;
					bottom: 0;
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

	.form-content {
		.input-group {
			margin-bottom: 30rpx;

			input {
				width: 100%;
				height: 90rpx;
				padding: 0 30rpx;
				border: 1rpx solid $uni-border-color;
				border-radius: 45rpx;
				font-size: 28rpx;
				background-color: #f8f8f8;
			}
		}

		.verification-group {
			display: flex;
			align-items: center;
			gap: 20rpx;

			input {
				flex: 1;
			}

			.verification-btn {
				width: 200rpx;
				height: 90rpx;
				line-height: 90rpx;
				text-align: center;
				background-color: $uni-color-primary;
				color: #fff;
				border-radius: 45rpx;
				font-size: 28rpx;

				&:disabled {
					background-color: #ccc;
				}
			}
		}

		.forgot-password {
			text-align: right;
			font-size: 26rpx;
			color: $uni-color-primary;
			margin-bottom: 40rpx;
		}

		.submit-btn {
			width: 100%;
			height: 90rpx;
			line-height: 90rpx;
			text-align: center;
			background-color: $uni-color-primary;
			color: #fff;
			border-radius: 45rpx;
			font-size: 32rpx;
			margin-top: 40rpx;
		}
	}

	.third-party-login {
		margin-top: 80rpx;

		.divider {
			position: relative;
			text-align: center;
			margin-bottom: 40rpx;

			&::before,
			&::after {
				content: '';
				position: absolute;
				top: 50%;
				width: 30%;
				height: 1rpx;
				background-color: $uni-border-color;
			}

			&::before {
				left: 0;
			}

			&::after {
				right: 0;
			}

			.divider-text {
				display: inline-block;
				padding: 0 20rpx;
				font-size: 26rpx;
				color: $uni-text-color-light;
				background-color: #fff;
			}
		}

		.third-party-icons {
			display: flex;
			justify-content: center;
			gap: 60rpx;

			.icon-item {
				display: flex;
				flex-direction: column;
				align-items: center;

				.icon {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 10rpx;
				}

				text {
					font-size: 24rpx;
					color: $uni-text-color-light;
				}
			}
		}
	}
</style> 