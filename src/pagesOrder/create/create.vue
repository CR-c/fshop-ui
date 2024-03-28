<script setup >
import { computed, ref, onUpdated, onBeforeUpdate, watchEffect } from "vue";
import OrderApi from "@/api/order.js";
import { onLoad, onShow } from "@dcloudio/uni-app";
import AddressApi from "@/api/address";
import AddressStore from "@/stores/address";
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();
// 订单备注
const buyerMessage = ref("");
// 配送时间
const deliveryList = ref([
  { type: 1, text: "时间不限 (周一至周日)" },
  { type: 2, text: "工作日送 (周一至周五)" },
  { type: 3, text: "周末配送 (周六至周日)" },
]);
//订单信息

// 当前配送时间下标
const activeIndex = ref(0);
// 当前配送时间
const activeDelivery = computed(() => deliveryList.value[activeIndex.value]);
// // 修改配送时间
const onChangeDelivery = function (ev) {
  activeIndex.value = ev.detail.value;
};
//订单商品信息
const goodsInfo = ref([]);
//订单id
const orderId = ref(-1);
const getOrderGoodsInfo = async function () {
  goodsInfo.value = await OrderApi.getOrderGoodsInfo(orderId.value);
  console.log(goodsInfo.value);
  addTotalPrice();
};
//选中的地址id
const addressId = ref(-1);
//选中的地址信息
const addressInfo = ref([]);
const getAddress = async function () {
  //从pinao中获取存储的地址id
  addressId.value = AddressStore.orderAddressStore().addressId;
  //通过id进行查找
  if (addressId.value !== -1) {
    addressInfo.value = await AddressApi.getAddressById(addressId.value);
  }
};

//订单总价
const orderTotalPrice = ref(0.0);
//统计订单总价
const addTotalPrice = function () {
  orderTotalPrice.value = 0.0;
  if (goodsInfo.value != null) {
    goodsInfo.value.forEach((item) => {
      orderTotalPrice.value += item.price * item.quantity;
      console.log(orderTotalPrice.value);
    });
  }
};

//提交订单
const subOrder = async function () {
  if (addressId.value === -1) {
    return uni.showToast({
      title: "请选择配送地址",
      icon: "none",
    });
  }
  await OrderApi.updateOrder(
    orderId.value,
    orderTotalPrice.value,
    buyerMessage.value,
    activeIndex.value,
    addressId.value,
    addressInfo.value.address,
    addressInfo.value.name,
    addressInfo.value.phone,
    1 //提交订单 =>待支付
  );
  // uni.navigateBack();
  uni.redirectTo({ url: `/pagesOrder/detail/detail?orderId=` + orderId.value+'&status=1' });
};

onLoad((options) => {
  console.log("create-onLoad");
  orderId.value = options.orderId;
  //获取订单对应的商品信息
  getOrderGoodsInfo();
});

onShow(() => {
  getAddress();
});
//数据更新后刷新
// onUpdated(() => {
//   //计算总价 能用但调用次数很多不知道为什么
//   addTotalPrice();
// });
</script>

<template>
  <scroll-view scroll-y class="viewport">
    <!-- 收货地址 -->
    <navigator
      v-if="addressId !== -1"
      class="shipment"
      hover-class="none"
      url="/pagesMember/address/address?from=order"
    >
      <view class="user"> {{ addressInfo.name }} {{ addressInfo.phone }} </view>
      <view class="address"> {{ addressInfo.address }} </view>
      <text class="icon icon-right"></text>
    </navigator>
    <navigator
      v-else
      class="shipment"
      hover-class="none"
      url="/pagesMember/address/address?from=order"
    >
      <view class="address"> 请选择收货地址 </view>
      <text class="icon icon-right"></text>
    </navigator>

    <!-- 商品信息 -->
    <view class="goods">
      <navigator
        v-for="item in goodsInfo"
        :key="item.orderGoodsId"
        :url="`/pages/goods/goods?id=` + item.clothId"
        class="item"
        hover-class="none"
      >
        <image class="picture" :src="item.img" />
        <view class="meta">
          <view class="name ellipsis">{{ item.clothName }}</view>
          <view class="attrs">{{ item.color }} {{ item.size }}</view>
          <view class="prices">
            <view class="pay-price symbol">{{ item.price }}</view>
            <view class="price symbol">{{ item.price }}</view>
          </view>
          <view class="count">x{{ item.quantity }}</view>
        </view>
      </navigator>
    </view>

    <!-- 配送及支付方式 -->
    <view class="related">
      <view class="item">
        <text class="text">配送时间</text>
        <picker
          :range="deliveryList"
          range-key="text"
          @change="onChangeDelivery"
        >
          <view class="icon-fonts picker">{{ activeDelivery.text }}</view>
        </picker>
      </view>
      <view class="item">
        <text class="text">订单备注</text>
        <input
          class="input"
          :cursor-spacing="30"
          placeholder="选题，建议留言前先与商家沟通确认"
          v-model="buyerMessage"
        />
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="settlement">
      <view class="item">
        <text class="text">商品总价: </text>
        <text class="number symbol">{{ orderTotalPrice }}</text>
      </view>
      <view class="item">
        <text class="text">运费: </text>
        <text class="number symbol">5.00</text>
      </view>
    </view>
  </scroll-view>

  <!-- 吸底工具栏 -->
  <view
    class="toolbar"
    :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
  >
    <view class="total-pay symbol">
      <text class="number">{{ orderTotalPrice }}</text>
    </view>
    <view @tap="subOrder()" class="button" :class="{ disabled: true }">
      提交订单
    </view>
  </view>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.symbol::before {
  content: "¥";
  font-size: 80%;
  margin-right: 5rpx;
}

.shipment {
  margin: 20rpx;
  padding: 30rpx 30rpx 30rpx 84rpx;
  font-size: 26rpx;
  border-radius: 10rpx;
  background: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png)
    20rpx center / 50rpx no-repeat #fff;
  position: relative;

  .icon {
    font-size: 36rpx;
    color: #333;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20rpx;
  }

  .user {
    color: #333;
    margin-bottom: 5rpx;
  }

  .address {
    color: #666;
  }
}

.goods {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    padding: 30rpx 0;
    border-top: 1rpx solid #eee;

    &:first-child {
      border-top: none;
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrs {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 6rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .prices {
      display: flex;
      align-items: baseline;
      margin-top: 6rpx;
      font-size: 28rpx;

      .pay-price {
        margin-right: 10rpx;
        color: #cf4444;
      }

      .price {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
      }
    }

    .count {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 26rpx;
      color: #444;
    }
  }
}

.related {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .input {
    flex: 1;
    text-align: right;
    margin: 20rpx 0;
    padding-right: 20rpx;
    font-size: 26rpx;
    color: #999;
  }

  .item .text {
    width: 125rpx;
  }

  .picker {
    color: #666;
  }

  .picker::after {
    content: "\e6c2";
  }
}

/* 结算清单 */
.settlement {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .danger {
    color: #cf4444;
  }
}

/* 吸底工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .total-pay {
    font-size: 40rpx;
    color: #cf4444;

    .decimal {
      font-size: 75%;
    }
  }

  .button {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
    background-color: #27ba9b;
  }

  .disabled {
    opacity: 0.6;
  }
}
</style>