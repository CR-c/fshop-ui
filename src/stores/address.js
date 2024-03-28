import {defineStore} from "pinia";

import {ref}  from 'vue';

//存储订单地址
const orderAddressStore = defineStore(
    'orderAddress',
    ()=>{
        //orderAddress
        const addressId = ref(-1);

        //定义修改orderAddress的方法

        const setAddressId = (newAddressId)=>{
            addressId.value = newAddressId;
        }

        //删除orderAddress

        const rmAddressId = ()=>{
            addressId.value = '';
        }

        return{
            addressId,setAddressId,rmAddressId
        }
    }
)

export default{
    orderAddressStore,
}