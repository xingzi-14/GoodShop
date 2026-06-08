<template>
    <div class="commentcom">
        <el-card>
            <el-row :gutter="30">
                <!-- 搜索框 -->
                <el-col :span="8">
                    <el-input v-model="title" placeholder="请输入商品名称" clearable   @clear="getCommentList">
                        <template #append>

                            <el-button  @click="getCommentList"><el-icon><Search /></el-icon></el-button>

                        </template>
                    </el-input>
                </el-col>
            </el-row>

             <div class="table-container">
             <el-table :data="tableData" style="width: 100%;" max-height="760">
                <el-table-column type="expand">
                    <template #default="scoped">
                        <div class="expand-row">
                            <p>
                                <strong>商家回复：</strong>{{ scoped.row.extra[0].data }}
                            </p>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="商品">
                    <template #default="scoped">
                        <div class="avatar">
                            <el-avatar :size="50" :src="scoped.row.goods_item.cover"></el-avatar>
                            {{scoped.row.goods_item.title}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="评分">
                   <template #default="scoped">
                    <p>
                       用户：{{ scoped.row.user.username}}
                    </p>

                        <el-rate
                            v-model="scoped.row.rating"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}分"
                        />
                   </template>
                </el-table-column>

                <el-table-column label="评价时间" prop="create_time">
                </el-table-column>

                <el-table-column label="是否显示">
                    <template #default="scoped">
                        <el-switch v-model="scoped.row.status" inline-prompt  :active-value="1" :inactive-value="0"
                        @change="editStatus(scoped.row)"/>
                    </template>
                </el-table-column>
             </el-table>
             </div>
             <div class="page">
        <el-pagination
          v-model:current-page="page"
          :page-size="pageSize"
          layout="total, prev, pager, next,jumper"
          :total="total"
          @change="handleCurrentChange"
        /></div>
        </el-card>
    </div>

    </template>
<script setup>
import { ref } from 'vue';
import { getCommentListFn,updateCommentStatu} from '../api/comment';
import { ElMessage } from 'element-plus';
let title=ref('')
let tableData=ref([])
let page=ref(1)
let pageSize=ref(10)
let total=ref(0)
const getCommentList=async()=>{
    let result=await getCommentListFn(page.value,title.value)
    console.log(result);
    if(result.msg!='ok'||!result.data){
        return ElMessage.error(result.msg);
    }
    tableData.value=result.data.list;
    total.value=result.data.totalCount;
}

const editStatus=async(row)=>{
    let result=await  updateCommentStatu(row.id,row.status)
    if(result.msg!='ok'||!result.data)return ElMessage.error(result.msg)
   console.log(result);
   ElMessage.success('更改状态成功！')
   getCommentList()
}
const handleCurrentChange=(p)=>{
    page.value=p;
    getCommentList();
}
getCommentList()
</script>
<style scoped lang="less">
.commentcom {
  padding: 12px;
}

.avatar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #303133;
}

.expand-row {
  padding: 16px 24px;
  background: #fafbfc;
  border-radius: 6px;

  p {
    margin: 6px 0;
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
  }

  strong {
    color: #303133;
  }
}

.page {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}

.table-container {
  margin-top: 15px;
}
</style>
