import Vue from 'vue'
import App from './App.vue'
import router from "@/router";
import axios from "axios";
import VueRouter from "vue-router";
import ElementUI, {MessageBox} from 'element-ui';
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

service.interceptors.request.use(

    config => {
        t=false
        // console.log("store.state.token")
        // console.log(localStorage.getItem("token"))
        // console.log("store.state.token")
        if (localStorage.getItem("token")) {
            // console.log("config.headers['token']")
            config.headers['token'] = localStorage.getItem("token")
            config.headers['username'] = localStorage.getItem("username")
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

//response响应拦截
let t=false
service.interceptors.response.use(response => {
        let res = response.data;
        console.log(res)
        if (res.code <= 400) {
            return response
        } else {
            if (res.code === 401) {
                if(!t){
                    t=!t
                    MessageBox.confirm(
                        '你已被登出,请重新登录',
                        '确定登出', {
                            confirmButtonText: '确定',
                            type: 'warning'
                        }
                    ).then(() => {
                        localStorage.removeItem("username")
                        localStorage.removeItem("token")

                        router.push("/login");
                    })
                }
            }
            return Promise.reject(response.data.msg)
        }
    },
    error => {
        console.log(error)
        if (error.response.data) {
            error.message = error.response.data.msg
        }
        return Promise.reject(error)
    }
)
new Vue({
  render: h => h(App),
  router: router,

}).$mount('#app')
