<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import AddressApi from "@/api/address";

const query = defineProps({
  id: Number,
});

// 表单数据
const form = ref({
  receiver: "", // 收货人
  contact: "", // 联系方式
  fullLocation: "", // 省市区(前端展示)
  provinceCode: "", // 省份编码(后端参数)
  cityCode: "", // 城市编码(后端参数)
  countyCode: "", // 区/县编码(后端参数)
  address: "", // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
});
const addressFrom = ref({
  addressId:null,
  name: "", //收货人
  phone: "", //联系方式
  province: "", //省份信息
  city: "", //城市
  area: "", //县区
  stress: "", //详细地址
  address: "默认",
  flag: 0, //默认地址，1为是，0为否
});
// 收集所在地区
const onRegionChange = (ev) => {
  // 省市区(前端展示)
  form.value.fullLocation = ev.detail.value.join(" ");
  //保存到addressFrom
  addressFrom.value.province = ev.detail.value[0];
  addressFrom.value.city = ev.detail.value[1];
  addressFrom.value.area = ev.detail.value[2];

  // 省市区(后端参数)
  // const [provinceCode, cityCode, countyCode] = ev.detail.code!
  const provinceCode = ev.detail.code[0];
  const cityCode = ev.detail.code[1];
  const countyCode = ev.detail.code[2];

  // 合并数据
  Object.assign(form.value, { provinceCode, cityCode, countyCode });
};

const onSubmit = function () {
  //详细地址赋值
  addressFrom.value.name = form.value.receiver;
  addressFrom.value.phone = form.value.contact;
  addressFrom.value.stress = form.value.address;
  addressFrom.value.flag = form.value.isDefault;
  // console.log(addressFrom.value)
  // console.log(addressFrom.value.address)
  //调用进行提交
  if(query.id){
    //存在id进行修改
    addressFrom.value.addressId=query.id
    AddressApi.updateAddress(addressFrom.value)
  }
  else{
    //没有id进行新增
    AddressApi.addAddress(addressFrom.value);
  }

  // 成功提示
  uni.showToast({ icon: "success", title: "添加成功" });
  // 返回上一页
  setTimeout(() => {
    uni.navigateBack();
  }, 400);
};

const getMemberAddressByIdData = async function () {
  if (query.id) {
    addressFrom.value = await AddressApi.getAddressById(query.id);
    //查询到的信息进行回填
    form.value.fullLocation = addressFrom.value.address;
    form.value.receiver = addressFrom.value.name;
    form.value.contact = addressFrom.value.phone;
    form.value.address = addressFrom.value.stress;
    form.value.isDefault = addressFrom.value.flag;

  }
};

onLoad(() => {
  getMemberAddressByIdData();
});

// 收集是否默认收货地址
const onSwitchChange = (ev) => {
  form.value.isDefault = ev.detail.value ? 1 : 0;
};
uni.setNavigationBarTitle({ title: query.id ? "修改地址" : "新建地址" });
</script>

<template>
  <view class="content">
    <form>
      <!-- 表单内容 -->
      <view class="form-item">
        <text class="label">收货人</text>
        <input
          class="input"
          placeholder="请填写收货人姓名"
          v-model="form.receiver"
        />
      </view>
      <view class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          placeholder="请填写收货人手机号码"
          v-model="form.contact"
        />
      </view>
      <view class="form-item">
        <text class="label">所在地区</text>
        <picker
          class="picker"
          mode="region"
          :value="form.fullLocation.split(' ')"
          @change="onRegionChange"
        >
          <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">详细地址</text>
        <input
          class="input"
          placeholder="街道、楼牌号等信息"
          v-model="form.address"
        />
      </view>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          class="switch"
          color="#27ba9b"
          :checked="form.isDefault === 1"
          @change="onSwitchChange"
        />
      </view>
    </form>
  </view>
  <!-- 提交按钮 -->
  <button @tap="onSubmit" class="button">保存并使用</button>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx 40rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>