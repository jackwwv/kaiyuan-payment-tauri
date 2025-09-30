/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 状态码管理
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:06:22
 */

export default {
  state: {
    CHAT: {
      RECORD: {
        text: "录音",
        value: 0,
      },
      TEXT: {
        text: "文字",
        value: 1,
      },
      IMG: {
        text: "图片",
        value: 2,
      },
      FILE: {
        text: "文件",
        value: 3,
      },
      NOTIFY: {
        text: "通知",
        value: 4,
      },
      VIDEO: {
        text: "视频",
        value: 5,
      },
      RECALL:{
        text:"撤回",
        value:6
      }
    },
    LOG: {
      NORMAL: {
        text: "普通日志",
        value: 0,
      },
      DEBUG: {
        text: "调试日志",
        value: 1,
      },
      WARN: {
        text: "警告日志",
        value: 2,
      },
      ERROR: {
        text: "错误日志",
        value: 3,
      },
    },
    ROOM: {
      ALONE: {
        text: "单聊",
        value: 0,
      },
      GROUP: {
        text: "群聊",
        value: 1,
      },
      NOTIFY: {
        text: "通知",
        value: 2,
      },
      ADMIN: {
        text: "后台",
        value: 3,
      },
    },
    SAVE: {
      LOCAL: {
        text: "本地存储",
        value: 0,
      },
      CLOUD: {
        text: "远端存储",
        value: 1,
      },
    },
    STATUS: {
      LOADING: {
        text: "发送中",
        value: 0,
      },
      SUCCESS: {
        text: "发送成功",
        value: 1,
      },
      FAIL: {
        text: "发送失败",
        value: 2,
      },
      /* RESEND: {
        text: "重新发送",
        value: 3,
      }, */
    },
    ADDFRIEND: {
      APPLY: {
        text: "申请",
        value: 0,
      },
      PASS: {
        text: "通过",
        value: 1,
      },
      REFUSE: {
        text: "拒绝",
        value: 2,
      },
    },
    CODE: {
      SUCCESS: {
        text: "成功",
        value: 200,
      },
      BAD_REQUEST: {
        text: "错误请求(客户端)",
        value: 400,
      },
      NOT_FOUND: {
        text: "未找到路由",
        value: 404,
      },
      ERROR: {
        text: "服务器错误",
        value: 500,
      },
      ERROR_AUTH_CHECK_TOKEN_FAIL: {
        text: "权限验证令牌失败",
        value: 10001,
      },
      ERROR_AUTH_CHECK_TOKEN_TIMEOUT: {
        text: "权限验证令牌超时",
        value: 10002,
      },
      ERROR_AUTH_TOKEN: {
        text: "权限验证令牌错误",
        value: 10003,
      },
      ERROR_AUTH: {
        text: "权限验证错误",
        value: 10004,
      },
      ROOM_NO_EXIST: {
        text: "房间不存在",
        value: 20000,
      },
    },
    TIME: {
      TIME_OUT: {
        text: "超时时间",
        value: 15000,
      },
      TIME_ONLINE_INTERVAL: {
        text: "在线检查间隔",
        value: 5000,
      },
    },
    DEFAULTIMG:'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiM0Qjk1RjYiLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyNCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiA1MkMxNiA0My4xNjM0IDIyLjE2MzQgMzcgMzEgMzdIMzNDNDEuODM2NiAzNyA0OCA0My4xNjM0IDQ4IDUyVjU0SDE2VjUyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==',
    // 角色默认头像配置
    ROLE_AVATARS: {
      USER: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='32' fill='%23F2C94C'/><circle cx='32' cy='26' r='9' fill='%23F4C29A'/><path d='M24 24c2-4 6-6 8-6s6 2 8 6' stroke='%23333' stroke-width='1.5' fill='none'/><path d='M22 52c0-8 28-8 28 0v4H22z' fill='%23333333'/><rect x='27' y='36' width='10' height='6' rx='3' fill='%23fff'/><path d='M24 34c0 3 2 6 8 6s8-3 8-6' stroke='%23333' stroke-width='1.5' fill='none'/></svg>",
      SERVICE: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='%23B8E2FF'/><stop offset='1' stop-color='%2399CEF5'/></linearGradient></defs><circle cx='32' cy='32' r='32' fill='url(%23g)'/><path d='M22 26a10 10 0 0 1 20 0v3H22z' fill='%23313A46'/><circle cx='32' cy='28' r='9' fill='%23F5C89A'/><path d='M23 28c0-5 4-9 9-9s9 4 9 9' stroke='%23313A46' stroke-width='2' fill='none'/><path d='M20 35a4 4 0 0 0 8 0v-2' stroke='%23313A46' stroke-width='2' fill='none'/><path d='M44 35a4 4 0 0 1-8 0v-2' stroke='%23313A46' stroke-width='2' fill='none'/><rect x='41' y='32' width='3' height='7' rx='1.5' fill='%23313A46'/><circle cx='21' cy='33.5' r='3.5' fill='%23313A46'/><path d='M21 33.5h3.5' stroke='%23FFFFFF' stroke-width='1.2'/><path d='M24 50c0-7 16-7 16 0v6H24z' fill='%230B66AF'/><path d='M20 50c2-6 8-9 12-9s10 3 12 9' stroke='%230B66AF' stroke-width='1.5' fill='none'/><path d='M29 30c.8 1.2 2 1.9 3 1.9s2.2-.7 3-1.9' stroke='%23313A46' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>",
      CUSTOMER: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNGRjk2NDciLz4KPGNpcmNsZSBjeD0iMzIiIGN5PSIyNCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiA1MkMxNiA0My4xNjM0IDIyLjE2MzQgMzcgMzEgMzdIMzNDNDEuODM2NiAzNyA0OCA0My4xNjM0IDQ4IDUyVjU0SDE2VjUyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTI0IDI4SDQwVjMwSDI0VjI4WiIgZmlsbD0iI0ZGOTY0NyIvPgo8cGF0aCBkPSJNMjQgMzJIMzZWMzRIMjRWMzJaIiBmaWxsPSIjRkY5NjQ3Ii8+CjxwYXRoIGQ9Ik0yNCAzNkg0MFYzOEgyNFYzNloiIGZpbGw9IiNGRjk2NDciLz4KPC9zdmc+Cg=='
    }
  },
  getters: {
    DEFAULTIMG(state) {
      return state.DEFAULTIMG;
    },
    ROLE_AVATARS(state) {
      return state.ROLE_AVATARS;
    },
    CODE(state) {
      return state.CODE;
    },
    TIME(state) {
      return state.TIME;
    },
    APPLY(state) {
      return state.ADDFRIEND.APPLY.value;
    },
    PASS(state) {
      return state.ADDFRIEND.PASS.value;
    },
    REFUSE(state) {
      return state.ADDFRIEND.REFUSE.value;
    },
    ALONE(state) {
      return state.ROOM.ALONE.value;
    },
    ADMIN(state) {
      return state.ROOM.ADMIN.value;
    },
    GROUP(state) {
      return state.ROOM.GROUP.value;
    },
    NOTIFY(state) {
      return state.ROOM.NOTIFY.value;
    },
    RECORD(state) {
      return state.CHAT.RECORD.value;
    },
    RECALL(state) {
      return state.CHAT.RECALL.value;
    },
    TEXT(state) {
      return state.CHAT.TEXT.value;
    },
    /* RESEND(state) {
      return state.STATUS.RESEND.value;
    }, */
    IMG(state) {
      return state.CHAT.IMG.value;
    },
    FILE(state) {
      return state.CHAT.FILE.value;
    },
    CHAT_NOTIFY(state) {
      return state.CHAT.NOTIFY.value;
    },
    CHAT_VIDEO(state) {
      return state.CHAT.VIDEO.value;
    },
    LOADING(state) {
      return state.STATUS.LOADING.value;
    },
    SUCCESS(state) {
      return state.STATUS.SUCCESS.value;
    },
    FAIL(state) {
      return state.STATUS.FAIL.value;
    },
    LOCAL(state) {
      return state.SAVE.LOCAL.value;
    },
    CLOUD(state) {
      return state.SAVE.CLOUD.value;
    },
  },
  mutations: {
    //修改仓库值
    updateState(state, e) {
      state = e;
    },
  },
};
