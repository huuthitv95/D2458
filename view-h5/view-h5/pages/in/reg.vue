<template>
	<view class="content">
		<view class="login-bg">
			<view class="header">
				<view class="goBack" @click="goBack">
				</view>
			</view>
			<view class="titleText">
				<view class="hy">注册</view>
				<view class="xccp"></view>
			</view>
			<view class="login-card">
				<!-- <view class="login-head">输入您的注册信息</view> -->
				
				<label class="uni-list-cell uni-list-cell-pd" style="padding: 0;border-bottom: 1px #e7e6ef solid;margin-top: 60upx;">
					<!-- <label class="label-2-text" >
					   <text>帐号</text>
					</label> -->
					<view>
						<input type="number" class="uni-input" placeholder="手机号码" v-model="form.username" />
					</view>	
					<view class="uni-icon uni-icon-clear" v-if="form.username" @click="delInputUsernameText"></view>
					<view class="uni-icon" v-else ></view>
					<view class="uni-icon placeholdertext"></view>
				</label>
				<label class="uni-list-cell uni-list-cell-pd" style="padding: 0;border-bottom: 1px #e7e6ef solid;margin-top: 60upx;">
					<!-- <label class="label-2-text" >
					   <text>昵称</text>
					</label> -->
					<view>
						<input type="text" class="uni-input" placeholder="昵称" v-model="form.nickname" />
					</view>	
					<view class="uni-icon uni-icon-clear" v-if="form.nickname" @click="delInputNicknameText"></view>
					<view class="uni-icon" v-else ></view>
					<view class="uni-icon placeholdertext"></view>
				</label>
				<label class="uni-list-cell uni-list-cell-pd" style="padding: 0;border-bottom: 1px #e7e6ef solid;margin-top: 60upx;">
					<!-- <label class="label-2-text" >
					   <text>密码</text>
					</label> -->
					<view>
						 <input class="uni-input" placeholder="密码" :password="showPassword" v-model="form.password"/>
					</view>
					<view class="uni-icon uni-icon-clear" v-if="form.password" @click="delInputPasswordText"></view>
					<view class="uni-icon" v-else ></view>
					<view class="uni-icon uni-icon-eye" :class="[showPassword ? '' : 'uni-active']" @click="changePassword"></view>
								
				
				</label>
			</view>
		</view>
		<view class="login-btn">
			<button :class="['landing',checkIn ? 'landing_true' : 'landing_false']" 
			:disabled="checkIn ? false : true" type="primary" @tap="subReg">注 册</button> 
		<!--	<view :class="['landing',checkIn ? 'landing_true' : 'landing_false']" @tap="subReg">注 册</view> -->
		</view>
		<view class="login-function-old">
			<view class="login-register" @click="go_login">登录</view>
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				showPassword: true,
				form: {
					username: '',
					nickname: '',
					password: '',
				}
			}
		},
		onLoad() {

		},
		computed: {
			checkIn(){
				return this.form.password != '' && this.form.username != '' && this.form.password.length > 5 &&  this.form.username.length > 5;
			}
		},
		methods: {
			go_login(){
				uni.navigateTo({
					url: '../../pages/in/login'
				})
			},
			goBack(){
				uni.navigateBack()
			},
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			delInputUsernameText(){
				this.form.username = ''
			},
			delInputNicknameText(){
				this.form.nickname = ''
			},
			delInputPasswordText(){
				this.form.password = ''
			},
			subReg(){
				let _this = this;
				if(!_this.checkIn){
					return;
				}
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(_this.form.username)))
				{
					uni.showModal({
						content: '手机号码有误，请重填',
					});
					return;
				}
				
				if(!(/^\w{1,20}$/.test(this.form.password))){
					uni.showModal({
						content: '密码只能包括下划线、数字、字母,长度6-20位',
					});
					return;
				}
 
				_this.$httpSend({
					path: '/im/in/reg',
					data: _this.form,
					success: (data) => {
						uni.setStorage({
							key: 'token',
							data: data.token,
							fail: () => {
								uni.showModal({
									content: '本地存储数据不可用!',
								});
							},
							success(){
								uni.reLaunch({
									url: '../chat/index',
								});
							},
						});
					}
				});
			},
			go_forget(){
				uni.navigateTo({
				    url: '../../pages/in/forget'
				})
			},
			go_register(){
				uni.navigateTo({
					url: '../../pages/in/reg'
				})
			}
			
		}
	}
