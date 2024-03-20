import request from '@/utils/request'

//获取地址信息
const getAddress = function () {
    return request({
        method: "GET",
        url: '/address/app/addressInfo',
    }).then((response) => {
        console.log("成功获取地址信息")
        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}
//分页获取地址信息
const getAddressPage = function (page, pageSize) {
    return request({
        method: "GET",
        url: '/address/app/addressPage',
        params: {
            page: page,
            pageSize: pageSize
        }
    }).then((response) => {
        console.log("分页查询成功")
        return response.data.data
        // console.log(response.data.data.records)
        // return response.data.data.records
    })
}

//根据地址id获取具体信息
const getAddressById = function (id) {
    return request({
        method: 'GET',
        url: '/address/app/addressInfo/' + id
    }).then((response) => {
        // console.log(response.data.data)
        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}

//新增地址信息
const addAddress = async function (addressInfo) {
    //设置成结构体
    const data = {
        name: addressInfo.name, //收货人
        phone: addressInfo.phone, //联系方式
        province: addressInfo.province, //省份信息
        city: addressInfo.city, //城市
        area: addressInfo.area, //县区
        stress: addressInfo.stress, //详细地址
        address: '默认',
        flag: addressInfo.flag, //默认地址，1为是，0为否
    }

    const response = await request({
        method: "POST",
        url: '/address/web/addAddress',
        // params: {
        //     address: data
        // }
        data: data
    })
    return response
}
//修改地址
const updateAddress = async function (addressInfo) {
    //设置成结构体
    const data = {
        addressId:addressInfo.addressId,//地址id，
        name: addressInfo.name, //收货人
        phone: addressInfo.phone, //联系方式
        province: addressInfo.province, //省份信息
        city: addressInfo.city, //城市
        area: addressInfo.area, //县区
        stress: addressInfo.stress, //详细地址
        address: '默认',
        flag: addressInfo.flag, //默认地址，1为是，0为否
    }
    const response = await request({
        method: "POST",
        url: '/address/web/updateAddress',
        data: data
    })
    return response
}

const deleteAdress = async function(addressId){
    const response = await request({
        method:"DELETE",
        url:'/address/web/deleteAddress/' + addressId,
        // params:{
        //     addressId:addressId
        // }
    })
    return response
}

export default {
    getAddress,
    getAddressPage,
    addAddress,
    getAddressById,
    updateAddress,
    deleteAdress,
}
