import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import axios from "axios";
import VueRouter from "vue-router";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/global.css'
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(ElementUI);

let baseURL = '/api';
if (process.env.NODE_ENV === 'production') {

  baseURL =  'http://10.1.16.112:8080';

}
// let baseURL =  'http://10.2.37.60:8080';
Vue.config.productionTip = false
axios.defaults.baseURL = baseURL
const service = axios.create({
  baseURL: axios.defaults.baseURL, // api的base_url
})
export default service

new Vue({
  render: h => h(App),
  router: router,

}).$mount('#app')
