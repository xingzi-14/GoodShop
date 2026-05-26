<template>
    <el-dialog v-model="isDialog" title="设置商品规格" width="60%" @close="CloseDialog">
        <el-form :model="SkuFormModel" label-width="120px">
            <el-form-item label="规格类型">
                <el-radio-group v-model="SkuFormModel.sku_type">
                    <el-radio :value="0">单规格</el-radio>
                    <el-radio :value="1">多规格</el-radio>
                </el-radio-group>
            </el-form-item>
            <template v-if="SkuFormModel.sku_type==0"> 
                <el-form-item label="市场价">
                    <el-input-number v-model="SkuFormModel.sku_value.oprice" :min="1" :precision="2" :step="0.01" controls-position="right" style="width: 80%;">
                        <template #suffix>元</template>
                    </el-input-number>
                    </el-form-item>

                    <el-form-item label="销售价">
                    <el-input-number v-model="SkuFormModel.sku_value.pprice" :min="1" :precision="2" :step="0.01" controls-position="right" style="width: 80%;">
                        <template #suffix>元</template>
                    </el-input-number>
                    </el-form-item>

                    <el-form-item label="成本价">
                    <el-input-number v-model="SkuFormModel.sku_value.cprice" :min="1" :precision="2" :step="0.01" controls-position="right" style="width: 80%;">
                        <template #suffix>元</template>
                    </el-input-number>
                    </el-form-item>

                    <el-form-item label="重量">
                    <el-input-number v-model="SkuFormModel.sku_value.weight" :precision="1" :step="0.1" controls-position="right" style="width: 80%;">
                        <template #append>公斤</template>
                    </el-input-number>
                    </el-form-item>

                    <el-form-item label="商品体积">
                    <el-input-number v-model="SkuFormModel.sku_value.volume" :precision="1" :step="0.1" controls-position="right" style="width: 80%;">
                        <template #suffix>立方米</template>
                    </el-input-number>
                    </el-form-item>
            </template>
            <template v-else-if="SkuFormModel.sku_type==1">
                <GoodsSkuAdd />
                <GoodsSkuTable /> 
            </template>

        </el-form>
            <template #footer>
                <el-button @click="CloseDialog">取消</el-button>
                <el-button type="primary" @click="editskusdataFn">保存</el-button>
            </template>
    </el-dialog>
</template>
<script setup>
import {reactive, ref, watch } from 'vue';
import { getCategoryGoodsFn,editGoodsSkuFn } from '../api/goods';
import { ElMessage } from 'element-plus';
import GoodsSkuAdd from './GoodsSkuAdd.vue';
import GoodsSkuTable from './GoodsSkuTable.vue';
import { goodID, initSkuListFn } from '../utils/useSku.js';
let isDialog = ref(false);
const SkuFormModel = reactive({
    sku_type: 0,
    sku_value: {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,  // 修正拼写：weigth -> weight
        volume: 0
    }
});
const props = defineProps({
    propID:Number,
});
const emits=defineEmits(['update:propID'])
watch(()=>props.propID,(newval)=>{
    newval!=0?openDialog():CloseDialog()
})
const openDialog = async() => {
    goodID.value = props.propID;
    let result = await getCategoryGoodsFn(props.propID);
    console.log(result);

    if (result.msg != 'ok' || !result.data) return ElMessage.error(result.msg);

    // 向表单赋值，确保类型一致（转换为数字）
    SkuFormModel.sku_type = Number(result.data.sku_type) ?? 0;
    
    // 单规格数据赋值
    if (result.data.sku_value) {
        SkuFormModel.sku_value = {
            oprice: result.data.sku_value.oprice ?? 0,
            pprice: result.data.sku_value.pprice ?? 0,
            cprice: result.data.sku_value.cprice ?? 0,
            weight: result.data.sku_value.weight ?? 0,  // 使用正确的字段名
            volume: result.data.sku_value.volume ?? 0
        };
    } else {
        // 使用默认值
        SkuFormModel.sku_value = {
            oprice: 0,
            pprice: 0,
            cprice: 0,
            weight: 0,
            volume: 0
        };
    }
    
    // 初始化多规格列表数据
    initSkuListFn(result.data);
    isDialog.value = true;
};
const CloseDialog = () => {
    isDialog.value = false;
    emits('update:propID', 0);
};
const editskusdataFn=async()=>{
    let result = await editGoodsSkuFn(props.propID, SkuFormModel);
    if (result.msg != 'ok') return ElMessage.error(result.msg);
    ElMessage.success('保存成功');
    CloseDialog();
}
</script>