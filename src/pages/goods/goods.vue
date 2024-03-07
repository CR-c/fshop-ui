// src/pages/goods/goods.vue
<script setup>
import { ref } from "vue"
import { onLoad } from "@dcloudio/uni-app"
import Goods from "@/api/goods.js"
import stoken from '@/stores/token.js'
//自定组件
import addressPanel from "@/pages/goods/comps/addressPanel.vue"
import servicePanel from "@/pages/goods/comps/servicePanel.vue"
import loginPanel from "@/pages/login/login.vue"
import specsPanel from "@/pages/goods/comps/specsPanel.vue"
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const clothId = ref(0)
const clothSId = ref("")
const clothInfo = ref([])
const clothSwiper =ref([])
const activeIndex = ref(0)
const addressList = ref([])
//设置寄件地址信息
const addressInfo = ref([])
//设置尺寸信息
const specsScInfo = ref({
  size:'',
  color:'',
  num:0
})
// 接收页面参数
onLoad((options)=>{
  // console.log(options)
  clothSId.value = options.id
  console.log(options.id)
  getClothInfo();
  getClothSwiper();

  // getAddressList();
})
//获取地址信息
const getAddressList = async function(){
    addressList.value = await Goods.getAddress()
    console.log(addressList.value)
}

//获取衣服信息
const getClothInfo = async function(){
  // let bId = BigInt();
  clothInfo.value = await Goods.getClothInfo(clothSId.value)
  console.log(clothInfo.value)
}
//获取衣服轮播图
const getClothSwiper = async function(){
  clothSwiper.value = await Goods.getClothSwiper(clothSId.value)
  console.log(clothSwiper.value)
}
//修改轮播图下标
const onchange = function(e){
  console.log(e)
  activeIndex.value = e.detail.current;
}
//轮播图放大
const onTapImg = function(index){
  uni.previewImage({
    current:index,
    urls: [clothSwiper.value[index].imgUrl],
    success: function() {
					console.log('选中了第' + (index + 1) + '个按钮,第' + (index + 1) + '张图片');
    },
    fail: function(err) {
      console.log(clothSwiper.value[index].imgUrl)
      console.log(err.errMsg);
    }
  })
}
//设置配送信息
const setAddressInfo = function(item){
  addressInfo.value = item
  popup.value.close()
  console.log(addressInfo.value)
}
//设置选中的尺寸信息
const setSpecsScInfo = function(chose){
  specsScInfo.value.size=chose.size
  specsScInfo.value.color=chose.color
  specsScInfo.value.num=chose.num
}

//uni弹出框
const popup = ref()
const popupName = ref("")

const popupNew = function(name){
  popupName.value = name;
  if(name === "address"){
    let head = stoken.userTokenStore().token
    if(head===""){
      console.log("head == null")
      popupName.value="login"
    }
  }
  popup.value.open()
}



</script>

<template>
  <scroll-view scroll-y="true" class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper circular @change="onchange($event)">
          <swiper-item v-for="(item,index) in clothSwiper" :key="item.id">
            <image
              @tap="onTapImg(index)"
              mode="widthFix"
              :src="item.imgUrl"
            />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ activeIndex+1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ clothSwiper.length }}</text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{clothInfo.price}}</text>
        </view>
        <view class="name ellipsis">{{clothInfo.name}} </view>
        <view class="desc"> {{clothInfo.description}} </view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <view @tap="popupNew('specs')" class="item arrow">
          <text class="label">选择</text>
          <text class="text ellipsis" v-if="specsScInfo.size.length===0 && specsScInfo.color.length===0"> 请选择商品规格 </text>
          <text class="text ellipsis" v-if="specsScInfo.length!==0 || specsScInfo.color.length!==0"> {{ specsScInfo.size+' '+specsScInfo.color }} </text>
        </view>
        <view @tap="popupNew('address')" class="item arrow">
          <text class="label">送至</text>
          <text class="text ellipsis" v-if="addressInfo.length===0"> 请选择收获地址 </text>
          <text class="text ellipsis" v-if="addressInfo.length!==0"> {{addressInfo.address}} </text>
        </view>
        <view @tap="popupNew('service')" class="item arrow">
          <text class="label">服务</text>
          <text class="text ellipsis"> 无忧退 快速退款 免费包邮 </text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 属性详情 -->
          <view class="item">
            <text class="label">属性名</text>
            <text class="value">属性值</text>
          </view>
          <view class="item">
            <text class="label">属性名</text>
            <text class="value">属性值</text>
          </view>
        </view>
        <!-- 图片详情 -->
        <image
          mode="widthFix"
          src="https://yanxuan-item.nosdn.127.net/a8d266886d31f6eb0d7333c815769305.jpg"
        ></image>
        <image
          mode="widthFix"
          src="https://yanxuan-item.nosdn.127.net/a9bee1cb53d72e6cdcda210071cbd46a.jpg"
        ></image>
      </view>
    </view>


  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button"><text class="icon-heart"></text>收藏</button>
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>客服
      </button>
      <navigator class="icons-button" url="/pages/cart/cart" open-type="switchTab">
        <text class="icon-cart"></text>购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart"> 加入购物车 </view>
      <view class="buynow"> 立即购买 </view>
    </view>
  </view>

  <uni-popup ref="popup" type="bottom">
    <addressPanel v-if="popupName==='address'"    @close="popup.close()"  @setAddressInfo="setAddressInfo"  />
    <servicePanel v-if="popupName==='service'"   @close="popup.close()"     />
    <loginPanel v-if="popupName==='login'" @close="popup.close()" />
    <specsPanel v-if="popupName==='specs'" :clothId="clothInfo.id" @close="popup.close()" @setSpecsScInfo="setSpecsScInfo" :specsScInfo="specsScInfo"/>
  </uni-popup>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  background-color: #f4f4f4;
  height: 100%;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;
    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #27ba9b;
    }
    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #fff;
  .preview {
    height: 550rpx;
    position: relative;
    .image {
      width: 550rpx;
      height: 550rpx;

    }
    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;
      .current {
        font-size: 26rpx;
      }
      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }
      .total {
        font-size: 24rpx;
      }
    }
  }
  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;
    .price {
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      color: #fff;
      font-size: 34rpx;
      box-sizing: border-box;
      background-color: #35c8a9;
    }
    .number {
      font-size: 56rpx;
    }
    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }
    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
    }
    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #cf4444;
    }
  }
  .action {
    padding-left: 20rpx;
    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;
      &:last-child {
        border-bottom: 0 none;
      }
    }
    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }
    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;
  .content {
    margin-left: -20rpx;
    .image {
      width: 100%;
    }
  }
  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;
    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }
    .label {
      width: 200rpx;
    }
    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    padding: 0 20rpx 200rpx;
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    width: 49%;
    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      border-radius: 10rpx;
      background-color: #fff;
    }
    .image {
      width: 300rpx;
      height: 260rpx;
    }
    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }
    .price {
      line-height: 1;
      font-size: 20rpx;
      color: #cf4444;
    }
    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }
  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx var(--window-bottom);
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;
  .buttons {
    display: flex;
    & > view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }
    .addcart {
      background-color: #ffa868;
    }
    .buynow,
    .payment {
      background-color: #27ba9b;
      margin-left: 20rpx;
    }
  }
  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    flex: 1;
    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;
      &::after {
        border: none;
      }
    }
    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>