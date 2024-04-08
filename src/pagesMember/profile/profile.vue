<script setup>
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
import my from "@/api/my";
import { computed, onMounted, ref } from "vue";
import {onShow,onLoad} from "@dcloudio/uni-app";
import {userInfoStore} from "@/stores/userInfo"
import stoken from '@/stores/token.js'
// import { get } from "http";
// import My from "../../api/my.js"
const userInfo = ref({
  openId:"",  
  nickname:"",
  age:"",
  sex:"",
  phone:"",
  status:"",
  pic:"",
  loginStatus:"false"
})
const store_userInfo = userInfoStore();

const getUser = function(){
    //从缓存中获取数据
  userInfo.value.openId=store_userInfo.openId;
  userInfo.value.nickname=store_userInfo.nickname;
  userInfo.value.age=store_userInfo.age;
  userInfo.value.sex=store_userInfo.sex;
  userInfo.value.phone=store_userInfo.phone;
  userInfo.value.status=store_userInfo.status;
  userInfo.value.pic=store_userInfo.pic;
  userInfo.value.loginStatus=store_userInfo.loginStatus;

}

onLoad(()=>{
  getUser()
})

const updateUser = function(){
  // store_userInfo.saveAll(userInfo.value.age)
  console.log("个人休息修改:begin")
  console.log(userInfo.value.nickname)
  store_userInfo.saveProfile(userInfo.value.phone,userInfo.value.nickname,userInfo.value.sex)
  
  // My.updateUserInfo(userInfo.value)
  my.updateUserInfo(userInfo.value)
  uni.navigateBack(
    {
      success:()=>{
        var page = getCurrentPages().pop();
        // if(page == undefined || page==null) return;
        // console.log("page.onLoad-begin")
        page.onLoad();
      }
    }
  )
}

const updateUserImage = function(){
  uni.chooseMedia({
    // 文件个数
    count: 1,
    // 文件类型
    mediaType: ['image'],
    success: (res) => {
      // 本地路径
      const { tempFilePath } = res.tempFiles[0]
      console.log(res.tempFiles);
      // 文件上传
      uni.uploadFile({
        url: 'http://localhost:5600/user/app/updUser_pic', // [!code ++]
        name: 'file', // 后端数据字段名  // [!code ++]
        filePath: tempFilePath, // 新头像  // [!code ++]
        header:{
          'Authorization':'Bearer ' + stoken.userTokenStore().token
        },
        success: (res) => {
          console.log(res)
          // 判断状态码是否上传成功
          if (res.statusCode === 200) {
            // 提取头像
            const { avatar } = JSON.parse(res.data).result 
            // 当前页面更新头像
            userInfo.value.pic = avatar;
            // profile.value.avatar = avatar // [!code ++]
            // 更新 Store 头像
            store_userInfo.pic = avatar;
            // memberStore.profile.avatar = avatar // [!code ++]
            uni.showToast({ icon: 'success', title: '更新成功' })
          } else {
            uni.showToast({ icon: 'error', title: '出现错误' })
          }
        }
      })
    },
  })
}

</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar">
      <view class="avatar-content">
        <image class="image" :src="userInfo.pic" mode="aspectFill"  />
        <text @tap="updateUserImage()" class="text">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">手机号</text>
          <!-- <text class="account">{{ userInfo.phone }}</text> -->
          <input class="input" type="text" placeholder="输入手机号" v-model=userInfo.phone />
          
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input class="input" type="text" placeholder="请填写昵称" v-model=userInfo.nickname />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group>
            <label class="radio">
              <radio value="男" color="#27ba9b" :checked="true"  />
              男
            </label>
            <label class="radio">
              <radio value="女" color="#27ba9b" :checked="false" />
              女
            </label>
          </radio-group>
        </view>
        <!-- <view class="form-item">
          <text class="label">生日</text>
          <picker
            class="picker"
            mode="date"
            start="1900-01-01"
            :end="new Date()"
            value="2000-01-01"
          >
            <view v-if="false">2000-01-01</view>
            <view class="placeholder" v-else>请选择日期</view>
          </picker>
        </view> -->
        <!-- <view class="form-item">
          <text class="label">城市</text>
          <picker class="picker" mode="region" :value="['广东省', '广州市', '天河区']">
            <view v-if="false">广东省广州市天河区</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view> -->
        <!-- <view class="form-item">
          <text class="label">职业</text>
          <input class="input" type="text" placeholder="请填写职业" value="" />
        </view> -->
      </view>
      <!-- 提交按钮 -->
      <button class="form-button" @tap="updateUser()">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: auto 420rpx;
  background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }
    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
}
</style>