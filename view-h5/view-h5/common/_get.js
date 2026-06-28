import _mixins from './_mixins';
import _action from './_action';
import _data from './_data';

export default {
	/** Lấy dữ liệu danh sách hội thoại */
	getChatList(){
		_mixins.methods.$httpSend({
			path: '/im/get/chatList',
			success(data) {
				_data.localData('chat_list',data);
				uni.$emit('data_chat_list',data);
				_action.setStatusTips();
			}
		});
	},
   /**
	 * Lấy dữ liệu hội thoại 
	 * @param {
			Dữ liệu gửi đi
			send_data: {
				list_id: list_id,
				time: 0,
				Có cập nhật số tin nhắn chưa đọc không
				is_up: 1,
			},
			Hàm callback
			calllback(data){
				
			},
			Có cần thao tác dữ liệu cache cục bộ không
			is_action_data: 1,
		}
	 */
	getChatData(config){
		_mixins.methods.$httpSend({
			path: '/im/get/chatData',
			data: config.send_data,
			success(data) {
				if(config.is_action_data){
					uni.$emit('data_chat_data',data);
					_data.localData(data.list_id,data);
				}
				else{
					uni.$emit('data_chat_data_unshift',data.list);
				}
				if('callback' in config){
					config.callback(data);
				}
			}
		});
	},
	/** Lấy dữ liệu danh bạ */
	getFriendList(send_data,callback){
		if(!send_data){
			send_data = {};
		}
		_mixins.methods.$httpSend({
			path: '/im/get/friendList',
			data: send_data,
			success(data) {
				if(data.data.length || 'up' in send_data){
					_data.localData('friend_list',data.data);
					uni.$emit('data_friend_list',data.data);
				}
				if(callback){
					callback(data);
				}
			}
		});
	},
	/** Lấy dữ liệu bảng tin: data=dữ liệu gửi, type=0 tải mới nhất, type=1 tải lịch sử */
	getCircleList(send_data,callback){
		_mixins.methods.$httpSend({
			path: '/im/get/circleData',
			data: send_data,
			success(data) {
				let circle_data = _data.localData('circle_data');
				if(!circle_data){
					circle_data = [];
				}
				if(send_data.type){
					circle_data.push(...data.data);
				} else {
					circle_data.unshift(...data.data);
				}
				
				_data.localData('circle_data',circle_data);
				uni.$emit('data_circle_data',circle_data);
				
				if(callback) {
					callback(data);
				}
			}
		});
	},
	/** Lấy dữ liệu cơ bản */
	base(){
		_mixins.methods.$httpSend({
			path: '/im/get/base',
			success(data) {
				
				data.user_info.photo += '?_=' + Math.random();
				data.user_info.circle_img += '?_=' + Math.random();
				
				_data.data('user_info',data.user_info);
				uni.$emit('data_user_info',data.user_info);
				
				_data.data('new_friend_tips_num',data.new_friend_tips_num);
				_data.data('no_reader_chat_num',data.no_reader_chat_num);
				_data.data('no_reader_circle',data.no_reader_circle);
				_data.data('no_reader_circle_chat_num',data.no_reader_circle_chat_num);
				_data.data('new_group_tips_num',data.new_group_tips_num);
				
				_action.setStatusTips();
				_action.downloadPhoto();
			}
		});
	},
	/** Lấy danh sách yêu cầu kết bạn */
	getFriendApplyList(callback){
		_mixins.methods.$httpSend({
			path: '/im/get/applyFriend',
			success(data) {
				_data.localData('friend_apply_list',data);
				uni.$emit('data_friend_apply_list',data);
				if(callback){
					callback(data);
				}
			}
		});
	},
	/** Lấy danh sách xác nhận nhóm */
	getGroupApplyList(callback){
		_mixins.methods.$httpSend({
			path: '/im/get/applyGroup',
			success(data) {
				_data.localData('group_apply_list',data);
				uni.$emit('data_group_apply_data',data);
				if(callback){
					callback(data);
				}
			}
		});
	},
}