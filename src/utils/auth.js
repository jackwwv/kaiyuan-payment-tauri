/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 权限函数工具库
 * @LastEditors: hua
 * @LastEditTime: 2020-11-22 18:33:01
 */

import store from '../store'
import { addLocalRoomMsg } from "@/utils/indexedDB"

/* 获取token
 * params:tokenName;令牌名
 * return bool or token
 */
export function getToken (tokenName) {
  let data = window.localStorage.getItem(tokenName)
  if (data == null) {
    return false
  }
  let dataObj = JSON.parse(data)
  var dataObjDatatoJson = dataObj.data
  return dataObjDatatoJson
}

/* 设置token
 * params:tokenName;令牌名
 * params:tokenVal;令牌值
 * return bool
 */
export function setToken (tokenName, tokenVal) {
  let curTime = new Date().getTime()
  window.localStorage.setItem(tokenName, JSON.stringify({ data: tokenVal, time: curTime }))
  return true
}

/* 销毁token
 * params:tokenName;令牌名
 * return bool
 */
export function removeToken (tokenName) {
  window.localStorage.removeItem(tokenName)
  return true
}

/**
 * 注销账户时清理数据
 */
export function clearData(){
  //保存收款账号数据
  const collectAccounts = localStorage.getItem('collectAccounts');
  
  //清除localstorage数据
  window.localStorage.clear();
  
  //恢复收款账号数据
  if (collectAccounts) {
    localStorage.setItem('collectAccounts', collectAccounts);
  }
  
  //清除indexdb数据
  window.indexedDB.deleteDatabase('addressBookBeg')
  window.indexedDB.deleteDatabase('msg')
  //失效token
  store.commit('SET_TOKEN', '')
}

/**
 * 更新房间列表时，处理房间信息
 * params roomList
 * return unread_number
 */
export function handleRoomMsg(roomList){
  let unread_number = 0
  roomList.forEach((item)=>{
    if(item.room === null){
        return;
    }
    if(item.room.last_msg !=''){
      let data;
      let isJsonFormat = false;
      
      try {
        data = JSON.parse(item.room.last_msg);
        isJsonFormat = true;
        console.log('last_msg是JSON格式:', data);
      } catch (error) {
        // 如果不是JSON格式，当作纯文本处理
        console.log('last_msg是纯文本格式:', item.room.last_msg);
        data = {
          msg: item.room.last_msg,
          created_at: new Date().getTime(),
          head_img: '',
          name: '系统',
          type: 'TEXT',
          user_id: 0
        };
        isJsonFormat = false;
      }
      

      if(item.is_alert){
        unread_number = unread_number+item.unread_number
      } else {
        unread_number += item.room.unread_number
      }

      if(item.save_action === store.getters.LOCAL && data['type'] !== store.getters.CHAT_VIDEO){
        let msgData = {
            msg:data['msg'],
            created_at:data.created_at,
            head_img:data['head_img'],
            name:data['name'],
            send_status:store.getters.SUCCESS,
            type:data['type'],
            user_id:data['user_id'],
            room_uuid:item.room_uuid
        }
        addLocalRoomMsg(msgData)
      }
      if(item.is_alert){
        unread_number = unread_number+item.unread_number
      }
    }
  })
  return unread_number;
}
