<script setup>

import MyIndex from '@/api/index'
import {onMounted,onBeforeMount, ref} from 'vue'

const categoryInfo = ref([])
const categoryUrl = ref([])

const getCategoryPanel= async function(){
    console.log("主分类请求:CategoryPanel")
    categoryInfo.value = await MyIndex.getPanel(0,0)

}

onMounted(()=>{

    getCategoryPanel()
})





</script>

<template>
  <view class="category">
    <navigator
      class="category-item"
      hover-class="none"
      url="/pages/category/"
      v-for="item in categoryInfo"
      :key="item.categoryId"
    >
      <image
        class="icon"
        src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/nav_icon_1.png"
      ></image>
      <text class="text">{{ item.categoryName }}</text>
    </navigator>
  </view>
</template>

<style lang="scss">
/* 前台类目 */
.category {
  margin: 20rpx 0 0;
  padding: 10rpx 0;
  display: flex;
  flex-wrap: wrap;
  min-height: 328rpx;

  .category-item {
    width: 150rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .icon {
      width: 100rpx;
      height: 100rpx;
    }
    .text {
      font-size: 26rpx;
      color: #666;
    }
  }
}
</style>