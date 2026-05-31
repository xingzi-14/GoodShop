<template>
    <div class="rolecom">
        <el-card>
            <el-button type="primary" @click="title='新增角色'">新增</el-button>
            <el-table :data="tableData" stripe border style="width: 100%;height: 450px;">
                <el-table-column label="角色ID" prop="id"/>
                <el-table-column label="角色名称" prop="name"/>
                <el-table-column label="角色描述" prop="desc"/>
                <el-table-column label="最近更新时间" prop="update_time"/>
                <el-table-column label="角色状态">
                    <template #default="scoped">
                        <el-switch v-model="scoped.row.status" inline-prompt active-text="使用"
                        inactive-text="禁用" :active-value="1" :inactive-value="0"
                        style="--el-switch-on-color:#13ce66;--el-switch-off-color:ff4949" @change="editStatus(scoped.row)"/>
                    </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scoped">
                    <div>
                        <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="primary" plain size="small" @click="setRolesFn(scoped.row)">
                            <el-icon><Share /></el-icon>
                            </el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="warning" plain size="small" @click="EditRole(scoped.row)">
                            <el-icon><Edit /></el-icon>
                            </el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" plain size="small" @click="DelRole(scoped.row.id)">
                            <el-icon><Delete /></el-icon>
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            </el-table>
            <div class="pageArea">
                <el-pagination 
                    v-model:current-page="page" 
                    v-model:page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="getRolesList"
                    @current-change="getRolesList"
                />
            </div>
        </el-card>

        <!-- 子组件 -->
        
        <UpdateRole v-model:propTitle="title" @update="getRolesList" :editRow="editSRow"/>
        <RoleSetRule 
        v-model:propID="orderId.id" 
        :propRole="orderId" 
        @refresh="getRolesList" 
    />
    </div>

</template>
<script setup>
import { ElMessage,ElMessageBox } from 'element-plus';
import { getRolesListFn,DelRoleFn,EditRoleStatuFn } from '../api/role';
import { ref } from 'vue';
import UpdateRole from '../components/UpdateRole.vue';
import RoleSetRule from '../components/RoleSetRule.vue';
let page=ref(1)
let pageSize = ref(8)
let total=ref(0)
let tableData=ref([])
let title=ref(null)
let editSRow=ref({})
//分配角色权限个体数据
let orderId=ref({})
const getRolesList=async()=>{
    let result=await getRolesListFn(page.value)

    if(result.msg!='ok'||!result.data){
        return ElMessage.error(result.msg);
    }
    tableData.value=result.data.list;
    total.value=result.data.totalCount;
}
getRolesList()

const EditRole=(row)=>{
title.value='编辑角色'
editSRow.value=row
}
const DelRole=async(id)=>{
    try {
    await ElMessageBox.confirm("确定删除？", "提示", {
      type: "warning",
    });

    let result = await DelRoleFn(id);

    if (result.msg !== "ok") {
      ElMessage.error("删除失败：" + result.msg);
      return;
    }

    ElMessage.success("删除成功");
    getRolesList()

  } catch (err) {
    ElMessage.info("已取消");
  }
}
const setRolesFn=(row)=>{
    title.value='分配权限'
    orderId.value=row
}

const editStatus=async(row)=>{
    let result=await  EditRoleStatuFn(row.id,row.status)
    if(result.msg!='ok'||!result.data)return ElMessage.error(result.msg)
   console.log(result);
   ElMessage.success('更改状态成功！')
   getRolesList()
}
</script>
<style scoped lang="less">
.rolecom {
  width: 100%;
  padding: 12px;
}

.pageArea {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
}
</style>