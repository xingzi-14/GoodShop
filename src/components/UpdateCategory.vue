<template>
    <div class="update">
      <el-dialog v-model="isDialog" :title="propTitle" width="40%" @close="CloseDialog">
        <el-form :model="formDataModel" label-width="80px" ref="formDom" :rules="formCategory">
          <!-- 规格名称 -->
          <el-form-item label="分类名称">
            <el-input v-model="formDataModel.name" placeholder="请输入分类名称" />
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
  import { ref, watch, reactive } from 'vue'
  import { addCategoryFn,EditCategoryFn } from '../api/category'
  import { ElMessage } from 'element-plus'
  
  let isDialog = ref(false)
  let formDataModel = reactive({
    name: '',
  })
  


  let formDom = ref('')
  let formCategory = reactive({
    name: [{ required: true, message: '名称不为空', trigger: 'blur' }],
  })
  
  const props = defineProps({
    propTitle: String,
    editRow: Object,
  })
  const emits = defineEmits(['update:propTitle', 'update'])
  
  watch(() => props.editRow, (val) => {
    if (props.propTitle === '编辑' && val) {
      formDataModel.name = val.name
    }
  })
  
  watch(() => props.propTitle, (newval) => {
    if (newval == '添加' || newval == '编辑') {
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
    isDialog.value = false
  }
  
  const handleSubmit = () => {
    formDom.value.validate(async (isVali) => {
      if (!isVali) return
  
      // 把标签转成逗号字符串
  
      switch (props.propTitle) {
        case '添加':
          let result = await addCategoryFn(formDataModel)
          if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg)
          ElMessage.success('新增成功')
          break
  
        case '编辑':
          let editCategory = await EditCategoryFn(props.editRow.id, formDataModel)
          if (editCategory.msg != 'ok' || !editCategory.data) return ElMessage.error(editCategory.msg)
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