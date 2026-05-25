<template>
  <div class="distribution-settings">
    <el-card shadow="never">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="right"
        label-width="100px"
      >
        <!-- 基础设置 -->
        <el-divider content-position="left">基础设置</el-divider>

        <el-form-item label="分销启用" prop="distribution_open">
          <el-radio-group v-model="form.distribution_open">
            <el-radio :value="1" border>是</el-radio>
            <el-radio :value="0" border>否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="分销海报" prop="spread_banners">
          <el-upload
            action="#"
            list-type="picture-card"
            :file-list="posterFileList"
            :auto-upload="false"
            :limit="1"
            :on-change="handlePosterChange"
            :on-remove="handlePosterRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <!-- 佣金设置 -->
        <el-divider content-position="left">佣金设置</el-divider>

        <el-form-item label="一级返佣比例" prop="store_first_rebate">
          <el-input-number
            v-model="form.store_first_rebate"
            :min="0"
            :max="100"
            :precision="0"
          >
          </el-input-number>
          <span class="suffix">%</span>
        </el-form-item>

        <el-form-item label="二级返佣比例" prop="store_second_rebate">
          <el-input-number
            v-model="form.store_second_rebate"
            :min="0"
            :max="100"
            :precision="0"
          >
          </el-input-number>
          <span class="suffix">%</span>
        </el-form-item>

        <el-form-item label="自购返佣" prop="is_self_brokerage">
          <el-radio-group v-model="form.is_self_brokerage">
            <el-radio :value="1" border>是</el-radio>
            <el-radio :value="0" border>否</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 结算设置 -->
        <el-divider content-position="left">结算设置</el-divider>

        <el-form-item label="结算时间" prop="settlement_days">
          <el-input-number
            v-model="form.settlement_days"
            :min="0"
            :max="365"
            :precision="0"
          >
          </el-input-number>
          <span class="suffix">天</span>
        </el-form-item>

        <el-form-item label="结算方式" prop="brokerage_method">
          <el-radio-group v-model="form.brokerage_method">
            <el-radio value="manual" border>手动结算</el-radio>
            <el-radio value="wechat" border>微信结算</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 提交 -->
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSave">
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getDistributionSetting, updateDistributionSetting } from '@/api/distribution'
import { image } from '@/api/pics'

// ========== 表单数据 ==========
const form = reactive({
  distribution_open: 0,
  spread_banners: [],
  store_first_rebate: 20,
  store_second_rebate: 10,
  is_self_brokerage: 1,
  settlement_days: 7,
  brokerage_method: 'manual'
})

const rules = {
  store_first_rebate: [
    { required: true, message: '请输入一级返佣比例', trigger: 'blur' }
  ],
  store_second_rebate: [
    { required: true, message: '请输入二级返佣比例', trigger: 'blur' }
  ],
  settlement_days: [
    { required: true, message: '请输入结算时间', trigger: 'blur' }
  ]
}

const formRef = ref(null)
const submitting = ref(false)

// 海报文件列表（用于预览）
const posterFileList = ref([])

// ========== 生命周期 ==========
onMounted(() => {
  fetchSettings()
})

// ========== 方法 ==========
async function fetchSettings() {
  try {
    const res = await getDistributionSetting()
    if (res.msg === 'ok' && res.data) {
      const d = res.data
      form.distribution_open = d.distribution_open ?? 0
      form.store_first_rebate = d.store_first_rebate ?? 20
      form.store_second_rebate = d.store_second_rebate ?? 10
      form.is_self_brokerage = d.is_self_brokerage ?? 1
      form.settlement_days = d.settlement_days ?? 7
      form.brokerage_method = d.brokerage_method ?? 'manual'

      if (d.spread_banners && d.spread_banners.length > 0) {
        posterFileList.value = d.spread_banners.map((url, i) => ({
          name: `poster-${i}`,
          url
        }))
      }
    }
  } catch (e) {
    console.error('获取分销设置失败', e)
  }
}

function handlePosterChange(uploadFile) {
  posterFileList.value = [uploadFile]
}

function handlePosterRemove() {
  posterFileList.value = []
}

async function handleSave() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const posterUrls = []
    for (const item of posterFileList.value) {
      if (item.raw) {
        const formData = new FormData()
        formData.append('file', item.raw)
        const uploadRes = await image(formData)
        posterUrls.push(uploadRes.url)
      } else if (item.url) {
        posterUrls.push(item.url)
      }
    }

    const payload = {
      distribution_open: form.distribution_open,
      spread_banners: posterUrls,
      store_first_rebate: form.store_first_rebate,
      store_second_rebate: form.store_second_rebate,
      is_self_brokerage: form.is_self_brokerage,
      settlement_days: form.settlement_days,
      brokerage_method: form.brokerage_method
    }

    const res = await updateDistributionSetting(payload)
    if (res.msg === 'ok') {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(res.msg || '保存失败')
    }
  } catch (e) {
    ElMessage.error('保存失败')
    console.error(e)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.distribution-settings {
  padding: 20px;
  height: 75vh;
  overflow-y: auto;
}
.suffix {
  margin-left: 8px;
  color: #666;
}
.el-form-item {
  margin-bottom: 22px;
}
.el-divider {
  margin-top: 0;
}
</style>
