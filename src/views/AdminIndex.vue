<template>
  <div class="adminIndex">
    <el-container class="container">
       <el-header>
          <HeaderCom/>
       </el-header>
       <el-container>
        <el-aside :width="$store.state.isCollapse ? '65px' : '200px'">
          <MenuCom/>
        </el-aside>
        <el-main>
          <TagMenus/>
          <router-view v-slot="{Component}">
            <keep-alive :max="8">
                <component :is="Component"></component>
            </keep-alive>
          </router-view>
        </el-main>
       </el-container>
    </el-container>
   
  </div>


      <!-- <el-button plain @click="open">退出登录</el-button> -->
</template>
<script setup>
import HeaderCom from '../components/HeaderCom.vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '../router'
import MenuCom from '../components/MenuCom.vue';
import TagMenus from '../components/TagMenus.vue';
import store from '../store';
// const open = () => {
//   ElMessageBox.confirm(
//     '确定要退出登录吗？',
//     '提示',
//     {
//       confirmButtonText: '确定',
//       cancelButtonText: '取消',
//       type: 'warning',
//     }
//   )
//     .then(() => {
//         router.push('/')
//       ElMessage({
//         type: 'success',
  
//       })
//     })
//     .catch(() => {
//       ElMessage({
//         type: 'info',
//         message: '取消退出',
//       })
//     })
// }
</script>
<style scoped>
.adminIndex {
  height: 100%;
  background-color: #f0f2f5;
}

.container {
  height: 100%;
}

.el-header {
  background: linear-gradient(135deg, #1a3a6e 0%, #2b5bb5 50%, #1a73e8 100%);
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 10;
}

.el-aside {
  transition: width 0.3s ease;
  background-color: #ffffff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.el-main {
  background-color: #f0f2f5;
  padding: 0;
  overflow: hidden;
}
</style>