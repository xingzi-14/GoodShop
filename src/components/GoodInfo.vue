<template>
    <div class="goodinfo"> 
        <el-dialog v-model="isDiglog" title="设置商品详情" width="50%" destroy-on-close @close="CloseDialog">
            <el-form :model="FormModel">
                <el-form-item label="商品详情"> 
                    <wangEditor v-model="FormModel.content"></wangEditor>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button plain @click="CloseDialog">取消</el-button>
                <el-button type="primary" @click="submitFn">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref,watch } from 'vue';
import { getCategoryGoodsFn,setGoodsContenTFn } from '../api/goods';
import { ElMessage } from 'element-plus';
import wangEditor from './wangEditor.vue';
let isDiglog = ref(false);
const props=defineProps({
    propID:Number
})
const FormModel={
    content:''
}
const emits=defineEmits(['update:propID'])
watch(()=>props.propID,async(val)=>{
    val!=0?OpenDialog():CloseDialog()
})
const OpenDialog = async() => {
    let res=await getCategoryGoodsFn(props.propID)
    if(res.msg!='ok'||!res.data)return ElMessage.error(res.msg)
    FormModel.content=res.data.content
    isDiglog.value=true;
}
const CloseDialog=()=>{
    isDiglog.value=false;
    emits('update:propID',0);
}
const submitFn=async()=>{
    let res=await setGoodsContenTFn(props.propID,FormModel)
    if(res.msg!='ok')return ElMessage.error(res.msg)
    ElMessage.success(res.msg)
    CloseDialog()
}
</script>
