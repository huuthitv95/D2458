import utfx from 'utfx';
import _data from './_data';
import _onSocket from './_onSocket';
import i18n from './i18n';

/**
 * socket 发送用到的一个函数
 */
function stringSource(s)
{
	let i = 0;
	return () => {
		return i < s.length ? s.charCodeAt(i++) : null;
	};
}

export default {
	/** 添加方法时,方法name前加$以避免与页面方法冲突 */
	methods: {
	
		/**
		 *  http 请求
		 *  config object
		 *  {
		 *      path: string, 请求路径
		 *	 	data: object, 发送数据
		 * 		success: function, 回调
		 * 		fail: function, 错误回调
		 * 		type: string 请求方式(默认post)
		 * 		success_action: boolean err状态不为0时是否执行success回调(默认是err状态不为0就只提示msg而不执行success回调)
		 * 		check: false 是否验证登陆默认不验证
		 *	}
		 */
		$httpSend(config){
			let header = {
				/** 这里设置为简单跨域，只会请求一次 */
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
								/** 不显示未登录提示 */
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
		 * 通过 websocket 发送数据,
		 * 如果还没有连接 websocket 就先连接websocket,过两秒等websocket连接上了发送本次的数据,如果两秒后还是没有连接上，则舍弃这次发送数据，
		 * 如果发送的值为空则只连接
		 * 	@param data object 
		 * 	{
		 *		action: 'model.controller.action',
		 *		data: {}
		 *	}
		 */
		$socketSend(send_data){
			/** callback1是连接,callback2是发送 */
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
						//console.log('socket连接成功')
					},
					fail(err){
						uni.showModal({
							content: JSON.stringify(err) + '---socket 接口调用失败',
						});
					}
				});
				uni.onSocketOpen((res) => {
					//console.log('socket已打开');
					/** 这里发送token到服务器验证 */						
					callback({
						action: 'checkToken',
						data: _data.localData('token'),
					});
					
					/** 这里如果有需要发送的数据，就等待2s再进行发送，如果2s后，token验证还是不合法，就舍弃这次的发送 */
					if(send_data) {
						setTimeout(() => {
							if(_data.data('socket_state')){
								callback(send_data);
							}
						},2000);
					}
					
				});
				/** 绑定服务器消息事件 */
				uni.onSocketMessage((res) => {
					res = JSON.parse(res.data);
					console.log(res)
					if(!(res.action in _onSocket)){
						if(res.action != 'ping' && res.type != 'ping' && res.action != 'bindUid' ){
							uni.showModal({
								content: '接受到无效的消息',
							});
						}
						//保存接收到心跳包的时间
						if(res.type === 'ping' ){
							const time = Date.parse(new Date())/1000
							console.log(time)
							_data.localData('socket_heartbeat',time)
						}
						if(res.action === 'bindUid' ){
							console.log('连接成功,已绑定UID:'+res.data.user_id)
						}
					} else {
						_onSocket[res.action](res.data);
					}
				});
				uni.onSocketClose((err) => {
					//console.log('socket已关闭');
					_data.data('socket_state',0);
				});
				
				uni.onSocketError((err) => {
					console.log(err)
					_data.data('socket_state',0);
					return;
					uni.showModal({
						content: JSON.stringify(err) + '---webSocket 连接打开失败!',
					});
				});
			},
			(send_data) => {
			
				uni.sendSocketMessage({
					data: JSON.stringify(send_data),
					fail(err){
						return;
						uni.showModal({
							content: JSON.stringify(err) + '---发送消息失败',
						});
					}
				});
			});	
		},
		
		/** 
		 * http发送文件(图片、文件、语音)
		 * @param json obj 
		 * {
			local_url: string * 在不调用上传控件的时候的本地文件地址
			data: json obj * 上传的数据
			success: function * 上传成功回调
			fail: function * 上传失败回调
			type: int 0对话上传文件 1上传头像 2朋友圈上传文件 3朋友圈背景图片上传 4群头像上传
			onProgressUpdate: function 上传进度监听
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
					/** 对话上传文件 */
					case 0:
						callback(config.local_url,'/im/upload/chat');
						break;
					/** 上传头像 */
					case 1:
						callback(config.local_url,'/im/upload/photo');
						break;
					/** 朋友圈上传文件 */
					case 2:
						callback(config.local_url,'/im/upload/circle');
						break;
					/** 朋友圈背景图片上传 */
					case 3:
						callback(config.local_url,'/im/upload/circleImg');
						break;
					/** 群头像上传 */
					case 4:
						callback(config.local_url,'/im/upload/groupPhoto');
						break;
					default:
						uni.showModal({
							content: '无效的操作',
						});
						break;
				}
			})((local_url,action_path) => {
				let uploadTask = uni.uploadFile({
					url: (_data.data('http_url') + action_path),
					filePath: local_url,
					name: 'file',
					/** formData必须要有值，否则会上传失败 */
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
					
					console.log('上传进度' + res.progress);
					console.log('已经上传的数据长度' + res.totalBytesSent);
					console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
				});
			});
		},
		
	}
}
