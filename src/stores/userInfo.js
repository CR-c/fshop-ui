import { defineStore } from "pinia";

import { ref } from 'vue';


export const userInfoStore = defineStore(
    'userInfo',
    {
        state:()=>{
            return {
                openId: "begin",
                nickname: "",
                age: "",
                sex: "",
                phone: "",
                status: -1,
                pic: "",
                loginStatus: "false"
            };
        },
        getters:{
        },
        actions:{
            saveAll(openId,nickname,age,sex,phone,status,pic){
                this.openId = openId;
                this.nickname=nickname;
                this.age=age;
                this.sex=sex;
                this.phone=phone;
                this.status=status;
                this.pic=pic;
                this.loginStatus="true";
            },
            delAll(){
                this.openId = "del";
                this.nickname="";
                this.age="";
                this.sex="";
                this.phone="";
                this.status=-1;
                this.pic="";
                this.loginStatus="false";
            },
            saveProfile(phone,nickname,sex){
                this.phone=phone
                this.nickname=nickname
                this.sex=sex
            }
        }
    }
)

// const userInfoStore = defineStore(
//     'userInfo',
//     () => {
//         //定义
//         const userInfo = ref({
//             openId: '',
//             nickname: '',
//             age: '',
//             sex: '',
//             phone: '',
//             status: 0,
//             pic: '',

//             loginStatus: 'false'
//         })

//         //设置
//         const setUserInfo = (newUserInfo) => {
//             console.log("userInfoJs----------1")
//             console.log(newUserInfo)
//             console.log("userInfoJs----------2")

//             // console.log("newUserInfo_openId:"+newUserInfo.openId)
//             // userInfo.value.openId = newUserInfo.openId
//             // userInfo.value.nickname = newUserInfo.nickname
//             // userInfo.value.age = newUserInfo.age
//             // userInfo.value.pic = newUserInfo.pic
//             // userInfo.value.sex = newUserInfo.sex
//             // userInfo.value.phone = newUserInfo.phone
//             // userInfo.value.status = newUserInfo.status
//             // userInfo.value = newUserInfo
//             userInfo.value.loginStatus = 'true'


//         }
//         //删除信息
//         const rmUserInfo = () => {
//             console.log("删除stores")
//             userInfo.value.openId = ''
//             userInfo.value.nickname = ''
//             userInfo.value.age = ''
//             userInfo.value.pic = ''
//             userInfo.value.sex = ''
//             userInfo.value.phone = ''
//             userInfo.value.status = 0

//             // userInfo.value.city=''
//             userInfo.value.loginStatus = 'false'
//             console.log(userInfo.value)
//         }
//         return {
//             userInfo, setUserInfo, rmUserInfo
//         }
//     }
// )

// export default {
//     userInfoStore
// }