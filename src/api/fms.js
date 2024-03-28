import request from "@/utils/request"

//发货
const beginDelive = function(orderId){

    const data ={
        fmsDetails:"",
        orderId:orderId
    }
    return request({
        method:"POST",
        url:"/orderFms/app/deliver",
        data:data
    }).then((response)=>{
        return response.data.data
    }).catch((e)=>{
        console.log(e.data)
    })
}

//查询物流信息
const getOrderFms = function(orderId){
    return request({
        method:"GET",
        url:"/orderFms/app/getOrderFms/"+orderId
    }).then((response)=>{
        return response.data.data
    }).catch((e)=>{
        console.log(e.data)
    })
}

export default{
    beginDelive,
    getOrderFms,
}