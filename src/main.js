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
Vue.config.productionTip = false;
axios.defaults.baseURL = baseURL;
const service = axios.create({
    baseURL: axios.defaults.baseURL, // API base URL
});
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

//NavigationDuplicated not display
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
            throw err;
        }
    });
};


//response响应拦截
let t=false
service.interceptors.response.use(response => {
        let res = response.data;
        console.log(res)
        if(response.data.code >= 400) {
            Vue.prototype.$message.error(response.data.message)
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
        } else if(response.data.code >=300){
            Vue.prototype.$message.warning(response.data.message)
        }
        else{
            console.log(response.data.message)
            if(response.data.message!== null && response.data.message !== ""){
                Vue.prototype.$message.success(response.data.message)
            }

        }
        return response

    },
    error => {
        console.log(error)
        if (error.response.data) {
            error.message = error.response.data.msg
        }
        return Promise.reject(error)
    }

)

router.beforeEach((to, from, next) => {
    next()

})


new Vue({
    render: h => h(App),
    router: router,

}).$mount('#app')
