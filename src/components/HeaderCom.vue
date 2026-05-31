<script setup>
import { Fold,Refresh,FullScreen,CaretBottom } from '@element-plus/icons-vue';

import { ElMessage,ElMessageBox  } from 'element-plus'

import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useEditPassword } from '../utils/UseEditPassword';
const {
    dialogEditPwd,
    editPwdForm,
    ruleFormDom,
    rulesForm,
    Cancel,
    goUpPwd,
}=useEditPassword();
const router =useRouter();
let store = useStore();
//刷新页面
 const RefreshHandle=()=>{
    location.reload();

 }
 import { useFullscreen } from '@vueuse/core';
 const {toggle} =useFullscreen();
 /**下拉菜单内容 */
 const commandHandle =(res)=>{
    if(res=='editPwd'){
        dialogEditPwd.value=true;
    }
    if(res=='logout'){
        handleLogout()
    }
    
 }



//退出登录
const handleLogout = async () => {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 1. 清空用户信息（Pinia / Vuex）
    store.commit('CLEAR_USER_INFO')
    
    // 2. 清除本地存储的 token
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')

    // 3. 跳转到登录页
    router.push('/login')

    // 4. 提示成功
    ElMessage.success('退出登录成功')
    
  } catch (error) {
    // 取消退出
    ElMessage.info('已取消退出')
  }
}
//折叠
const setMenus=()=>{
    store.commit('updateIsCollapse')
}
</script>
<template>
 <div class="headercom">
    <span class="logo">商城后台管理系统</span>
    <el-icon class="foldicon" @click="setMenus"><Fold /></el-icon>
    <article class="article">
        <!--刷新-->
        <el-tooltip  effect="dark" content="刷新" :enterable="false">
                <el-icon class="iconrigth"><Refresh @click="RefreshHandle"/>
                    
                </el-icon>
        </el-tooltip>
    
        <!--全屏-->
        <el-tooltip effect="dark" content="全屏" :enterable="false">
            <el-icon class="iconrigth"><FullScreen  @click="toggle"/></el-icon>
        </el-tooltip>
        
        <!--登陆者信息加下拉菜单-->
       <el-dropdown @command="commandHandle">
           <span>
        <!--头像-->
                <el-avatar :size="30" :src="$store.state.userInfo.avatar"></el-avatar>
                <span>{{$store.state.userInfo.username }}</span>
                
        <!--箭头-->
                <el-icon><CaretBottom /></el-icon>
           </span> 
           <template #dropdown>
                <el-dropdown-menu>
                    <!-- 菜单项 -->
                    <el-dropdown-item command="editPwd">修改密码</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </article>
 </div>
 <!--修改密码对话框-->
 <el-dialog v-model="dialogEditPwd" title="修改密码" width="400">
    <el-form ref="ruleFormDom" :model="editPwdForm" :rules="rulesForm" label-width="80px">
        <el-form-item label="旧密码" prop="oldpassword">
            <el-input show-password placeholder="请输入原来的密码" v-model="editPwdForm.oldpassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
            <el-input show-password placeholder="请输入新密码" v-model="editPwdForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
            <el-input show-password placeholder="请输入确认新密码" v-model="editPwdForm.repassword"></el-input>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialogfooter">
            <el-button type="info" @click="Cancel">取消</el-button>
            <el-button type="success" @click="goUpPwd">确认修改</el-button>
        </span>
    </template>
 </el-dialog>
</template>
<style scoped lang="less">
.headercom {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  color: #fff;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.foldicon {
  margin-left: 20px;
  cursor: pointer;
  font-size: 20px;
  transition: all 0.3s ease;
  padding: 4px;
  border-radius: 4px;
}

.foldicon:hover {
  background: rgba(255, 255, 255, 0.15);
}

.article {
  margin-left: auto;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 6px;

  .iconrigth {
    cursor: pointer;
    font-size: 18px;
    padding: 6px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .iconrigth:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .el-dropdown {
    color: #fff;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    span {
      display: flex;
      align-items: center;
      gap: 6px;

      .el-avatar {
        margin-right: 4px;
      }
    }
  }
}
</style>
