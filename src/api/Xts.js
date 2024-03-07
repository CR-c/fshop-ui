import request from '../utils/request'

function getSwiperInfo(){
    return request.get("/picture/getSwiper")
}

export default{
    getSwiperInfo,
}