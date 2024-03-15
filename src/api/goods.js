import request from '@/utils/request'
import stoken from '../stores/token.js'
import {toRaw} from 'vue'
// import JSONBig from 'json-bigint'

const getClothInfo = function(id){
    return request({
        method:"GET",
        url:'/cloth/app/getClothInfo',
        params:{
            sId:id
        }
    }).then((response)=>{
        return response.data.data
    })
}

const getClothSwiper = function(id){
    return request({
        method:"GET",
        url:'/picture/app/getClothSwiper',
        params:{
            clothId:id
        }
    }).then((response)=>{
        return response.data.data
    })
}

//获取地址信息
const getAddress = function(){
    return request({
        method:"GET",
        url:'/address/app/addressInfo',
    }).then((response)=>{
        console.log("成功获取地址信息")
        return response.data.data
    }).catch((e)=>{
        console.log(e.data)
    })
}

const getAddressPage = function(page,pageSize){
    return request({
        method:"GET",
        url:'/address/app/addressPage',
        params:{
            page:page,
            pageSize:pageSize
        }
    }).then((response)=>{
        console.log("分页查询成功")
        return response.data.data
        // console.log(response.data.data.records)
        // return response.data.data.records
    })
}



//查询尺寸信息
const getSpecs = function(id){
    return request({
        method:"GET",
        url:'/specs/app/specsById',
        params:{
            id:id
        }
    }).then((response)=>{
        // return response.data.data
        let specsInfo = response.data.data
        let colorList = [];
        let sizeList = [];
        for(let item of specsInfo){
            if(colorList.indexOf(item.color)===-1){
              colorList.unshift(item.color);
            }
            if(sizeList.indexOf(item.size)===-1){
                sizeList.unshift(item.size);
            }
        }
        return [colorList,sizeList,specsInfo]
        // colorListR.value = colorList
        // console.log(colorListR.value)
    })
}

//根据尺寸和颜色查询仓库数量
const getNums = function(id,size,color){
    if(size===null){
        size=''
    }
    if(color===null){
        color=''
    }
    return request({
        method:"GET",
        url:'/specs/app/specsNumBySC',
        params:{
            id:id,
            size:size,
            color:color
        }
    }).then((response)=>{
        // console.log(response.data)
        // console.log(response.data.data)
        return response.data.data
    })
}

export default{
    getClothInfo,
    getClothSwiper,
    getAddress,
    getAddressPage,
    getSpecs,
    getNums,
    
}