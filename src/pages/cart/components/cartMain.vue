<script setup>
import { onLoad } from "@dcloudio/uni-app";
import stoken from "@/stores/token.js";
import { ref, onMounted, onUpdated, onBeforeMount } from "vue";
import { onShow } from "@dcloudio/uni-app";
import CartsApi from "@/api/cart.js";
import GoodsApi from "@/api/goods.js";
import OrderApi from "@/api/order.js";

//登录请求头
const head = ref("");
//总价
const totalPrice = ref(0);
//选中的个数
const totalGoods = ref(0);
//获取购物车信息
const cartsInfo = ref([]);
//全选/取消全选
const checkStaus = ref("");
//空订单号
const orderId = ref(-1);
const cartsLength = ref(0);
//获取购物车的信息
const getCartsInfo = async function () {
  cartsInfo.value = await CartsApi.getCartsInfo();
  console.log(cartsInfo.value);
  if (cartsInfo.value !== null) {
    cartsLength.value = cartsInfo.value.length;
  }
  judge_checkALl();
};
//判断是否全部选中了
const judge_checkALl = function () {
  if (cartsInfo.value !== null) {
    let count = 0;
    let num = 0;
    cartsInfo.value.forEach((item) => {
      num += 1;
      if (item.checkFlag === true) {
        count += 1;
      }
    });
    if (count === num) {
      checkStaus.value = "取消全选";
    } else {
      checkStaus.value = "全选";
    }
  }
};
//删除商品
const delCarts = async function (clothId, item) {
  await CartsApi.deleteCartsInfo(clothId, item);
  updateTotalPrice();
  getCartsInfo();
};

onBeforeMount(() => {
  //获取一个空订单id
  // getOrderId();
});
onLoad(() => {
  //获取请求头判断是否登录
  head.value = stoken.userTokenStore().token;
  if (head.value !== "") {
    getCartsInfo();
  }
  //更新购物车价格
  updateTotalPrice();
});

onShow(() => {
  //获取请求头判断是否登录
  head.value = stoken.userTokenStore().token;
  if (head.value !== "") {
    getCartsInfo();
  }
  console.log("cart.vue-onshow");
  updateTotalPrice();
});
//数据更新后刷新
onUpdated(() => {
  updateTotalPrice();
  judge_checkALl();
  // getOrderId();
});

//更新购物车总价
const updateTotalPrice = function () {
  let sum = 0;
  let count = 0;
  if (cartsInfo.value !== null) {
    cartsInfo.value.forEach((item) => {
      if (item.checkFlag === true) {
        sum += item.price * item.quantity;
        count += 1;
        console.log(sum);
      }
    });
    totalPrice.value = sum;
    totalGoods.value = count;
  }
};

//更新购物车选中商品的数量
const updateQuantity = async function (flag, item) {
  //查询对应的货品最大数量
  let max = await GoodsApi.getNums(item.clothId, item.size, item.color);
  // console.log(temp.value)
  // console.log(item)
  if (flag === "+" && item.quantity < max) {
    item.quantity += 1;
    await CartsApi.updateCartsInfo(item);
  } else if (flag === "-" && item.quantity > 0) {
    item.quantity -= 1;
    await CartsApi.updateCartsInfo(item);
  } else {
    uni.showToast({ icon: "success", title: "超出数量限制" });
  }
  updateTotalPrice();
};

//更新选中状态
const updCheck = async function (item, flag) {
  if (item === null && flag == 1) {
    cartsInfo.value.forEach((item) => {
      if (checkStaus.value === "全选") {
        item.checkFlag = true;
        checkStaus.value === "取消全选";
      } else {
        item.checkFlag = false;
        checkStaus.value === "全选";
      }
      cartsInfo.value.forEach((itemA) => {
        CartsApi.updateCartsInfo(itemA);
      });
    });
  } else if (item.checkFlag === false) {
    item.checkFlag = true;
  } else {
    item.checkFlag = false;
  }
  if (item !== null) {
    await CartsApi.updateCartsInfo(item);
  }
};

