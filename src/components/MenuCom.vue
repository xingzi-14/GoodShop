<script setup>
import { useStore } from "vuex"
import { computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
// 引入 Element Plus 图标
import * as Icons from '@element-plus/icons-vue'
import { House } from '@element-plus/icons-vue'

const store = useStore();
const router = useRouter();
const route = useRoute();

let menuDataCom = computed(() => {
    return store.state.menus
})

let defaultActive = ref(route.path)

// 图标字符串 转 组件（核心修复）
const getIcon = (iconName) => {
  return Icons[iconName] || null
}
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
        
            <template v-for="item in menuDataCom" :key="item.id">
                <el-sub-menu v-if="item.id!=5" :index="item.id + ''">
                <template #title>
                    <el-icon>
                      <!-- 修复这里 -->
                      <component v-if="getIcon(item.icon)" :is="getIcon(item.icon)"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </template>

                <!-- 二级菜单 -->
                <el-menu-item 
                    v-for="subItem in item.child" 
                    :index="'/admin' + subItem.frontpath" 
                    :key="subItem.id"
                >
                    <template #title>
                        <el-icon>
                          <!-- 修复这里 -->
                          <component v-if="getIcon(subItem.icon)" :is="getIcon(subItem.icon)"></component>
                        </el-icon>
                        <span>{{ subItem.name }}</span>
                    </template>
                </el-menu-item>
            </el-sub-menu>
            </template>
        </el-menu>
    </div>
</template>

<style scoped>
:deep(.el-icon) {
  font-size: 25px !important;
}
</style>