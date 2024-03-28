import request from '@/utils/request'


const getCartsInfo = function () {
    return request({
        method: "GET",
        url: "/carts/app/findAllByUserId"
    }).then((response) => {
        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}

//修改单个购物车信息
const updateCartsInfo = function (item) {
    return request({
        method: "POST",
        url: "/carts/app/updCart",
        data: item
    }).then((response) => {
        console.log(response);
    }).catch((e) => {
        console.log(e.data)
    })
}
//删除单个购物车信息
const deleteCartsInfo = function (clothId,carts) {
    return request({
        method: "DELETE",
        url: "/carts/app/delCarts/" + clothId,
        data:carts
    }).then((response) => {
        console.log(response)
    }).catch((e) => {
        console.log(e.data)
    })
}

export default {
    getCartsInfo,
    updateCartsInfo,
    deleteCartsInfo,
}