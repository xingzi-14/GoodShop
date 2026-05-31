<template>
    <div class="tagmenu">
       <!-- 外层:确认默认激活的标签名称，设置选项目卡为卡片样式，设置改变样式标签事件以及移除标签事件 -->
        <el-tabs v-model="activeTable" type="card" @tab-change="ChangeTable" @tab-remove="RemoveTable" class="tabsclass">
            <!-- -->
            <el-tab-pane v-for="item in tabsList" :key="item.path" :label="item.title" :name="item.path" :closable="item.path != '/admin/index'"></el-tab-pane>
        </el-tabs>

        <!-- 下拉菜单 -->
        <el-dropdown @command="editPath">
            <span class="el-dropdown-link">
                <el-icon><arrow-down/></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭全部</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup>
import { ref,reactive } from 'vue';
import { useRoute,useRouter,onBeforeRouteUpdate } from 'vue-router';

const route =useRoute();
const router =useRouter();

//默认model的选中变量,默认为当前访问的路由路径
let activeTable =ref('/admin/index');
//初始化tab菜单数组:保存用户所点击的菜单地址
let tabsList = ref([
    {title:'后台首页',path:'/admin/index'},
])

//改变选中标签事件
/**
 * path参数：是事件的回调参数，也就是直接获取当前修改的标签选项的name属性植
 */
const ChangeTable =(path)=>{
    console.log(path);
    activeTable.value=path;
    router.push(path)
}

//移除标签事件
const RemoveTable =(path)=>{
    const index = tabsList.value.findIndex(item => item.path == path);
    const indexNew=index-1;

        tabsList.value.splice(index,1)
    if(activeTable.value==path){
        activeTable.value=tabsList.value[indexNew].path
        router.push(tabsList.value[indexNew].path                )
    }

        window.sessionStorage.setItem('tabsList',JSON.stringify(tabsList.value))
}

const AddTabsList = (obj) => {
  // 🔥 关键：判断 path 是否已经存在，存在就不添加！
  const isExist = tabsList.value.some(item => item.path === obj.path)
  
  // 不存在才添加
  if (!isExist) {
    tabsList.value.push(obj)
  }
  
  // 保存到本地存储
  window.sessionStorage.setItem('tabsList', JSON.stringify(tabsList.value))
}
const initTabsList = () => {
  let result = JSON.parse(window.sessionStorage.getItem('tabsList'))
  if (result) {
    // 🔥 去重：保证从本地存储拿出来也没有重复
    const uniqueTabs = [...new Map(result.map(item => [item.path, item])).values()]
    tabsList.value = uniqueTabs
  }
}
initTabsList();

//监听当前路由发生的改变：一旦发生路由更改，将自动触发该函数
onBeforeRouteUpdate((to,from)=>{
    //目标地址中提取标题和路径
    activeTable.value=to.path;
    let obj ={
        title:to.meta.title,
        path:to.path
    }
    AddTabsList(obj);
});
//下拉菜单修改路径
const editPath =(res)=>{
    if(res=='other'){
        other();
    }
    if(res=='all'){
        all();
    }
    
 }


 const other=()=>{
    let newArr=[];
    const index = tabsList.value.findIndex(item => item.path == activeTable.value);
    newArr.push(tabsList[0])
    newArr.push(tabsList[index])
    tabsList.splice(0, tabsList.length); // 清空
    newArr.forEach(item => tabsList.push(item));
    window.sessionStorage.setItem('tabsList',JSON.stringify(tabsList))
 }
 const all = () => {
  // 只保留首页
  const newArr = tabsList.filter(item => item.path === '/admin/index');
  
  tabsList.splice(0, tabsList.length);
  newArr.forEach(item => tabsList.push(item));

  // 跳回首页
  activeTable.value = '/admin/index';
  router.push('/admin/index');

  window.sessionStorage.setItem('tabsList', JSON.stringify(tabsList));
}
</script>

<style scoped lang="less">
.tagmenu {
  display: flex;
  align-items: center;
  background-color: #f0f2f5;
  overflow: hidden;
  padding: 8px 8px 4px 8px;
  border-bottom: 1px solid #e4e7ed;
}

.tabsclass {
  max-width: 1138px;
  flex: 1;

  :deep(.el-tabs__header) {
    margin: 0;
    border-bottom: none !important;
  }

  :deep(.el-tabs__nav) {
    border: 0 !important;
  }

  :deep(.el-tabs__item) {
    background-color: #fff;
    height: 32px;
    line-height: 32px;
    border-radius: 6px;
    margin-right: 6px;
    margin-left: 0;
    border: 1px solid #e4e7ed;
    font-size: 13px;
    color: #606266;
    padding: 0 12px;
    transition: all 0.3s ease;
  }

  :deep(.el-tabs__item:hover) {
    color: #409eff;
    border-color: #d9ecff;
  }

  :deep(.el-tabs__item.is-active) {
    color: #409eff;
    background: linear-gradient(135deg, #ecf5ff, #d9ecff);
    border-color: #b3d8ff;
    font-weight: 600;
  }

  :deep(.el-tabs__nav-next),
  :deep(.el-tabs__nav-prev) {
    line-height: 32px;
  }
}

.el-dropdown {
  width: 34px;
  height: 32px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #b3d8ff;
    background-color: #ecf5ff;
  }
}
</style>