<template>
  <div class="rolesetrule">
    <el-dialog v-model="isDialog" title="分配权限" width="30%" @close="CloseDialog">
      <el-tree-v2 
        ref="treeRef" 
        node-key="id" 
        :props="treeProps" 
        :data="roleData"
        :default-expanded-keys="defaultRoles"  
        show-checkbox 
        :height="360" 
        :check-strictly="true"
      >
        <template #default="{ node, data }">
          <span>
            <el-tag v-if="data.menu == 1">菜单</el-tag>
            <el-tag type="success" v-if="data.menu == 0">权限</el-tag>
            {{ data.name }}
          </span>
        </template>
      </el-tree-v2>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" plain @click="CloseDialog">取消</el-button>
          <el-button color="#1A4094" @click="handleConfirm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, watch, nextTick } from 'vue';
import { getRulesListFn, setRoleFn } from '@/api/rules.js';
import { ElMessage } from 'element-plus';

let isDialog = ref(false);
let roleData = ref([]);
let defaultRoles = ref([]); 
let treeRef = ref(null);

let treeProps = reactive({
  value: 'id',
  label: 'name',
  children: 'child', 
});

const props = defineProps({
  propID: [Number, String],
  propRole: Object
});

const emits = defineEmits(['update:propID', 'refresh']);

// 加载权限列表 + 默认展开全部一级菜单
getRulesListFn().then(res => {
  roleData.value = res.data.list;
  defaultRoles.value = roleData.value.map(i => i.id);
});

// 监听打开弹窗 → 安全回显权限
watch(() => props.propID, async (newVal) => {
  if (newVal) {
    isDialog.value = true;
    
    await nextTick();
    await nextTick();

    if (treeRef.value && props.propRole?.rules) {
      let ids = props.propRole.rules.map(item => item.id);
      treeRef.value.setCheckedKeys(ids);
    }
  } else {
    isDialog.value = false;
  }
});

// 确定提交保存
const handleConfirm = async () => {
  if (!treeRef.value) return;
  
  let rule_ids = treeRef.value.getCheckedKeys();

  if (!rule_ids.length) {
    ElMessage.warning("请选择权限");
    return;
  }

  let res = await setRoleFn({
    id: props.propID,
    rule_ids: rule_ids
  });

  if (res.msg === "ok") {
    ElMessage.success("权限分配成功！");
    emits("refresh");
    CloseDialog();
  } else {
    ElMessage.error("分配失败");
  }
};

const CloseDialog = () => {
  emits("update:propID", "");
};
</script>