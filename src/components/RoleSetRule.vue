<template>
    <div class="rolesetrule">
      <el-dialog v-model="isDialog" title="分配角色" width="30%" @close="CloseDialog">
        <el-tree-v2 ref="treeRef" node-key="id" :props="treeProps" 
        :data="roleData" :default-expanded-keys="defaultRoles" show-checkbox :height="360" >
            <template #default="{node,data}">
                    <!-- 左边权限名称 -->
                     <span>
                        <el-tag v-if="data.menu==1">菜单</el-tag>
                        <el-tag type="success" v-if="data.menu==0">权限</el-tag>
                        {{ data.name }}
                     </span>
            </template>
        </el-tree-v2>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="info" plain @click="CloseDialog">取消</el-button>
            <el-button color="#1AA094"  @click="sendRuleOfRole">确定</el-button>
          </span>
        </template>
    </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref ,watch} from 'vue';
  import { getRulesListFn } from '../api/rules';
  import { setRoleFn } from '../api/role';
  import { ElMessage } from 'element-plus';
    let isDialog = ref(false);
    let roleData=ref([]);
    let defaultRoles=ref(1);
    let treeRef=ref(null)

    let treeProps=reactive({
        value :'id',
        label : 'name',
        children :'child',
    })
    let checkedboxList=ref([])
    let role_id=ref(null)
  // 接收父组件传递的数据
  const props = defineProps({
    propID: Object
  })
  
  // 自定义事件传递子组件的数据
  const emits = defineEmits(['update:propID','update'])
  
  watch(() => props.propID, (newVal) => {
    if (newVal && newVal.id) {
        OpenDialog();
    } else {
        CloseDialog();
    }
});

getRulesListFn().then((result)=>{
roleData.value=result.data.list;
defaultRoles.value=roleData.value.map(item=>{
    return item.id
})
}).catch((error)=>{
console.log(error);
})
  // 初始化启动对话框函数
  const OpenDialog = () => {

    isDialog.value = true;
    role_id.value=props.propID.id;
        console.log(role_id);
        console.log(props.propID.id);

    checkedboxList.value=props.propID.rules.map(item=>{
        return item.id
    })
      setTimeout(()=>{
    treeRef.value.setCheckedKeys(checkedboxList.value)
  },100)
  }



const sendRuleOfRole=async()=>{
  console.log(treeRef.value.getCheckedKeys());
 let ids=treeRef.value.getCheckedKeys().join(',');
   let  result =await setRoleFn(role_id.value,ids)
   if(result.msg!='ok'||!result.data)return ElMessage.error(result.msg)
   
   console.log(result);
   ElMessage.success('权限分配成功！')
  CloseDialog()
  emits('update')
}

  // 初始化关闭对话框函数
  const CloseDialog = () => {
    isDialog.value = false;
    checkedboxList.value=[]
    emits('update:propID',null)
  }
  </script>
  
  <style scoped>
  </style>