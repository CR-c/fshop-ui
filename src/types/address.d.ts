/** 添加收货地址: 请求参数 */
export type AddressParams = {
    name:'', //收货人
    phone:'', //联系方式
    province:'', //省份信息
    city:'', //城市
    area:'', //县区
    stress:'', //详细地址
    flag:'',//是否为默认地址,默认值0-非默认地址
  }