//获取订单号
const getOrderId = async function () {
  console.log(orderId.value);
  if (head.value !== "") {
    orderId.value = await OrderApi.getCreateOrderId();
  }
  console.log(orderId.value);
};
//将商品添加到订单中
const addOrderGoods = async function () {
  await OrderApi.addOrderGoods(orderId.value, cartsInfo);
};

const gotoPayment = async function () {
  if (totalGoods.value === 0) {
    return uni.showToast({
      title: "请选择商品",
      icon: "none",
    });
  }
  //获取一个空订单id
  await getOrderId();
  //添加商品到订单中
  OrderApi.addOrderGoods(orderId.value, cartsInfo.value);
  //跳转到结算页面
  uni.navigateTo({ url: "/pagesOrder/create/create?orderId=" + orderId.value });
};
</script>

<template>
  <scroll-view scroll-y class="scroll-view">
    <!-- 已登录: 显示购物车 -->
    <template v-if="head !== ''">
      <!-- 购物车列表 -->
      <view class="cart-list" v-if="cartsInfo.length > 0">
        <!-- 优惠提示 -->
        <view class="tips">
          <text class="label">满减</text>
          <text class="desc">满1件, 即可享受9折优惠</text>
        </view>
        <!-- 滑动操作分区 -->
        <uni-swipe-action>
          <!-- 滑动操作项 -->
          <uni-swipe-action-item
            v-for="item in cartsInfo"
            :key="item.cartsId"
            class="cart-swipe"
          >
            <!-- 商品信息 -->
            <view class="goods">
              <!-- 选中状态 -->
              <text
                @tap="updCheck(item, 0)"
                class="checkbox"
                :class="{ checked: item.checkFlag }"
              ></text>
              <navigator
                :url="`/pages/goods/goods?id=` + item.clothId"
                hover-class="none"
                class="navigator"
              >
                <image
                  mode="aspectFill"
                  class="picture"
                  :src="item.img"
                ></image>
                <view class="meta">
                  <view class="name ellipsis">{{ item.clothName }}</view>
                  <view class="attrsText ellipsis"
                    >{{ item.size }} {{ item.color }}</view
                  >
                  <view class="price">{{ item.price }}</view>
                </view>
              </navigator>
              <!-- 商品数量 -->
              <view class="count">
                <text @tap="updateQuantity('-', item)" class="text">-</text>
                <input class="input" type="number" :value="item.quantity" />
                <text @tap="updateQuantity('+', item)" class="text">+</text>
              </view>
            </view>
            <!-- 右侧删除按钮 -->
            <template #right>
              <view class="cart-swipe-right">
                <button
                  @tap="delCarts(item.clothId, item)"
                  class="button delete-button"
                >
                  删除
                </button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <!-- 购物车空状态 -->
      <view class="cart-blank" v-else>
        <!-- <image src="/static/images/blank_cart.png" class="image" /> -->
        <text class="text">购物车还是空的，快来挑选好货吧</text>
        <navigator
          open-type="switchTab"
          url="/pages/index/index"
          hover-class="none"
        >
          <button class="button">去首页看看</button>
        </navigator>
      </view>
      <!-- 吸底工具栏 -->
      <view class="toolbar">
        <text @tap="updCheck(null, 1)" class="all" :class="{ checked: true }">{{
          checkStaus
        }}</text>
        <text class="text">合计:</text>
        <text class="amount">{{ totalPrice }}</text>
        <view class="button-grounp">
          <view
            @tap="gotoPayment()"
            class="button payment-button"
            :class="{ disabled: true }"
          >
            去结算({{ totalGoods }})
          </view>
        </view>
      </view>
    </template>
    <!-- 未登录: 提示登录 -->
    <view class="login-blank" v-else>
      <text class="text">登录后可查看购物车中的商品</text>
      <navigator url="/pages/login/login" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>
    <!-- 猜你喜欢 -->
    <!-- <XtxGuess ref="guessRef"></XtxGuess> -->
    <!-- 底部占位空盒子 -->
    <view class="toolbar-height"></view>
  </scroll-view>
