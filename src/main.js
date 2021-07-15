import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import QS from 'qs'

//导入字体图标
import './assets/fonts/iconfont.css'
import "./assets/font1/iconfont.css"

//导入全局样式表
import './assets/css/global.css'


import axios from 'axios'
axios.defaults.baseURL = "http://localhost:5500/"
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
});
Vue.prototype.$axios = axios

Vue.use(ElementUI);

Vue.config.productionTip = false




new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
