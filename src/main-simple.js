// 最小化测试版本
import Vue from "vue";

console.log('Vue imported:', Vue);

// 创建一个简单的 Vue 应用
const app = new Vue({
  data: {
    message: 'Hello Vue!'
  },
  mounted() {
    console.log('Simple Vue app mounted!');
    // 将应用实例挂载到 window 对象
    window.vueApp = this;
    console.log('Vue app exposed to window:', window.vueApp);
  }
}).$mount('#app');

console.log('Simple Vue app created:', app);
