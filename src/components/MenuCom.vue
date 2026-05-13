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
<style scoped>
:deep(.el-icon) {
  font-size: 25px !important;
}
</style>