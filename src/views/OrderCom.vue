<template>
  <div class="order-page">
    <el-card>
      <!-- 1. 订单状态标签页 -->
      <el-tabs v-model="tabMap.tab" @tab-change="getOrderList">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="待支付" name="wait_pay" />
        <el-tab-pane label="待发货" name="wait_ship " />
        <el-tab-pane label="待收货" name="wait_confirm " />
        <el-tab-pane label="已收货" name="received" />
        <el-tab-pane label="已完成" name="finished" />
        <el-tab-pane label="已关闭" name="closed" />
        <el-tab-pane label="退款中" name="refunding" />
      </el-tabs>

      <!-- 2. 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="tabMap.no"
          placeholder="请输入订单号"
          style="width: 250px"
          clearable
          @keyup.enter="getOrderList"
        >
          <template #append>
            <el-button type="primary" icon="Search" @click="getOrderList" />
          </template>
        </el-input>
      </div>

      <!-- 3. 批量操作按钮 -->
      <div class="batch-btn-group">
        <el-button type="danger" plain @click="handleBatchDelete">批量删除</el-button>
        <el-button type="primary" @click="handleExportExcel">导出订单</el-button>
      </div>

      <!-- 4. 订单表格 -->
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />

        <!-- 订单信息 -->
        <el-table-column label="订单信息" min-width="320">
          <template #default="scope">
            <div class="order-info">
              <div class="order-no">订单号：{{ scope.row.no }}</div>
              <div class="order-time">下单时间：{{ scope.row.create_time }}</div>
              <div class="goods-info mt10">
                <el-image
                  :src="scope.row.user.avatar"
                  style="width: 60px; height: 60px; margin-right: 10px"
                  fit="cover"
                />
                <div>
                  <div v-for="item in scope.row.order_items" :key="item.id">
                    <span v-if="item.goods_item">{{ item.goods_item.title }}</span>
                    <span v-else>暂无商品</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="实付款" prop="total_price" width="100" />

        <el-table-column label="购买用户" width="130">
          <template #default="scope">
            {{ scope.row.user.username }}
          </template>
        </el-table-column>

        <!-- 订单状态 -->
        <el-table-column label="订单状态" min-width="220">
          <template #default="scope">
            <div>支付状态：
              <el-tag size="small" type="success">
                {{ scope.row.payment_method === 'alipay' ? '支付宝支付' : '未支付' }}
              </el-tag>
            </div>
            <div>发货状态：
              <el-tag size="small" type="warning">
                {{ scope.row.ship_status === 'pending' ? '未发货' : scope.row.ship_status === 'delivered' ? '待收货' : '已收货' }}
              </el-tag>
            </div>
            <div>退款状态：
              <el-tag size="small" type="info">
                {{ scope.row.refund_status === 'pending' ? '无需退款' : '退款中' }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button type="primary" link size="small" @click="openOrder(scope.row)">订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <div class="page-area" style="margin-top:20px; text-align:center;">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="getOrderList"
          @current-change="getOrderList"
        />
      </div>
    </el-card>

    <OrderDetails v-model:details="orderDetails" :ThisOrder="orderData" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrderListFn, deleteBatchOrderFn, exportOrderExcelFn } from '../api/order'
import OrderDetails from '../components/OrderDetails.vue'

const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const selectedOrders = ref([])

let orderDetails = ref(false)
let orderData = ref({})


const tabMap = reactive({
  tab: 'all',
  no:'',
})
       


const getOrderList = async () => {

  // console.log("传给后端的tab参数：", tab)
console.log(tabMap);
  let res = await getOrderListFn(page.value, tabMap)
  console.log(res);
  tableData.value = res.data.list
  total.value = res.data.totalCount
}



// 多选
const handleSelectionChange = (val) => {
  selectedOrders.value = val
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedOrders.value.length === 0) {
    ElMessage.warning('请选择订单')
    return
  }


    await ElMessageBox.confirm('确定删除？')
    
    let params = {
      ids: selectedOrders.value.map(item => item.id)
    }

    console.log('最终传给后端：', params)

    let res = await deleteBatchOrderFn(params)
    if(res.msg!='ok'||!res.data)return ElMessage.error(res.msg)
    ElMessage.success("删除成功")

}

// 导出Excel
const handleExportExcel = async () => {
  let res = await exportOrderExcelFn(activeTab.value)
  const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = '订单列表.xlsx'
  a.click()
  ElMessage.success('导出成功')
}

const openOrder = (row) => {
  orderData.value = row
  orderDetails.value = true
}

getOrderList()
</script>

<style scoped lang="less">
.order-page {
  padding: 12px;
}

.search-bar {
  margin: 15px 0;
}

.batch-btn-group {
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
}

:deep(.el-table) {
  max-height: 520px;
  overflow: auto;
  border-radius: 6px;
}

.order-info {
  .order-no {
    color: #409eff;
    font-weight: 600;
    font-size: 14px;
  }

  .order-time {
    font-size: 12px;
    color: #909399;
    margin: 4px 0;
  }

  .goods-info {
    display: flex;
    align-items: center;
    margin-top: 8px;
    gap: 12px;
  }
}

.page-area {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0 10px 0;
}
</style>