</script>

<style>
	page {
		background: #fff;
	}
	.header {
		height: 100upx;
		text-align: center;
		padding: 0 40upx;
	}
	.header .goBack {
		width: 40upx;
		height: 100upx;
		background-image: url(/static/theme/default/login/goBack.png);
		background-size: auto 30upx;
		background-repeat: no-repeat;
		background-position: center;
	}
	.titleText {
		padding: 60upx;
	}
	.titleText .hy{
		font-family: PingFang SC;
		font-style: normal;
		font-weight: normal;
		font-size: 56upx;
		line-height: 78upx;
		color: #333333;
		mix-blend-mode: normal;
		margin-top: 80upx;
		}
	.titleText .xccp{
		font-family: PingFang SC;
		font-style: normal;
		font-weight: normal;
		font-size: 28upx;
		line-height: 40upx;
		color: #999999;
		mix-blend-mode: normal;
		margin-top: 30upx;
	}
	.landing {
		height: 84upx;
		line-height: 84upx;
		color: #FFFFFF;
		font-size: 32upx;
		width: 550upx;
		bordor: none;
		border-radius: 10upx;
	}
	.placeholdertext{
		/* #ifdef H5 */
		width: 48upx;
		/* #endif */
		/*#ifdef APP-PLUS */
		
		width: 40upx;
		/* #endif */
		height: 24upx;
	}
	.landing_true {
		
	}
	.landing_false {
		background-color: #d8d8d8;
	}
	.uni-button[type=primary] {
	}
	.landing_false {
		background: linear-gradient(278.07deg, #467CF6 0.25%, #6C99FF 100%);
		border-radius: 4px;
	}
	.login-btn{
		padding: 10upx 20upx;
		margin-top: 68upx;
		text-align: center;
	}
	.login-input input{
		background: #F2F5F6;
		font-size: 28upx;
		padding: 10upx 25upx;
		height: 62upx;
		line-height: 62upx;
		border-radius: 8upx;
	}
	.login-margin-b{
		margin-bottom: 25upx;
	}
	.login-input{
		padding: 20upx 20upx;
	}
	.login-head{
		font-size: 34upx;
		text-align: center;
		margin-top: 35upx;
		margin-bottom: 24upx;
		padding: 25upx 80upx 130upx 10upx;
	}
	.login-card{
		background: #fff;
		border-radius: 12upx;
		padding: 10upx 60upx;
		/* box-shadow: 0 6upx 18upx rgba(0,0,0,0.12); */
		position: relative;
	}
	.login-bg {
		/* height: 260upx;
		padding: 25upx;
		background: linear-gradient(#FF978D, #FFBB69); */
		background-image: url(/static/theme/default/login/bg.png);
		background-repeat: no-repeat;
		background-size: 45% auto;
		background-position: top right;
	}
	.uni-input {
		height: 50upx;
		width: 460upx;
		padding: 15upx 0 15upx 0upx;
		line-height:50upx;
		font-size:28upx;
		background:#FFF;
		flex: 1;
	}
	.uni-icon {
		text-align: left;
	}
	.login-function-old{
		margin-top:40upx; 
		text-align: center;
	}
	.login-register{
		width: 100%;
		text-align: center;
		color: #467CF6;
		font-size: 26upx;
	}
	.uni-list-cell:after{display:none !important;}
</style>
