import store from './store/';
import _get from './_get';
import _action from './_action';
import h5Copy from './junyi-h5-copy.js'
export default {
	/** Xác thực token */
	checkToken(res) {
		if(res.err){
			_action.checkFail();
		} else {
			/** Đặt trạng thái đăng nhập */
			store.commit('set',{ k:'socket_state',v:1 });
			/** Lấy dữ liệu cơ bản */
			_get.base();
		}
	},
	/** Đăng xuất */
	offline(res){
		uni.showModal({
			content: 'Tài khoản của bạn đã đăng nhập từ thiết bị khác. Nếu không phải bạn, hãy đổi mật khẩu ngay!',
			success(){
				_action.checkFail();
			},
		});
	},
	/** Lấy danh sách hội thoại */
	getChatList(){
		_get.getChatList();
	},
	/** Lấy danh sách bạn bè */
	getFriendList(){
		_get.getFriendList({ up: 1});
	},
	
	copy() {
	     let content = 'Sao chép tin nhắn' // nội dung sao chép, phải là chuỗi, số cần chuyển sang chuỗi
	     const result = h5Copy(content)
	       if (result === false) {
	         uni.showToast({
	           title:'Không hỗ trợ',
	         })
	       } else {
	         uni.showToast({
	           title:'Sao chép thành công',
	           icon:'none'
	         })
	       }
		  },
	/** Thông báo bạn bè mới */
	newFriend(data){
		_action.playVoice('/static/voice/friend.mp3');
		let num = store.state.new_friend_tips_num + (data.num * 1);
		store.commit('set',{ k:'new_friend_tips_num',v:num });
		_action.setStatusTips();
	},
	/** Nhận tin nhắn mới */
	chatData(data){
		let chat_data = store.state.page_data.chat_data,
		msg_reader_num = 1;
		if(chat_data[data.list_id]){
			// Nếu đang trong hội thoại với đối phương, cập nhật trạng thái đã đọc
			if(store.state.page_data.message_query_list_id == data.list_id && store.state.user_info.id != data.data.msg.user_info.uid){
				_action.updataNoReader(data.list_id);
				msg_reader_num = 0;
			}
			store.state.page_data.chat_data[data.list_id].list.push(data.data);
		}
		
		/** Cập nhật dữ liệu danh sách hội thoại */		
		for(let i = 0,j = store.state.page_data.chat_list.length;i < j;i ++){
			if(store.state.page_data.chat_list[i].list_id == data.list_id){
				let last_msg;
				switch(data.data.msg.type * 1){
					case 0:
						last_msg = data.data.msg.content.text;
						break;
					case 1:
						/** Giọng nói */
						last_msg = '[Giọng nói]';
						break;
					case 2:
						/** Hình ảnh */
						last_msg = '[Hình ảnh]';
						break;
					case 3:
						/** Video */
						last_msg = '[Video]';
						break;
					case 4:
						/** Tệp */
						last_msg = '[Tệp]';
						break;
					case 5:
						/** Lì xì */
						last_msg = '[Lì xì]';
						break;
					default:
						/** Loại tin nhắn không xác định */
						last_msg = '[Không xác định]';
						break;
				}
				store.state.page_data.chat_list[i].last_msg = last_msg;
				store.state.page_data.chat_list[i].no_reader_num += msg_reader_num;
				store.state.page_data.chat_list[i].time = data.data.msg.time;
				let action_list_data = store.state.page_data.chat_list[i];
				store.state.page_data.chat_list.splice(i,1);
				store.state.page_data.chat_list.unshift(action_list_data);
				break;
			}
		}
		
		/** Nếu không phải tin nhắn của mình thì rung */
		if(store.state.user_info.id != data.data.msg.user_info.uid){
			uni.vibrateLong();
			_action.playVoice('/static/voice/chat.mp3');
		}
	},
	/** Nhận thông báo hoạt động bảng tin của bạn bè */
	circleTips(data){
		_action.playVoice('/static/voice/circle.mp3');
		store.commit('set',{ k:'no_reader_circle',v:1 });
		_action.setStatusTips();
	},
	/** Nhận thông báo bình luận/thích bảng tin từ bạn bè */
	cricleChatTips(data){
		_action.playVoice('/static/voice/circle.mp3');
		let num = store.state.no_reader_circle_chat_num;
		num ++;
		store.commit('set',{ k:'no_reader_circle_chat_num',v:num });
		_action.setStatusTips();
	},
	/** Thu hồi tin nhắn */
	deleteChat(data){
		let chat_data = store.state.page_data.chat_data;
		if(chat_data[data.list_id] && chat_data[data.list_id].list.length){
			for(let i = 0,j = chat_data[data.list_id].list.length;i < j;i++ ){
				if(chat_data[data.list_id].list[i].msg.id == data.msg_id){
					store.state.page_data.chat_data[data.list_id].list.splice(i,1);
					break;
				}
			}
		}
	},
}