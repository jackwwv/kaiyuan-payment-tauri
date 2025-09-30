/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 路由模块
 * @LastEditors: hua
 * @LastEditTime: 2020-11-22 18:45:40
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import authRouter from './modules/auth'
import myRouter from './modules/my'
import roomRouter from './modules/room'
import groupRoomRouter from './modules/groupRoom'
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
// 在 Vite 中直接使用动态导入
const _import = (file) => () => import('../views/' + file + '.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    ...authRouter,
    ...myRouter,
    ...roomRouter,
    ...groupRoomRouter,
    {
      path: '/personInfo',
      name: 'personInfo',
      component: _import('groupRoom/personInfo'),
      meta: { title: '', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'groupRoomDetails'}
    },
    // 首页
    {
      path: '/home', // 路径
      name: 'home', // 给他个名字，后期路由传参用
      component: _import('home/home'), // 载入组件
      meta: { title: '消息', isShowHead: false, isShowFoot: true, isShowBack: false, isShowDef:true, backPath:'home', defTextName:'搜索', defPath:'search'} // 定义一些公共状态，你喜欢就好
    },
    // 代付仪表板
    {
      path: '/dashboard', // 路径
      name: 'dashboard', // 给他个名字，后期路由传参用
      component: _import('dashboard/dashboard'), // 载入组件
      meta: { title: '代付仪表板', isShowHead: false, isShowFoot: true, isShowBack: false, isShowDef:false} // 定义一些公共状态，你喜欢就好
    },
    // 订单页面
    {
      path: '/order', // 路径
      name: 'order', // 给他个名字，后期路由传参用
      component: _import('order/order'), // 载入组件
      meta: { title: '订单管理', isShowHead: false, isShowFoot: true, isShowBack: false, isShowDef:false} // 定义一些公共状态，你喜欢就好
    },
    // 代收页面
    {
      path: '/collect', // 路径
      name: 'collect', // 给他个名字，后期路由传参用
      component: _import('collect/collect'), // 载入组件
      meta: { title: '代收管理', isShowHead: false, isShowFoot: true, isShowBack: false, isShowDef:false} // 定义一些公共状态，你喜欢就好
    },
    // 客服页面
    {
      path: '/service', // 路径
      name: 'service', // 给他个名字，后期路由传参用
      component: _import('service/service'), // 载入组件
      meta: { title: '客服中心', isShowHead: false, isShowFoot: true, isShowBack: false, isShowDef:false} // 定义一些公共状态，你喜欢就好
    },
    // 修改登录密码
    {
      path: '/passwordChange',
      name: 'passwordChange',
      component: _import('my/set/passwordChange'),
      meta: { title: '修改登录密码', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 修改二级密码
    {
      path: '/secondaryPassword',
      name: 'secondaryPassword',
      component: _import('my/set/secondaryPassword'),
      meta: { title: '修改二级密码', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 谷歌验证
    {
      path: '/googleAuth',
      name: 'googleAuth',
      component: _import('my/set/googleAuth'),
      meta: { title: '谷歌验证', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 绑定银行卡
    {
      path: '/bindCard',
      name: 'bindCard',
      component: _import('my/set/bindCard'),
      meta: { title: '绑定银行卡', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 提现
    {
      path: '/withdraw',
      name: 'withdraw',
      component: _import('my/set/withdraw'),
      meta: { title: '提现', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 我的团队
    {
      path: '/myTeam',
      name: 'myTeam',
      component: _import('my/set/myTeam'),
      meta: { title: '我的团队', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 分成记录
    {
      path: '/commissionRecord',
      name: 'commissionRecord',
      component: _import('my/set/commissionRecord'),
      meta: { title: '分成记录', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 资金明细
    {
      path: '/fundDetails',
      name: 'fundDetails',
      component: _import('my/set/fundDetails'),
      meta: { title: '资金变动明细', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 回调助手
    {
      path: '/callbackAssistant',
      name: 'callbackAssistant',
      component: _import('my/set/callbackAssistant'),
      meta: { title: '回调助手', isShowHead: false, isShowFoot: false, isShowBack: false}
    },
    // 通讯录
    {
      path: '/addressBook', // 路径
      name: 'addressBook', // 给他个名字，后期路由传参用
      component: _import('addressBook/addressBook'), // 载入组件
      meta: { title: '通讯录', isShowHead: false, isShowFoot: true, isShowBack: false, isShowDef:true, backPath:'home', defTextName:'搜索', defPath:'search'} // 定义一些公共状态，你喜欢就好
    },
    // 群聊
    {
      path: '/groupChat', // 路径
      name: 'groupChat', // 给他个名字，后期路由传参用
      component: _import('groupChat/groupChat'), // 载入组件
      meta: { title: '发起群聊', isShowHead: false, isShowFoot: true, isShowBack: false, backPath: -1} // 定义一些公共状态，你喜欢就好
    },
    // 搜索
    {
      path: '/search', // 路径
      name: 'search', // 给他个名字，后期路由传参用
      component: _import('search/search'), // 载入组件
      meta: { title: '添加好友', isShowHead: true, isShowFoot: false, isShowBack: true, backPath:'home'} // 定义一些公共状态，你喜欢就好
    },
    //错误页面
    {
      path: '/connectLose',
      name: 'connectLose',
      component: _import('error/connectLose'),
      meta: { title: '链接丢失', isShowHead: false, isShowFoot: false, isShowBack: false, backPath:'home'}
    }
  ]
})

// 在每个路由前执行一些东西
router.beforeEach((to, from, next) => {
  // 获取token
  const token = store.getters.token
  
  // 不需要认证的页面（公开页面）
  const publicPages = ['authLogin', 'authRegister']
  
  // 检查是否需要认证
  if (!publicPages.includes(to.name) && !token) {
    console.log('🔒 未登录，跳转到登录页面')
    next({ name: 'authLogin' })
  } else {
    console.log('✅ 认证通过，允许访问:', to.name)
    next()
  }
})

router.afterEach(function(to,from){
  //物理键绑定返回上一页
  window.physicsBackRouter = 'last'
  var toL = to.path.split('/').length;
  var fromL = from.path.split('/').length;
  var trans;
  if (toL == fromL) {
    trans = 'fade'
  } else {
    trans = toL > fromL ? 'next' : 'prev'
  }
  if (to.meta.title) {
    console.log("to.query.name",to.meta.title)

    store.dispatch("updateNavbarTitle", to.meta.title);
  }
  //过渡效果
  store.dispatch('updateTransition', trans)
})
export default router
