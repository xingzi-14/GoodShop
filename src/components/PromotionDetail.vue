<template>
  <el-dialog
    v-model="visible"
    title="推广明细"
    width="900px"
    :close-on-click-modal="false"
    @closed="handleClosed"
  >
    <!-- 分销员信息 -->
    <div class="agent-summary" v-if="agentInfo">
      <div class="agent-summary-left">
        <el-avatar :size="48" :src="agentInfo.avatar">
          <el-icon><UserFilled /></el-icon>
        </el-avatar>
        <div class="agent-summary-info">
          <div class="agent-summary-name">{{ agentInfo.nickname || agentInfo.username || '--' }}</div>
          <div class="agent-summary-phone">{{ agentInfo.phone || '--' }}</div>
        </div>
      </div>
      <div class="agent-summary-right">
        <div class="agent-summary-item">
          <span class="label">推广数量</span>
          <span class="value">{{ agentInfo.share_num ?? 0 }}</span>
        </div>
        <div class="agent-summary-item">
          <span class="label">订单数量</span>
          <span class="value">{{ agentInfo.share_order_num ?? 0 }}</span>
        </div>
        <div class="agent-summary-item">
          <span class="label">订单金额</span>
          <span class="value">¥{{ agentInfo.order_price ?? '0.00' }}</span>
        </div>
        <div class="agent-summary-item">
          <span class="label">账户佣金</span>
          <span class="value">¥{{ agentInfo.commission ?? '0.00' }}</span>
        </div>
        <div class="agent-summary-item">
          <span class="label">已提现</span>
          <span class="value">¥{{ agentInfo.cash_out_price ?? '0.00' }}</span>
        </div>
        <div class="agent-summary-item">
          <span class="label">未提现</span>
          <span class="value">¥{{ agentInfo.no_cash_out_price ?? '0.00' }}</span>
        </div>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-radio-group v-model="timeType" size="default">
        <el-radio-button value="all">全部</el-radio-button>
        <el-radio-button value="today">今天</el-radio-button>
        <el-radio-button value="yesterday">昨天</el-radio-button>
        <el-radio-button value="week">最近7天</el-radio-button>
      </el-radio-group>

      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="YYYY-MM-DD"
        style="width: 240px"
      />

      <el-radio-group v-model="level" size="default">
        <el-radio-button :value="0">全部</el-radio-button>
        <el-radio-button :value="1">一级推广</el-radio-button>
        <el-radio-button :value="2">二级推广</el-radio-button>
      </el-radio-group>

      <el-button type="primary" :icon="Search" @click="handleSearch">
        搜索
      </el-button>
    </div>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      v-loading="loading"
      stripe
      style="width: 100%"
      :empty-text="emptyText"
    >
      <el-table-column label="头像" width="80" align="center">
        <template #default="{ row }">
          <el-avatar :size="40" :src="row.avatar">
            <el-icon><UserFilled /></el-icon>
          </el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="用户信息" min-width="160">
        <template #default="{ row }">
          <div class="user-info">
            <div class="user-name">{{ row.nickname || row.username || '--' }}</div>
            <div class="user-phone">电话：{{ row.phone || '--' }}</div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="share_num" label="推广数量" width="100" align="center" />
      <el-table-column prop="share_order_num" label="推广订单数量" width="120" align="center" />
      <el-table-column prop="order_price" label="订单金额" width="120" align="right">
        <template #default="{ row }">
          ¥{{ row.order_price ?? '0.00' }}
        </template>
      </el-table-column>
      <el-table-column prop="commission" label="账户佣金" width="120" align="right">
        <template #default="{ row }">
          ¥{{ row.commission ?? '0.00' }}
        </template>
      </el-table-column>
      <el-table-column prop="cash_out_price" label="已提现佣金" width="120" align="right">
        <template #default="{ row }">
          ¥{{ row.cash_out_price ?? '0.00' }}
        </template>
      </el-table-column>
      <el-table-column prop="no_cash_out_price" label="未提现佣金" width="120" align="right">
        <template #default="{ row }">
          ¥{{ row.no_cash_out_price ?? '0.00' }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180" align="center" />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="totalCount > 0"
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :total="totalCount"
      layout="total, prev, pager, next"
      background
      small
      style="margin-top: 16px; justify-content: center"
      @current-change="fetchData"
    />
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Search, UserFilled } from '@element-plus/icons-vue'
import { getPromotionDetail } from '@/api/distribution'

// ========== 弹窗控制 ==========
const visible = ref(false)
const emptyText = ref('No Data')
const agentInfo = ref(null)

// ========== 筛选条件 ==========
const timeType = ref('all')
const dateRange = ref(null)
const level = ref(0)
const currentUserId = ref(null)

// ========== 分页 & 数据 ==========
const page = ref(1)
const pageSize = ref(15)
const totalCount = ref(0)
const tableData = ref([])
const loading = ref(false)

// ========== 暴露给父组件的方法 ==========
function open(row) {
  agentInfo.value = row
  currentUserId.value = row.id
  timeType.value = 'all'
  dateRange.value = null
  level.value = 0
  page.value = 1
  visible.value = true
  fetchData()
}

defineExpose({ open })

// ========== 方法 ==========
async function fetchData() {
  loading.value = true
  try {
    const params = {
      user_id: currentUserId.value
    }
    if (timeType.value !== 'all') params.type = timeType.value
    if (dateRange.value) {
      params.starttime = dateRange.value[0]
      params.endtime = dateRange.value[1]
    }
    if (level.value !== 0) params.level = level.value

    const res = await getPromotionDetail(page.value, params)
    if (res.msg === 'ok') {
      tableData.value = res.data.list || []
      totalCount.value = res.data.totalCount || 0
    }
  } catch (e) {
    console.error('获取推广明细失败', e)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchData()
}

function handleClosed() {
  tableData.value = []
  totalCount.value = 0
  currentUserId.value = null
  agentInfo.value = null
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 12px 16px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.user-info {
  line-height: 1.6;
}

.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.user-phone {
  font-size: 12px;
  color: #909399;
}

.agent-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin-bottom: 16px;
  background: #f0f5ff;
  border-radius: 8px;
  border: 1px solid #d6e4ff;
  flex-wrap: wrap;
  gap: 16px;
}

.agent-summary-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-summary-info {
  line-height: 1.5;
}

.agent-summary-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.agent-summary-phone {
  font-size: 13px;
  color: #909399;
}

.agent-summary-right {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.agent-summary-item {
  text-align: center;
}

.agent-summary-item .label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.agent-summary-item .value {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}
</style>
