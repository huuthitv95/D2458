<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件

if (!function_exists('api_locale')) {
    function api_locale()
    {
        $locale = $_POST['_locale'] ?? $_GET['_locale'] ?? '';
        return in_array($locale, ['vi', 'en'], true) ? $locale : 'vi';
    }
}

if (!function_exists('api_msg')) {
    function api_msg($key, array $params = [])
    {
        $locale = api_locale();
        $messages = [
            'vi' => [
                'login.data_error' => 'Dữ liệu đăng nhập không hợp lệ',
                'login.bad_password' => 'Tên người dùng hoặc mật khẩu không đúng',
                'login.locked' => 'Người dùng đã bị {status}',
                'login.success' => 'Đăng nhập thành công',
                'login.register_data_error' => 'Dữ liệu đăng ký không hợp lệ',
                'login.username_rule' => 'Mã cộng đồng chỉ được gồm dấu gạch dưới, số, chữ cái và không quá 20 ký tự',
                'login.nickname_rule' => 'Biệt danh chỉ được là ký tự tiếng Trung',
                'login.password_rule' => 'Mật khẩu chỉ được gồm dấu gạch dưới, số, chữ cái, độ dài 6-20 ký tự',
                'login.username_exists' => 'Tên người dùng này đã tồn tại',
                'login.register_success' => 'Đăng ký thành công',
                'set.data_error' => 'Dữ liệu không hợp lệ',
                'set.type_error' => 'Loại dữ liệu không hợp lệ',
                'set.success' => 'Thành công',
                'set.pass1' => 'Vui lòng nhập mật khẩu cũ',
                'set.pass2' => 'Vui lòng nhập mật khẩu mới',
                'set.pass3' => 'Vui lòng xác nhận mật khẩu mới',
                'set.pass_mismatch' => 'Hai mật khẩu mới không khớp',
                'set.old_password_error' => 'Mật khẩu cũ không đúng',
            ],
            'en' => [
                'login.data_error' => 'Login data is invalid',
                'login.bad_password' => 'Username or password is incorrect',
                'login.locked' => 'User has been {status}',
                'login.success' => 'Logged in successfully',
                'login.register_data_error' => 'Registration data is invalid',
                'login.username_rule' => 'Community ID can only contain underscores, numbers, letters, and be at most 20 characters',
                'login.nickname_rule' => 'Nickname must be Chinese characters',
                'login.password_rule' => 'Password can only contain underscores, numbers, letters, and be 6-20 characters long',
                'login.username_exists' => 'This username already exists',
                'login.register_success' => 'Registered successfully',
                'set.data_error' => 'Invalid data',
                'set.type_error' => 'Invalid data type',
                'set.success' => 'Success',
                'set.pass1' => 'Please enter the current password',
                'set.pass2' => 'Please enter a new password',
                'set.pass3' => 'Please confirm the new password',
                'set.pass_mismatch' => 'The new passwords do not match',
                'set.old_password_error' => 'Current password is incorrect',
            ],
        ];
        $text = $messages[$locale][$key] ?? $key;
        foreach ($params as $paramKey => $paramValue) {
            $text = str_replace('{' . $paramKey . '}', (string) $paramValue, $text);
        }
        return $text;
    }
}
