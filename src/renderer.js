/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-11-07 15:09:10
 */
/*从babel的官方网站下载babel-polyfill,安装到web应用的头部即可轻松解决问题,并能支持ES6所有的新方法**/
import 'babel-polyfill'
import promise from 'es6-promise'
promise.polyfill()
 
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import { logAdd } from "@/socketioApi/config";
import Vant from 'vant';
import 'vant/lib/index.css';
import 'emoji-mart-vue-fast/css/emoji-mart.css'
Vue.use(Vant);
Vue.config.productionTip = false;
Vue.config.devtools = import.meta.env.MODE !== "production";

//重置css
import "@/assets/scss/reset.scss"
//svg图标
import "@/assets/style.css";
//引入animate.css动画
import animate from "animate.css";
Vue.use(animate);

//图标问题直接修改源码rem.css ttf
import YDUI from "vue-ydui";
Vue.use(YDUI);

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 图片懒加载
import VueLazyload from "vue-lazyload";
// 在 main.js 中已经配置了 VueLazyload
// Vue.use(VueLazyload, {
//   preLoad: 1.3,   //预加载的宽高比
//   loading: require('@/assets/img/image-error.png'),//require("@/assets/loading-bars.svg"),
//   error: require('@/assets/img/image-error.png'),
//   attempt: 0//尝试加载次数
// });

//图片点击全屏
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

let options = {
  fullscreenEl: false,
  closeEl: true,
  shareEl: false,
  downloadEl: false,
  counterEl: true,
  arrowEl: true,
  preloaderEl: true,
  tapToClose: true,
  tapToToggleControls: true,
  clickToCloseNonZoomable: true,
  closeOnVerticalDrag: true,
  verticalDragRange: 0.75,
  pinchToClose: true,
  allowPanToNext: true,
  allowMouseDrag: true,
  allowTouchDrag: true,
  allowKeyboardNavigation: true
};
Vue.use(preview, options)

//系统错误捕获，这里可以提交到后端
const warnHandler = (msg, vm, trace)=>{
  console.error((`[Vue warn]: ${new Date()} ` + msg + trace));
  logAdd({data:JSON.stringify([`[Vue warn]: ${new Date()} ${msg} ${trace} `]), type:1, level:2})

}
Vue.config.warnHandler = warnHandler;
Vue.prototype.$throw = (error)=> warnHandler(error,this);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