</template>

<style lang="scss">
:host {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f7f7f8;
}

// 滚动容器
.scroll-view {
  flex: 1;
}

// 购物车列表
.cart-list {
  padding: 0 20rpx;

  // 优惠提示
  .tips {
    display: flex;
    align-items: center;
    line-height: 1;
    margin: 30rpx 10rpx;
    font-size: 26rpx;
    color: #666;

    .label {
      color: #fff;
      padding: 7rpx 15rpx 5rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      background-color: #27ba9b;
      margin-right: 10rpx;
    }
  }

  // 购物车商品
  .goods {
    display: flex;
    padding: 20rpx 20rpx 20rpx 80rpx;
    border-radius: 10rpx;
    background-color: #fff;
    position: relative;

    .navigator {
      display: flex;
    }

    .checkbox {
      position: absolute;
      top: 0;
      left: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 100%;

      &::before {
        content: "\e6cd";
        font-family: "erabbit" !important;
        font-size: 40rpx;
        color: #444;
      }

      &.checked::before {
        content: "\e6cc";
        color: #27ba9b;
      }
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
    }

    .name {
      height: 72rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrsText {
      line-height: 1.8;
      padding: 0 15rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .price {
      line-height: 1;
      font-size: 26rpx;
      color: #444;
      margin-bottom: 2rpx;
      color: #cf4444;

      &::before {
        content: "￥";
        font-size: 80%;
      }
    }

    // 商品数量
    .count {
      position: absolute;
      bottom: 20rpx;
      right: 5rpx;

      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 220rpx;
      height: 48rpx;

      .text {
        height: 100%;
        padding: 0 20rpx;
        font-size: 32rpx;
        color: #444;
      }

      .input {
        height: 100%;
        text-align: center;
        border-radius: 4rpx;
        font-size: 24rpx;
        color: #444;
        background-color: #f6f6f6;
      }
    }
  }

  .cart-swipe {
    display: block;
    margin: 20rpx 0;
  }

  .cart-swipe-right {
    display: flex;
    height: 100%;

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      padding: 6px;
      line-height: 1.5;
      color: #fff;
      font-size: 26rpx;
      border-radius: 0;
    }

    .delete-button {
      background-color: #cf4444;
    }
  }
}

// 空状态
.cart-blank,
.login-blank {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;
  .image {
    width: 400rpx;
    height: 281rpx;
  }
  .text {
    color: #444;
    font-size: 26rpx;
    margin: 20rpx 0;
  }
  .button {
    width: 240rpx !important;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    border-radius: 60rpx;
    color: #fff;
    background-color: #27ba9b;
  }
}

// 吸底工具栏
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;

  .all {
    margin-left: 25rpx;
    font-size: 14px;
    color: #444;
    display: flex;
    align-items: center;
  }

  .all::before {
    font-family: "erabbit" !important;
    content: "\e6cd";
    font-size: 40rpx;
    margin-right: 8rpx;
  }

  .checked::before {
    content: "\e6cc";
    color: #27ba9b;
  }

  .text {
    margin-right: 8rpx;
    margin-left: 32rpx;
    color: #444;
    font-size: 14px;
  }

  .amount {
    font-size: 20px;
    color: #cf4444;

    .decimal {
      font-size: 12px;
    }

    &::before {
      content: "￥";
      font-size: 12px;
    }
  }

  .button-grounp {
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    text-align: center;
    line-height: 72rpx;
    font-size: 13px;
    color: #fff;

    .button {
      width: 240rpx;
      margin: 0 10rpx;
      border-radius: 72rpx;
    }

    .payment-button {
      background-color: #27ba9b;

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}
// 底部占位空盒子
.toolbar-height {
  height: 100rpx;
}
</style>