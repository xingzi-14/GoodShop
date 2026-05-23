<template>
    <el-dialog title="设置轮播图" destroy-on-close v-model="isDialog" width="40%"
    @close="CloseDialog">
        <el-alert v-if="loading" type="info" :closable="false">
            <template #title>正在加载轮播图数据...</template>
        </el-alert>
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
const FormModel = reactive({
  bannerList: [],
})
const props = defineProps({
    propID: [Number, String],
})
const emits = defineEmits(['update:propID', 'success'])
watch(() => props.propID, (newval) => {
    newval != 0 ? OpenDialog() : CloseDialog()
})

// 调试：监听子组件 v-model 是否传回数据
watch(() => FormModel.bannerList, (newVal) => {
    console.log(newVal);
    
}, { deep: true })

const OpenDialog = async () => {
    isDialog.value = true;
      
        let res = await getCategoryGoodsFn(props.propID);
        console.log('[GoodBanner] getCategoryGoodsFn 返回:', res);
        if (res.msg !== 'ok' || !res.data) return ElMessage.error(res.msg);
        const banners = res.data.goodsBanner || [];
        console.log('[GoodBanner] goodsBanner 原始数据:', JSON.stringify(banners));
        FormModel.bannerList = banners.map(item => typeof item === 'string' ? item : item.url);  
    
}
const CloseDialog = () => {
    FormModel.bannerList = []
    emits("update:propID", 0)
    isDialog.value = false;
}

const submit = async () => {
   

    let res = await setGoodsBannersFn(props.propID, FormModel);
    if (res.msg !== 'ok') return ElMessage.error(res.msg || '设置失败');
    ElMessage.success('轮播图设置成功');
    emits('success');
    CloseDialog();
}
</script>
