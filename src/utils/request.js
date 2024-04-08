import axios from "axios";
import stoken from '../stores/token.js'
import { UniAdapter } from "uniapp-axios-adapter";
// const baseURL = "http://localhost:8080"
//创建
// const instance = axios.create({baseURL});
const instance = axios.create({
    // baseURL : 'https://10.225.196.74:8080',
    baseURL : 'http://localhost:5600',
    //阿里云ecs
    // baseURL: 'http://47.115.213.55:9001',
    // timeout: 10000,
    adapter: UniAdapter,
  });

//请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //请求前的回调
        //设置请求头
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        if(stoken.userTokenStore().token){
            config.headers['Authorization'] = 'Bearer ' + stoken.userTokenStore().token
        }
        return config
    },
    (err)=>{
        //请求错误的回调
        console.log(err)
        return Promise.reject(err); 
    }
)
// //添加响应拦截器
// instance.interceptors.response.use(
//     result=>{
//         return result.data;
//     },
//     err=>{
//         // alert("服务异常");
//         return Promise.reject(err);
//     }
// )



export default instance;