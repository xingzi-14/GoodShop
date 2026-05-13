<template>
    <div class="update">
      <el-dialog v-model="isDialog" :title="propTitle" width="40%" @close="CloseDialog">
        <el-form :model="formDataModel" label-width="80px" ref="formDom" :rules="formSkus">
          <!-- 规格名称 -->
          <el-form-item label="规格名称">
            <el-input v-model="formDataModel.name" placeholder="请输入规格名称" />
          </el-form-item>
  
          <!-- 规格数据（标签版 + 你的原有结构） -->
          <el-form-item label="规格数据">
            <div class="flex gap-2">
              <el-tag
                v-for="tag in dynamicTags"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-if="inputVisible"
                ref="InputRef"
                v-model="inputValue"
                class="w-20"
                size="small"
                @keyup.enter="handleInputConfirm"
                @blur="handleInputConfirm"
              />
              <el-button v-else class="button-new-tag" size="small" @click="showInput">
                + New Tag
              </el-button>
            </div>
          </el-form-item>
  
          <!-- 排序 -->
          <el-form-item label="排序">
            <el-input-number v-model="formDataModel.order" :min="1" :max="9999" />
          </el-form-item>
  
          <!-- 状态开关 -->
          <el-form-item label="状态">
            <el-switch
              v-model="formDataModel.status"
              :active-value="1"
              :inactive-value="0"
              active-text="使用"
              inactive-text="禁用"
            />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="CloseDialog">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, reactive, nextTick } from 'vue'
  import { addSkusFn,EditSkusFn } from '../api/skus'
  import { ElMessage } from 'element-plus'
  
  let isDialog = ref(false)
  let formDataModel = reactive({
    name: '',
    default: '',
    order: 30,
    status: 1,
  })
  
  //标签功能
  const inputValue = ref('')
  const dynamicTags = ref([])
  const inputVisible = ref(false)
  const InputRef = ref()
  
  const handleClose = (tag) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  }
  const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
      InputRef.value.input.focus()
    })
  }
  const handleInputConfirm = () => {
    if (inputValue.value) {
      dynamicTags.value.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
  }
  
  
  let formDom = ref('')
  let formSkus = reactive({
    name: [{ required: true, message: '名称不为空', trigger: 'blur' }],
    default: [{ required: true, message: '规格不为空', trigger: 'blur' }],
  })
  
  const props = defineProps({
    propTitle: String,
    editRow: Object,
  })
  const emits = defineEmits(['update:propTitle', 'update'])
  
  watch(() => props.editRow, (val) => {
    if (props.propTitle === '编辑' && val) {
      formDataModel.name = val.name
      formDataModel.default = val.default
      formDataModel.order = val.order
      formDataModel.status = val.status
  
      // 编辑回显标签
      dynamicTags.value = val.default ? val.default.split(',') : []
    }
  })
  
  watch(() => props.propTitle, (newval) => {
    if (newval == '新增' || newval == '编辑') {
      OpenDialog()
    } else {
      CloseDialog()
    }
  })
  
  const OpenDialog = () => {
    isDialog.value = true
  }
  
  const CloseDialog = () => {
    emits('update:propTitle', null)
    formDataModel.name = ''
    formDataModel.default = ''
    formDataModel.order = 30
    formDataModel.status = 1
  
    // 关闭清空标签
    dynamicTags.value = []
    isDialog.value = false
  }
  
  const handleSubmit = () => {
    formDom.value.validate(async (isVali) => {
      if (!isVali) return
  
      // 把标签转成逗号字符串
      formDataModel.default = dynamicTags.value.join(',')
  
      switch (props.propTitle) {
        case '新增':
          let result = await addSkusFn(formDataModel)
          if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg)
          ElMessage.success('新增成功')
          break
  
        case '编辑':
          let editSkus = await EditSkusFn(props.editRow.id, formDataModel)
          if (editSkus.msg != 'ok' || !editSkus.data) return ElMessage.error(editSkus.msg)
          ElMessage.success('编辑成功')
          break
      }
      CloseDialog()
      emits('update')
    })
  }
  </script>
  
  <style scoped>
  .flex {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  </style>