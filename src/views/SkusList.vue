<template>
    <div class="homeIndex">
       <el-card>
        <header>
            <el-button type="primary" plain @click="title='新增'">新增</el-button>
            <el-button type="danger" plain @click="DelSkusList">批量删除</el-button>
        </header>

        <el-table :data="tableData"  @selection-change="handleSelectionChange"  stripe border style="width: 100%;height: 560px; ">
            <el-table-column type="selection" width="55" />
            <el-table-column label="规格名称" prop="name"/>
            <el-table-column label="规格数据" prop="default"/>
            <el-table-column label="排序" prop="order"/>
            <el-table-column label="状态" prop="status">
                <template #default="scoped">
                        <el-switch v-model="scoped.row.status" inline-prompt active-text="使用"
                        inactive-text="禁用" :active-value="1" :inactive-value="0"
                        style="--el-switch-on-color:#13ce66;--el-switch-off-color:ff4949"/>
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
                            <el-button type="danger" plain size="small" @click="DelSkus(scoped.row.id)">
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
                    @size-change="getSkusList"
                    @current-change="getSkusList"
                />
            </div>
       </el-card>
      
        <UpdateSkus v-model:propTitle="title" @update="getSkusList" :editRow="editSkus" />
    </div>
</template>
<script setup>
import { getSkusListFn,DeleteRules } from '../api/skus';
import { ElMessage ,ElMessageBox} from 'element-plus';
import { ref } from 'vue';
import UpdateSkus from '../components/UpdateSkus.vue';
let page=ref(1)
let pageSize = ref(10)
let total=ref(0)
let tableData=ref([])
let title=ref(null)
let editSkus=ref({})
const selectedList = ref([])
const getSkusList=async()=>{
    let result=await getSkusListFn(page.value,pageSize.value)
    console.log(result);
    if(result.msg!='ok'||!result.data){
        return ElMessage.error(result.msg);
    }
    tableData.value=result.data.list;
    total.value=result.data.totalCount;
}
const DelSkus=async(id)=>{
    try {
    await ElMessageBox.confirm("确定删除？", "提示", {
      type: "warning",
    });

    let result = await DeleteRules(id);

    if (result.msg !== "ok") {
      ElMessage.error("删除失败：" + result.msg);
      return;
    }

    ElMessage.success("删除成功");
    getSkusList()

  } catch (err) {
    ElMessage.info("已取消");
  }
}
const DelSkusList=async()=>{
    if (selectedList.value.length === 0) {
    return ElMessage.warning('请选择要删除的数据')
  }

  const ids = selectedList.value.map(item => item.id)
  try {
    await ElMessageBox.confirm("确定删除？", "提示", {
      type: "warning",
    });

    let result = await DeleteRules(ids);

    if (result.msg !== "ok") {
      ElMessage.error("删除失败：" + result.msg);
      return;
    }

    ElMessage.success("删除成功");
    getSkusList()

  } catch (err) {
    ElMessage.info("已取消");
  }

}
const EditSkus=(row)=>{
title.value='编辑'
editSkus.value=row
}
// 监听表格多选变化
const handleSelectionChange = (val) => {
  selectedList.value = val
}
getSkusList()
</script>
<style scoped lang="less">
.homeIndex {
  padding: 12px;
}

.el-card {
  margin-top: 0;
  height: 680px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;

  .el-table {
    margin-top: 15px;
  }
}

.pageArea {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
}
</style>