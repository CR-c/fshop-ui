import request from '@/utils/request'

//创建订单并获取订单号
const getCreateOrderId = function () {
    return request({
        method: "GET",
        url: '/order/app/getCreateOrderId'
    }).then((response) => {
        console.log("getCreateOrderId-then")
        return response.data.data
    }).catch((e) => {
        console.log("getCreateOrderId失败")
        console.log(e.data)
    })
}
//通过订单号添加商品信息到订单商品表
const addOrderGoods = function (orderId, carts) {
    return request({
        method: "POST",
        url: '/orderGoods/app/addGoods/' + orderId,
        data: carts
    }).then((response) => {
        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}

const getOrderAndAddGoods = function (carts) {
    getCreateOrderId().then((response) => {
        addOrderGoods(response, carts)
    })
}



//通过订单号,查询订单商品信息
const getOrderGoodsInfo = function (orderId) {
    return request({
        method: "GET",
        url: "/orderGoods/app/getGoods/" + orderId
    }).then((response) => {

        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}
//根据用户id查询所有的订单商品信息
const getOrderGoodsPage = function () {
    return request({
        method: "GET",
        url: '/orderGoods/app/getOrderGoodsPage',
    }).then((response) => {
        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}

//删除订单
const deleteOrder = function (orderId) {
    return request({
        method: "DELETE",
        url: '/order/app/delOrder/' + orderId,
    }).then((response) => {
        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}

//查询订单信息
const getOrderInfo = function (orderId, status) {
    return request({
        method: "GET",
        url: '/order/app/getOrder/' + orderId,
        data: {
            status: status
        }
    }).then((response) => {
        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}


//根据状态码分页查询订单
const getOrderPage = function (page, pageSize, status) {
    return request({
        method: "GET",
        url: '/order/getOrderPage/',
        data: {
            page: page,
            pageSize: pageSize,
            status: status
        }
    }).then((response) => {
        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}

//取消订单
const cancelOrder = function (orderId, cancelReason) {


    return request({
        method: "PUT",
        url: '/order/app/cancelOrder/' + orderId,
        data: {
            message: cancelReason
        }

    }).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error.response.data);
    });
}

//支付订单
const payOrder = function (orderId) {
    return request({
        method: "POSt",
        url: '/order/app/payOrder/' + orderId,
    }).then((response) => {
        return response.data.data
    }).catch((e) => {
        console.log(e.data)
    })
}

//提交为完整的订单信息,
const updateOrder = function (orderId, orderTotalPrice, buyerMessage, activeIndex, addressId, address, addressName, addressPhone, status) {
    const data = {
        orderId: orderId,
        orderPrice: orderTotalPrice + 5,
        orderMessage: buyerMessage,
        orderDeliveryId: activeIndex,
        orderGoodsPrice: orderTotalPrice,
        orderFmsPrice: 5,
        orderAddressId: addressId,
        orderAddress: address,
        orderReceiver: addressName,
        orderReceiverPhone: addressPhone,
        orderStatus: status
    }

    const response = request({
        method: "POST",
        url: '/order/app/updateOrder',
        data: data
    })
    return response

}

export default {
    getCreateOrderId,
    addOrderGoods,
    getOrderGoodsInfo,
    getOrderGoodsPage,
    getOrderAndAddGoods,
    updateOrder,
    getOrderInfo,
    getOrderPage,
    deleteOrder,
    cancelOrder,
    payOrder,
}