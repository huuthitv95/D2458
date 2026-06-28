export default function uniCopy(content) {
	/**
	 * Logic sao chép cho miniprogram và app
	 */
	//#ifndef H5
	uni.setClipboardData({
		data: content,
		success: function() {
			console.log('success');
			return true
		}
	});
	//#endif
	
	/**
	 * Logic sao chép cho H5
	 */
	// #ifdef H5
	if (!document.queryCommandSupported('copy')) { // Để tương thích với một số trình duyệt không hỗ trợ queryCommandSupported
		// Không hỗ trợ
		return false
	}
	let textarea = document.createElement("textarea")
	textarea.value = content
	textarea.readOnly = "readOnly"
	document.body.appendChild(textarea)
	textarea.select() // Chọn đối tượng
	textarea.setSelectionRange(0, content.length) // Quan trọng
	let result = document.execCommand("copy") // Thực thi lệnh sao chép của trình duyệt
	textarea.remove()
	return result
	// #endif
}
