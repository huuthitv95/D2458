<template>
	<view class="page">	
		
		<view class="uni-card" v-if="data.type == 1">
			<view class="uni-list">
				
				<view class="uni-list-cell">
					<view class="uni-media-list uni-list-cell-navigate uni-navigate-right">
						<text>群头像</text>
						<view class="uni-media-list-logo photo">
							<image :src="photo(data.group.is_photo+'')" :lazy-load="true" style="border-radius: 10upx;" />
						</view>
					</view>
				</view>
					
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate uni-navigate-right">
						<view>
							<text>群聊名称</text> 
							<view class="show_text">{{data.group.name}}</view>
						</view>
					</view>
				</view>
				
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate uni-navigate-right">
						<view>
							<text>群公告</text> 
							<view class="show_text_">{{data.group.notice}}</view>
						</view>
					</view>
				</view>
			</view>
			
			
		</view>
		
		<view class="switch_class">
			<view class="uni-list" style="background-color: #02B300; font-size: 53px; border-radius: 8px; width: 80%;margin: 0 auto;" >
				<view class="uni-list-cell " style="text-align: center;">
					<view class="uni-list-cell-db" style="font-size: 24px; text-align: center; color: #fff;" @tap="applyGroup">申请入群</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	
	import _hook from '../../../common/_hook';
	import _data from '../../../common/_data';
	import _action from '../../../common/_action';
	
	export default {
		data() {
			return {
				data: {
					member: [],
					group: {
						is_photo: 'default_group_photo/90.jpg',
					},
					is_action: 0,
					type: 1,
				},
				list_id: 0,
			};
		},
		computed: {
			staticPhoto(){
				return _data.staticPhoto();
			},
			isAction(){
				if(this.data.group.main_id == _data.data('user_info').id){
					return true;
				}
				return false;
			}
		},
		onShow(){
			_hook.routeSonHook();
			let _this = this;
			_this.$httpSend({
				path: '/im/message/getChatDetails',
				data: { list_id: _this.list_id, },
				success(data) {
					_this.data = data;
					if(data.type == 1){
						uni.setNavigationBarTitle({
							title: data.group.name,
						});
					}
					let cache_data = _data.data('cache');						
					if(data.type == 1 && !('group_photo_' + _this.list_id in cache_data)){
						uni.downloadFile({
							url: _data.staticPhoto() + data.group.is_photo,
							success: (res) => {
								if (res.statusCode === 200) {
									cache_data['group_photo_' + _this.list_id] = res.tempFilePath;
									_data.data('cache',cache_data);
								}
							}
						});
					}
					
				}
			});
		},
		methods: {
			photo(path){
				return this.staticPhoto + path + '?_=' + Math.random();
			},
			applyGroup(){
				const _this = this
				_this.$httpSend({
					path: '/im/message/applyGroup',
					data: { list_id: _this.list_id, inviter_id: _this.inviter_id},
					success(data) {
						uni.showModal({
							content: data,
						});
					}
				});
				console.log(this.user_id)
			}
		},
		onLoad(option) {
			this.list_id = option.list_id;
			this.inviter_id = option.inviter_id;
		},
	}
	
</script>

<style>
	
	.photos {
		background-color: #FFFFFF;
	}
	
	.photo_main {
		margin: 7upx 0 0 40upx;
		display: inline-block;
		text-align: center;
	}
	
	.photo {
		width: 106upx;
		height: 106upx;
		border-radius: 7upx;
	}
	
	.name_class{
		font-size: 20upx;
		color: #8f8f94;
		max-width: 106upx;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.title {
		background: #FFFFFF;
		padding: 10upx 30upx 0 40upx;
	}
	
	.title_val {
		display: inline-block;
	}
	
	.title_num {
		display: inline-block;
		color: #8f8f94;
		font-size: 20upx;
		float: right;
	}
	
	.switch_class{
		margin-top: 20upx;
	}
	
	.show_text_ {
		color: #8f8f94;
	}
	.show_text {
		position: absolute;
		right: 60upx;
		color: #8f8f94;
		display: inline-block;
	}
	.photo_qrcode{
		width: 52upx;
		height: 52upx;
		margin-right: 0upx;
	}
</style>
