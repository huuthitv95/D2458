<template>
	<view class="content">
		<view class="login-bg">
<!-- 			<view class="header">
				<view class="goBack" @click="goBack">
				</view>
			</view> -->
			<view class="titleText">
				<view class="hy">{{$t('auth.welcome')}}(✿◡‿◡)</view>
				<view class="xccp"></view>
			</view>
			<view class="language-switch" @tap="chooseLanguage">
				{{$t('language.current')}}
			</view>
			<view class="login-card">
<!-- 				<view class="uni-media-image">
					<image class="uni-media-loading" src="/static/theme/default/app.png" />
				</view> -->
				<!-- <view class="login-head">&nbsp;&nbsp;</view> -->
				<label class="uni-list-cell uni-list-cell-pd" style="padding: 0;border-bottom: 1px #e7e6ef solid;margin-top: 60upx;">
					<!-- <label class="label-2-text" >
					   <text>帐号</text>
					</label> -->
					<view >
						<input type="number" class="uni-input"  :placeholder="$t('auth.phone')" v-model="form.username" />
					</view>
					<view class="uni-icon uni-icon-clear" v-if="form.username" @click="delInputUsernameText"></view>
					<view class="uni-icon" v-else ></view>
					<view  class="uni-icon placeholdertext">&nbsp;</view>
				</label>
				<label class="uni-list-cell uni-list-cell-pd" style="padding: 0;border-bottom: 1px #e7e6ef solid;margin-top: 60upx;" >
						<!-- <label class="label-2-text" >
						   <text>密码</text>
						</label> -->				   
						<view >
						   <input class="uni-input" :placeholder="$t('auth.password')" :password="showPassword" v-model="form.password"/>
						</view>
						
						<view class="uni-icon uni-icon-clear" v-if="form.password" @click="delInputPasswordText"></view>
						<view class="uni-icon" v-else ></view>
						<view class="uni-icon uni-icon-eye" :class="[showPassword ? '' : 'uni-active']" @click="changePassword"></view>
						
				</label>
		</view>
		<view class="login-btn">
			<button :class="['landing',checkIn ? 'landing_true' : 'landing_false']" 
			:disabled="checkIn ? false : true" type="primary" @tap="subLongin">{{$t('auth.login')}}</button> 
			<!--  <view :class="['landing',checkIn ? 'landing_true' : 'landing_false']" @tap="subLongin">登 陆</view> -->
		</view>
		<view class="login-function-old">
			<!-- <view class="login-forget" @click="go_forget">忘记密码</view> -->
			<view class="login-register" @click="go_register">{{$t('auth.register_link')}}</view>
		</view>
		<!--
		<view>
			<view class="login-function">
				
					<text class="textspace" @click="go_forget">找回密码</text> |
				    <text class="textspace" @click="go_frozen">紧急冻结</text> |
					<text class="textspace" @click="go_register">快速注册</text>
				  
			
			</view>
		</view>
		-->
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
					password: '',
				}
			}
		},
		onLoad() {
			return;
			uni.getSystemInfo({
				success: function (res) {
					console.log("model:",res.model);
					console.log("pixelRatio:",res.pixelRatio);
					console.log("windowWidth:",res.windowWidth);
					console.log("windowHeight:",res.windowHeight);
					console.log("language:",res.language);
					console.log("version:",res.version);
					console.log("platform:",res.platform);
				}
			});
		},
		computed: {
			checkIn(){
				return this.form.password != '' && this.form.username != '' && this.form.password.length > 5;
			}
		},
		methods: {
			goBack(){
				uni.navigateBack()
			},
			changePassword() {
				this.showPassword = !this.showPassword;
			},
			delInputUsernameText(){
				this.form.username = ''
			},
			delInputPasswordText(){
				this.form.password = ''
			},
			subLongin(){
				let _this = this;
				if(!_this.checkIn){
					return;
				}
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(_this.form.username))){ 
				        alert(_this.$t('auth.phone_invalid'));  
				        return; 
				    } 
				_this.$httpSend({
					path: '/im/in/login',
					data: _this.form,
					success: (data) => {
						uni.setStorage({
							key: 'token',
							data: data.token,
							fail: () => {
								uni.showModal({
									content: _this.$t('storage.local_unavailable'),
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
			go_frozen(){
			uni.navigateTo({
				url: '../../pages/set/frozen'
			})	
			},
			go_register(){
				uni.navigateTo({
					url: '../../pages/in/reg'
				})
			},
			chooseLanguage(){
				const items = [this.$t('language.vietnamese'), this.$t('language.english')];
				uni.showActionSheet({
					itemList: items,
					success: (res) => {
						this.$setLocale(res.tapIndex === 1 ? 'en' : 'vi');
						uni.showToast({
							title: this.$t('language.changed'),
							icon: 'none',
						});
					}
				});
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
	.language-switch {
		position: absolute;
		right: 40upx;
		top: 40upx;
		color: #666;
		font-size: 26upx;
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
	.uni-media-image{
		padding: 10upx 10upx;
		margin-top: 10upx;
		text-align: center;
	}
	.uni-media-loading {
		width:150upx;
		height:150upx;
		
	}
	.landing {
		height: 84upx;
		line-height: 84upx;
		width: 548upx;
		color: #FFFFFF;
		font-size: 32upx;
		bordor: none;
		border-radius: 10upx;
	}
	.placeholdertext{
		/* #ifdef H5 */
		width: 40upx;
		/* #endif */
		
		/*#ifdef APP-PLUS */
		width: 40upx;
		/* #endif */
		
		height:24upx;
	}
	.landing_true {
		
	}
	.landing_false {
		background: linear-gradient(278.07deg, #467CF6 0.25%, #6C99FF 100%);
		border-radius: 4px;
	}
	.uni-button[type=primary] {
		
	}
	.login-btn{
		padding: 10upx 20upx;
		margin-top: 68upx;
		text-align: center;
	}
	.login-function{
		
		/* #ifdef H5 */
		margin-top:350upx;
		/* #endif */
		
		/*#ifdef APP-PLUS */
		margin-top: 260upx;
		
		
		/* #endif */
		
		color: #999;
		text-align: center;
	}
	.login-function-old{
		margin-top:40upx; 
		text-align: center;
	}
	.login-forget{
		float: left;
		font-size: 26upx;
		color: #999;
	}
	.textspace {
		padding: 10upx 10upx;
	}
	.login-register{
		width: 100%;
		text-align: center;
		color: #467CF6;
		font-size: 26upx;

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
		padding: 25upx 10upx 55upx 10upx;
	}
	.login-card{
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
	
	.content {
		background: #fff;
	}
	.uni-input {
		height: 50upx;
		width: 460upx;
		padding: 15upx 0 15upx 0;
		line-height:50upx;
		font-size:28upx;
		background:#FFF;
		flex: 1;
	}
	.uni-form-item .with-fun .uni-icon {
		text-align: left;
	}
	.uni-list-cell:after{display:none !important;}
</style>
	
