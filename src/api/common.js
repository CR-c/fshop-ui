import request from "@/utils/request"



const upload = function(file){
    return request({
        method:"POST",
        url:"/common/upLoad",
        header: {
            'Content-Type': 'multipart/form-data' // 设置请求头，很重要
        },
        data:file
    }).then((response)=>{
        return response.data.code
    }).catch((e)=>{
        console.log(e.data);
    })
}

export default{
    upload
}