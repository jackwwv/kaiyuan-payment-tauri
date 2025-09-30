// 调试版本 - 逐步加载
console.log('Starting main-debug.js');

// 先导入所有模块
console.log('Importing Vue...');
import Vue from "vue";
console.log('Vue imported successfully:', Vue);

console.log('Importing App...');
import App from "./App.vue";
console.log('App imported successfully:', App);

console.log('Importing router...');
import router from "./router/index";
console.log('Router imported successfully:', router);

console.log('Importing store...');
import store from "./store/index";
console.log('Store imported successfully:', store);

console.log('All imports completed');

// 现在尝试创建 Vue 应用
try {
  console.log('Creating Vue app...');
  const app = new Vue({
    router,
    store,
    render: h => h(App),
    mounted() {
      console.log('Vue app mounted!');
      window.vueApp = this;
      console.log('Vue app exposed to window:', window.vueApp);
    }
  }).$mount("#app");
  console.log('Vue app created successfully:', app);
} catch (error) {
  console.error('Error creating Vue app:', error);
}
