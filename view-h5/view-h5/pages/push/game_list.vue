<template>
	<view class="page">
		<uni-list>
			<uni-list-item title="朋友圈" 
						   :show-arrow="true"
						   :show-badge="true"
						   badge-type="error"
						   :badge-text="show_tips"
						   thumb="../../static/theme/default/push/circle.png"
						   @click="goPath('../push/circle')"
						   />
						   
		</uni-list>
	<!-- 	
		<uni-list>
			<uni-list-item title="皇冠娱乐城"
						   :show-arrow="true"
						   :show-badge="true"
						   thumb="../../static/theme/default/my/tu.png"
						   @click="goPath('../push/game1')"
						   />
		</uni-list>
		-->
		<uni-list>
			<uni-list-item title="APP客户端"
						   :show-arrow="true"
						   :show-badge="true"
						   thumb="../../static/theme/default/my/ma.png"
						   @click="goPath('../push/game2')"
						   />
		</uni-list> 
	</view>
</template>

<script>
	
	import uniList from '@dcloudio/uni-ui/lib/uni-list/uni-list.vue';
	import uniListItem from '@dcloudio/uni-ui/lib/uni-list-item/uni-list-item.vue';
	import _get from '../../common/_get';
	import _hook from '../../common/_hook';
	import _data from '../../common/_data';
	
	export default {
		components: {
			uniList,
			uniListItem
		},
		data() {
			return {
				my_data: { id: 0 },
				show_tips: '',
			}
		},
		onShow(){
			_hook.routeTabBarHook();
			let num = _data.data('no_reader_circle_chat_num'),
			_this = this;
			_this.my_data = _data.data('user_info');
			
			/** 监听新的个人数据 */
			uni.$on('data_user_info',function(data){
				_this.my_data = data;
			});
			
			/** 监听朋友圈动态提示 */
			uni.$on('data_circle_tips',function(data){
				_this.show_tips = data;
			});
			
			if(num){
				this.show_tips = num;
			}
			else if(_data.data('no_reader_circle')){
				this.show_tips = '好友动态';
			}
			else {
				this.show_tips = '';
			}
		},
		onLoad() {
			
		},
		onHide(){
			//uni.$off('data_user_info');
			uni.$off('data_circle_tips');
		},
		computed: {
			myPhoto(){
				return _data.staticPhoto() + this.my_data.photo;
			},
		},
		methods: {
			goPath(path) {
				if(path){
					uni.navigateTo({
						url: path,
					});
				}
			},
		},
		watch: {
			
		},
	}
</script>

<style>
	
	.phto {
		width: 106upx;
		height: 106upx;
		margin-left: 30upx;
		margin-right: 30upx;
	}
	
	.qrcode {
		width: 50upx;
		height: 50upx;
		margin-right: -20upx;
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
