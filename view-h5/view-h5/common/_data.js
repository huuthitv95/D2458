import i18n from './i18n';

export default {
	/**
	 * [Đặt/lấy dữ liệu globalData]
	 * @param {Object} k Khóa cần đặt/lấy
	 * @param {Object} v Giá trị cần đặt, nếu không truyền thì là lấy giá trị của khóa
	 * @return {String|Array|Object}
	 */
	data(k,v){
		if(v === undefined){
			return getApp().globalData[k];
		}
		else{
			getApp().globalData[k] = v;
		}
	},
	/**
	 * [Đặt/lấy dữ liệu trang lưu cục bộ]
	 * @param {Object} k Khóa cần đặt/lấy
	 * @param {Object} v Giá trị cần đặt; v=undefined thì lấy giá trị; v=null thì xóa khóa
	 * @return {String|Array|Object}
	 */
	localData(k,v){
		if(v === undefined){
			return uni.getStorageSync(k);
		}
		else if(v === null){
				uni.removeStorage({
					key: k,
					fail(){
						uni.showModal({
							content: i18n.t('Xóa dữ liệu cục bộ thất bại'),
						});
					}
				});
		}
		else {
				uni.setStorage({
					key: k,
					data: v,
					fail(){
						uni.showModal({
							content: i18n.t('Đặt dữ liệu cục bộ thất bại, vui lòng kiểm tra storage'),
						});
					}
				});
		}
	},
	/** Địa chỉ file tĩnh chat */
	staticChat(){
		return getApp().globalData.static_url + '/static/chat/';
	},
	/** Địa chỉ file tĩnh bảng tin */
	staticCircle(){
		return getApp().globalData.static_url + '/static/circle/';
	},
	/** Địa chỉ ảnh đại diện */
	staticPhoto(){
		return getApp().globalData.static_url + '/static/photo/';
	},
	/** Lấy số tin nhắn chưa đọc trong giao diện hội thoại */
	chatTipsNum(){
		let num = 0,
		chat_list = uni.getStorageSync('chat_list');
		if(chat_list){
			for(let value of chat_list){
				num += (value.no_reader_num * 1);
			}
		}
		return num;
	},
}
