<template>
	<view>
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="title">Nhập mật khẩu cũ</view>
				<view class="with-fun">
					<input class="uni-input" placeholder="Nhập mật khẩu" :password="showPassword[0]" v-model="formData.pass1" />
					<view class="uni-icon uni-icon-eye" :class="[!showPassword[0] ? 'uni-active' : '']" @click="changePassword(0)"></view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">Nhập mật khẩu mới</view>
				<view class="with-fun">
					<input class="uni-input" placeholder="Nhập mật khẩu" :password="showPassword[1]" v-model="formData.pass2" />
					<view class="uni-icon uni-icon-eye" :class="[!showPassword[1] ? 'uni-active' : '']" @click="changePassword(1)"></view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">Xác nhận mật khẩu mới</view>
				<view class="with-fun">
					<input class="uni-input" placeholder="Nhập mật khẩu" :password="showPassword[2]" v-model="formData.pass3" />
					<view class="uni-icon uni-icon-eye" :class="[!showPassword[2] ? 'uni-active' : '']" @click="changePassword(2)"></view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	
	import _action from '../../common/_action';
	
	export default {
		data() {
			return {
				showPassword: [ true,true,true ],
				formData: {
					pass1: '',
					pass2: '',
					pass3: '',
				}
			}
		},
		computed: {
			
		},
		onLoad() {
			this.platform = uni.getSystemInfoSync().platform
		},
		methods: {
			changePassword(num) {
				this.$set(this.showPassword,num,!this.showPassword[num]);
			},
			send(){
				let _this = this;
				if(!_this.formData.pass1 || _this.formData.pass1.length < 6){
					uni.showModal({
						content: 'Vui lòng nhập mật khẩu cũ, ít nhất 6 ký tự',
					});
					return;
				}
				if(!_this.formData.pass2 || _this.formData.pass2.length < 6){
					uni.showModal({
						content: 'Vui lòng nhập mật khẩu mới, ít nhất 6 ký tự',
					});
					return;
				}
				if(!_this.formData.pass3 || _this.formData.pass3.length < 6){
					uni.showModal({
						content: 'Vui lòng xác nhận mật khẩu mới, ít nhất 6 ký tự',
					});
					return;
				}
				if(_this.formData.pass2 !== _this.formData.pass3){
					uni.showModal({
						content: 'Hai lần nhập mật khẩu mới không khớp',
					});
					return;
				}
				_this.$httpSend({
					path: '/im/set/password',
					data: _this.formData,
					success() {
						uni.showToast({
							title: 'Đã thay đổi, vui lòng đăng nhập lại',
						});
						setTimeout(() => {
							_action.checkFail();
						},2000);
					}
				});
			},
		},
		onNavigationBarButtonTap(e) {
			this.send();
		},
	}
</script>

<style scoped>
	
	.title {
		padding: 10upx 25upx;
	}
	
	.uni-icon-clear,
	.uni-icon-eye {
		color: #999;
	}
	
</style>
