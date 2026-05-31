<template>
<div class="manegercom">
    <el-card>
        <el-row :gutter="30">
            <!-- 搜索框 -->
            <el-col :span="8">
                <el-input v-model="keyword" placeholder="请输入管理员" clearable   @clear="getData">
                    <template #append>
                        <el-button :icon="Search"  @click="getData"/>
                    </template>
                </el-input>
            </el-col>
            <!-- 添加管理员 -->
             <el-col :span="8">
                <el-button type="primary" @click="openDialogFn(1)">添加管理员</el-button>
             </el-col>
        </el-row>
        <!-- 显示管理员列表 -->
         <el-table :data="tableData" style="width: 100%;">
            <el-table-column label="管理员头像及名称">
                <template #default="scope">
                    <div class="avatar">
                        <el-avatar :size="50" :src="scope.row.avatar"></el-avatar>
                        {{scope.row.username}}
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="角色权限"prop= "role.name"></el-table-column>

            <el-table-column label="账号状态">
                <template #default="scope">
                    <div>
                        <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.status"  @change="handleStatusChange(scope.row)" ></el-switch>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template #default="scope">
                    <div>
                        <el-button type="primary" :icon="Edit" size="small" @click="openDialogFn(2,scope.row)"></el-button>
                        <el-button type="warning" :icon="Delete" size="small" @click="delManagerFn(scope.row.id)"></el-button>
                    </div>
                </template>
            </el-table-column>
         </el-table>
         <div class="page"> 
    <el-pagination
      v-model:current-page="page"
      :page-size="limit"
      layout="total, prev, pager, next,jumper"
      :total="total"
      @current-change="handleCurrentChange"
    /></div>
    </el-card>
    <UpdateManager  v-model:propTitle="ParentData.title" :roleList="roleList" @reload="getData":row="ParentData.row"/>
</div>

</template>
<script setup>
import { reactive, ref } from 'vue';
import{ManagePage,ManageStatu,DeleteManage}from '../api/manager';
import { Search,  Edit, Delete } from '@element-plus/icons-vue';
import { ElMessageBox,ElMessage } from 'element-plus';
import UpdateManager from '../components/UpdateManager.vue';
let keyword =ref('')
let page=ref(1)
let limit=ref(6)
let total=ref(0)
let tableData=ref([])
let   roleList=ref([])
let ParentData=reactive({
    title :'',
    row:{}
})
const getData=async()=>{
    // page.value = 1 
    let result=await ManagePage(page.value,limit.value,keyword.value)
        console.log(result);
    if(result.msg!='ok'||!result.data)return

    tableData.value=result.data.list;
    total.value=result.data.totalCount;
    roleList.value=result.data.roles
}
const handleCurrentChange=(p)=>{
    page.value=p;
    getData();
}
// 状态切换事件
const handleStatusChange = async (row) => {
let result=await ManageStatu(row.id,row.status)
console.log(result);
console.log(row.status);
if(result.msg!='ok'||!result.data)return
getData()
};



// 删除管理员
const delManagerFn = async (id) => {
  try {
    await ElMessageBox.confirm("确定删除？", "提示", {
      type: "warning",
    });

    let result = await DeleteManage(id);

    if (result.msg !== "ok") {
      ElMessage.error("删除失败：" + result.msg);
      return;
    }

    ElMessage.success("删除成功");
    getData();
  } catch (err) {
    ElMessage.info("已取消");
  }
};
const openDialogFn=(type,item={})=>{
switch(type){
    case 1:
        //添加管理员

        ParentData.title='添加管理员'
        ParentData.row = {}
        break;
    case 2:
        ParentData.title='编辑管理员'
        ParentData.row = { ...item }
        //编辑管理员
        break;
}
}
getData()
</script>
<style scoped lang="less">
.manegercom {
  padding: 12px;
}

.el-card {
  margin-top: 0;
  padding: 16px;
}

.el-table {
  margin-top: 20px;
}

.avatar {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;

  .el-avatar {
    flex-shrink: 0;
  }
}

.page {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}
</style>