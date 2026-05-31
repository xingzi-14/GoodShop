<template>
    <el-aside>
        <div class="piclistaside">
            <div class="cate-item" v-for="item in catePicList" :key="item.id" :class="{active:item.id==isActive}">
                <span @click="changeCateID(item.id)">{{ item.name }}</span>
                <em v-if="$route.path=='/admin/image/list'">
                <el-button type="primary" text @click="$emit('edit',item)">
                   <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="primary" text @click="handleDelete(item.id)">
                   <el-icon><Close /></el-icon>
                </el-button>
                </em>
            </div>
        </div>
        <div class="page">
            <el-pagination layout="prev,pager,next" :total="total" 
            v-model:page-size="pageSize" v-model:current-page="currentPage"@current-change="handleCurrentPage"/>
        </div>
    </el-aside>
</template>
<script setup>
import { getPicsCateList,delPicsCateList } from '../api/pics';
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
let catePicList=ref([]);
let total=ref(0)
let isActive=ref(0)
let pageSize=ref(10);
let currentPage=ref(1);
const emit =defineEmits(['changeid'])
//发起请求
const getData =async ()=>{
    let result =await getPicsCateList(currentPage.value,pageSize.value);
    if(result.msg!='ok'||!result.data){
        return
    }
    catePicList.value=result.data.list
    total.value=result.data.totalCount

    changeCateID(catePicList.value[0].id);
    console.log(result);
}
getData()
const handleCurrentPage=(val)=>{
    currentPage.value=val;
    getData()
}
const handleDelete = async (id) => {
    // 1. 弹出确认框
    await ElMessageBox.confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).catch(() => {
        ElMessage.info('已取消删除');
        throw new Error('cancel');
    });

    // 2. 调用删除接口
    const result = await delPicsCateList(id);

    // 3. 判断是否成功
    if (result.msg === 'ok') {
        ElMessage.success('删除成功');
        // 4. 重新获取列表
        getData();
    } else {
        ElMessage.error('删除失败');
    }
};
const changeCateID=(id)=>{
isActive.value=id;
emit('changeid',id);
}

defineExpose({
    getData
})
</script>
<style scoped lang="less">
.el-aside {
  height: 100%;
  border-right: 1px solid #ebeef5;
  position: relative;
  background: #fafbfc;

  .page {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border-top: 1px solid #ebeef5;
  }

  .piclistaside {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 50px;
    left: 0;
    overflow-y: auto;

    .cate-item {
      display: flex;
      height: 45px;
      align-items: center;
      cursor: pointer;
      border-radius: 6px;
      margin: 2px 6px;
      transition: all 0.3s ease;

      span {
        padding-left: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        color: #606266;
      }

      em {
        margin-left: auto;
        padding-right: 8px;

        .el-button {
          margin: 0;
          width: 28px;
        }
      }

      &:hover {
        background-color: #ecf5ff;
      }
    }

    .active {
      background: linear-gradient(135deg, #ecf5ff, #d9ecff);
      border-radius: 6px;

      span {
        color: #409eff;
        font-weight: 600;
      }
    }
  }
}
</style>