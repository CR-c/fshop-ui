<script setup>
import { onMounted, ref ,watch,computed} from "vue";
import Goods from "@/api/goods.js"

// import { watch } from "fs";
const query = defineProps({
  clothId:String,
  specsScInfo:{
    size:String,
    color:String
  }
})
// const props = defineProps({
//     clothId,
// })
const emit = defineEmits(['close','setSpecsScInfo'])
const emitF = function(){
  emit('close');
  emit('setSpecsScInfo',chose.value)
}


const specsInfo = ref([])
const getSpecsInfo = async function(){
  let colorTemp = [];
  let sizeTemp = [];
  // specsInfo.value = await Goods.getSpecs(query.clothId)
  [colorTemp,sizeTemp,specsInfo.value] = await Goods.getSpecs(query.clothId)
  // console.log("----------------------------")
  // console.log(colorTemp)
  // console.log("----------------------------")
  // console.log(sizeTemp)
  // console.log("----------------------------")
  // console.log(specsInfo.value)
  colorList.value = colorTemp;
  sizeList.value = sizeTemp;
}

onMounted(()=>{
  getSpecsInfo();
  // chose.value = query.specsScInfo
  if(query.specsScInfo.size!=='undefine'){
    chose.value.size = query.specsScInfo.size
  }
  if(query.specsScInfo.color!=='undefine'){
    chose.value.color = query.specsScInfo.color
  }
})

const chose = ref({
    size:'',
    color:'',
    num:0
})
const specsNums = ref(0)

const setChoseColor = async function(name){
  // console.log(name)
  chose.value.color = name;
  specsNums.value = await Goods.getNums(query.clothId,chose.value.size,chose.value.color);
  // console.log(specsNums.value)
}

const setChoseSize = async function(name){
  chose.value.size = name;
  specsNums.value = await Goods.getNums(query.clothId,chose.value.size,chose.value.color);
    // console.log(specsNums.value)
}

const updateChoseNum = function(flag){
  if(flag===1){
    //增加
    if(chose.value.num+1<=specsNums.value){
      chose.value.num+=1
    }
  }
  if(flag===-1){
    //减少
    if(chose.value.num-1>=0){
      chose.value.num-=1
    }
  }
}



// const colorList = []
const colorList = ref([])
// const sizeList = []
const sizeList = ref([])
// const temp = ref('黑色')




</script>

<template>
  <view class="specs_panel">
    <uni-icons class="uni-icon" type="closeempty" color="" size="24" @click="emitF()"/>
    <view class="title">这个是商品规格页面</view>
    <view class="content">
        <view class="btsize" v-for="(item,index) in sizeList" :key="index">
          <button @click="setChoseSize(item)" :class="{chose:chose.size===item}">尺寸:{{ item }}</button>
        </view>
        <view class="btcolor" v-for="(item,index) in colorList" :key="index">
            <button @click="setChoseColor(item)" :class="{chose:chose.color===item}">{{ item }}</button>
        </view>
        <view>
            <text class="lastNum">剩余数量:{{specsNums}}</text>
        </view>
        <view>
          <uni-icons
            type="back"
            color=""
            size="15"
            @click="updateChoseNum(-1)"
          />
          <text class="choseNum">数量:{{ chose.num }}</text>
          <uni-icons
            type="forward"
            color=""
            size="15"
            @click="updateChoseNum(1)"
          />
        </view>
        
    </view>
    <button @tap="emitF()">确定</button>
  </view>
</template>


<style lang="scss">

.specs_panel {
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
.uni-icon{
    position: absolute;
    right: 0;
}

.chose {
    background-color:#e9ccd3;
}
.content {
  min-height: 300rpx;
  max-height: 540rpx;
  overflow: auto;
  padding: 20rpx;

  .btsize {
    display: inline-block;
    margin-left: 5%;
    background-color: #444;
    // -webkit-tap-highlight-color: transparent;
  }
  .btcolor {
    display: inline-block;
    margin-left: 5%;
    // -webkit-tap-highlight-color: transparent;
  }
  .lastNum {
    position: absolute;
    right: 5%;
  }
  .choseNum {
    size: 50px;
  }
}
</style>