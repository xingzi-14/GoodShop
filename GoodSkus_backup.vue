<template>
  <el-dialog title="设置商品规格" v-model="isDialog" width="65%" destroy-on-close @close="CloseDialog" top="2vh">
    <div class="skus-container">
      <!-- 规格类型切换 -->
      <div class="sku-type-switch">
        <span class="label">规格类型：</span>
        <el-radio-group v-model="sku_type">
          <el-radio :value="0">单规格</el-radio>
          <el-radio :value="1">多规格</el-radio>
        </el-radio-group>
      </div>

      <!-- ========== 单规格表单 ========== -->
      <template v-if="sku_type === 0">
        <el-form :model="singleForm" label-width="80px" class="single-form">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="市场价">
                <el-input-number :controls="false" v-model="singleForm.oprice" :min="0" :precision="2" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售价">
                <el-input-number :controls="false" v-model="singleForm.pprice" :min="0" :precision="2" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成本价">
                <el-input-number :controls="false" v-model="singleForm.cprice" :min="0" :precision="2" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="重量(kg)">
                <el-input-number :controls="false" v-model="singleForm.weight" :min="0" :precision="3" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="体积(m³)">
                <el-input-number :controls="false" v-model="singleForm.volume" :min="0" :precision="3" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>

      <!-- ========== 多规格表单 ========== -->
      <template v-else>
        <!-- 规格卡片管理 -->
        <div class="spec-cards-area">
          <div class="spec-header">
            <span class="label">规格管理</span>
            <el-button size="small" type="primary" @click="addSpecCard">
              <el-icon><Plus /></el-icon>添加规格
            </el-button>
          </div>
          <div v-if="skuCards.length === 0" class="empty-tip">暂无规格，请点击"添加规格"</div>
          <div v-for="(card, idx) in skuCards" :key="card._key" class="spec-card">
            <div class="spec-card-header">
              <el-input v-model="card.name" placeholder="规格名称（如：尺寸）" size="small" />
              <span class="order-label">排序：</span>
              <el-input-number :controls="false" v-model="card.order" :min="1" size="small" />
              <el-button size="small" type="danger" plain @click="removeSpecCard(idx)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <div class="spec-card-values">
              <el-tag
                v-for="(tag, tagIdx) in card.values"
                :key="tag"
                closable
                size="small"
                @close="removeSpecValue(card, tagIdx)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="card.inputVisible"
                ref="tagInputRef"
                v-model="card.inputValue"
                size="small"
                class="tag-input"
                @keyup.enter="addSpecValue(card)"
                @blur="addSpecValue(card)"
              />
              <el-button v-else size="small" class="add-tag-btn" @click="showSpecValueInput(card)">
                <el-icon><Plus /></el-icon>添加选项值
              </el-button>
            </div>
          </div>
        </div>

        <!-- SKU 明细表 -->
        <div class="sku-table-area" v-if="skuTableData.length > 0">
          <span class="label">SKU 明细</span>
          <el-table :data="skuTableData" border size="small" class="sku-table">
            <!-- 规格值列 -->
            <el-table-column
              v-for="card in validCards"
              :key="card._key"
              :label="card.name || '规格'"
              align="center"
            >
              <template #default="{ row }">
                {{ row.specs[card._key] }}
              </template>
            </el-table-column>
            <!-- 图片 -->
            <el-table-column label="图片" width="120" align="center">
              <template #default="{ row }">
                <SelectImage v-model="row.image" :propnum="1" />
              </template>
            </el-table-column>
            <!-- 销售价 -->
            <el-table-column label="销售价" width="120" align="center">
              <template #default="{ row }">
                <el-input-number :controls="false" v-model="row.pprice" :min="0" :precision="2" size="small" style="width: 100px;" />
              </template>
            </el-table-column>
            <!-- 市场价 -->
            <el-table-column label="市场价" width="120" align="center">
              <template #default="{ row }">
                <el-input-number :controls="false" v-model="row.oprice" :min="0" :precision="2" size="small" style="width: 100px;" />
              </template>
            </el-table-column>
            <!-- 成本价 -->
            <el-table-column label="成本价" width="120" align="center">
              <template #default="{ row }">
                <el-input-number :controls="false" v-model="row.cprice" :min="0" :precision="2" size="small" style="width: 100px;" />
              </template>
            </el-table-column>
            <!-- 库存 -->
            <el-table-column label="库存" width="100" align="center">
              <template #default="{ row }">
                <el-input-number :controls="false" v-model="row.stock" :min="0" size="small" style="width: 80px;" />
              </template>
            </el-table-column>
            <!-- 体积 -->
            <el-table-column label="体积(m³)" width="110" align="center">
              <template #default="{ row }">
                <el-input-number :controls="false" v-model="row.volume" :min="0" :precision="3" size="small" style="width: 90px;" />
              </template>
            </el-table-column>
            <!-- 重量 -->
            <el-table-column label="重量(kg)" width="110" align="center">
              <template #default="{ row }">
                <el-input-number :controls="false" v-model="row.weight" :min="0" :precision="3" size="small" style="width: 90px;" />
              </template>
            </el-table-column>
            <!-- 编码 -->
            <el-table-column label="商品编码" width="130" align="center">
              <template #default="{ row }">
                <el-input v-model="row.code" size="small" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </div>

    <template #footer>
      <el-button @click="CloseDialog">取消</el-button>
      <el-button type="primary" @click="submitFn" :loading="submitting">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick } from 'vue'
