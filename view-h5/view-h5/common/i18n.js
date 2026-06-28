const LOCALE_KEY = 'app_locale';
const DEFAULT_LOCALE = 'vi';
const SUPPORTED_LOCALES = ['vi', 'en'];

const messages = {
	vi: {
		'language.current': 'Tiếng Việt',
		'language.title': 'Ngôn ngữ',
		'language.vietnamese': 'Tiếng Việt',
		'language.english': 'English',
		'language.changed': 'Đã đổi ngôn ngữ',
		'auth.welcome': 'Chào mừng bạn!',
		'auth.login': 'Đăng nhập',
		'auth.register_link': 'Chưa có tài khoản? Đăng ký',
		'auth.phone': 'Số điện thoại',
		'auth.password': 'Mật khẩu',
		'auth.phone_invalid': 'Số điện thoại không hợp lệ',
		'storage.local_unavailable': 'Không thể dùng bộ nhớ cục bộ',
		'server.error': 'Lỗi máy chủ: ',
		'audio.playing': 'Đang phát',
		'audio.play_error': 'Lỗi phát âm thanh: ',
		'settings.password': 'Đổi mật khẩu đăng nhập',
		'settings.logout': 'Đăng xuất',
		'tab.chat': 'Trò chuyện',
		'tab.contacts': 'Danh bạ',
		'tab.discover': 'Khám phá',
		'tab.me': 'Tôi',
	},
	en: {
		'language.current': 'English',
		'language.title': 'Language',
		'language.vietnamese': 'Tiếng Việt',
		'language.english': 'English',
		'language.changed': 'Language changed',
		'auth.welcome': 'Welcome!',
		'auth.login': 'Log in',
		'auth.register_link': 'No account yet? Sign up',
		'auth.phone': 'Phone number',
		'auth.password': 'Password',
		'auth.phone_invalid': 'Invalid phone number',
		'storage.local_unavailable': 'Local storage is unavailable',
		'server.error': 'Server error: ',
		'audio.playing': 'Playing',
		'audio.play_error': 'Audio playback error: ',
		'settings.password': 'Change login password',
		'settings.logout': 'Log out',
		'tab.chat': 'Chats',
		'tab.contacts': 'Contacts',
		'tab.discover': 'Discover',
		'tab.me': 'Me',
	},
};

