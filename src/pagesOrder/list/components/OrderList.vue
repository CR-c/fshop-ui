<script setup>
import OrderApi from "@/api/order";
import { onLoad } from "@dcloudio/uni-app";
import { onMounted, ref } from "vue";
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync();

// 定义 porps
const props = defineProps({
  orderStatus:0,
});

// 请求参数
// const queryParams = {
//   page: 1,
//   pageSize: 5,
//   orderState: props.orderState,
// };

// 获取订单列表
const orderPageInfo = ref([]);
const getOrderPageInfo = async function () {
  orderPageInfo.value = await OrderApi.getOrderPage(1, 5, props.orderStatus);
  console.log("orderPage");
  console.log(orderPageInfo.value);
};
// const orderStatus = ref(0);
// const page = ref(1);
// const pageSize = ref(5);


onMounted(()=>{
  getOrderPageInfo()
})
const tempfunction = function(){
  console.log("OrderList-vue")
  console.log(typeof props.orderStatus)
  console.log(props.orderStatus)

}
</script>

<template>
  <scroll-view scroll-y class="orders">
    <view
      class="card"
      v-for="order in orderPageInfo.records"
      :key="order.orderId"
    >
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">{{ order.createTime }}</text>
        <!-- 订单状态文字 -->
        <text>{{ order.orderId }}</text>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <text
          v-if="order.orderState >= 4 || order.orderState == -2"
          class="icon-delete"
        ></text>
        <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
        <navigator
          v-for="item in order.goodsList"
          :key="item.orderGoodsId"
          class="goods"
          :url="
            `/pagesOrder/detail/detail?orderId=` +
            item.orderId +
            '&status=' +
            order.orderStatus
          "
          hover-class="none"
        >
          <view class="cover">
            <image mode="aspectFit" :src="item.img"></image>
          </view>
          <view class="meta">
            <view class="name ellipsis">{{ item.clothName }}</view>
            <view class="type">{{ item.size }}</view>
          </view>
        </navigator>
        <!-- 支付信息 -->
        <view class="payment">
          <text class="quantity">共88件商品</text>
          <text>实付</text>
          <text class="amount">
            <text class="symbol">¥</text>{{ order.orderPrice }}</text
          >
        </view>
        <!-- 订单操作按钮 -->
        <view class="action">
          <!-- 待付款状态：显示去支付按钮 -->
          <template v-if="order.orderStatus === 1">
            <view class="button primary">去支付</view>
          </template>
          <template v-else>
            <navigator
              class="button secondary"
              :url="`/pagesOrder/create/create?orderId=` + order.orderId"
              hover-class="none"
            >
              再次购买
            </navigator>
            <!-- 待收货状态: 展示确认收货 -->
            <view v-if="order.orderStatus === 3" class="button primary"
              >确认收货</view
            >
          </template>
        </view>
      </view>
      <!-- 底部提示文字 -->
      <view
        class="loading-text"
        :style="{ paddingBottom: safeAreaInsets.bottom + 'px' }"
      >
        {{ true ? "没有更多数据~" : "正在加载..." }}
      </view>
    </view>
  </scroll-view>
</template>