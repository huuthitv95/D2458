<?php

namespace app\super\controller;

use think\Controller;
use app\im\model\mongo\Chat;
use app\im\model\mysql\User;
use think\facade\Request;
const PAGE_RECORDS = 15;
class Chatlist extends Controller
{
    public function initialize()
    {
        $super_id = session('super_id');
        if(!$super_id)
        {
            $this->error('请先登录');
        }
    }

    public function index()
    {
        $post_data = Request::post();
        $key = Request::param();
        $where = [];
        $where1 = [];
        if(isset($key['act']) && $key['act'] == 'check')
        {
            if($key['start_time'] && !$key['end_time'])
            {
                $where[] = ['create_time','>=',strtotime($key['start_time'].' 00:00:00')];
            }
            else if(!$key['start_time'] && $key['end_time'])
            {
                $where[] = ['create_time','<=',strtotime($key['end_time'].' 23:59:59')];
            }
            else if($key['start_time'] && $key['end_time'])
            {
                if(strtotime($key['start_time'].' 00:00:00') < strtotime($key['end_time'].' 00:00:00'))
                {
                    $where[] = ['create_time','>=',strtotime($key['start_time'].' 00:00:00')];
                    $where[] = ['create_time','<=',strtotime($key['end_time'].' 23:59:59')];
                }
                else
                {
                    $where[] = ['create_time','>=',strtotime($key['end_time'].' 00:00:00')];
                    $where[] = ['create_time','<=',strtotime($key['start_time'].' 23:59:59')];
                }
            }
            $userids = User::getUserIdByNickname($key['key']);
            if($key['key'])
            {
                $where1[] =  ['u.id','in', $userids];
            }
        }
       
        $chatArr =  Chat::where('user_id','>',0)->order('time', 'desc')->paginate(PAGE_RECORDS);
     

        $list = array();
        foreach($chatArr as $key => $val){
            $user = User::find($val->user_id);
            $val->nickname = isset($user->nickname) ? $user->nickname : '';
            array_push($list,$val);
          
        }
        $this->assign('chatlist',  $chatArr);
        $this->assign('list',  $list);
        $this->assign('key',$key);
        return $this->fetch();
    }

    public function memberChatList()
    {
        $user_id = (int)Request::param('user_id');
        $key = Request::param();
        $where[] =  ['user_id','=',$user_id];
        $chatArr =  Chat::where('user_id','=', $user_id)->order('time', 'desc')->paginate(PAGE_RECORDS);
        $list = array();
        foreach($chatArr as $key => $val){
           // $user = User::getUserByUserId($val->user_id);
           // $val->nickname = $user->nickname ;
            array_push($list,$val);
          
        }
        
        $this->assign('chatlist',  $chatArr);
        $this->assign('list',  $list);
        $this->assign('key',$key);
        return $this->fetch();
     
    }
    public function badwords() {
       $words = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/static/badwords.txt');
       $wordsArr = explode('、',$words);
       $this->assign('badwords',$wordsArr);
       return $this->fetch();
    }
    public function delwords() {
        $del = Request::param('words');
        $words = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/static/badwords.txt');
        $wordsArr = explode('、',$words);
        $key = array_search($del, $wordsArr);
        if ($key !== false){
            array_splice($wordsArr, $key, 1);
        }
        $str = implode('、',$wordsArr);
        $res = file_put_contents($_SERVER['DOCUMENT_ROOT'].'/static/badwords.txt',$str);
        if($res) echo 1;
    }

    public function addwords() {
        $add = Request::param('words');
        $words = file_get_contents($_SERVER['DOCUMENT_ROOT'].'/static/badwords.txt');
        $wordsArr = explode('、',$words);
        $key = array_search($add, $wordsArr);
        if($key !== false){
            echo '敏感词已存在！';exit;
        }

        if ($words) {
            $str = $words.'、'.$add;
        }else {
            $str = $add;
        }
        $res = file_put_contents($_SERVER['DOCUMENT_ROOT'].'/static/badwords.txt',$str);
        if($res) echo 1;
    }
}