const sourceMap = {
	'欢迎您！': ['Chào mừng bạn!', 'Welcome!'],
	'手机号码': ['Số điện thoại', 'Phone number'],
	'密码': ['Mật khẩu', 'Password'],
	'登 录': ['Đăng nhập', 'Log in'],
	'登陆': ['Đăng nhập', 'Log in'],
	'登录': ['Đăng nhập', 'Log in'],
	'还没有账号，前往注册': ['Chưa có tài khoản? Đăng ký', 'No account yet? Sign up'],
	'会话': ['Trò chuyện', 'Chats'],
	'通讯录': ['Danh bạ', 'Contacts'],
	'发现': ['Khám phá', 'Discover'],
	'我的': ['Tôi', 'Me'],
	'设置': ['Cài đặt', 'Settings'],
	'登录密码修改': ['Đổi mật khẩu đăng nhập', 'Change login password'],
	'退出登录': ['Đăng xuất', 'Log out'],
	'帐号': ['Tài khoản', 'Account'],
	'账号': ['Tài khoản', 'Account'],
	'朋友圈': ['Khoảnh khắc', 'Moments'],
	'好友动态': ['Hoạt động bạn bè', 'Friend updates'],
	'发起群聊': ['Tạo nhóm chat', 'Start group chat'],
	'添加好友': ['Thêm bạn bè', 'Add friend'],
	'扫一扫': ['Quét mã', 'Scan'],
	'收付款': ['Thu/chi tiền', 'Payments'],
	'输入搜索关键词': ['Nhập từ khóa tìm kiếm', 'Enter search keywords'],
	'申请入群': ['Xin vào nhóm', 'Request to join group'],
	'管理员设置': ['Cài đặt quản trị viên', 'Admin settings'],
	'禁言设置': ['Cài đặt cấm chat', 'Mute settings'],
	'全体禁言(除群主和管理员)': ['Cấm chat toàn nhóm (trừ chủ nhóm và quản trị viên)', 'Mute all members except owner and admins'],
	'置顶聊天': ['Ghim cuộc trò chuyện', 'Pin chat'],
	'消息免打扰': ['Tắt thông báo', 'Do not disturb'],
	'强提醒': ['Nhắc quan trọng', 'Strong reminder'],
	'没有权限设置': ['Bạn không có quyền cài đặt', 'You do not have permission'],
	'设置成功': ['Cài đặt thành công', 'Settings saved'],
	'群主才能设置': ['Chỉ chủ nhóm mới được cài đặt', 'Only the group owner can change this'],
	'发送': ['Gửi', 'Send'],
	'取消': ['Hủy', 'Cancel'],
	'确定': ['OK', 'OK'],
	'保存': ['Lưu', 'Save'],
	'保存成功': ['Đã lưu', 'Saved'],
	'复制成功': ['Đã sao chép', 'Copied'],
	'复制消息': ['Sao chép tin nhắn', 'Copy message'],
	'撤回消息': ['Thu hồi tin nhắn', 'Recall message'],
	'发送消息失败': ['Gửi tin nhắn thất bại', 'Failed to send message'],
	'本地存储数据不可用': ['Không thể dùng bộ nhớ cục bộ', 'Local storage is unavailable'],
	'本地数据设置失败,请检测storage存储': ['Lưu dữ liệu cục bộ thất bại, vui lòng kiểm tra storage', 'Failed to save local data, please check storage'],
	'删除本地数据失败': ['Xóa dữ liệu cục bộ thất bại', 'Failed to delete local data'],
	'接受到无效的消息': ['Nhận được tin nhắn không hợp lệ', 'Received an invalid message'],
	'接口调用失败': ['Gọi API thất bại', 'API request failed'],
	'server error：': ['Lỗi máy chủ: ', 'Server error: '],
	'开始播放': ['Đang phát', 'Playing'],
	'音效播放错误 ->': ['Lỗi phát âm thanh: ', 'Audio playback error: '],
	'连接成功,已绑定UID': ['Kết nối thành công, đã gán UID', 'Connected and bound UID'],
	'刚刚': ['Vừa xong', 'Just now'],
	'分钟前': [' phút trước', ' minutes ago'],
	'今天': ['Hôm nay', 'Today'],
	'昨天': ['Hôm qua', 'Yesterday'],
	'年': [' năm ', '/'],
	'月': [' tháng ', '/'],
	'日': [' ngày ', ' '],
	'[语音]': ['[Giọng nói]', '[Voice]'],
	'[图片]': ['[Ảnh]', '[Image]'],
	'[视频]': ['[Video]', '[Video]'],
	'[文件]': ['[Tệp]', '[File]'],
	'[红包]': ['[Lì xì]', '[Red packet]'],
	'[未知]': ['[Không rõ]', '[Unknown]'],

	'标为已读': ['Đánh dấu đã đọc', 'Mark as read'],
	'标为未读': ['Đánh dấu chưa đọc', 'Mark as unread'],
	'删除': ['Xóa', 'Delete'],
	'会话成员': ['Thành viên nhóm', 'Group members'],
	'邀 请': ['Mời', 'Invite'],
	'移 除': ['Xóa khỏi nhóm', 'Remove'],
	'群头像': ['Ảnh nhóm', 'Group photo'],
	'群聊名称': ['Tên nhóm chat', 'Group name'],
	'群公告': ['Thông báo nhóm', 'Group notice'],
	'群二维码': ['Mã QR nhóm', 'Group QR code'],
	'解散该群': ['Giải tán nhóm', 'Disband group'],
	'重要提示': ['Cảnh báo quan trọng', 'Important warning'],
	'此操作数据不可恢复,确定要解散该群吗?': ['Hành động này không thể hoàn tác, bạn có chắc muốn giải tán nhóm?', 'This action is irreversible. Are you sure you want to disband the group?'],
	'不解散': ['Không giải tán', 'Cancel'],
	'没有权限查看': ['Bạn không có quyền xem', 'You do not have permission to view'],
	'拼手气红包': ['Lì xì may mắn', 'Lucky red packet'],
	'普通红包': ['Lì xì thường', 'Normal red packet'],
	'红包个数': ['Số lì xì', 'Number of packets'],
	'输入红包个数': ['Nhập số lì xì', 'Enter number of packets'],
	'个': ['cái', 'item(s)'],
	'总金额': ['Tổng số tiền', 'Total amount'],
	'输入金额': ['Nhập số tiền', 'Enter amount'],
	'元': ['đồng', 'VND'],
	'小伙伴领取的金额随机': ['Số tiền mỗi người nhận ngẫu nhiên', 'Random amount for each recipient'],
	'恭喜发财': ['Chúc mừng phát tài', 'Best wishes'],
	'发红包': ['Gửi lì xì', 'Send red packet'],
	'单个金额': ['Số tiền mỗi phần', 'Amount per packet'],
	'小伙伴领取的金额相同': ['Mỗi người nhận cùng số tiền', 'Equal amount for each recipient'],
	'金额不能为空': ['Số tiền không được để trống', 'Amount cannot be empty'],
	'的红包': ['Lì xì của', 'red packet from'],
	'已领取': ['Đã nhận', 'Claimed'],
	'共': ['Tổng', 'Total'],
	'手气王': ['May mắn nhất', 'Luckiest'],
	'抢红包': ['Nhận lì xì', 'Claim red packet'],
	'加载中': ['Đang tải...', 'Loading...'],
	'扫一扫上面群的二维码': ['Quét mã QR nhóm phía trên', 'Scan the group QR code above'],
	'申请进群': ['Xin vào nhóm', 'Request to join group'],
	'移除成员': ['Xóa thành viên', 'Remove members'],
	'搜索我的朋友': ['Tìm bạn bè', 'Search friends'],
	'新的朋友': ['Bạn mới', 'New friends'],
	'群聊': ['Nhóm chat', 'Group chats'],
	'群认证': ['Xác nhận nhóm', 'Group approval'],
	'标签': ['Nhãn', 'Labels'],
	'小程序': ['Tiểu chương trình', 'Mini programs'],
	'备注': ['Ghi chú', 'Remark'],
	'你需要发送验证申请': ['Bạn cần gửi yêu cầu xác minh', 'You need to send a verification request'],
	'等对方通过': ['Chờ đối phương chấp nhận', 'Wait for the other party to approve'],
	'是直接添加成功': ['Sẽ được thêm ngay', 'Will be added directly'],
	'确定删除这条好友申请记录吗': ['Bạn có chắc muốn xóa yêu cầu kết bạn này không?', 'Are you sure you want to delete this friend request?'],
	'删除成功': ['Xóa thành công', 'Deleted successfully'],
	'提示': ['Thông báo', 'Notice'],
	'好友的用户名': ['Tên người dùng bạn bè', 'Friend\'s username'],
	'邮箱': ['Email', 'Email'],
	'手机': ['Điện thoại', 'Phone'],
	'无搜索结果': ['Không tìm thấy kết quả', 'No results found'],
	'昵称': ['Biệt danh', 'Nickname'],
	'隐藏': ['Ẩn', 'Hidden'],
	'验证信息': ['Thông tin xác minh', 'Verification info'],
	'个性签名': ['Chữ ký cá nhân', 'Bio'],
	'来 源': ['Nguồn gốc', 'Source'],
	'更多信息': ['Thông tin thêm', 'More info'],
	'发消息': ['Nhắn tin', 'Send message'],
	'音视频通话': ['Gọi video/âm thanh', 'Audio/video call'],
	'添加到通讯录': ['Thêm vào danh bạ', 'Add to contacts'],
	'不能给自己发消息': ['Không thể nhắn tin cho chính mình', 'Cannot send a message to yourself'],
	'已添加': ['Đã thêm', 'Already added'],
	'设置备注和标签': ['Đặt ghi chú và nhãn', 'Set remark and label'],
	'删除好友及相关的会话数据并且不能恢复': ['Xóa bạn bè và dữ liệu liên quan, không thể khôi phục', 'Delete friend and related data, cannot be undone'],
	'确认删除吗': ['Bạn có chắc muốn xóa không?', 'Are you sure you want to delete?'],
	'操作成功': ['Thao tác thành công', 'Operation successful'],
	'删除会话列表数据': ['Xóa danh sách hội thoại', 'Delete chat list data'],
	'删除对话数据': ['Xóa dữ liệu hội thoại', 'Delete conversation data'],
	'从我的好友列表里删除': ['Xóa khỏi danh sách bạn bè', 'Remove from friend list'],
	'帐号:': ['Tài khoản:', 'Account:'],
	'头像': ['Ảnh đại diện', 'Avatar'],
	'性别': ['Giới tính', 'Gender'],
	'男': ['Nam', 'Male'],
	'女': ['Nữ', 'Female'],
	'更多': ['Thêm', 'More'],
	'我的二维码': ['Mã QR của tôi', 'My QR code'],
	'扫一扫上面的二维码': ['Quét mã QR phía trên', 'Scan the QR code above'],
	'加我为好友': ['Thêm tôi làm bạn', 'Add me as a friend'],
	'输入原密码': ['Nhập mật khẩu cũ', 'Enter old password'],
	'输入新密码': ['Nhập mật khẩu mới', 'Enter new password'],
	'确认新密码': ['Xác nhận mật khẩu mới', 'Confirm new password'],
	'请输入密码': ['Vui lòng nhập mật khẩu', 'Please enter password'],
	'请输入原密码,不能小于6位': ['Vui lòng nhập mật khẩu cũ, ít nhất 6 ký tự', 'Please enter the old password, at least 6 characters'],
	'请输入新密码,不能小于6位': ['Vui lòng nhập mật khẩu mới, ít nhất 6 ký tự', 'Please enter new password, at least 6 characters'],
	'请确认新密码,不能小于6位': ['Vui lòng xác nhận mật khẩu mới, ít nhất 6 ký tự', 'Please confirm new password, at least 6 characters'],
	'两次新密码不一致': ['Hai lần nhập mật khẩu mới không khớp', 'New passwords do not match'],
	'已修改,请重新登陆': ['Đã thay đổi, vui lòng đăng nhập lại', 'Changed, please log in again'],
	'紧急冻结': ['Khóa khẩn cấp', 'Emergency freeze'],
	'输入冻结密码': ['Nhập mật khẩu khóa', 'Enter freeze password'],
	'冻结成功': ['Đã khóa thành công', 'Frozen successfully'],
	'注册': ['Đăng ký', 'Register'],
	'输入您的注册信息': ['Nhập thông tin đăng ký', 'Enter registration info'],
	'手机号码有误': ['Số điện thoại không hợp lệ', 'Invalid phone number'],
	'请重填': ['Vui lòng nhập lại', 'Please re-enter'],
	'密码只能包括下划线': ['Mật khẩu chỉ gồm chữ, số, dấu gạch dưới', 'Password can only contain letters, numbers, underscores'],
	'数字': ['chữ số', 'digits'],
	'字母': ['chữ cái', 'letters'],
	'长度': ['độ dài', 'length'],
	'请输入您的手机号': ['Vui lòng nhập số điện thoại', 'Please enter your phone number'],
	'请输入验证码': ['Vui lòng nhập mã xác minh', 'Please enter the verification code'],
	'获取验证码': ['Lấy mã xác minh', 'Get verification code'],
	'提交': ['Gửi', 'Submit'],
	'验证码': ['Mã xác minh', 'Verification code'],
	'忘记密码': ['Quên mật khẩu', 'Forgot password'],
	'找回密码': ['Lấy lại mật khẩu', 'Recover password'],
	'快速注册': ['Đăng ký nhanh', 'Quick register'],
	'评论': ['Bình luận', 'Comment'],
	'赞': ['Thích', 'Like'],
	'语音识别失败': ['Nhận dạng giọng nói thất bại', 'Voice recognition failed'],
	'重选': ['Chọn lại', 'Reselect'],
	'关闭': ['Đóng', 'Close'],
	'旋转': ['Xoay', 'Rotate'],
	'预览': ['Xem trước', 'Preview'],
	'上传': ['Tải lên', 'Upload'],
	'这一刻的想法': ['Chia sẻ khoảnh khắc này...', 'Share this moment...'],
	'拍照': ['Chụp ảnh', 'Take photo'],
	'相册': ['Album', 'Album'],
	'内容不能为空': ['Nội dung không được để trống', 'Content cannot be empty'],
	'发布中': ['Đang đăng...', 'Publishing...'],
	'设置备注': ['Đặt ghi chú', 'Set remark'],
	'选择图片': ['Chọn ảnh', 'Select image'],
	'修改群头像': ['Thay ảnh nhóm', 'Change group photo'],
	'昵称设置': ['Cài đặt biệt danh', 'Nickname settings'],
	'个性签名设置': ['Cài đặt chữ ký', 'Bio settings'],
	'性别设置': ['Cài đặt giới tính', 'Gender settings'],
};

