<template>
	<view class="page">
		
		<uni-list>
			<uni-list-item :title="$t('settings.password')" 
						   :show-arrow="true"
						   :show-badge="true"
						   thumb="../../static/theme/default/my/password.png"
						   @click="goPath('../set/password')"
						   />
			<uni-list-item :title="$t('language.title')"
						   :show-arrow="true"
						   :show-badge="true"
						   :note="$t('language.current')"
						   @click="chooseLanguage"
						   />
						   
		</uni-list>
		
		<view class="uni-padding-wrap uni-common-mt login_out">
			<button type="warn" @tap="loginOut">{{$t('settings.logout')}}</button>
		</view>
	</view>
</template>

<script>
	
	import uniList from '@dcloudio/uni-ui/lib/uni-list/uni-list.vue';
	import uniListItem from '@dcloudio/uni-ui/lib/uni-list-item/uni-list-item.vue';
	import _action from '../../common/_action';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	
	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				my_data: {},
			}
		},
		onShow(){
			_hook.routeTabBarHook();
			let _this = this;
			/** 监听新的个人数据 */
			uni.$on('data_user_info',function(data){
				_this.my_data = data;
			});
		},
		onLoad() {
			let _this = this;
			_this.my_data = _data.data('user_info');
		},
		onUnload(){
			uni.$off('data_user_info');
		},
		computed: {
			
		},
		methods: {
			loginOut(){
				_action.checkFail();
			},
			goPath(path) {
				if(path){
					uni.navigateTo({
						url: path
					});
				}
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
			},
		},
		watch: {
			
		},
	}
</script>

<style>
	.login_out {
		margin-top: 100upx ;
	}
	.phto {
		width: 130upx;
		height: 130upx;
		margin-left: 30upx;
		margin-right: 30upx;
	}
	
	.my_padding {
		padding-bottom: 25px;
	}
	
	.my_padding:before {
		background-color:white;
	}
	
	.uni-list {
		margin-bottom: 30upx;
	}
	
</style>
