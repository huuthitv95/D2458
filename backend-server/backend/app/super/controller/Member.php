<?php

namespace app\super\controller;

use think\Controller;
use app\im\model\mysql\User;
use app\super\model\BsysConfig;
use think\facade\Request;

const PAGE_RECORDS = 15;

class Member extends Controller
{
    public function initialize()
    {
        $super_id = session('super_id');
        if(!$super_id)
        {
            $this->error('请先登录');
        }
    }

    public function memberList()
    {
        $key = Request::param();
        $where = [];
        $where1 = [];
        if(isset($key['act']) && $key['act'] == 'check')
        {
            /*
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
            }*/
            if($key['key'])
            {
                $val = (String) $key['key'];

              //  $where[] = ['username','=', $val];
              //  $where1[] = ['nickname','=',$val];
                $where[] = ['username','like','%'.$val.'%'];
                $where1[] = ['nickname','like','%'.$val.'%'];
            }
        }
        //获取注册会员
        $list = User::where(function ($q)use($where){
                    $q->where($where);
                })->where(function ($q1)use($where1){
                    $q1->whereOr($where1);
                })
            ->field('*,username as yuan_name')->order('id', 'desc')
            ->paginate(PAGE_RECORDS,false,[
                    'query'=>Request::param()
                ])->each(function ($v)use($key){
                    if(isset($key['key']) && $key['key'])
                    {
                        if(preg_match('/'.$key['key'].'/',$v['username']))
                        {
                            $v['username'] = preg_replace('/'.$key['key'].'/','<span style="color: red">'.$key['key'].'</span>',$v['username']);
                        }
                        if(preg_match('/'.$key['key'].'/',$v['nickname']))
                        {
                            $v['nickname'] = preg_replace('/'.$key['key'].'/','<span style="color: red">'.$key['key'].'</span>',$v['nickname']);
                        }
                    }
                    return $v;
                });

       
       // $user_conf_status = BsysConfig::where('table_name','user')->where('field_key','status')->find();
                                  
        //var_dump($user_conf_status);exit;
      //  $user_conf_servives = BsysConfig::where('table_name','user')->where('field_key','is_servives')->find();
        //dump($list);
        $this->assign('list',$list);
        $this->assign('key',$key);
        //$this->assign('user_status', explode(",", $user_conf_status->field_val) );
       // $this->assign('user_servives',  explode(",", $user_conf_servives->field_val));
        return $this->fetch();
    }

    public function memberShow()
    {
        $user_id = Request::param('user_id');
        $user = User::where('id',$user_id)->find();
        $this->assign('user',$user);
        return view();
    }

    public function editMember() {
        $user_id = Request::param('user_id');
        $user = User::where('id',$user_id)->find();
        $this->assign('user',$user);
        return view();
    }

    public function changeUserStatus()
    {
        $post = Request::param();
        $change =  User::where(['id'=>$post['id']])->update(['status'=>$post['act']]);
        if($change){
            return ['status'=>true,'msg'=>'成功'];
        } else{
            return ['status'=>false,'msg'=>'系统繁忙，请稍后重试'];
        }
       //$change = User::changeStatus($post['id'],$post['act']);
        //$change = BsysConfig::changeUserStatus($post['id'],$post['act']);
    }

    public function changeUserService()
    {
       $post = Request::post();
       $return_data = [
        'err' => 1,
        'msg' => 'fail',
       ];
       $where =  ['id' => $post['id'] ];
       $User_obj = User::where($where)->find();
      
       $is_customer_service = 0;
       if($post['act']){
          $is_customer_service = 1;
       }


       $update = [];
      if( $User_obj){
         //
          $update['is_customer_service'] =$is_customer_service;
          if (isset($post['custom_message'])) {
              $update['custom_message'] =$post['custom_message'];
          }

          if( User::where($where)->update( $update )){
             $return_data['err'] = 0;
             $return_data['msg'] = '数据修改成功！';
          }
         
      }
      
      //  $change = User::changeUserService($post['id'],$post['act']);
       //$service = new StdClass();
      // $service->agent_id = $post['agent_id'];
      // $service->user_id  = $post['id'];
      // $change = BsysConfig::changeUserService($post);
       
     //   return $change;
       return $return_data;
    }

    public function memberByagent(){
        $post = Request::param(); 
        $return_data = [
            'err' => 1,
            'msg' => 'error',
          ];
        $agent_id=$post['agent_id'];
        $where[] = ['agent_id','=',$agent_id];
        $user = User::where($where)->where('is_customer_service',1)->select();
        if($user)
        {
            $return_data['err'] = 0;
            $return_data['msg'] = '数据修改成功！';
            $return_data['data'] = $user;
        }
        return $return_data;
    }
}