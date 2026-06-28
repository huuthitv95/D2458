<script>
	
	import _action from './common/_action';
	import _get from './common/_get';
	import _data from './common/_data';
	
	export default {
		globalData: {
			agent_id: 0,
			/** Địa chỉ HTTP server */
			http_url: 'https://demo1.guaiwola.com',
			/** Địa chỉ lưu file tĩnh */
			static_url: 'https://demo1.guaiwola.com',
			/** Địa chỉ socket server */
			socket_url: 'wss://api-api.guaiwola.com',
			
			
			/** Trạng thái kết nối socket */
			socket_state: 0,
			/** Thông báo yêu cầu kết bạn */
			new_friend_tips_num: 0,
			/** Thông báo xác nhận nhóm */
			new_group_tips_num: 0,
			/** Thông báo bảng tin */
			no_reader_circle: 0,
			/** Số tin nhắn bảng tin chưa đọc */
			
			no_reader_circle_chat_num: 0,
			/** Dữ liệu cache */
			cache: {
				/** Dữ liệu cache ảnh đại diện cá nhân */
				local_photo: '',
			},
			/** Thông tin người dùng */
			user_info: {
				id: 0,
				nickname: '',
				username: '',
				photo: 'default_man/70.jpg',
				doodling: '',
				circle_img: 'default_circle_img.jpg?_=3.1415926',
			},
		},
		onLaunch() {
			
			// #ifdef APP-PLUS
			
			/** Khóa hướng màn hình */
			plus.screen.lockOrientation('portrait-primary');
			
			/** Kiểm tra cập nhật */
			let _this = this;
			
			plus.runtime.getProperty(plus.runtime.appid, function(info) {
				_this.$httpSend({
					path: '/im/app/update',
					data: {
						appid: info.appid,
						version: info.version,
					},
					success(res){
						if(res.status) {
							_action.checkFail();
							let wgtWaiting = plus.nativeUI.showWaiting("Bắt đầu tải xuống bản cập nhật"),
							update_url = (plus.os.name == 'Android' ? res.update_url.android : res.update_url.ios),
							downloadTask = uni.downloadFile({
							    url: update_url,
							    success: (res) => {
									wgtWaiting.close();
									if (res.statusCode === 200 ) {
										plus.runtime.install(res.tempFilePath,{},() => {
											plus.runtime.restart();
										},(e) => {
											uni.showModal({
												content: "update error [" + e.code + "]：" + e.message,
												showCancel: false,
											});
										});
									} else {
										uni.showModal({
											content: "api error update fail!",
											showCancel: false,
										});
									}
							    }
							});
							downloadTask.onProgressUpdate((res) => {
								wgtWaiting.setTitle('Đang tải... ' + res.progress + '%');
							});
						}
					},
				});
			});
			
			// #endif
			
		},
		onShow() {
			if(!_data.localData('token')){
				return;
			}
			setTimeout(() => {
			   /**
				* Mỗi lần app khởi động đều tải danh sách hội thoại mới nhất; danh sách hội thoại mới nhất sẽ đảm bảo giao diện hội thoại luôn cập nhật
				* Delay 100ms ở đây, nếu không biến toàn cục chưa load xong sẽ báo lỗi.
				*/
				_get.getChatList();
			},100);
			
			// Bắt đầu kiểm tra heartbeat sau 1 phút kết nối thành công; nếu quá 40 giây không nhận heartbeat từ server thì kết nối lại socket
			setTimeout(function(){
				setInterval(function(){
					const time = Date.parse(new Date())/1000
					const socket_heartbeat = parseInt(_data.localData('socket_heartbeat'))
					if(socket_heartbeat && (time - socket_heartbeat) > 40){
						console.log('no_socket_heartbeat')
						/** Ngắt kết nối và kết nối lại, sau đó lấy dữ liệu mới nhất */
						_data.data('socket_state',0);
						uni.closeSocket();
						_this.$socketSend();
						_get.getChatList();
					} else {
						if(_data.localData('token')){
							// Kiểm tra người dùng hiện tại đã liên kết clientID chưa
							_this.$httpSend({
								path: '/im/message/checkUid',
								data: {
									token: _data.localData('token'),
								},
								success_action: true,
								success(res) {
									const clientID = res.data.client_id
									console.log(clientID)
									if (clientID.length == 0){
										/** Ngắt kết nối và kết nối lại, sau đó lấy dữ liệu mới nhất */
										_data.data('socket_state',0);
										uni.closeSocket();
										_this.$socketSend();
										_get.getChatList();
									}
								}
							});
						}
					}
				},40000)
			},60000)
			
			
			let _this = this;
			
			/**
			 * @param {Object} res
			 * Lắng nghe thay đổi mạng
			 * Nếu mạng thay đổi, ngắt socket rồi kết nối lại
			 * Lấy lại dữ liệu danh sách hội thoại
			 * Nếu đang ở giao diện hội thoại thì lấy lại dữ liệu hội thoại đó
			 */
			uni.onNetworkStatusChange(function (res) {
				/** Ngắt kết nối và kết nối lại, sau đó lấy dữ liệu mới nhất */
				_data.data('socket_state',0);
				uni.closeSocket();
				_this.$socketSend();
				_get.getChatList();
				
				if(_data.localData('message_list_id')){
					_get.getChatData({
						send_data: {
							list_id: _data.localData('message_list_id'),
							time: 0,
							is_up: 1,
						},
						is_action_data: 1,
					});
				}
			});
		},
		onHide() {
			
		}
	}
</script>

<style>
	
	/* #ifndef APP-PLUS-NVUE */
	/** uni.css - Thư viện style component và template chung, có thể dùng như một UI library */
	@import './static/css/uni.css';
	/** Đặt màu nền cho body */
	page {
		background-color: #F4F5F6;
	}
	/** Điều chỉnh style icon tùy chỉnh thanh điều hướng */
	.uni-page-head .uni-btn-icon {
		min-width: auto !important;
		overflow: inherit !important;
	}
	/* #endif */
	
	.uni-tabbar {
		display: flex !important;
	}
</style>
