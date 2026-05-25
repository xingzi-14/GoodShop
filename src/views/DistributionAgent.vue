<template>
  <div class="agent-list">
    <!-- 搜索 & 筛选 -->
    <el-card shadow="never" class="search-card">
      <div class="search-bar">
        <div class="search-left">
          <el-input
            v-model="keyword"
            placeholder="请输入搜索信息"
            clearable
            style="width: 260px"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>

        <div class="search-right">
          <el-radio-group v-model="timeType" @change="handleTimeChange">
            <el-radio-button value="all">全部</el-radio-button>
            <el-radio-button value="today">今天</el-radio-button>
            <el-radio-button value="yesterday">昨天</el-radio-button>
            <el-radio-button value="week">最近7天</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never" class="table-card">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        style="width: 100%"
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
              <div class="user-name">用户：{{ row.username || '--' }}</div>
              <div class="user-phone">电话：{{ row.phone || '--' }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="promotion_count" label="推广数量" width="100" align="center" />
        <el-table-column prop="order_count" label="订单数量" width="100" align="center" />
        <el-table-column prop="order_amount" label="订单金额" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.order_amount ?? '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="total_commission" label="账户佣金" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.total_commission ?? '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="withdrawn_commission" label="已提现佣金" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.withdrawn_commission ?? '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="pending_commission" label="未提现佣金" width="120" align="right">
          <template #default="{ row }">
            ¥{{ row.pending_commission ?? '0.00' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="showPromotionDetail(row)">
              查看推广明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :page-sizes="[10, 15, 20, 30]"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 推广明细弹窗 -->
    <PromotionDetail ref="detailRef" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, UserFilled } from '@element-plus/icons-vue'
import { getAgentList } from '@/api/distribution'
import PromotionDetail from '@/components/PromotionDetail.vue'

// ========== 搜索 & 筛选 ==========
const keyword = ref('')
const timeType = ref('all')

// ========== 分页 & 数据 ==========
const page = ref(1)
const pageSize = ref(15)
const totalCount = ref(0)
const tableData = ref([])
const loading = ref(false)

// ========== 弹窗组件 ==========
const detailRef = ref(null)

// ========== 生命周期 ==========
onMounted(() => {
  fetchData()
})

// ========== 方法 ==========
async function fetchData() {
  loading.value = true
  try {
    const params = { limit: pageSize.value }
    if (keyword.value) params.keyword = keyword.value
    if (timeType.value !== 'all') params.type = timeType.value

    const res = await getAgentList(page.value, params)
    if (res.msg === 'ok') {
      tableData.value = res.data.list || []
      totalCount.value = res.data.totalCount || 0
    }
  } catch (e) {
    console.error('获取分销员列表失败', e)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchData()
}

function handleTimeChange() {
  page.value = 1
  fetchData()
}

function handleSizeChange() {
  page.value = 1
  fetchData()
}

function handleCurrentChange() {
  fetchData()
}

function showPromotionDetail(row) {
  detailRef.value?.open(row)
}
</script>

<style scoped>
.agent-list {
  padding: 20px;
}
.search-card {
  margin-bottom: 16px;
}
.table-card {
  height: 65vh;
  overflow-y: auto;
}
.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-info {
  line-height: 1.6;
}
.user-name {
  font-size: 14px;
  color: #333;
}
.user-phone {
  font-size: 12px;
  color: #999;
}
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
