<template>
    <el-dialog
      title="订单详情"
      v-model="visible"
      width="450px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div class="detail-wrap">
        <!-- 订单信息 -->
        <div class="block">
          <h3 class="block-title">订单信息</h3>
          <div class="info-item">
            <span class="label">订单号：</span>
            <span class="value">{{ ThisOrder.no }}</span>
          </div>
          <div class="info-item">
            <span class="label">付款方式：</span>
            <span class="value">{{ ThisOrder.payment_method }}</span>
          </div>
          <div class="info-item">
            <span class="label">下单时间：</span>
            <span class="value">{{ ThisOrder.create_time }}</span>
          </div>
        </div>
  
        <!-- 商品信息 -->
        <div class="block">
          <h3 class="block-title">商品信息</h3>
          <div class="info-item">
            <span class="label">商品名称：</span>
            <span class="value">{{ ThisOrder.order_items[0]?.goods_name }}</span>
          </div>
          <div class="info-item">
            <span class="label">商品价格：</span>
            <span class="value">{{ ThisOrder.total_price }}</span>
          </div>
          <div class="info-item">
            <span class="label">商品数量：</span>
            <span class="value">{{ ThisOrder.order_items[0]?.num }}</span>
          </div>
          <div class="info-item">
            <span class="label">商品规格：</span>
            <div class="tag-group">
              <el-tag v-for="tag in ThisOrder.order_items[0]?.specs" :key="tag" size="small">
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="info-item">
            <span class="label">商品总价：</span>
            <span class="value">{{ ThisOrder.total_price }}</span>
          </div>
        </div>
  
        <!-- 收货信息 -->
        <div class="block">
          <h3 class="block-title">收货信息</h3>
          <div class="info-item">
            <span class="label">收货人：</span>
            <span class="value">{{ ThisOrder.address.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">联系方式：</span>
            <span class="value">{{ ThisOrder.address.phone }}</span>
          </div>
          <div class="info-item">
            <span class="label">联系地址：</span>
            <span class="value">
              {{ ThisOrder.address.province }}{{ ThisOrder.address.city }}{{ ThisOrder.address.district }}{{ ThisOrder.address.address }}
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </template>
<script setup>
import { computed} from 'vue';

const props = defineProps({
    details: Boolean,
    ThisOrder:Object
  })

  const emit = defineEmits(['update:details'])

// 核心：双向绑定
const visible = computed({
  get: () => props.details,
  set: (val) => emit('update:details', val)
})
const handleClose = () => {
 props.ThisOrder={}
}
</script>
<style scoped lang="less">
.detail-wrap {
  padding: 10px 0;
}
.block {
  margin-bottom: 20px;
  &:not(:last-child) {
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
  }
  .block-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 12px;
    color: #333;
  }
  .info-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .label {
      width: 90px;
      color: #666;
    }
    .value {
      color: #333;
    }
    .tag-group {
      display: flex;
      gap: 6px;
    }
  }
}
</style>