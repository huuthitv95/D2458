import _data from './_data';
import _get from './_get';
import _action from './_action';
import h5Copy from './junyi-h5-copy.js'
export default {
	/** Xác thực token */
	checkToken(res) {
		if(res.err){
			_action.checkFail();
		} else {
			/** Đặt trạng thái kết nối socket */
			_data.data('socket_state',1);
			/** Lấy dữ liệu cơ bản */
			_get.base();
		}
	},
	/** Sao chép/dán **/
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
	/** Đăng xuất */
	offline(res){
		_action.checkFail();
		uni.showModal({
			content: 'Tài khoản của bạn đã đăng nhập từ thiết bị khác. Nếu không phải bạn, hãy đổi mật khẩu ngay!',
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
	/** Thông báo bạn bè mới */
	newFriend(data){
		_action.playVoice('/static/voice/friend.mp3');
		let num = _data.data('new_friend_tips_num') + (data.num * 1);
		_data.data('new_friend_tips_num',num);
		_action.setStatusTips();
	},
	/** Thông báo lượt thích */
	circleLike(data){
		_action.playVoice('/static/voice/circle.mp3');
		let circle_data = _data.localData('circle_data');
		for(let i = 0,j = circle_data.length;i< j; i++){
			if(circle_data[i].post_id == data.id){
				circle_data[i].like = data.likes;
				_data.localData('circle_data',circle_data);
				uni.$emit('data_circle_data',circle_data);
				break;
			}
		}
	},
	/** Nhận tin nhắn mới */
	chatData(data){
		let chat_data = _data.localData(data.list_id),
		msg_reader_num = 0;
		
		/** Nếu không phải tin nhắn của mình: đang trong hội thoại thì rung, không ở hội thoại đó thì rung + âm thanh */
		if(_data.data('user_info').id != data.data.msg.user_info.uid){
			
			// #ifdef APP-PLUS
			uni.vibrateLong();
			// #endif
			
			if(_data.localData('message_list_id') == data.list_id){
				_action.updataNoReader(data.list_id);
			}
			else{
				_action.playVoice('/static/voice/chat.mp3');
				msg_reader_num = 1;
			}
		}
		
		/** Cập nhật dữ liệu danh sách hội thoại */
		for(let i = 0,local_chat_list = _data.localData('chat_list'),j = local_chat_list.length;i < j;i ++){
			if(local_chat_list[i].list_id == data.list_id){
				switch(data.data.msg.type * 1){
					case 0:
						local_chat_list[i].last_msg = data.data.msg.content.text;
						break;
					case 1:
						/** Giọng nói */
						local_chat_list[i].last_msg = '[Giọng nói]';
						break;
					case 2:
						/** Hình ảnh */
						local_chat_list[i].last_msg = '[Hình ảnh]';
						break;
					case 3:
						/** Video */
						local_chat_list[i].last_msg = '[Video]';
						break;
					case 4:
						/** Tệp */
						local_chat_list[i].last_msg = '[Tệp]';
						break;
					case 5:
						/** Lì xì */
						local_chat_list[i].last_msg = '[Lì xì]';
						break;
					default:
						/** Loại tin nhắn không xác định */
						local_chat_list[i].last_msg = '[Không xác định]';
						break;
				}
				local_chat_list[i].no_reader_num += msg_reader_num;
				local_chat_list[i].time = data.data.msg.time;
				
				let action_list_data = local_chat_list[i];
				
				local_chat_list.splice(i,1);
				local_chat_list.unshift(action_list_data);
				
				_data.localData('chat_list',local_chat_list);
				uni.$emit('data_chat_list',local_chat_list);
								
				break;
			}
		}
		
		/** Khi có dữ liệu cache của hội thoại này */
		if(chat_data){
			chat_data.list.push(data.data);
			chat_data.list = chat_data.list.slice(-15);
			_data.localData(data.list_id,chat_data);
			/** Nếu đang trong hội thoại với đối phương, gửi dữ liệu ra trang để hiển thị */
			if(_data.localData('message_list_id') == data.list_id) {
				/** Giữ 15 bản ghi trên trang để tăng hiệu suất */
				uni.$emit('data_chat_data_push',chat_data.list);
			}
		}
		_action.setStatusTips();
	},
	/** Nhận thông báo hoạt động bảng tin của bạn bè */
	circleTips(data){
		_action.playVoice('/static/voice/circle.mp3');
		_data.data('no_reader_circle',1);
		_action.setStatusTips();
	},
	/** Nhận thông báo bình luận/thích bảng tin từ bạn bè */
	cricleChatTips(data){
		_action.playVoice('/static/voice/circle.mp3');
		let num = _data.data('no_reader_circle_chat_num');
		num ++;
		_data.data('no_reader_circle_chat_num',num);
		_action.setStatusTips();
	},
	/** Thu hồi tin nhắn */
	deleteChat(data){
		let chat_data = _data.localData(data.list_id);
		for(let i = 0,j = chat_data.list.length;i < j;i++ ){
			if(chat_data.list[i].msg.id == data.data.msg.id){
				chat_data.list[i] = data.data;
				_data.localData(data.list_id,chat_data);
				uni.$emit('data_chat_data_delete',chat_data.list);
				break;
			}
		}
	},
	/** Yêu cầu vào nhóm */
	chatGroupApply(data){
		let local_data = _data.localData('group_apply_list');
		if(!local_data){
			local_data = [];
		}
		local_data.push(data);
		_data.localData('group_apply_list',local_data);
		uni.$emit('data_group_apply_data',local_data);
		let num = _data.data('new_group_tips_num');
		num ++;
		_data.data('new_group_tips_num',num);
		_action.playVoice('/static/voice/friend.mp3');
		_action.setStatusTips();
	},
	
	/** Thông báo quản trị viên nhóm đã xử lý */
	groupChatApplyAllow(id){
		let local_data = _data.localData('group_apply_list');
		for(let value of local_data){
			if(value.id == id){
				value.status = 1;
				value.text = 'Đã chấp nhận';
				let num = _data.data('new_group_tips_num');
				num --;
				if(num < 0){
					num = 0;
				}
				_data.data('new_group_tips_num',num);
			}
			break;
		}
		_data.localData('group_apply_list',local_data);
		uni.$emit('data_group_apply_data',local_data);
		_action.setStatusTips();
	},
	
	/** Giải tán nhóm */
	removeGroup(data){
		/** Xóa dữ liệu cache danh sách hội thoại */
		for(let i = 0,local_chat_list = _data.localData('chat_list'),j = local_chat_list.length;i < j;i ++){
			if(local_chat_list[i].list_id == data.list_id){
				local_chat_list.splice(i,1);
				_data.localData('chat_list',local_chat_list);
				uni.$emit('data_chat_list',local_chat_list);
				break;
			}
		}
		/** Xóa dữ liệu cache hội thoại */
		_data.localData(data.list_id,null);
		uni.showModal({
			title: data.group_name + ' Nhóm chat đã bị trưởng nhóm giải tán!',
		});
	}
}