import utfx from 'utfx';
import _data from './_data';
import _onSocket from './_onSocket';
import i18n from './i18n';

/**
 * Hàm dùng để gửi dữ liệu qua socket
 */
function stringSource(s)
{
	let i = 0;
	return () => {
		return i < s.length ? s.charCodeAt(i++) : null;
	};
}

export default {
	/** Khi thêm phương thức, thêm $ trước tên để tránh xung đột với phương thức trang */
	methods: {
	
		/**
		 *  HTTP request
		 *  config object
		 *  {
		 *      path: string, đường dẫn request
		 *	 	data: object, dữ liệu gửi đi
		 * 		success: function, callback thành công
		 * 		fail: function, callback lỗi
		 * 		type: string, phương thức request (mặc định là post)
		 * 		success_action: boolean, có gọi success callback khi err != 0 không (mặc định: chỉ hiện msg, không gọi success callback)
		 * 		check: false, có xác thực đăng nhập không (mặc định không xác thực)
		 *	}
		 */
		$httpSend(config){
			let header = {
				/** Đặt là cross-origin đơn giản, chỉ gửi một request */
				'Content-Type': 'application/x-www-form-urlencoded',
			};
			let send_data = ('data' in config ? config.data : {}),
			url = _data.data('http_url') + config.path;
			send_data['_token'] = _data.localData('token');
			send_data['_agent_id'] = _data.data('agent_id');
			send_data['_locale'] = i18n.getLocale();
			uni.request({
				url: url,
				data: send_data,
				method: ('type' in config ? config.type : 'POST'),
				header: header,
				dataType: 'json',
				success(res) {
					if(res.statusCode == 200){
						if(res.data && typeof res.data.msg === 'string'){
							res.data.msg = i18n.translateText(res.data.msg);
						}
						if(('success_action' in config) && config.success_action ){
							config.success(res.data);
						}
						else {
							if(res.data.err){
								/** Không hiển thị thông báo chưa đăng nhập */
								if(send_data['_token'] || config.path.indexOf('/in/') > -1){
									uni.showModal({
										content: res.data.msg,
									});
								}
							}
							else {
								if('success' in config){
									config.success(res.data.data);
								}
							}
						}
					}
					else {
						uni.showModal({
							content: i18n.translateText('server error：') + JSON.stringify(res.data),
						});
					}
				},
				fail(err) {
					if('fail' in config){
						config.fail(err);
					}else{
						console.log(JSON.stringify(err));return;
						uni.showModal({
							content: JSON.stringify(err),
						});
					}
				}
			});
		},

		/**
		 * Gửi dữ liệu qua websocket,
		 * Nếu chưa kết nối websocket thì kết nối trước, đợi 2 giây để websocket kết nối rồi gửi dữ liệu; nếu sau 2 giây vẫn chưa kết nối thì bỏ qua lần gửi này,
		 * Nếu giá trị gửi rỗng thì chỉ kết nối
		 * 	@param data object 
		 * 	{
		 *		action: 'model.controller.action',
		 *		data: {}
		 *	}
		 */
		$socketSend(send_data){
			/** callback1 là kết nối, callback2 là gửi */
			((callback1,callback2) => {
				
				if(send_data && _data.data('socket_state')){
					callback2(send_data);
				}else{
					callback1(callback2,send_data);
				}
			})((callback,send_data) => {
				uni.connectSocket({
					url: _data.data('socket_url'),
					header: {
						'content-type': 'application/json',
					},
					// protocols: [ 'protocol1' ],
					method: 'GET',
					success(res){
						//console.log('socket kết nối thành công')
					},
					fail(err){
						uni.showModal({
							content: JSON.stringify(err) + '---Gọi socket thất bại',
						});
					}
				});
				uni.onSocketOpen((res) => {
					//console.log('socket đã mở');
					/** Gửi token đến server để xác thực */						
					callback({
						action: 'checkToken',
						data: _data.localData('token'),
					});
					
					/** Nếu có dữ liệu cần gửi, đợi 2 giây rồi gửi; nếu sau 2 giây token vẫn chưa hợp lệ thì bỏ qua lần gửi này */
					if(send_data) {
						setTimeout(() => {
							if(_data.data('socket_state')){
								callback(send_data);
							}
						},2000);
					}
					
				});
				/** Bind sự kiện tin nhắn từ server */
				uni.onSocketMessage((res) => {
					res = JSON.parse(res.data);
					console.log(res)
					if(!(res.action in _onSocket)){
						if(res.action != 'ping' && res.type != 'ping' && res.action != 'bindUid' ){
							uni.showModal({
								content: 'Nhận được tin nhắn không hợp lệ',
							});
						}
						// lưu thời gian nhận heartbeat
						if(res.type === 'ping' ){
							const time = Date.parse(new Date())/1000
							console.log(time)
							_data.localData('socket_heartbeat',time)
						}
						if(res.action === 'bindUid' ){
							console.log('Kết nối thành công, đã liên kết UID:'+res.data.user_id)
						}
					} else {
						_onSocket[res.action](res.data);
					}
				});
				uni.onSocketClose((err) => {
					//console.log('socket đã đóng');
					_data.data('socket_state',0);
				});
				
				uni.onSocketError((err) => {
					console.log(err)
					_data.data('socket_state',0);
					return;
					uni.showModal({
						content: JSON.stringify(err) + '---Mở kết nối webSocket thất bại!',
					});
				});
			},
			(send_data) => {
			
				uni.sendSocketMessage({
					data: JSON.stringify(send_data),
					fail(err){
						return;
						uni.showModal({
							content: JSON.stringify(err) + '---Gửi tin nhắn thất bại',
						});
					}
				});
			});	
		},
		
		/** 
		 * Gửi file qua HTTP (hình ảnh, tệp, giọng nói)
		 * @param json obj 
		 * {
			local_url: string * Địa chỉ file cục bộ khi không dùng control tải lên
			data: json obj * Dữ liệu tải lên
			success: function * Callback tải lên thành công
			fail: function * Callback tải lên thất bại
			type: int 0=file hội thoại 1=ảnh đại diện 2=file bảng tin 3=ảnh nền bảng tin 4=ảnh đại diện nhóm
			onProgressUpdate: function * Theo dõi tiến trình tải lên
		   }
		 */
		$httpSendFile(config){
			if(!config){
				config = {};
			}
			let send_data = ('data' in config ? config.data : {});
			send_data['_token'] = _data.localData('token');
			send_data['_locale'] = i18n.getLocale();
			
			((callback) => {
				switch (config.type){
					/** Tải file trong hội thoại */
					case 0:
						callback(config.local_url,'/im/upload/chat');
						break;
					/** Tải lên ảnh đại diện */
					case 1:
						callback(config.local_url,'/im/upload/photo');
						break;
					/** Tải file bảng tin */
					case 2:
						callback(config.local_url,'/im/upload/circle');
						break;
					/** Tải ảnh nền bảng tin */
					case 3:
						callback(config.local_url,'/im/upload/circleImg');
						break;
					/** Tải lên ảnh đại diện nhóm */
					case 4:
						callback(config.local_url,'/im/upload/groupPhoto');
						break;
					default:
						uni.showModal({
							content: 'Thao tác không hợp lệ',
						});
						break;
				}
			})((local_url,action_path) => {
				let uploadTask = uni.uploadFile({
					url: (_data.data('http_url') + action_path),
					filePath: local_url,
					name: 'file',
					/** formData phải có giá trị, nếu không sẽ tải lên thất bại */
					formData: send_data,
					success: (res) => {
						if(res.statusCode == 200){
							if('success' in config){
								res.data = JSON.parse(res.data);
								if(res.data.err){
									if('fail' in config){
										config.fail(err);
									} else {
										uni.showModal({
											content: res.data.msg,
										});
									}
								}else{
									config.success(res.data.data);
								}
							}
						}
					},
					fail(err){
						if('fail' in config){
							config.fail(err);
						} else {
							uni.showModal({
								content: JSON.stringify(err),
							});
						}
					}
				});
				uploadTask.onProgressUpdate((res) => {
					
					if('onProgressUpdate' in config){
						config.onProgressUpdate();
					}
					
					return;
					
					console.log('Tiến trình tải lên: ' + res.progress);
					console.log('Dữ liệu đã tải lên: ' + res.totalBytesSent);
					console.log('Tổng dữ liệu cần tải lên: ' + res.totalBytesExpectedToSend);
				});
			});
		},
		
	}
}
