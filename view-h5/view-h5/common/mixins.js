import utfx from 'utfx';
import store from './store/';
import onSocketMessage from './onSocketMessage';

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
			url = store.state.core.http_url + config.path;
			send_data['_token'] = uni.getStorageSync('token');
			uni.request({
				url: url,
				data: send_data,
				method: ('type' in config ? config.type : 'POST'),
				header: header,
				dataType: 'json',
				success(res) {
					if('success' in config && res.statusCode == 200){
						if(('success_action' in config) && config.success_action ){
							config.success(res.data);
						}else{
							if(res.data.err){
								/** Không hiển thị thông báo chưa đăng nhập */
								if(send_data['_token'] || config.path.indexOf('/in/') > -1){
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
				if(send_data && store.state.socket_state){
					callback2(send_data);
				}else{
					callback1(callback2,send_data);
				}
			})((callback) => {
				uni.connectSocket({
					url: store.state.core.socket_url,
					header: {
						'content-type': 'application/json',
					},
					// protocols: [ 'protocol1' ],
					method: 'GET',
					success(){
					},
					fail(err){
						uni.showModal({
							content: JSON.stringify(err) + '---Gọi socket thất bại',
						});
					}
				});
				uni.onSocketOpen((res) => {
					
					/** Bind sự kiện tin nhắn từ server */
					uni.onSocketMessage((res) => {
						
						res = JSON.parse(res.data);
						if(!(res.action in onSocketMessage)){
							if(res.action != 'ping' && res.type != 'ping' ){
								uni.showModal({
									content: 'Nhận được tin nhắn không hợp lệ',
								});
							}
						} else {
							onSocketMessage[res.action](res.data);
						}
						
						return;
						/** Cách viết bên dưới nhận dữ liệu nhị phân không tương thích APP */
						
						if (res.data instanceof Blob) {
							/** Blob trong JS không có phương thức đọc trực tiếp, dùng FileReader để đọc dữ liệu */
							let reader = new FileReader();
							reader.readAsDataURL(res.data);							
						    /** Gọi khi thao tác đọc hoàn tất thành công */
							reader.onload = function(evt){								
								let data = JSON.parse(((str) => {
									/** Giải mã base64 */
									if(str.indexOf(',') > -1){
										str = str.split(',')[1];
									}
									return decodeURIComponent(atob(str).split('').map((c) => {
									    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
									}).join(''));
								})(evt.target.result));
								if(!(data.action in onSocketMessage)){
									if(data.action != 'ping'){
										console.log('action null');
									}
									return;
								}
								onSocketMessage[data.action](data.data);
							}
						}
					});
					
					/** Gửi token đến server để xác thực */						
					callback({
						action: 'checkToken',
						data: uni.getStorageSync('token'),
					});
					
					/** Nếu có dữ liệu cần gửi, đợi 2 giây rồi gửi; nếu sau 2 giây token vẫn chưa hợp lệ thì bỏ qua lần gửi này */
					if(send_data) {
						setTimeout(() => {
							if(store.state.socket_state){
								callback(send_data);
							}
						},2000);
					}
					
				});
				
				uni.onSocketClose((err) => {
					store.commit('set',{ k:'socket_state',v:0 });
				});
				
				uni.onSocketError((err) => {
					store.commit('set',{ k:'socket_state',v:0 });
					console.log(JSON.stringify(err));return;
					uni.showModal({
						content: JSON.stringify(err) + '---Mở kết nối webSocket thất bại!',
					});
				});
			},
			(send_data) => {
				
				uni.sendSocketMessage({
					data: JSON.stringify(send_data),
					fail(err){
						uni.showModal({
							content: JSON.stringify(err) + '---Gửi tin nhắn thất bại',
						});
					}
				});
				
				return 
				/** Bên dưới là gửi dữ liệu dạng nhị phân */
				
				/** Quá trình chuyển chuỗi sang nhị phân */
				let data = JSON.stringify(send_data),
				strCodes = stringSource(data),
				/** Chuỗi JS là UTF-16, chuyển sang UTF-8 */
				length = utfx.calculateUTF16asUTF8(strCodes)[1];
				/** Đầu chuỗi */
				let offset = 0,
				/** Khởi tạo buffer nhị phân có độ dài = độ dài chuỗi UTF-8 + 4 byte (kết thúc chuỗi) */
				buffer = new ArrayBuffer(length + offset),
				view = new DataView(buffer);
				
				/** Đặt độ dài vào đầu chuỗi */
				view.setUint32(0, length);
				utfx.encodeUTF16toUTF8(stringSource(data), function(b) {
					view.setUint8(offset++, b);
				}.bind(this));			
				uni.sendSocketMessage({
					data: buffer,
					success(res){
						
					},
					fail(err){
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
			send_data['_token'] = uni.getStorageSync('token');
			
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
					url: (store.state.core.static_url + action_path),
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