const routeTitles = {
	'pages/chat/index': ['Trò chuyện', 'Chats'],
	'pages/friend/index': ['Danh bạ', 'Contacts'],
	'pages/push/index': ['Khám phá', 'Discover'],
	'pages/my/index': ['Tôi', 'Me'],
	'pages/set/index': ['Cài đặt', 'Settings'],
	'pages/in/login': ['Đăng nhập', 'Log in'],
	'pages/in/reg': ['Đăng ký', 'Sign up'],
	'pages/in/forget': ['Quên mật khẩu', 'Forgot password'],
};

function normalizeLocale(locale) {
	return SUPPORTED_LOCALES.indexOf(locale) > -1 ? locale : DEFAULT_LOCALE;
}

function getLocale() {
	let locale = '';
	try {
		locale = uni.getStorageSync(LOCALE_KEY);
	} catch (e) {}
	return normalizeLocale(locale || DEFAULT_LOCALE);
}

function setLocale(locale) {
	locale = normalizeLocale(locale);
	uni.setStorageSync(LOCALE_KEY, locale);
	updateBars();
	translatePage();
	uni.$emit('locale_changed', locale);
	return locale;
}

function interpolate(text, params) {
	if (!params) return text;
	return String(text).replace(/\{(\w+)\}/g, (all, key) => params[key] !== undefined ? params[key] : all);
}

