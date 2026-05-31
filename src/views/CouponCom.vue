<template>
    <div class="coupon">
      <el-card>
        <header>
          <el-button type="primary" plain @click="diaStatus=true">新增</el-button>
        </header>
  
        <el-table :data="tableData" stripe  style="width: 100%; height: 600px;">
          
            <el-table-column label="优惠券名称">
                <template #default="scope">
                    <div class="coupon-name-box">
                    <div class="coupon-name">{{scope.row.name }}</div>
                    <div class="coupon-time">
                        {{ scope.row.start_time }} ~ {{ scope.row.end_time }}
                    </div>
                    </div>
                </template>
            </el-table-column>
  
          <!-- 状态开关（和截图样式1:1还原） -->
          <el-table-column label="状态">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                inline-prompt
                active-text="已结束"
                inactive-text="进行中"
                :active-value="1"
                :inactive-value="0"
                style="--el-switch-on-color: #909399; --el-switch-off-color: #67c23a;"
                @change="editStatus(scope.row)"
              />
            </template>
          </el-table-column>
  
          <!-- 优惠列（根据type自动显示满减/折扣） -->
          <el-table-column label="优惠">
            <template #default="scope">
              <span v-if="scope.row.type === 0">满减 ¥{{ scope.row.value }}</span>
              <span v-if="scope.row.type === 1">折扣 {{ scope.row.value }}折</span>
            </template>
          </el-table-column>
  
          <el-table-column label="发送数量" prop="total" />
          <el-table-column label="已使用" prop="used" />
  
          <el-table-column label="操作">
            <template #default=" scope">
              <el-button 
                type="danger" 
                plain 
                size="small" 
                @click="DelCoupon(scope.row.id)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="pageArea">
                <el-pagination 
                    v-model:current-page="page" 
                    v-model:page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="getCouponList"
                    @current-change="getCouponList"
                />
            </div> -->
      </el-card>
      <updateCoupon v-model:visible="diaStatus"  @update="getCouponList" />
    </div>
  </template>
<script setup>
import { ref } from 'vue';
import { getCouponListFn ,DeleteCoupon,CouponStatu} from '../api/coupon';
import { ElMessage ,ElMessageBox} from 'element-plus';
import updateCoupon from '../components/updateCoupon.vue';
let tableData=ref([])
let page=ref(1)
// let pageSize = ref(6)
// let total=ref(0)
let diaStatus=ref(false)
const getCouponList=async()=>{
    let result=await getCouponListFn(page.value)
    console.log(result);
    if(result.msg!='ok'||!result.data){
        return ElMessage.error(result.msg);
    }
    tableData.value=result.data.list;
    // total.value=result.data.totalCount;

}

const DelCoupon=async(id)=>{
    try {
    await ElMessageBox.confirm("确定删除？", "提示", {
      type: "warning",
    });

    let result = await DeleteCoupon(id);

    if (result.msg !== "ok") {
      ElMessage.error("删除失败：" + result.msg);
      return;
    }

    ElMessage.success("删除成功");
    getCouponList()

  } catch (err) {
    ElMessage.info("已取消");
  }
}
const editStatus=async(row)=>{
    
    let result = await CouponStatu(row.id,row.status);

    if(result.msg!='ok'||!result.data){
        return ElMessage.error(result.msg);
    }

    ElMessage.success("修改成功");
    getCouponList()
}
getCouponList()
</script>
<style scoped lang="less">
.coupon {
  padding: 12px;
}

.coupon-name-box {
  padding: 14px 16px;
  background: linear-gradient(135deg, #f5f7fa, #e8edf2);
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #b3d8ff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
  }

  .coupon-name {
    font-weight: 600;
    font-size: 14px;
    color: #303133;
  }

  .coupon-time {
    margin-top: 8px;
    font-size: 11px;
    color: #909399;
    line-height: 1.5;
  }
}

.pageArea {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
}
</style>