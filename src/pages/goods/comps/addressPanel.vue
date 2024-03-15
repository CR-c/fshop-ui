// AddressPanel.vue
<script setup>
//
import Goods from "@/api/goods.js"
import { onLoad } from "@dcloudio/uni-app"
import stoken from "@/stores/token.js"
import {ref,onMounted,toRaw, computed} from 'vue'
const emit = defineEmits(['close','setAddressInfo'])
const emitF = function(){
  emit('close');
}
const emitA = function(item){
  emit('setAddressInfo',item)
}
//页码
const page = ref(1)
//总页码
const pages = ref(1)
//分页查询的所有信息
const addressPage = ref([])
//分页查询的具体信息
const addressList = ref([])
//进行分页查询
const getAddressList =  async function(page,pageSize){
  addressPage.value = await Goods.getAddressPage(page,pageSize)
  // addressList.value = addressPage.value.records
  // addressList.value = toRaw(addressPage.value.target)
  pages.value = addressPage.value.pages
  // console.log(addressPage.value)
  // console.log(toRaw(addressPage.data.data))
  // console.log(toRaw(addressPage.data.records))
  // console.log(toRaw(addressPage.value.records))
  // console.log(toRaw(addressPage.value.pages))
}

onMounted(()=>{
  console.log("onMounted-begin")
  //默认查询3条每页
  getAddressList(1,3);

})




const cutPage = function(){
  console.log("cutPage-begin")
  console.log(page.value)
  if(page.value!==1){
    page.value = page.value-1;
  }
  console.log("cutPage-end")
  console.log(page.value)
  getAddressList(page.value,3);
}
const addPage = function(){
  console.log("addPage-begin")
  console.log(page.value)
  if(page.value!==pages.value){
    page.value++;
  }
  console.log("addPage-end")
  console.log(page.value)
  getAddressList(page.value,3);
}



</script>

<template>
  <view class="address-panel">
    <!-- 关闭按钮 -->
    <!-- <text  class="close icon-close"></text> -->
    <uni-icons type="closeempty" color="" size="24" @click="emitF()"/>
    <!-- 标题 -->
    <view class="title">配送至</view>
    <!-- 内容 -->
    <!-- <view class="content">
      <view class="item"  v-for="item in addressList" :key="item.addressId" >
        <view class="user">{{ item.name }}</view>
        <view class="address">{{item.address}}</view>
        <uni-icons class="iconsc" type="circle" size="24" @click="emitA(item)"/>  
        <view>{{ item.phone }}</view>
      </view>
    </view> -->
    <!-- 地址懒 -->
    <view class="address">
      <!-- <view class="item" v-for="item in addressList" :key="item.addressId"> -->
      <view class="item" v-for="item in addressPage.records" :key="item.addressId">
        <view class="item-content">
          <view class="user">
            {{ item.name }}
            <text class="contact">{{item.phone}}</text>
            <text v-if="item.flag===0" class="badge">默认 </text>
            <uni-icons class="iconsc" type="circle" size="24" @click="emitA(item)"/>  
          </view>
          <view class="locate">{{ item.province }} {{ item.city }} {{ item.area }} {{ item.stress }}</view>
        </view>
      </view>
    <view>
      <!-- 翻页 -->
    </view>
      <uni-icons type="arrow-left" size="30" @click="cutPage()"></uni-icons>
      <text class="current">{{page}}</text>
      <text class="split">/</text>
      <text class="total">{{ addressPage.pages }}</text>
      <uni-icons type="arrow-right" size="30" @click="addPage()" ></uni-icons>
    </view>
    <!-- 新建地址 -->
    <view class="footer">
      <view class="button primary"> 新建地址 </view>
      <view v-if="false" class="button primary">确定</view>
    </view>
  </view>
</template>

<style lang="scss">
.address-panel {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.title {
  line-height: 1;
  padding: 40rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: normal;
  border-bottom: 1rpx solid #ddd;
  color: #444;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  min-height: 300rpx;
  max-height: 540rpx;
  overflow: auto;
  padding: 20rpx;
  .item {
    padding: 30rpx 50rpx 30rpx 60rpx;
    background-size: 40rpx;
    background-repeat: no-repeat;
    background-position: 0 center;
    background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);
    position: relative;
  }
  .icon {
    color: #999;
    font-size: 40rpx;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 0;
  }
  .icon-checked {
    color: #27ba9b;
  }
  .icon-ring {
    color: #444;
  }
  .user {
    font-size: 28rpx;
    color: #444;
    font-weight: 500;
    display: inline-block;
  }
  .address {
    font-size: 26rpx;
    color: #666;
    display: inline-block;
    position: absolute;
    right: 8%;
  }
  .iconsc{
    position: absolute;
    right: 0;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;

  .button {
    flex: 1;
    height: 72rpx;
    text-align: center;
    line-height: 72rpx;
    margin: 0 20rpx;
    color: #fff;
    border-radius: 72rpx;
  }

  .primary {
    color: #fff;
    background-color: #27ba9b;
  }

  .secondary {
    background-color: #ffa868;
  }
  
}
.address {
  padding: 0 20rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
  .iconsc{
    position: absolute;
    right: 0;
  }
  .item-content {
    line-height: 1;
    padding: 40rpx 10rpx 38rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;

    .edit {
      position: absolute;
      top: 36rpx;
      right: 30rpx;
      padding: 2rpx 0 2rpx 20rpx;
      border-left: 1rpx solid #666;
      font-size: 26rpx;
      color: #666;
      line-height: 1;
    }
  }

  .item:last-child .item-content {
    border: none;
  }

  .user {
    font-size: 28rpx;
    margin-bottom: 20rpx;
    color: #333;

    .contact {
      color: #666;
    }

    .badge {
      display: inline-block;
      padding: 4rpx 10rpx 2rpx 14rpx;
      margin: 2rpx 0 0 10rpx;
      font-size: 26rpx;
      color: #27ba9b;
      border-radius: 6rpx;
      border: 1rpx solid #27ba9b;
    }
  }

  .locate {
    line-height: 1.6;
    font-size: 26rpx;
    color: #333;
  }
}
</style>