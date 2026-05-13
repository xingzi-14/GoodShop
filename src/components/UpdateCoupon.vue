<template>
    <div class="coupon-add">
      <el-dialog v-model="dialogVisible" title="新增" width="40%" @close="handleClose">
        <el-form :model="form" label-width="120px" ref="formRef">
          <!-- 优惠券名称 -->
          <el-form-item label="优惠券名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入优惠券名称" reqiured/>
          </el-form-item>
  
          <!-- 类型：满减/折扣 -->
          <el-form-item label="类型">
            <el-radio-group v-model="form.type" reqiured>
              <el-radio :label="0">满减</el-radio>
              <el-radio :label="1">折扣</el-radio>
            </el-radio-group>
          </el-form-item>
  
          <!-- 面值 -->
          <el-form-item label="面值">
            <el-input v-model.number="form.value" reqiured>
              <template #append>元</template>
            </el-input>
          </el-form-item>
  
          <!-- 数量（步进器） -->
          <el-form-item label="数量">
            <el-input-number v-model="form.total" :min="1" :max="9999" />
          </el-form-item>
  
          <!-- 最低使用价格 -->
          <el-form-item label="最低使用价格">
            <el-input v-model.number="form.min_price" reqiured>
              <template #append>元</template>
            </el-input>
          </el-form-item>
  
          <!-- 描述 -->
          <el-form-item label="描述">
            <el-input v-model="form.desc" placeholder="请输入描述" reqiured/>
          </el-form-item>
  
          <!-- 活动时间：开始/结束 -->
          <el-form-item label="活动时间" reqiured>
            <el-date-picker
              v-model="form.start_time"
              type="datetime"
              placeholder="开始时间"
              style="width: 48%"
            />
            <span style="margin: 0 4px;">To</span>
            <el-date-picker
              v-model="form.end_time"
              type="datetime"
              placeholder="结束时间"
              style="width: 48%"
            />
          </el-form-item>
  
          <!-- 排序（步进器） -->
          <el-form-item label="排序">
            <el-input-number v-model="form.order" :min="1" :max="999" />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import { addCouponFn } from '../api/coupon' // 你的新增接口
  
  const props = defineProps({
    visible: Boolean
  })
  const emits = defineEmits(['update:visible','update'])
  
  const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emits('update:visible', val)
  })
  
  const formRef = ref(null)
  const form = reactive({
    name: '',
    type: 0,
    value: 0,
    total: 100,
    min_price: 1,
    desc: '',
    start_time: '',
    end_time: '',
    order: 50
  })
  
  // 提交表单（重点：时间转时间戳）
  const handleSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    // 拷贝一份对象，不影响原表单
    const data = {
      ...form,
      start_time: new Date(form.start_time).getTime() / 1000,
      end_time: new Date(form.end_time).getTime() / 1000
    }

    let res = await addCouponFn(data)

    if (res.msg === 'ok') {
      ElMessage.success('添加成功')
      dialogVisible.value = false
    } else {
      ElMessage.error(res.msg)
    }
  })
  emits('update')
}
  
  const handleClose = () => {
    dialogVisible.value = false
  }
  </script>
