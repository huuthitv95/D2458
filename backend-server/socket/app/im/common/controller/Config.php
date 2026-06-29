<?php
namespace common\controller;

class Config
{
    public static $gateWayPort = '8383';
    public static $registerPort = '1237';

    /** 获取本机ip */
    public static function getLocalIP()
    {
        $preg = "/\A((([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\Z/";
        if (strtoupper(substr(PHP_OS,0,3))==='WIN') {
            //获取操作系统为win2000/xp、win7的本机IP真实地址
            exec("ipconfig", $out, $stats);
            if (!empty($out)) {
                foreach ($out AS $row) {
                    if (strstr($row, "IP") && strstr($row, ":") && !strstr($row, "IPv6")) {
                        $tmpIp = explode(":", $row);
                        if (preg_match($preg, trim($tmpIp[1]))) {
                            return trim($tmpIp[1]);
                        }
                    }
                }
            }
        } else {
            //获取操作系统为linux类型的本机IP真实地址
            $result = shell_exec("/sbin/ifconfig");
            //var_dump($result);exit;
            if (preg_match_all("/inet (\d+\.\d+\.\d+\.\d+)/", $result, $match) !== 0)  // 这里根据你机器的具体情况， 可能要对“inet ”进行调整， 如“addr:”，看如下注释掉的if
            //if (preg_match_all("/addr:(\d+\.\d+\.\d+\.\d+)/", $result, $match) !== 0)
            {
                foreach ($match [0] as $k => $v) {
                    if ($match [1] [$k] != "127.0.0.1") {
                        $the_local_ip = $match [1] [$k];
                        return $match [1] [$k];
                    }
                }
            }
        }
        return '127.0.0.1';
    }
}