function sourceTranslate(text, locale) {
	if (!text) return text;
	let value = sourceMap[text];
	if (value) return locale === 'en' ? value[1] : value[0];
	value = sourceMap[String(text).trim()];
	if (value) return String(text).replace(String(text).trim(), locale === 'en' ? value[1] : value[0]);
	return text;
}

function translateText(text) {
	const locale = getLocale();
	return sourceTranslate(text, locale);
}

function t(key, params) {
	const locale = getLocale();
	const value = (messages[locale] && messages[locale][key]) || sourceTranslate(key, locale) || key;
	return interpolate(value, params);
}

function updateBars() {
	const locale = getLocale();
	const tabs = locale === 'en'
		? ['Chats', 'Contacts', 'Discover', 'Me']
		: ['Trò chuyện', 'Danh bạ', 'Khám phá', 'Tôi'];
	tabs.forEach((text, index) => {
		uni.setTabBarItem({ index, text });
	});
	const pages = getCurrentPages();
	if (!pages.length) return;
	const route = pages[pages.length - 1].route;
	if (routeTitles[route]) {
		uni.setNavigationBarTitle({
			title: locale === 'en' ? routeTitles[route][1] : routeTitles[route][0],
		});
	}
}

function translateDomNode(node, locale) {
	if (!node || !node.childNodes) return;
	for (let i = 0; i < node.childNodes.length; i++) {
		const child = node.childNodes[i];
		if (child.nodeType === 3) {
			const next = sourceTranslate(child.nodeValue, locale);
			if (next !== child.nodeValue) child.nodeValue = next;
		} else if (child.nodeType === 1) {
			['placeholder', 'title', 'alt', 'value'].forEach((attr) => {
				const value = child.getAttribute && child.getAttribute(attr);
				const next = sourceTranslate(value, locale);
				if (value && next !== value) child.setAttribute(attr, next);
			});
			translateDomNode(child, locale);
		}
	}
}

function translatePage() {
	// H5 runtime safeguard. Native UniApp text should use $t in edited screens.
	if (typeof document === 'undefined' || !document.body) return;
	setTimeout(() => translateDomNode(document.body, getLocale()), 0);
}

export default {
	LOCALE_KEY,
	DEFAULT_LOCALE,
	SUPPORTED_LOCALES,
	getLocale,
	setLocale,
	t,
	translateText,
	updateBars,
	translatePage,
};
