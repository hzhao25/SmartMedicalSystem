import Vue from 'vue'
//找不到路由添加
import router from './router/index.js';
import App from './App.vue'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//找不到路由添加
import VueRouter from 'vue-router';

Vue.use(axios)
Vue.use(ElementUI);
//找不到路由添加
Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  //找不到路由添加
  router
}).$mount('#app')
