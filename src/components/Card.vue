<template>
  <div class="card-row">
    <el-skeleton v-if="loading" animated :rows="3" style="width: 400px; flex: 1; min-width: 100px" />
    <template v-else>
      <el-card  style="width: 400px; flex: 1; min-width: 100px"   v-for="item in data?.panels || []"  :key="item.title"  >
        <template #header>
          <div class="header-right">
            <span>{{ item.title }}</span>
            <el-tag type="primary">{{ item.unit }}</el-tag>
          </div>
        </template>

        <h1 class="center-text">
          <GsapCom :propval="item.value"/>
        </h1>

        <template #footer>
          {{ item.subTitle }}
          <el-tag type="primary">{{ item.subValue }}</el-tag>
        </template>
      </el-card>
    </template>
  </div>
</template>

<script setup>
import { ElCard, ElTag, ElSkeleton } from 'element-plus'
import { orderState } from '../api/home'
import { ref, onMounted } from 'vue'
import GsapCom from './GsapCom.vue'

const data = ref(undefined)
const loading = ref(true) // 加载状态

const getData = async () => {
  try {
    loading.value = true
    const res = await orderState()
    console.log('接口数据：', res)
    data.value = res.data
  } catch (err) {
    console.log('请求失败', err)
  } finally {
    // 延迟 500ms 关闭加载，让骨架屏更自然
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

onMounted(() => {
  getData()
})
</script>

<style>
.card-row {
  display: flex;
  gap: 16px;
  padding: 10px;
  flex-wrap: wrap;
}
.header-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.center-text {
  text-align: center;
  margin: 16px 0;
}
</style>