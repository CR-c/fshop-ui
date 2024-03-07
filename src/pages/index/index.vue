<template>

<customerNavBar></customerNavBar>
<XtxSwiper/>
<CategoryPanel/>
<HotPanel/>
</template>

<script setup>
import customerNavBar from '../index/comp/customerNavBar.vue';
import CategoryPanel from '../index/comp/CategoryPanel.vue';
import HotPanel from '../index/comp/HotPanel.vue'
import my from '../../api/my.js'
import stoken from '../../stores/token'
const btext = async function(){
	// console.log(stoken.userTokenStore().token)
	let temp = await my.getUserInfo()
	console.log(temp.data.data.age)
}

</script>

<style>

</style>
