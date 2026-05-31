<template>
<div class="rulescom">
    <el-card>
        <!-- 顶部 -->
        <header>
            <el-button type="success" plain @click="openDialog">新增</el-button>
        </header>
        <!-- 底部 -->
        <el-tree :data="data" :props="defaultProps" node-key="id" :default-expanded-keys="defaultKey">
            <!-- 自定义树形结构布局 -->
            <template #default="{node,data}">
                <div class="content">
                    <!-- 左边权限名称 -->
                     <div class="left">
                        <el-tag v-if="data.menu==1">菜单</el-tag>
                        <el-tag type="success" v-if="data.menu==0">权限</el-tag>
                        <el-icon v-if="data.icon"><component :is="data.icon"></component></el-icon>
                        {{ data.name }}
                     </div>
                    <!-- 右边权限名称 ,此处所有事件触发都需要设置禁止冒泡-->
                    <div class="right">
                        <el-switch  v-model="data.status" :inactive-value="0" :active-value="1" inactive-text="禁用" active-text="应用" inline-prompt   @change="EditStatus(data.id, data.status)"/>
                        <el-button type="warning" size="small" @click="EditRules(data)">
                            <el-icon><EditPen /></el-icon>
                        </el-button>

                        <el-button type="primary" size="small" @click="AddRuleLevel(data)">
                            <el-icon><Plus /></el-icon>
                        </el-button>

                        <el-button type="danger" size="small" @click="DelRules(data.id)">
                            <el-icon><Minus /></el-icon>
                        </el-button>
                    </div>
                </div>
            </template>
        </el-tree>
    </el-card>
    <UpdateRules  v-model:propTitle="title" :rulesList="data" @submitok="getRulesList" :ruleData="rule"/>
</div>

</template>
<script setup>
import { ElMessage,ElMessageBox } from 'element-plus';
import { getRulesListFn,RulesStatu,DeleteRules} from '../api/rules';
import { ref } from 'vue';
import UpdateRules from '../components/UpdateRules.vue';
const data=ref([])
const rulesList=ref([])
const defaultKey=ref([])
const defaultProps={
    children:'child',
    label:'name',
}
let rule=ref({})
let title=ref('')
// 初始化数据
const getRulesList = async ()=>{
    let result =await getRulesListFn();
    if(result.msg!='ok'||!result.data)return ElMessage.error(result.msg)
    data.value=result.data.list
    rulesList.value=result.data.rules
    console.log(data);
    console.log(rulesList);
    defaultKey.value=result.data.list.map(item=>{
        return item.id
    })
}

  getRulesList();



const openDialog=()=>{
// isDialog.value=true
 title.value='新增'
}
const EditRules=(data)=>{
    rule.value=data
    console.log(rule);
    title.value='编辑'

}
const EditStatus = async (id,status) => {
    let result = await RulesStatu(id, status)
  
  if (result.msg !== 'ok') return
  ElMessage.success('状态修改成功')
  getRulesList()
}
const AddRuleLevel=(data)=>{
    rule.value=data
    console.log(rule);
    title.value='新增下级权限'
}


const DelRules=async(id)=>{
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
    getRulesList()

  } catch (err) {
    ElMessage.info("已取消");
  }
}
</script>
<style scoped lang="less">
.rulescom {
  padding: 12px;

  .el-card {
    margin-top: 0;
    height: 630px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;

    .el-tree {
      margin-top: 20px;

      .content {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 14px 0;
        border-bottom: 1px solid #f5f7fa;
        transition: all 0.3s ease;

        &:hover {
          background: #fafbfc;
          border-radius: 6px;
          padding-left: 8px;
          padding-right: 8px;
        }

        .left {
          flex: 0 0 auto;
          min-width: 200px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #303133;

          .el-icon {
            font-size: 16px;
          }
        }

        .right {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;

          .el-switch {
            margin-right: 8px;
          }
        }
      }

      :deep(.el-tree-node__content) {
        height: 44px;
        padding: 0 8px;
        border-radius: 6px;
      }

      :deep(.el-tree-node__content:hover) {
        background: #f5f7fa;
      }
    }
  }
}
</style>