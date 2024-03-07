

import request from "@/utils/request"
import stoken from "@/stores/token"
// import {ref} from "vue"
// import {userInfoStore} from "@/stores/userInfo"
import {userInfoStore} from "@/stores/userInfo"

const store_userInfo = userInfoStore()
const login = function(code){
    return request({
        method:"GET",
        url:'/user/app/login',
        params:{
            code:code
        }
    }).then((response)=>{
        stoken.userTokenStore().setToken(response.data.data)
        console.log("openID:"+response.data.data)
    })
}



function getUserInfo(){
    return request({
        method:"GET",
        url:'/user/app/userInfo'
    }).then((response)=>{
        console.log("getUserInfo-------------")
        // console.log(response.data.data)
        let temp = response.data.data
        console.log(temp)
        console.log("--------------getUserInfo")
        store_userInfo.saveAll(temp.openId,temp.nickname,temp.age,temp.sex,temp.phone,temp.status,temp.pic);
        // store_userInfo.userInfoStore().setUserInfo(response.data.data)
        return response.data.data

    }).catch((err)=>{
        console.log(err)
        console.log(stoken.userTokenStore().token)
    })
}


export default{
    login,
    getUserInfo
}