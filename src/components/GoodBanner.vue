<template>
    <el-dialog title="设置轮播图" destroy-on-close v-model="isDialog" width="40%" 
    @close="CloseDialog">
        <el-form :model="FormModel">
            <el-form-item label="轮播图">
                <SelectImage :propnum="5" v-model="FormModel.bannerList"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="CloseDialog">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, watch, reactive } from 'vue';
import SelectImage from './SelectImage.vue';
import { getCategoryGoodsFn, setGoodsBannersFn } from '../api/goods';
import { ElMessage } from 'element-plus';
let isDialog = ref(false);
let ArrData=ref([])
const FormModel = reactive({
  bannerList: [],
})
const props=defineProps({
    propID: [Number, String],
})
const emits=defineEmits(['update:propID', 'success'])
watch(()=>props.propID,(newval)=>{
    newval!=0?OpenDialog():CloseDialog()
})


// 🔴 修复：弹窗在数据加载成功后才打开，增加 loading 状态
const OpenDialog = async () => {
    
    
        let res = await getCategoryGoodsFn(props.propID);
        if (res.msg !== 'ok' || !res.data) return ElMessage.error(res.msg);
        // 兼容两种数据格式：对象数组 [{url:'...'}] 或字符串数组 ['...']
        const banners = res.data.goodsBanner || [];
        ArrData.value=banners
        FormModel.bannerList = banners.map(item => typeof item === 'string' ? item : item.url);
        isDialog.value = true;
    
}
const CloseDialog=()=>{
    FormModel.bannerList=[]
    emits("update:propID", 0)
    isDialog.value=false;
}

const submit = async () => {
    console.log(props.propID, FormModel.bannerList,ArrData.value);
    let res = await setGoodsBannersFn(props.propID,  FormModel);
    console.log(props.propID, FormModel.bannerList,ArrData.value);
    if (res.msg !== 'ok'||!res.data) return ElMessage.error(res.msg || '设置失败');
    ElMessage.success('轮播图设置成功');
    // 接口调用成功后触发 success 事件，通知最外层组件刷新
    emits('success');
    CloseDialog();
}
</script>
