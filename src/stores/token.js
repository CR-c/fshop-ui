import {defineStore} from "pinia";

import {ref}  from 'vue';

const userTokenStore = defineStore(
    'token',
    ()=>{
        //定义token
        const token = ref('');

        //定义修改token的方法

        const setToken = (newToken)=>{
            token.value = newToken;
        }

        //删除token

        const rmToken = ()=>{
            token.value = '';
        }

        return{
            token,setToken,rmToken
        }
    }
)

export default{
    userTokenStore,
}