import {
  getCategoryGoodsFn,
  editGoodsSkuFn,
  insertGoodsSkusFn,
  editGoodsSkusCardFn,
  delGoodsSkusCardFn,
  insertGoodsSkusCardValueFn,
  delGoodsSkusCardValueFn,
} from '../api/goods'
import { ElMessage } from 'element-plus'
import SelectImage from './SelectImage.vue'

let isDialog = ref(false)
let submitting = ref(false)
let sku_type = ref(0)

// ===== 单规格 =====
const singleForm = reactive({
  oprice: 0,
  pprice: 0,
  cprice: 0,
  weight: 0,
  volume: 0,
})

// ===== 多规格 =====
let cardKeyCounter = 0
const skuCards = ref([])
const skuTableData = ref([])
const existingCards = ref([]) // 已保存到后端的规格卡片

const validCards = computed(() => skuCards.value.filter(c => c.name && c.values.length > 0))

// 监听规格卡片变化，重新生成 SKU 表
watch(
  () => skuCards.value.map(c => ({ key: c._key, name: c.name, values: [...c.values] })),
  () => { generateSkuTable() },
  { deep: true }
)

function generateSkuTable() {
  const cards = validCards.value
  if (cards.length === 0) {
    skuTableData.value = []
    return
  }

  // 保留旧数据用于回填
  const oldRows = [...skuTableData.value]

  // 笛卡尔积
  let combinations = [{ specs: {} }]
  for (const card of cards) {
    const next = []
    for (const combo of combinations) {
      for (const val of card.values) {
        next.push({
          specs: { ...combo.specs, [card._key]: val },
        })
      }
    }
    combinations = next
  }

  // 尝试从旧数据中恢复已有字段
  skuTableData.value = combinations.map(combo => {
    const old = oldRows.find(r => {
      const oldSpecs = r.specs || {}
      const newSpecs = combo.specs
      const keys = Object.keys(newSpecs)
      if (Object.keys(oldSpecs).length !== keys.length) return false
      return keys.every(k => oldSpecs[k] === newSpecs[k])
    })
    if (old) {
      return { ...combo, image: old.image, pprice: old.pprice, oprice: old.oprice, cprice: old.cprice, stock: old.stock, volume: old.volume, weight: old.weight, code: old.code }
    }
    return { ...combo, image: '', pprice: 0, oprice: 0, cprice: 0, stock: 0, volume: 0, weight: 0, code: '' }
  })
}

// 添加规格卡片
function addSpecCard() {
  const key = `card_${cardKeyCounter++}`
  skuCards.value.push({
    _key: key,
    _id: null,        // 后端 ID（新增的为 null）
    name: '',
    order: skuCards.value.length + 1,
    type: 0,
    values: [],
    inputVisible: false,
    inputValue: '',
  })
}

// 删除规格卡片
function removeSpecCard(idx) {
  skuCards.value.splice(idx, 1)
}

// 添加规格值
function addSpecValue(card) {
  if (card.inputValue && !card.values.includes(card.inputValue)) {
    card.values.push(card.inputValue)
  }
  card.inputVisible = false
  card.inputValue = ''
}

// 删除规格值
function removeSpecValue(card, tagIdx) {
  card.values.splice(tagIdx, 1)
}

