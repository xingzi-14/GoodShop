<template>
    <div class="homeIndex">
        <el-card>
        <header>
            <el-button type="primary" plain @click="title='添加'">添加分类</el-button>
        </header>

        <el-table :data="tableData"  stripe border style="width: 100%;height: 560px; ">
            <el-table-column  width="55px" prop="id"/>
            <el-table-column label="分类名称" prop="name"/>
            <el-table-column label="状态" prop="status">
                <template #default="scoped">
                        <el-switch v-model="scoped.row.status" inline-prompt active-text="使用"
                        inactive-text="禁用" :active-value="1" :inactive-value="0"
                        style="--el-switch-on-color:#13ce66;--el-switch-off-color:ff4949" @change="editStatus(scoped.row)"/>
                    </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scoped">
                    <div>
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="warning" plain size="small" @click="EditSkus(scoped.row)">
                            <el-icon><Edit /></el-icon>
                            </el-button>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" plain size="small" @click="DelCategory(scoped.row.id)">
                            <el-icon><Delete /></el-icon>
                            </el-button>
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
        </el-table>
       </el-card>
       <updateCategory v-model:propTitle="title" @update="getCategoryList" :editRow="editSkus" />
    </div>
</template>
<script setup>
import { getCategoryListFn ,DeleteCategory,CategoryStatu} from '../api/category';
import { ElMessage ,ElMessageBox} from 'element-plus';
import { ref } from 'vue';
import updateCategory from '../components/updateCategory.vue';
let tableData=ref([])
let title=ref(null)
let editSkus=ref({})
const getCategoryList=async()=>{
    let result=await getCategoryListFn()
    console.log(result);
    if(result.msg!='ok'||!result.data){
        return ElMessage.error(result.msg);
    }
    tableData.value=result.data;
}
const DelCategory=async(id)=>{
    try {
    await ElMessageBox.confirm("确定删除？", "提示", {
      type: "warning",
    });

    let result = await DeleteCategory(id);

    if (result.msg !== "ok") {
      ElMessage.error("删除失败：" + result.msg);
      return;
    }

    ElMessage.success("删除成功");
    getCategoryList()

  } catch (err) {
    ElMessage.info("已取消");
  }
}

const EditSkus=(row)=>{
title.value='编辑'
editSkus.value=row
}
const editStatus=async(row)=>{
 

    let result = await CategoryStatu(row.id,row.status);

    if(result.msg!='ok'||!result.data){
        return ElMessage.error(result.msg);
    }

    ElMessage.success("修改成功");
    getCategoryList()

  } 

getCategoryList()
</script>
<style scoped less="lang">
    .el-card{
        margin-top: 20px;
        height: 680px;
        overflow-y: auto;
        overflow-x: hidden; 
        .el-table{
            margin-top: 15px;
        }
    }
    
</style>