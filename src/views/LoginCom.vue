<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {reactive, ref} from 'vue'
import { LoginFn, getUserInfoFn } from '../api/login'
import { useRouter } from 'vue-router';
//应用vuex的函数
import { useStore } from 'vuex';

let store = useStore();
const loginFormRef = ref(null)
let FormObj=reactive({
  username:'',
  password:''
})
let loading =ref(false)
//校验用户名
const checkUserName=(rule,value,callback)=>{
  if(value==''){
    return callback(new Error('请输入用户名'))
  }
  callback()
}
//校验密码
const checkPwd=(rule,value,callback)=>{
  if(value==''){
    return callback(new Error('请输入密码'))
  }
  callback()
}
//表单规则
const loginRules=reactive({
  username:[{validator: checkUserName,trigger :'blur',required:true}],
  password :[{validator: checkPwd,trigger :'blur' ,required:true}]
})



//跳转


const router =useRouter();

const LoginFon = (el) => {
  
  if (!el) return;

  el.validate(async () => {
   
  try{
        loading.value=true;
     let result = await LoginFn(FormObj);
 
    if (result.errorCode) {
      ElMessage.error(result.msg);
    } else {
      window.sessionStorage.setItem('token' ,result.data.token);
      // let info=await getUserInfoFn()
      // console.log(info);
      //判断数据结果
      // if(!info.data) ElMessage.error('未查到管理员信息，请联系工作人员')
 // 否则将信息存储到vuex.userInfo内
// 在组件中使用store的mutations函数，格式为：store.commit('函数名',传入的数据)
// 在组件中使用store的actions函数，格式为：store.dispatch('函数名',传入的数据)
      // store.commit('insertUserInfoFn',info.data);
      if(result.data.token) await store.dispatch('ActionGetUserInfo')
      router.push('/admin/index')
    }
  }catch(error){
    console.log(error);
  }finally{
    loading.value=false;
  }
  }
);
};
</script>
<template>
    <div class="All">
      <el-row class="row"  type="flex" align="middle" >

            <el-col class="leftAll" :span="14">
                <h1>Vite+Vue3商城管理系统</h1>
                <p>技术支持：apricot</p>
            </el-col>



      
          <el-col class="rightAll" :span="10">
                <div class="login-box">
                <h1 class="p">登录</h1>

                <el-form style="width: 300px;" :model="FormObj" ref="loginFormRef" :rules="loginRules">
                  <el-form-item prop="username">
                    <el-input placeholder="请输入用户名" v-model="FormObj.username">
                      <template #prefix>
                        <el-icon><User /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>

                  <el-form-item prop="password">
                    <el-input show-password placeholder="请输入密码" v-model="FormObj.password">
                      <template #prefix>
                        <el-icon><Lock /></el-icon>
                      </template>
                    </el-input>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" style="width: 300px; height: 50px"  @click="LoginFon(loginFormRef)" :loading="loading">
                      登录
                    </el-button>
                  </el-form-item>
              </el-form>

              </div>
          </el-col>  
      </el-row>   
     </div>
    
</template>
<style scoped>

.All {
  width: 100%;
  height: 100%;

}
.row{
  height: 100%;
}
.leftAll {
  width:60%;
  height: 100vh;
  background-color: #e0f0ff;
 display: flex;
  justify-content: center;
  align-items: center;
 flex-direction: column;
}
.rightAll{
    width:40%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
 flex-direction: column;
  
}
.p{
  margin-bottom: 15px;
}
.login-box {
  text-align: center;
}
</style>