import _data from './_data';
import _mixins from './_mixins';
import i18n from './i18n';

export default {
	/** Hiển thị thông báo trạng thái */
	setStatusTips(){
		let pages = getCurrentPages();
		if(pages.length < 1){
			return;
		}
		let route = pages[pages.length - 1].route,
		/** Chỉ cập nhật trạng thái tin nhắn ở trang tabbar */
		routes = [
			'pages/chat/index',
			'pages/friend/index',
			'pages/push/index',
			'pages/my/index',
		];
		if(routes.indexOf(route) == -1){
			return;
		}
		/** Thông báo danh bạ */
		let num = (_data.data('new_friend_tips_num') * 1),
		num_ = (_data.data('new_group_tips_num') * 1);
		if(num_){
			uni.$emit('data_new_group_apply_tips',num_);
		}
		if(num){
			uni.$emit('data_new_friend_tips',num);
		}
		if(num + num_) {
			uni.setTabBarBadge({
			 index: 1,
			 text: (num + num_ + ''),
			});
		} else {
			uni.removeTabBarBadge({ index: 1 });
		}
		/** Thông báo danh sách hội thoại */
		num = _data.chatTipsNum();
		if(num){
			uni.setTabBarBadge({
			 index: 0,
			 text: (num + ''),
			});
			if(route == 'pages/chat/index'){
				uni.setNavigationBarTitle({
					title: i18n.t('tab.chat') + '(' + num +')',
				});
			}
		} else {
			uni.removeTabBarBadge({ index: 0 });
			if(route == 'pages/chat/index'){
				uni.setNavigationBarTitle({
					title: i18n.t('tab.chat'),
				});
			}
		}

		/** Thông báo bảng tin (ưu tiên hiển thị số tin nhắn, sau đó thông báo hoạt động bạn bè) */
		num = _data.data('no_reader_circle_chat_num');
		if(num){
			uni.setTabBarBadge({
				index: 3,
				text: (num + ''),
			});
			uni.$emit('data_circle_tips',num);
		}
		else {
			uni.removeTabBarBadge({ index: 3 });
			num = _data.data('no_reader_circle');
			if(num){
				uni.showTabBarRedDot({ index: 3 });
				uni.$emit('data_circle_tips',i18n.t('Hoạt động bạn bè'));
			}else{
				uni.hideTabBarRedDot({ index: 3 });
			}
		}
		
	},
	/** Phương thức thực thi route guard */
	routeTool() {
		let token = _data.localData('token');
		/** Chưa có token thì chuyển đến trang đăng nhập để lấy token */
		if(!token){
			uni.reLaunch({
				url: '/pages/in/login'
			});
			return;
		}
		/** Nếu chưa kết nối socket thì tiến hành kết nối */
		if(!_data.data('socket_state')) {
			_mixins.methods.$socketSend();
		}
	},
	/** Thực thi sau khi xác thực thất bại */
	checkFail()
	{
		/** Ngắt kết nối socket */
		uni.closeSocket();
		
		/** Đặt trạng thái socket thành mất kết nối */
		_data.data('socket_state',0);
		/** Thông báo yêu cầu kết bạn */
		_data.data('new_friend_tips_num',0);
		/** Thông báo bảng tin */
		_data.data('no_reader_circle',0);
		/** Số tin nhắn bảng tin chưa đọc */
		_data.data('no_reader_circle_chat_num',0);
		/** Xóa địa chỉ tạm cục bộ của ảnh đại diện */
		let data = _data.data('cache');
		data.local_photo = '';
		_data.data('cache',data);
		/** Lưu trữ thông tin người dùng */
		_data.data('user_info',{
			id: 0,
			nickname: '',
			username: '',
			photo: 'default_man/90.jpg',
			doodling: '',
			circle_img: 'default_circle_img.jpg',
		});
		
		/** Xóa dữ liệu cache */
		let locale = i18n.getLocale();
		uni.clearStorage();
		i18n.setLocale(locale);
		
		/** Chuyển đến giao diện đăng nhập */
		uni.reLaunch({
			url: '/pages/in/login'
		});
	},
	/** Đặt tin nhắn chưa đọc về 0 */
	updataNoReader(list_id){
		_mixins.methods.$httpSend({
			path: '/im/message/updataNoReader',
			data: { list_id: list_id },
		});
	},
	/** Tải về ảnh đại diện của mình */
	downloadPhoto(){
		uni.downloadFile({
			url: _data.staticPhoto() + _data.data('user_info').photo,
			success: (res) => {
				if (res.statusCode === 200) {
					let data = _data.data('cache');
					data.local_photo = res.tempFilePath;
					_data.data('cache',data);
				}
			}
		});
	},
	/** Phát âm thanh */
	playVoice(path){
		let innerAudioContext = uni.createInnerAudioContext();
		innerAudioContext.src = path;
	//	innerAudioContext.obeyMuteSwitch = false;
		innerAudioContext.play();
		innerAudioContext.onPlay(() => {
		  console.log(i18n.t('Bắt đầu phát'));
		});
		innerAudioContext.onError((res) => {
			innerAudioContext.destroy();
			return;
			uni.showToast({
				title: i18n.t('Lỗi phát âm thanh ->') + JSON.stringify(res),
				icon: 'none',
			});
		});
	},
	/** Chuyển đổi timestamp */
	timestampFormat( timestamp ) {
		let curTimestamp = parseInt(new Date().getTime() / 1000), // timestamp hiện tại
		timestampDiff = curTimestamp - timestamp, // số giây chênh lệch với timestamp hiện tại
		curDate = new Date( curTimestamp * 1000 ), // đối tượng ngày giờ hiện tại
		tmDate = new Date( timestamp * 1000 ),  // đối tượng ngày giờ từ timestamp tham số
		Y = tmDate.getFullYear(), 
		m = tmDate.getMonth() + 1, d = tmDate.getDate(),
		H = tmDate.getHours(), i = tmDate.getMinutes(), 
		s = tmDate.getSeconds();
		if ( timestampDiff < 60 ) { // trong vòng 1 phút
			return i18n.t('Vừa xong');
		} else if( timestampDiff < 3600 ) { // trong vòng 1 giờ
			return Math.floor( timestampDiff / 60 ) + i18n.t(' phút trước');
		} else if ( curDate.getFullYear() == Y && curDate.getMonth()+1 == m && curDate.getDate() == d ) {
			return i18n.t('Hôm nay') + ' ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
		} else {
			var newDate = new Date( (curTimestamp - 86400) * 1000 ); // đối tượng ngày giờ từ timestamp tham số + 1 ngày
			if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
				return i18n.t('Hôm qua') + ' ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
			} else if ( curDate.getFullYear() == Y ) {
				return  ((String(m).length == 1 ? '0' : '') + m) + i18n.t('/') + ((String(d).length == 1 ? '0' : '') + d) + i18n.t(' ') + ' ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
			} else {
				return  Y + i18n.t('/') + ((String(m).length == 1 ? '0' : '') + m) + i18n.t('/') + ((String(d).length == 1 ? '0' : '') + d) + i18n.t(' ') + ' ' + ((String(H).length == 1 ? '0' : '') + H) + ':' + ((String(i).length == 1 ? '0' : '') + i);
			}
		}
	},
}
