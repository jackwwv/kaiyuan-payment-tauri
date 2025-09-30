/*
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 
 * @LastEditors: hua
 * @LastEditTime: 2019-11-07 15:09:10
 */
/*从babel的官方网站下载babel-polyfill,安装到web应用的头部即可轻松解决问题,并能支持ES6所有的新方法**/
// 在 Vite 中，polyfill 通过配置自动处理，不需要手动导入

import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
// import { logAdd } from "@/socketioApi/config";
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

// 注释掉 vue-ydui 导入，使用自定义组件替代
// import YDUI from "vue-ydui";
// import 'vue-ydui/dist/ydui.rem.css';
// Vue.use(YDUI);

// 添加基本的 YDUI 样式
const yduiStyles = `
  .yd-navbar {
    display: flex;
    align-items: center;
    height: 44px;
    padding: 0 15px;
    background-color: #FFF;
    border-bottom: 1px solid #e5e5e5;
    position: relative;
  }
  .yd-navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  .yd-navbar-item {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }
  .yd-navbar-center-box {
    flex: 1;
    display: flex;
    justify-content: center;
  }
  .yd-navbar-center {
    display: flex;
    align-items: center;
  }
  .yd-navbar-center-title {
    font-size: 17px;
    font-weight: 500;
    color: #5C5C5C;
  }
  .yd-btn {
    display: inline-block;
    padding: 0 15px;
    height: 36px;
    line-height: 36px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
  }
  .yd-btn-primary {
    background-color: #1AAD19;
    color: #FFF;
  }
  .yd-btn-primary:hover {
    background-color: #179B16;
  }
  .yd-btn-disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .yd-btn-loading {
    display: inline-block;
    margin-right: 5px;
  }
  .yd-btn-rolling {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid #FFF;
    border-top-color: transparent;
    border-radius: 50%;
    animation: yd-btn-rolling 1s linear infinite;
  }
  @keyframes yd-btn-rolling {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .yd-layout {
    display: flex;
    width: 100%;
    height: 100%;
  }
  .yd-layout-vertical {
    flex-direction: column;
  }
  .yd-layout-horizontal {
    flex-direction: row;
  }
  .yd-icon {
    display: inline-block;
    font-style: normal;
    vertical-align: middle;
    text-align: center;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .yd-icon-custom {
    font-family: 'iconfont' !important;
  }
`;

// 动态添加样式
const styleSheet = document.createElement('style');
styleSheet.textContent = yduiStyles;
document.head.appendChild(styleSheet);

// 调试信息
console.log('Using custom YDUI components instead of vue-ydui library');

// 预定义全局 MeScroll 变量，避免 mescroll.min.js 报错
if (typeof window !== 'undefined') {
  window.MeScroll = null;
}

// 添加 YDUI Dialog 功能到 Vue 原型
Vue.prototype.$dialog = {
  toast(options) {
    const { mes, icon = 'success', timeout = 2000 } = options || {};
    
    // 创建 toast 元素
    const toast = document.createElement('div');
    toast.className = 'yd-toast';
    toast.innerHTML = `
      <div class="yd-toast-content">
        <i class="yd-icon yd-icon-${icon}"></i>
        <span>${mes}</span>
      </div>
    `;
    
    // 添加样式
    if (!document.getElementById('yd-toast-styles')) {
      const style = document.createElement('style');
      style.id = 'yd-toast-styles';
      style.textContent = `
        .yd-toast {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 12px 20px;
          border-radius: 6px;
          z-index: 9999;
          font-size: 14px;
          max-width: 80%;
          text-align: center;
        }
        .yd-toast-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .yd-toast .yd-icon {
          font-size: 16px;
        }
        .yd-toast .yd-icon-error {
          color: #ff4757;
        }
        .yd-toast .yd-icon-success {
          color: #2ed573;
        }
        .yd-toast .yd-icon-warning {
          color: #ffa502;
        }
      `;
      document.head.appendChild(style);
    }
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, timeout);
  },
  
  alert(options) {
    const { mes, title = '提示', callback } = options || {};
    alert(`${title}: ${mes}`);
    if (callback) callback();
  },
  
  confirm(options) {
    const { mes, title = '确认', callback } = options || {};
    const result = confirm(`${title}: ${mes}`);
    if (callback) callback(result);
    return result;
  }
};

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

// 图片懒加载
import VueLazyload from "vue-lazyload";
import imageError from '@/assets/img/image-error.png';
Vue.use(VueLazyload, {
  preLoad: 1.3,   //预加载的宽高比
  loading: imageError,
  error: imageError,
  attempt: 0//尝试加载次数
});

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
  // logAdd({data:JSON.stringify([`[Vue warn]: ${new Date()} ${msg} ${trace} `]), type:1, level:2})

}
Vue.config.warnHandler = warnHandler;
Vue.prototype.$throw = (error)=> warnHandler(error,this);

// 引入Tauri API (在浏览器环境中注释掉)
// import { invoke } from '@tauri-apps/api/core'

// 全局混入Tauri功能 (在浏览器环境中注释掉)
// Vue.mixin({
//   methods: {
//     // 调用Tauri后端命令
//     async tauriInvoke(command, args = {}) {
//       try {
//         return await invoke(command, args)
//       } catch (error) {
//         console.error('Tauri invoke error:', error)
//         throw error
//       }
//     }
//   }
// })

