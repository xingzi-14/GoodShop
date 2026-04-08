import { createStore } from "vuex"
import { getUserInfoFn } from "../api/login";
import createPersistedState from 'vuex-persistedstate' 
// import { get } from "@vueuse/core";
const store= createStore({
  state(){
    
    return {
        //定义管理员信息变量
        userInfo :{},
        menus :{},
        isCollapse: false,
        
    }
  },
  //同步函数
  mutations: {
//初始化不该变量的函数，当登录成功，获取管理员信息后将组件的数据赋值给state的变量
//state是当前store的存储数据空间对象 ，data是组件传递过来的数据
//向共享空间存储管理员个人信息
insertUserInfoFn(state,data){
    state.userInfo=data;
},
CLEAR_USER_INFO(state) {
    state.userInfo = {}
    state.token = ''
  },
//向共享空间存储管理员的权限菜单
  insertMenuFn(state,data){
    state.menus=data
  },
  updateIsCollapse(state){
    state.isCollapse=!state.isCollapse
  }
  },
  actions: {
    //获取登录信息
    //context参数：表示当前store实例
    ActionGetUserInfo(context){
        //实例并返回promise对象
        return new Promise((resolve,reject)=>{
       
            //调用获取管理员信息和函数并将其赋值给mutatoins
            getUserInfoFn().then(res =>{
                 let obj={
                    id: res.data.id,
                    username:res.data.username,
                    avatar:res.data.avatar,
                    super:res.data.super,
                    role:res.data.role,
                  }                  
                    context.commit('insertUserInfoFn',obj)
                    context.commit('insertMenuFn',res.data.menus)
                resolve(res);

            }).catch(err=>reject(err))
        })
    }
  },
      plugins : [
      createPersistedState({
        storage :window.sessionStorage,
        paths :['userInfo','menus' ]
      })
    ]
})

export default store;