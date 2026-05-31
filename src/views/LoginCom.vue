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
  position: relative;
  overflow: hidden;
}

.All::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -30%;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.08), rgba(103, 194, 58, 0.05));
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

.All::after {
  content: '';
  position: absolute;
  bottom: -40%;
  right: -20%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.06), rgba(64, 158, 255, 0.06));
  animation: float 6s ease-in-out infinite reverse;
  pointer-events: none;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -20px) scale(1.05); }
}

.row {
  height: 100%;
  position: relative;
  z-index: 1;
}

.leftAll {
  width: 60%;
  height: 100vh;
  background: linear-gradient(135deg, #1a73e8 0%, #4a90d9 25%, #2b5bb5 50%, #1a3a6e 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.leftAll::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  pointer-events: none;
}

.leftAll::after {
  content: '';
  position: absolute;
  bottom: -50px;
  left: -50px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  pointer-events: none;
}

.leftAll h1 {
  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}

.leftAll p {
  color: rgba(255, 255, 255, 0.75);
  font-size: 15px;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
}

.rightAll {
  width: 40%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
  position: relative;
}

.p {
  margin-bottom: 24px;
  font-size: 26px;
  font-weight: 600;
  color: #303133;
  letter-spacing: 1px;
}

.login-box {
  text-align: center;
  padding: 48px 40px;
  border-radius: 12px;
  background: #fff;
}

.login-box :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e4e7ed inset;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-box :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.login-box :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff inset, 0 0 0 3px rgba(64, 158, 255, 0.15);
}

.login-box :deep(.el-button--primary) {
  border-radius: 8px;
  font-size: 16px;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #409eff, #337ecc);
  transition: all 0.3s ease;
}

.login-box :deep(.el-button--primary:hover) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.35);
}
</style>