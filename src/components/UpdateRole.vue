<template>
    <div class="updaterole">
      <el-dialog v-model="isDialog" :title="propTitle" width="40%" @close="CloseDialog">
        <el-form :model="formDataModel" ref="formDom" :rules="formRules" label-width="80px" status-icon>
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="formDataModel.name" />
          </el-form-item>
          <el-form-item label="角色描述" prop="desc">
            <el-input v-model="formDataModel.desc" type="textarea" :row="2"/>
          </el-form-item>
          <el-form-item>
            <el-switch v-model="formDataModel.status" inline-prompt active-text="使用"
                        inactive-text="禁用" :active-value="1" :inactive-value="0"
                        style="--el-switch-on-color:#13ce66;--el-switch-off-color:ff4949"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="info" plain @click="CloseDialog">取消</el-button>
            <el-button color="#1AA094"  @click="InsertAndUpdateRoleFn">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>

import{ ref,watch,reactive} from 'vue';
import { InsertRoleFn ,EditRoleFn} from '../api/role';
import { ElMessage } from 'element-plus';
  let isDialog=ref(false)
  let formDataModel=reactive({
    name:'',
    desc:'',
    status:1,

  })
  let formDom=ref('');
  let formRules = reactive({
  name: [{ required: true, message: '角色名称不为空', trigger: 'blur' }],
  desc: [{ required: true, message: '角色描述不为空', trigger: 'blur' }],
})
  const props=defineProps({
    propTitle:String,
    editRow:Object
  })
  const emits=defineEmits(['update:propTitle','update'])
  watch(() => props.editRow, (val) => {
  if (props.propTitle === '编辑角色' && val) {
    formDataModel.name = val.name
    formDataModel.desc = val.desc
    formDataModel.status = val.status
  }
})
  watch(()=>props.propTitle,(newval)=>{
    if(newval=='新增角色'||newval=='编辑角色'){
      OpenDialog()
    }else{
      CloseDialog()
    }
  })
  
  const OpenDialog=()=>{
    isDialog.value=true
  }
  
  const CloseDialog=()=>{
    emits('update:propTitle',null)
    formDataModel.name='';
    formDataModel.desc='';
    formDataModel.status=1
    isDialog.value=false
  }
  const InsertAndUpdateRoleFn=()=>{
    formDom.value.validate(async(isVali)=>{
      if(!isVali)return
        switch(props.propTitle){
        case '新增角色':
          let result=await InsertRoleFn(formDataModel)
          if(result.msg!='ok'||!result.data)return ElMessage.error(result.msg)
          console.log(result);
          
        break;

        case '编辑角色':
          let editRole=await EditRoleFn(props.editRow.id,formDataModel)
          if(editRole.msg!='ok'||!editRole.data)return ElMessage.error(editRole.msg)
          console.log(editRole);
        break;
      }
      CloseDialog();
      emits('update')
    })
  }
  </script>
  
  <style scoped>
  
  </style>