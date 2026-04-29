<template>
    <div class="updatemanager">
      <!-- v-model不允许绑定prop的任何数据，需要通过监听prop来确认绑定的数据结果 -->
      <!-- close-on-click-modal点击遮罩关闭对话框 -->
      <el-dialog v-model="isDialog" :title="propTitle" width="40%" :close-on-click-modal="false" @close="closeChildDiaFn">
        <el-form :model="ModelFormData" ref="RefFormDom" :rules="RuleFormItem" label-width="158px">
          <el-form-item label="管理员用户名" prop="username">
            <el-input v-model="ModelFormData.username" />
          </el-form-item>
  
          <el-form-item label="设置登录密码" prop="password"  v-if="propTitle == '添加管理员'">
            <el-input password show-password v-model="ModelFormData.password" />
          </el-form-item>
  
          <el-form-item label="所属角色" prop="role_id">
            <el-select v-model="ModelFormData.role_id" placeholder="请选择管理员角色" class="select-width" @change="ChangeRoleFn">
              <el-option v-for="item in roleList" :key="item.id" :label="item.name":value=item.id />
            </el-select>
          </el-form-item>
  
          <el-form-item label="上传头像" prop="avatar">
            <SelectImage v-model="ModelFormData.avatar"/>
            <!-- 调用图库管理查询显示的结构 -->
          </el-form-item>
  
          <el-form-item label="账号状态" prop="status" v-show="propTitle == '添加管理员'">
            <el-switch 
              v-model="ModelFormData.status" 
              :active-value="1" 
              :inactive-value="0" 
              active-text="激活" 
              inactive-text="冻结" 
              inline-prompt 
              style="--el-switch-on-color: #13ce66;"
              @change="ChangeStatusFn"
            />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <span class="dialog-footer">
            <el-button type="info">取消</el-button>
            <el-button type="success" @click="AddManageFn">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
<script setup>

import { reactive, ref ,watch,defineEmits} from 'vue';
import { AddManage,EditManage } from '../api/manager';
import { ElMessage } from 'element-plus';
import SelectImage from './SelectImage.vue';
let ModelFormData=reactive({
username:'',
password:'',
role_id:null,
avatar:'',
status:0,
})
const emit = defineEmits(['reload','update:propTitle'])
const RefFormDom=ref(null)
const RuleFormItem=({
    username :[{required :true,message:'用户名不得为空！',trigger:'blur'}],
    password :[{required :true,message:'密码不得为空！',trigger:'blur'}],
    role_id :[{required :true,message:'必须选择管理员角色',trigger:'blur'}],

})
let isDialog=ref(false)
const props=defineProps({
    propTitle :{
        type :String,
        default :'添加管理员'
    },
    roleList:{
        type :Array,
        default :[]
    },
    row:{
        type:Object,
        default:()=>{}
    }
})
watch(()=>props.propTitle,(newval)=>{
    isDialog.value=newval==null ?false :true
});


watch(()=>props.row, (val)=>{
  if(val.id){ // 有id就是编辑
    ModelFormData.id = val.id
    ModelFormData.username = val.username
    ModelFormData.role_id = val.role_id
    ModelFormData.avatar = val.avatar
    ModelFormData.status = val.status
    // ModelFormData.password = val.password
  }
}, {deep:true,immediate:true})
const ChangeStatusFn=(e)=>{
    ModelFormData.status = e;
}
const ChangeRoleFn=(e)=>{
    ModelFormData.role_id = e
}
const AddManageFn =()=>{
    RefFormDom.value.validate(async(vali)=>{
        if(!vali)return
        if(props.propTitle=='添加管理员'){
        let result =await AddManage(ModelFormData)
        console.log(result);
        if(result.msg!='ok'||!result.data){
            return ElMessage.error(result.msg)
        }
     
        ElMessage.success("添加成功")
    }else if(props.propTitle=='编辑管理员'){
        let result =await EditManage(props.row.id,ModelFormData)
        console.log(result);
        if(result.msg!='ok'||!result.data){
            return ElMessage.error(result.msg)
        }
        ElMessage.success("修改成功")
        
    }
      closeChildDiaFn()
    emit('reload')
    })
  
    
}
const closeChildDiaFn = ()=>{
    // 关闭对话框清空表单
    ModelFormData.username = '',
    ModelFormData.password = '',
    ModelFormData.role_id = null,
    ModelFormData.avatar = '',
    ModelFormData.status = 0,
    isDialog.value = false;
    emit('update:propTitle', null)
}
</script>