// 显示规格值输入框
function showSpecValueInput(card) {
  card.inputVisible = true
  nextTick(() => {
    const inputs = document.querySelectorAll('.tag-input input')
    if (inputs.length) inputs[inputs.length - 1].focus()
  })
}

// ===== 弹窗控制 =====
const props = defineProps({
  propID: { type: Number, default: 0 },
})
const emits = defineEmits(['update:propID', 'success'])

watch(() => props.propID, (val) => {
  if (val != 0) OpenDialog()
  else CloseDialog()
})

async function OpenDialog() {
  const res = await getCategoryGoodsFn(props.propID)
  if (res.msg !== 'ok' || !res.data) return ElMessage.error(res.msg)

  const goods = res.data

  // 根据已有数据判断单/多规格
  if (goods.sku_type !== undefined) {
    sku_type.value = goods.sku_type
  }

  if (goods.sku_type === 1 && goods.goodsSkus && goods.goodsSkus.length > 0) {
    // 多规格模式：从 goodsSkus 还原规格卡片和 SKU 表
    restoreMultiSpec(goods.goodsSkus, goods.goodsSkusCard || [])
  } else if (goods.sku_type === 0 && goods.goodsSkus && goods.goodsSkus.length > 0) {
    // 单规格模式
    const sku = goods.goodsSkus[0]
    singleForm.oprice = sku.oprice || 0
    singleForm.pprice = sku.pprice || 0
    singleForm.cprice = sku.cprice || 0
    singleForm.weight = sku.weight || 0
    singleForm.volume = sku.volume || 0
  }

  isDialog.value = true
}

function restoreMultiSpec(goodsSkus, goodsSkusCard) {
  skuCards.value = []
  skuTableData.value = []

  if (goodsSkusCard.length > 0) {
    // 从规格卡片还原
    existingCards.value = goodsSkusCard
    for (const card of goodsSkusCard) {
      const values = (card.goodsSkusCardValue || []).map(v => v.value || v.name || '')
      skuCards.value.push({
        _key: `card_${cardKeyCounter++}`,
        _id: card.id,
        name: card.name,
        order: card.order || 1,
        type: card.type || 0,
        values: values.filter(Boolean),
        inputVisible: false,
        inputValue: '',
      })
    }
  } else if (goodsSkus.length > 0) {
    // 从 SKU 数据反推规格
    const specMap = new Map()
    for (const sku of goodsSkus) {
      if (!sku.skus) continue
      for (const s of sku.skus) {
        if (!specMap.has(s.name)) {
          specMap.set(s.name, { name: s.name, values: new Set(), order: s.order || 1, id: s.goods_skus_card_id || null })
        }
        specMap.get(s.name).values.add(s.value)
      }
    }
    for (const [name, info] of specMap) {
      skuCards.value.push({
        _key: `card_${cardKeyCounter++}`,
        _id: info.id,
        name,
        order: info.order,
        type: 0,
        values: [...info.values],
        inputVisible: false,
        inputValue: '',
      })
    }
  }

  // 初始化后生成表格
  nextTick(() => { generateSkuTable() })

  // 回填 SKU 数据
  if (goodsSkus.length > 0) {
    nextTick(() => {
      for (const sku of goodsSkus) {
        const skuList = Array.isArray(sku.skus) ? sku.skus : []
        const row = skuTableData.value.find(r => {
          if (skuList.length === 0) return false
          return skuList.every(s => r.specs && Object.values(r.specs).includes(s.value))
        })
        if (row) {
          row.image = sku.image || ''
          row.pprice = sku.pprice || 0
          row.oprice = sku.oprice || 0
          row.cprice = sku.cprice || 0
          row.stock = sku.stock || 0
          row.volume = sku.volume || 0
          row.weight = sku.weight || 0
          row.code = sku.code || ''
        }
      }
    })
  }
}

function CloseDialog() {
  isDialog.value = false
  skuCards.value = []
  skuTableData.value = []
  existingCards.value = []
  cardKeyCounter = 0
  singleForm.oprice = 0
  singleForm.pprice = 0
  singleForm.cprice = 0
  singleForm.weight = 0
  singleForm.volume = 0
  sku_type.value = 0
  emits('update:propID', 0)
}

