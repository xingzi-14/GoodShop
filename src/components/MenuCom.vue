<script setup>
import {useStore} from "vuex"
import { computed,ref } from "vue";
import { useRouter,useRoute } from "vue-router";
const store=useStore();
const router=useRouter();
const route=useRoute();


let menuDataCom=computed(()=>{
    return store.state.menus
})

let defaultActive=ref (route.path)
</script>
<template>
    <div class="menuCom">
        <el-menu 
            :router="true" 
            :default-active="defaultActive" 
            :unique-opened="true" 
            :collapse="$store.state.isCollapse"
        >
        <el-menu-item index="/admin/index"> 
            <el-icon><House /></el-icon>
            <span>后台首页</span>
        </el-menu-item>
            <template v-for="item in menuDataCom"    :key="item.id" >
                <el-sub-menu v-if="item.id!=5"  :index="item.id + ''" >
                <template #title>
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </template>
                <!--二级菜单-->
                <el-menu-item 
                    v-for="subItem in item.child" 
                    :index="'/admin'+subItem.frontpath" 
                    :key="subItem.id"
                >
                    <template #title>
                        <el-icon>
                            <component :is="subItem.icon"></component>
                        </el-icon>
                        <span>{{ subItem.name }}</span>
                    </template>
                </el-menu-item>
            </el-sub-menu>  
            </template>          
        </el-menu>
    </div>
</template>
<style scoped lang="less">
.menuCom {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

:deep(.el-menu) {
  border-right: none !important;
  background-color: #ffffff;
}

:deep(.el-menu-item) {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-menu-item:hover) {
  background-color: #ecf5ff !important;
  color: #409eff;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #ecf5ff, #d9ecff) !important;
  color: #409eff !important;
  font-weight: 600;
  border-radius: 8px;
}

:deep(.el-sub-menu) {
  margin: 2px 0;
}

:deep(.el-sub-menu__title) {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: #409eff !important;
}

:deep(.el-icon) {
  font-size: 18px !important;
}
</style>