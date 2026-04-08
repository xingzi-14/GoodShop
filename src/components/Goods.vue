<template>
   <div class="card-container">
    <div class="card-row ">
        <el-card  style="width:650px;flex:1;min-width:100px;max-height: 230px; min-height: 130px;" > 
            <template #header >
            <div class="header-right">
                <span>店铺提示</span>
                <el-tag type="primary" >店铺提示1</el-tag>
            </div>
            </template>
            <div class="item-group">
            <el-card style="max-width: 150px;" v-for="item in data.goods" :key="item.goods">
                {{ item.label }}
              {{ item.value }}
            </el-card>
            </div>
        </el-card>
    </div>
    <div class="card-row ">
        <el-card  style="width:650px;flex:1;min-width:100px;max-height: 230px; min-height: 130px;" > 
            <template #header >
            <div class="header-right">
                <span>商品提示</span>
                <el-tag type="primary" >商品提示1</el-tag>
            </div>
            </template>
            <div class="item-group">
            <el-card style="max-width: 150px;" v-for="item in data.order" :key="item.goods">
                {{ item.label }}
              {{ item.value }}
            </el-card>
            </div>
        </el-card>
    </div>
  </div>
</template>
<script setup>
import { ElCard } from 'element-plus'
import {GoodsState} from '../api/home';

import { ref, onMounted } from 'vue'

// 1. 定义响应式变量存数据
const data = ref({
  goods: [],
  order: []
})

// 2. 获取数据
const getData = async () => {
  try {
    // 用常量接收接口返回
    const res = await GoodsState()
    console.log("接口数据：", res)
    
    // 把数据交给响应式变量
    data.value = res.data
  } catch (err) {
    console.log("请求失败", err)
  }
}

// 3. 页面加载时自动调用
onMounted(() => {
  getData()
})
</script>
<style>
.item-group {
  display: flex;
  flex-wrap: wrap;
  gap: 40px; /* 间距 */
}
.card-container {
  display: flex;
  flex-direction: column; /* 关键：竖着排 */
  gap: 20px; /* 上下间距 */
}
/* 小卡片宽度 */
/* .item-card {
  width: 100px;
  text-align: center;
} */
</style>