<template>
  <div class="manager-manage">
    <!-- 搜索栏 -->
    <div class="search-group">
      <div class="search-bar">
        <!-- 会员等级下拉选择 -->
        <el-select
          v-model="levelFilter"
          placeholder="请选择会员等级"
          clearable
          style="width: 200px; height: 32px"
        >
          <el-option
            v-for="item in data.user_level"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>

        <!-- 关键词输入框 -->
        <el-input
          v-model="keyword"
          placeholder="请输入关键词"
          clearable
          style="width: 200px; height: 32px"
        />

        <!-- 搜索按钮 -->
        <el-button type="primary" icon="Search" @click="handleSearch"></el-button>
      </div>

    </div>
      <el-button type="success" @click="openDialog(null)">添加管理员</el-button>
    <div class="table-wrapper">
      <el-table :data="showList" style="width: 100%;">
        <el-table-column label="用户" align="center">
          <template #default="scope">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 6px;">
              <el-avatar :src="scope.row.avatar" style="width: 40px; height: 40px" />
              <span>{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="会员等级" align="center">
          <template #default="scope">{{ scope.row.user_level?.name }}</template>
        </el-table-column>

        <el-table-column label="注册时间" prop="create_time" align="center"></el-table-column>

        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" />
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openDialog(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="page"
      layout="total, prev, pager, next, jumper"
      :total="data.totalCount || 0"
      style="margin-top: 20px; text-align: right"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>

  <el-dialog v-model="isDialog"  width="50%" @close="closeDialog" :title="editId ? '编辑管理员' : '添加管理员'">
    <el-form ref="ruleAddUserDOM" :model="AddUserData" :rules="ruleAddUser" label-width="100px">
        
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
            <el-input v-model="AddUserData.username" :disabled="!!editId"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
            <el-input v-model="AddUserData.password" type="password" ></el-input>
        </el-form-item>

        <!-- 会员等级 -->
        <el-form-item label="会员等级" prop="user_level_id">
            <el-select v-model="AddUserData.user_level_id" placeholder="请选择" clearable style="width: 100%;">
                <el-option
                v-for="item in data.user_level"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
            </el-select>
        </el-form-item>

        <!-- 昵称 -->
        <el-form-item label="昵称" prop="nickname">
            <el-input v-model="AddUserData.nickname"></el-input>
        </el-form-item>

        <!-- 电话 -->
        <el-form-item label="电话" prop="phone">
            <el-input v-model="AddUserData.phone"></el-input>
        </el-form-item>

        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="AddUserData.email"></el-input>
        </el-form-item>

        <!-- 头像 URL -->
        <el-form-item label="头像" prop="avatar">
          <SelectImage v-model="AddUserData.avatar" />
    
        </el-form-item>

        <!-- 启用状态 -->
        <el-form-item label="启用状态" prop="status">
            <el-switch v-model="AddUserData.status" :active-value="1" :inactive-value="0"
                       active-text="启用" inactive-text="禁用"></el-switch>
        </el-form-item>

    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button type="info" @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { UserPage, AddUser, EditUser, DeleteUser } from '../api/user';
import { ref, onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import SelectImage from '../components/SelectImage.vue';

const isDialog = ref(false);
const editId = ref(null); // 编辑ID，有值就是编辑模式

const data = ref({ list: [], user_level: [], totalCount: 0 })
const page = ref(1)
const levelFilter = ref('')
const keyword = ref('')
const ruleAddUserDOM = ref(null)
const showList = ref([])

// 获取列表
const getData = async () => {
  try {
    const res = await UserPage(page.value)
    data.value = res.data
    showList.value = data.value.list
  } catch (err) {
    console.log('请求失败', err)
  }
}

// 分页
const handleCurrentChange = (val) => {
  page.value = val
  getData()
}

// 搜索
const handleSearch = () => {
  let arr = [...data.value.list]
  if (levelFilter.value) {
    arr = arr.filter(item => item.user_level_id === levelFilter.value)
  }
  if (keyword.value) {
    arr = arr.filter(item => item.username.includes(keyword.value))
  }
  showList.value = arr
}

// 表单数据
const AddUserData = reactive({
  username: '',
  password: '',
  user_level_id: '',
  nickname: '',
  phone: '',
  email: '',
  avatar: '',
  status: 1
});

// 校验规则
const ruleAddUser = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: 'blur' }],
  password: [{ required: false, message: "请输入密码", trigger: 'blur' }],
  user_level_id: [{ required: true, message: "请选择会员等级", trigger: 'change' }],
  phone: [{ required: true, message: "请输入电话", trigger: 'blur' }],
});

// 打开弹窗：添加/编辑共用
const openDialog = (row) => {
  if (row) {
    // 编辑回显
    editId.value = row.id;
    Object.assign(AddUserData, {
      ...row,
      password: ''
    })
  } else {
    // 添加
    editId.value = null;
    closeDialog();
  }
  isDialog.value = true;
}

// 关闭重置
const closeDialog = () => {
  isDialog.value = false;
  ruleAddUserDOM.value?.resetFields();
  Object.assign(AddUserData, {
    username: '', password: '', user_level_id: '', nickname: '',
    phone: '', email: '', avatar: '', status: 1
  });
};

// 统一提交：新增/编辑
const submitForm = async () => {
  try {
    await ruleAddUserDOM.value.validate()
  } catch (e) {
    return
  }

  const postData = {
    username: AddUserData.username,
    password: AddUserData.password,
    user_level_id: AddUserData.user_level_id,
    nickname: AddUserData.nickname,
    phone: AddUserData.phone,
    email: AddUserData.email,
    avatar: AddUserData.avatar,
    status: AddUserData.status + '',
  }

  // 编辑时密码为空就删掉
  if (editId.value && !postData.password) {
    delete postData.password
  }

  try {
    let result;
    if (editId.value) {
      result = await EditUser(editId.value, postData)
    } else {
      result = await AddUser(postData)
    }

    if (result.msg !== 'ok') {
      console.error('提交失败', result)
      return
    }

    ElMessage.success(editId.value ? '编辑成功' : '添加成功')
    getData()
    closeDialog()
  } catch (err) {
    ElMessage.error('操作失败')
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      '此操作将永久删除该用户, 是否继续?',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await DeleteUser(row.id)
    if (res.msg === 'ok') {
      ElMessage.success('删除成功')
      getData()
    } else {
      ElMessage.error('删除失败')
    }
  } catch {
    ElMessage.info('已取消删除')
  }
}

onMounted(() => {
  getData()
})
</script>

<style scoped>
.search-group {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 15px;
  margin-top: 15px;
}

.table-wrapper {
  height: 650px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>