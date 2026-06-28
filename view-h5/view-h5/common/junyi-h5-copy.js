export default function h5Copy(content) {
  
  if (!document.queryCommandSupported('copy')) {
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
  
}