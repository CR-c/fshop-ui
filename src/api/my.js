import request from '../utils/request'




function getUserInfo(){
    return request({
        method:"GET",
        url:'/user/app/userInfo'
    }).then((response)=>{
        return response.data.data
    })
}

function updateUserInfo(userInfo){
    return request({
        method:"POST",
        url:'/user/app/updateUserInfo',
        // params:userInfo
        data:userInfo
    }).then((response)=>{
        console.log(userInfo)
        return response.data.data
    })
}



export default{
    getUserInfo,
    updateUserInfo
}