// 创建简单的 YDUI 组件替代品
const YdNavbar = {
  name: 'yd-navbar',
  props: {
    title: String,
    fixed: Boolean,
    bgcolor: {
      type: String,
      default: '#FFF'
    },
    color: {
      type: String,
      default: '#5C5C5C'
    }
  },
  render(h) {
    return h('header', {
      class: {
        'yd-navbar': true,
        'yd-navbar-fixed': this.fixed
      },
      style: {
        backgroundColor: this.bgcolor,
        color: this.color
      }
    }, [
      h('div', { class: 'yd-navbar-item' }, this.$slots.left),
      h('div', { class: 'yd-navbar-center-box' }, [
        h('div', { class: 'yd-navbar-center' }, [
          this.$slots.center || h('span', { class: 'yd-navbar-center-title' }, this.title)
        ])
      ]),
      h('div', { class: 'yd-navbar-item' }, this.$slots.right)
    ]);
  }
};

const YdButton = {
  name: 'yd-button',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: String,
    disabled: Boolean,
    loading: Boolean
  },
  render(h) {
    const buttonClass = [
      'yd-btn',
      'yd-btn-' + this.type,
      this.size ? 'yd-btn-' + this.size : '',
      { 'yd-btn-disabled': this.disabled || this.loading }
    ];

    const children = [];
    
    if (this.loading) {
      children.push(
        h('span', { class: 'yd-btn-loading' }, [
          h('span', { class: 'yd-btn-rolling' }, [
            h('i')
          ])
        ])
      );
    }
    
    children.push(
      h('span', {
        style: { visibility: this.loading ? 'hidden' : '' }
      }, this.$slots.default)
    );

    return h('button', {
      class: buttonClass,
      attrs: {
        disabled: this.disabled || this.loading
      },
      on: {
        click: (event) => this.$emit('click', event)
      }
    }, children);
  }
};

const YdLayout = {
  name: 'yd-layout',
  props: {
    type: {
      type: String,
      default: 'vertical' // vertical, horizontal
    }
  },
  render(h) {
    const classes = {
      'yd-layout': true,
      'yd-layout-vertical': this.type === 'vertical',
      'yd-layout-horizontal': this.type === 'horizontal'
    };
    
    return h('div', {
      class: classes
    }, this.$slots.default);
  }
};

const YdIcon = {
  name: 'yd-icon',
  props: {
    name: String,
    custom: Boolean,
    color: String,
    size: [String, Number]
  },
  render(h) {
    const iconClass = [
      'yd-icon',
      this.custom ? 'yd-icon-custom' : '',
      this.name ? `yd-icon-${this.name}` : ''
    ].filter(Boolean);
    
    const style = {};
    if (this.color) style.color = this.color;
    if (this.size) style.fontSize = typeof this.size === 'number' ? `${this.size}px` : this.size;
    
    return h('i', {
      class: iconClass,
      style: style
    }, this.$slots.default);
  }
};

// 立即注册组件
Vue.component('yd-navbar', YdNavbar);
Vue.component('yd-button', YdButton);
Vue.component('yd-layout', YdLayout);
Vue.component('yd-icon', YdIcon);

console.log('YDUI components manually registered');

// 检查组件是否已注册
console.log('yd-navbar registered:', !!Vue.options.components['yd-navbar']);
console.log('yd-button registered:', !!Vue.options.components['yd-button']);
console.log('yd-layout registered:', !!Vue.options.components['yd-layout']);

// 在创建 Vue 应用之前再次确保组件已注册
console.log('Before Vue app creation - checking components:');
console.log('yd-navbar exists:', !!Vue.options.components['yd-navbar']);
console.log('yd-button exists:', !!Vue.options.components['yd-button']);
console.log('yd-layout exists:', !!Vue.options.components['yd-layout']);

// 强制重新注册组件
console.log('Force registering components...');
Vue.component('yd-navbar', YdNavbar);
Vue.component('yd-button', YdButton);
Vue.component('yd-layout', YdLayout);
Vue.component('yd-icon', YdIcon);

// 验证注册结果
console.log('After force registration:');
console.log('yd-navbar registered:', !!Vue.options.components['yd-navbar']);
console.log('yd-button registered:', !!Vue.options.components['yd-button']);
console.log('yd-layout registered:', !!Vue.options.components['yd-layout']);

// 额外的组件注册检查
console.log('All registered components:', Object.keys(Vue.options.components));

// 在创建 Vue 应用之前最后一次确保组件注册
console.log('Final registration attempt...');
Vue.component('yd-navbar', YdNavbar);
Vue.component('yd-button', YdButton);
Vue.component('yd-icon', YdIcon);

// 强制检查组件注册
console.log('=== COMPONENT REGISTRATION DEBUG ===');
console.log('Vue.options.components keys:', Object.keys(Vue.options.components));
console.log('yd-navbar in components:', 'yd-navbar' in Vue.options.components);
console.log('yd-button in components:', 'yd-button' in Vue.options.components);
console.log('yd-navbar component:', Vue.options.components['yd-navbar']);
console.log('yd-button component:', Vue.options.components['yd-button']);
console.log('=== END DEBUG ===');

const app = new Vue({
  router,
  store,
  render: h => h(App),
  mounted() {
    console.log('开元支付应用已启动')
    // 将应用实例挂载到 window 对象，方便调试
    window.vueApp = this
    
    // 再次检查组件注册状态
    console.log('Final check - yd-navbar registered:', !!Vue.options.components['yd-navbar']);
    console.log('Final check - yd-button registered:', !!Vue.options.components['yd-button']);
    
    // 可以在这里调用Tauri API
    this.$nextTick(() => {
      // 应用初始化完成
      console.log('Vue 应用初始化完成')
    })
  }
}).$mount("#app");