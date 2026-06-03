<template>
  <div class="news-manage">
    <el-card>
      <header>
        <el-button type="primary" plain @click="openDialog(null)">新增公告</el-button>
      </header>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input
          v-model="keyword"
          placeholder="请输入标题关键词"
          clearable
          style="width: 240px"
        />
        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>
        </el-button>
      </div>

      <el-table :data="showList" stripe border style="width: 100%">
        <el-table-column label="ID" prop="id" width="80" align="center" />
        <el-table-column label="标题" prop="title" min-width="200" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="create_time" width="180" align="center" />
        <el-table-column label="操作" width="180" align="center">
          <template #default="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="warning" plain size="small" @click="openDialog(scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" plain size="small" @click="handleDelete(scope.row.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pageArea">
        <el-pagination
          v-model:current-page="page"
          layout="total, prev, pager, next, jumper"
          :total="total"
          @current-change="getNewsList"
        />
      </div>
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="isDialog"
      :title="editId ? '编辑公告' : '新增公告'"
      width="60%"
      @close="closeDialog"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <wangEditor v-model="formData.content" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getNewsListFn, addNewsFn, editNewsFn, deleteNewsFn } from '../api/news'
import wangEditor from '../components/wangEditor.vue'

// --- 列表数据 ---
const tableData = ref([])
const showList = ref([])
const page = ref(1)
const total = ref(0)
const keyword = ref('')

// --- 弹窗数据 ---
const isDialog = ref(false)
const editId = ref(null)
const formRef = ref(null)

const formData = reactive({
  title: '',
  content: ''
})

const formRules = reactive({
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
})

// --- 获取列表 ---
const getNewsList = async () => {
  const result = await getNewsListFn(page.value)
  if (result.msg !== 'ok' || !result.data) {
    return ElMessage.error(result.msg || '获取列表失败')
  }
  tableData.value = result.data.list
  showList.value = result.data.list
  total.value = result.data.totalCount
}

// --- 搜索 ---
const handleSearch = () => {
  if (keyword.value) {
    showList.value = tableData.value.filter(item =>
      item.title.includes(keyword.value)
    )
  } else {
    showList.value = tableData.value
  }
}

// --- 打开弹窗 ---
const openDialog = (row) => {
  if (row) {
    editId.value = row.id
    formData.title = row.title
    formData.content = row.content || ''
  } else {
    editId.value = null
  }
  isDialog.value = true
}

// --- 关闭弹窗 ---
const closeDialog = () => {
  isDialog.value = false
  formRef.value?.resetFields()
  formData.title = ''
  formData.content = ''
  editId.value = null
}

// --- 提交表单 ---
const submitForm = async () => {
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  const postData = {
    title: formData.title,
    content: formData.content
  }

  let result
  if (editId.value) {
    result = await editNewsFn(editId.value, postData)
  } else {
    result = await addNewsFn(postData)
  }

  if (result.msg !== 'ok') {
    return ElMessage.error(result.msg || '操作失败')
  }

  ElMessage.success(editId.value ? '编辑成功' : '新增成功')
  getNewsList()
  closeDialog()
}

// --- 删除 ---
const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除该公告？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const result = await deleteNewsFn(id)
    if (result.msg !== 'ok') {
      return ElMessage.error('删除失败：' + result.msg)
    }
    ElMessage.success('删除成功')
    getNewsList()
  } catch {
    ElMessage.info('已取消')
  }
}

onMounted(() => {
  getNewsList()
})
</script>

<style scoped lang="less">
.news-manage {
  padding: 12px;
}

.el-card {
  margin-top: 0;
  height: 680px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;

  .el-table {
    margin-top: 15px;
  }
}

.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 15px;
}

.pageArea {
  display: flex;
  justify-content: center;
  padding-top: 16px;
}
</style>
