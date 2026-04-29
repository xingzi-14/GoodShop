<template>
    <!-- <el-dialog v-model="isDialogRules":title="propTitle" width="50%" @close="CloseDialog"> -->
        <el-dialog v-model="isDialogRules" :title="propTitle" width="50%" @close="CloseDialog">
            <el-form :model="RulesModelData" label-width="120px">
            <el-form-item label="上级菜单">
            <el-cascader :options="rulesList" :props="props1" v-model="RulesModelData.rule_id" placeholder="请选择上级菜单"/>
            </el-form-item>

            <el-form-item label="菜单/规则">
            <el-radio-group v-model="RulesModelData.menu">
                <el-radio :value="1" size="large" border>菜单</el-radio>
                <el-radio :value="0" size="large" border>规则</el-radio>
            </el-radio-group>
            </el-form-item>

            <el-form-item label="名称">
            <el-input v-model="RulesModelData.name"/>
            </el-form-item>

            <el-form-item label="排序">
            <el-input-number v-model="RulesModelData.order" :min="1" :max="1000" @change="ChangeOrderFn"/>
            </el-form-item>

            <el-form-item label="菜单图标" v-if="RulesModelData.menu == 1">
                <IconSelect v-model="RulesModelData.icon"/>
            </el-form-item>

            <!-- 二级菜单才有跳转地址，一级菜单没有 -->
            <el-form-item label="前端路由" v-if="RulesModelData.menu == 1 && RulesModelData.rule_id > 0">
            <el-input v-model="RulesModelData.frontpath" />
            </el-form-item>

            <el-form-item label="后端规则" v-if="RulesModelData.menu == 0">
            <el-input v-model="RulesModelData.condition" />
            </el-form-item>

            <el-form-item label="请求方式" v-if="RulesModelData.menu == 0">
            <el-select v-model="RulesModelData.method" placeholder="请选择请求方式">
                <el-option v-for="item in methodData" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
            </el-form-item>



            <el-form-item label="状态">
            <el-switch v-model="RulesModelData.status" :active-value="1" :inactive-value="0" inactive-text="禁用" active-text="应用" inline-prompt @change="ChangeStatu"/>
            </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
            <el-button type="info" @click="isDialogRules=false">取消</el-button>
            <el-button type="success" @click="InsertRulesDataFn">确定</el-button>
        </span>
        </template>
    </el-dialog>

    <!-- </el-dialog> -->
</template>
<script setup>
import {ref,watch,reactive} from 'vue'
import { addRulesFn,EditRulesFn } from '../api/rules'
import IconSelect from './IconSelect.vue'
let isDialogRules=ref(false)

const props=defineProps({
    rulesList: Array,
    propTitle :String,
    ruleData:{},
})
const emits=defineEmits(['update:propTitle','submitok'])
// 表单model数据
const RulesModelData = reactive({
  rule_id : 0,       // 上级菜单ID
  menu : 1,          // 类型:1菜单,0权限规则
  name : '',         // 名称
  order : 50,        // 排序
  status : 1,        // 是否启动
  icon : '',         // 图标,菜单必填,权限不用
  frontpath : '',    // 前端路由,菜单且非一级菜单必填
  condition : '',    // 后端规则,权限必填
  method : '',       // 后端接口请求方式,权限必填
})

// 级联选择器配置对象
const props1 = reactive({
  checkStrictly : true,  // 遵守父子节点不相互关联,父子分开两个窗口
  value : 'id',          // 数据中的id属性作为选项值
  label : 'name',        // 数据中的name属性作为文本展示
  children : 'child',    // 数据中的child属性作为二级菜单的值
  emitPath : false,      // 切换节点时,直接返回改节点的值: id/child
})
const methodData = ref([
    { id:1 , name : 'GET' },
    { id:2 , name : 'POST' },
    { id:3 , name : 'PUT' },
    { id:4 , name : 'DELETE' }
])
//监听标题
watch(()=>props.propTitle,(newval)=>{
   if(newval==''||newval==null){
    CloseDialog();
   }else{
    console.log(props.ruleData);
    openDialog();
   }
})
//改变排序
const ChangeOrderFn=(val)=>{
    RulesModelData.order=val;
}
//状态
const ChangeStatu=(val)=>{
    RulesModelData.status=val;
}
const InsertRulesDataFn = async()=>{
switch(props.propTitle){
    case '新增':
        let result=await addRulesFn(RulesModelData)

        if(result.msg!='ok'|| !result.data)return 
        CloseDialog();
        emits('submitok')
    break ;

    case '编辑' :
        let result2=await EditRulesFn(props.ruleData.id,RulesModelData)
        console.log(result2);
        if(result2.msg!='ok'|| !result2.data)return 
        CloseDialog();
        emits('submitok')
    break;
    case '新增下级权限' :
        let result3=await addRulesFn(RulesModelData)

        if(result3.msg!='ok'|| !result3.data)return 
        CloseDialog();
        emits('submitok')
    break;
}
}
const openDialog=()=>{
    const data = props.ruleData || {}
    switch(props.propTitle){
        case '新增' :
      RulesModelData.rule_id  =0;       // 上级菜单ID
      RulesModelData.menu = 1;         // 类型:1菜单,0权限规则
      RulesModelData.name = '';         // 名称
      RulesModelData.order = 50;        // 排序
      RulesModelData.status = 1;        // 是否启动
      RulesModelData.icon = '';         // 图标,菜单必填,权限不用
      RulesModelData.frontpath = '';    // 前端路由,菜单且非一级菜单必填
      RulesModelData.condition = '';    // 后端规则,权限必填
      RulesModelData.method = '';       // 后端接口请求方式,权限必填 
      break;
      case "编辑":
      RulesModelData.rule_id = data.rule_id
      RulesModelData.menu = data.menu
      RulesModelData.name = data.name
      RulesModelData.order = data.order
      RulesModelData.status = data.status
      RulesModelData.icon = data.icon
      RulesModelData.frontpath = data.frontpath
      RulesModelData.condition = data.condition
      RulesModelData.method = data.method
    break;
      case "新增下级权限" :
      RulesModelData.rule_id  =data.id;       // 上级菜单ID
      RulesModelData.menu = 1;         // 类型:1菜单,0权限规则
      RulesModelData.name = '';         // 名称
      RulesModelData.order = 50;        // 排序
      RulesModelData.status = 1;        // 是否启动
      RulesModelData.icon = '';         // 图标,菜单必填,权限不用
      RulesModelData.frontpath = '';    // 前端路由,菜单且非一级菜单必填
      RulesModelData.condition = '';    // 后端规则,权限必填
      RulesModelData.method = '';       // 后端接口请求方式,权限必填 
    }
    isDialogRules.value=true
}
const CloseDialog=()=>{
    isDialogRules.value=false
    emits('update:propTitle','')
}
</script>