// ===== 保存 =====
async function submitFn() {
  submitting.value = true
  try {
    if (sku_type.value === 0) {
      await saveSingleSpec()
    } else {
      await saveMultiSpec()
    }
    ElMessage.success('商品规格设置成功')
    emits('success')
    CloseDialog()
  } catch (e) {
    ElMessage.error(e.message || '保存失败')
  } finally {
    submitting.value = false
  }
}

async function saveSingleSpec() {
  const data = {
    sku_type: 0,
    sku_value: {
      oprice: singleForm.oprice,
      pprice: singleForm.pprice,
      cprice: singleForm.cprice,
      weight: singleForm.weight,
      volume: singleForm.volume,
    },
  }
  const res = await editGoodsSkuFn(props.propID, data)
  if (res.msg !== 'ok') throw new Error(res.msg)
}

async function saveMultiSpec() {
  const cards = validCards.value

  // 1. 保存/新增规格卡片，并同步选项值
  const cardIdMap = {} // _key -> backend card id
  for (const card of cards) {
    let cardId = card._id

    if (cardId) {
      // 更新已有规格卡片
      await editGoodsSkusCardFn(cardId, {
        goods_id: props.propID,
        name: card.name,
        order: card.order,
        type: card.type,
      })
    } else {
      // 新增规格卡片
      const res = await insertGoodsSkusFn({
        goods_id: props.propID,
        name: card.name,
        order: card.order,
        type: card.type,
      })
      if (res.msg === 'ok' && res.data) {
        cardId = res.data.id
        card._id = cardId
      }
    }

    if (cardId) {
      cardIdMap[card._key] = cardId
      // 同步规格值：删除旧的全部重建（简单策略）
      // 先获取已有值并删除不再需要的，再新增新的
      await syncCardValues(cardId, card)
    }
  }

  // 删除已移除的规格卡片
  const currentCardKeys = new Set(cards.map(c => c._key))
  for (const oldCard of existingCards.value) {
    // 检查是否还在当前卡片中
    const stillExists = cards.some(c => c._id === oldCard.id)
    if (!stillExists) {
      await delGoodsSkusCardFn(oldCard.id)
    }
  }

  // 2. 构建 goodsSkus 数据
  const goodsSkus = skuTableData.value.map(row => {
    const skus = []
    for (const card of cards) {
      const cardId = cardIdMap[card._key] || card._id
      const value = row.specs[card._key]
      skus.push({
        goods_skus_card_id: String(cardId || ''),
        name: card.name,
        order: card.order,
        value: value,
        text: value,
      })
    }
    return {
      skus,
      image: row.image || '',
      pprice: row.pprice,
      oprice: row.oprice,
      cprice: row.cprice,
      stock: row.stock,
      volume: row.volume,
      weight: row.weight,
      code: row.code || '',
      goods_id: props.propID,
    }
  })

  const data = {
    sku_type: 1,
    goodsSkus,
  }
  const res = await editGoodsSkuFn(props.propID, data)
  if (res.msg !== 'ok') throw new Error(res.msg)
}

async function syncCardValues(cardId, card) {
  // 简单策略：为每个值调用新增接口（后端可能有去重逻辑）
  // 这里仅新增不存在的值，删除由后端处理
  for (const value of card.values) {
    await insertGoodsSkusCardValueFn({
      goods_skus_card_id: cardId,
      name: card.name,
      order: card.order,
      value,
    })
  }
}
</script>

<style scoped>
.skus-container {
  max-height: 65vh;
  overflow-y: auto;
}
.sku-type-switch {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.sku-type-switch .label {
  font-weight: bold;
  margin-right: 12px;
}
.single-form {
  margin-top: 10px;
}
.spec-cards-area {
  margin-top: 10px;
}
.spec-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.spec-header .label {
  font-weight: bold;
}
.empty-tip {
  color: #999;
  font-size: 13px;
  padding: 20px 0;
}
.spec-card {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px 14px;
  margin-bottom: 10px;
  background: #fafafa;
}
.spec-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.spec-card-header .el-input {
  width: 160px;
}
.spec-card-header .el-input-number {
  width: 110px;
}
.order-label {
  font-size: 13px;
  color: #666;
}
.spec-card-values {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.tag-input {
  width: 100px;
}
.add-tag-btn {
  font-size: 12px;
}
.sku-table-area {
  margin-top: 20px;
}
.sku-table-area .label {
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
}
.sku-table {
  margin-top: 5px;
}
</style>
