/**
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 用户激活相关API
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 */
import { send } from '@/socketioApi/common'

/**
 * 激活用户账号
 * @param {Object} data - 激活数据
 * @param {number} data.user_id - 用户ID
 * @returns {Promise} 返回激活结果
 */
export function activateUser(data) {
    let reqData = {
        'c': 'UserActivationService',
        'a': 'activate_user',
        'data': data
    }
    return send('send', reqData, 'api')
}

/**
 * 停用用户账号
 * @param {Object} data - 停用数据
 * @param {number} data.user_id - 用户ID
 * @returns {Promise} 返回停用结果
 */
export function deactivateUser(data) {
    let reqData = {
        'c': 'UserActivationService',
        'a': 'deactivate_user',
        'data': data
    }
    return send('send', reqData, 'api')
}

/**
 * 获取用户激活状态
 * @param {Object} data - 查询数据
 * @param {number} data.user_id - 用户ID
 * @returns {Promise} 返回用户激活状态
 */
export function getUserActivationStatus(data) {
    let reqData = {
        'c': 'UserActivationService',
        'a': 'get_user_activation_status',
        'data': data
    }
    return send('send', reqData, 'api')
}

/**
 * 获取未激活用户列表
 * @param {Object} data - 查询参数
 * @param {number} data.page - 页码，默认1
 * @param {number} data.limit - 每页数量，默认10
 * @returns {Promise} 返回未激活用户列表
 */
export function getInactiveUsers(data) {
    let reqData = {
        'c': 'UserActivationService',
        'a': 'get_inactive_users',
        'data': data
    }
    return send('send', reqData, 'api')
}

/**
 * 批量激活用户
 * @param {Object} data - 批量激活数据
 * @param {Array} data.user_ids - 用户ID数组
 * @returns {Promise} 返回批量激活结果
 */
export function batchActivateUsers(data) {
    let reqData = {
        'c': 'UserActivationService',
        'a': 'batch_activate_users',
        'data': data
    }
    return send('send', reqData, 'api')
}
