/*
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 邀请码接口
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 */

import {send} from '@/utils/socketio'

// 验证邀请码接口
export function validateInviteCode(data) {
    let reqData = {
        'c':'InviteCodeService',
        'a':'validate_invite_code',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 使用邀请码接口
export function useInviteCode(data){
    let reqData = {
        'c':'InviteCodeService',
        'a':'use_invite_code',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 创建邀请码接口
export function createInviteCode(data){
    let reqData = {
        'c':'InviteCodeService',
        'a':'create_invite_code',
        'data':data
    }
    return send('send', reqData, 'api')
}

// 获取邀请码列表接口
export function getInviteCodeList(data){
    let reqData = {
        'c':'InviteCodeService',
        'a':'get_invite_codes',
        'data':data
    }
    return send('send', reqData, 'api')
}
