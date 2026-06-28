<template>
    <view>
        <view class="uni-title uni-common-pl">{{$t('friend.set_remark_title')}}</view>
        <view class="uni-textarea">
            <textarea auto-height v-model="content" :maxlength="20"/>
        </view>
    </view>
</template>

<script>
	
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import i18n from '../../common/i18n';
	
	export default {
		components:{
			
		},
		data() {
			return {
				user_id: '',
				is_type: 0,
				content: '',
			}
		},
		onShow(){
			_hook.routeSonHook();
		},
		onLoad(option){
			let _this = this;
			_this.user_id = option.user_id;
			_this.$httpSend({
				path: '/im/friend/getRemarks',
				data: { user_id: _this.user_id, },
				success(data) {
					_this.content = data.remarks;
				}
			});
		},
		computed:{
			
		},
		methods:{
			$t(key) { return i18n.t(key); },
			send(){
				let _this = this;
				if(_this.content == ''){
					uni.showToast({
						title: _this.$t('friend.remark_empty'),
						icon: 'none',
					});
					return;
				}
				_this.$httpSend({
					path: '/im/friend/setRemarks',
					data: { content: _this.content,user_id: _this.user_id, },
					success_action: true,
					success(res) {
						uni.showToast({
							title: res.msg,
							duration: 2000
						});
						_get.getFriendList();
						_get.getChatList();
						setTimeout(() => {
							uni.reLaunch({
								url: './index'
							});
						},2000);
					}
				});
			}
		},
		onNavigationBarButtonTap(e) {
			if(e.index == 0){
				this.send();
			}
		},
		watch:{
			
		},
	}
</script>

<style>

</style>