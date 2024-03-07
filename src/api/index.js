
import request from '../utils/request'

//获取分类
function getPanel(status,fId){
    return request({
        method: 'GET',
        url:"/category/app/getPanel",
        params:{
            status:status,
            fId:fId
        }
    }).then(response=>{
        console.log(response.data.data)
        return response.data.data
    })
}

//获取热门属性
function getHotPanel(){
    return request({
        method: 'GET',
        url:"/hot/app/getHotPanel",
        params:{
        }
    }).then(response=>{
        console.log(response.data)
        return response.data.data
    })
}

//获取衣服属性
function getCloth(categoryId){
    return request({
        method: 'GET',
        url: "/cloth/app/faList",
        params: {
            categoryFather: categoryId
        }
    }).then(response=>{
        console.log(response.data.data)
        return response.data.data
    })
    // const response = await request({
    //     method: 'GET',
    //     url: "/cloth/app/faList",
    //     params: {
    //         categoryFather: categoryId
    //     }
    // })
    // console.log(response.data.data)
    // return response.data.data
}


export default{
    getPanel,
    getHotPanel,
    getCloth,
}