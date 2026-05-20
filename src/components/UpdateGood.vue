<template>
    <el-dialog class="updategood" :title="propTitle" v-model="isDialog" width="40%" @close="CloseDialog" top="2vh" style="margin-bottom: 0px;">
        <el-form :model="GoodFormModel" label-width="110px">
            <el-form-item label="商品名称">
                <el-input v-model="GoodFormModel.title" />
            </el-form-item>
            <el-form-item label="商品分类"> 
                <el-select v-model="GoodFormModel.category_id">
                    <el-option v-for="item in propCategory" :label="item.name" :key="item.id" :value="item.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="封面">
                <SelectImage v-model="GoodFormModel.cover" />"
            </el-form-item>
            <el-form-item label="商品单位">
                <el-input v-model="GoodFormModel.unit" />
            </el-form-item>
            <el-form-item label="商品库存">
                <el-input type="number" v-model="GoodFormModel.stock" />
            </el-form-item>
            <el-form-item label="商品预警">
                <el-input type="number" v-model="GoodFormModel.min_stock" />
            </el-form-item>
            <el-form-item label="商品原价格">
                <el-input type="number"  v-model="GoodFormModel.min_oprice" />
                <template #append>元</template>
            </el-form-item>
            <el-form-item label="商品活动价">
                <el-input type="number" v-model="GoodFormModel.min_price" />
                <template #append>元</template>
            </el-form-item>   
            <el-form-item label="商品描述">
                <el-input v-model="GoodFormModel.desc" type="textarea" :row="2"/>
            </el-form-item>         
            <el-form-item label="是否显示库存">
                <!-- 1. 使用 el-radio-group 并绑定 v-model -->
                <el-radio-group v-model="GoodFormModel.stock_display">
                    <el-radio :value="1" border>是</el-radio>
                    <el-radio :value="0" border>否</el-radio>
                </el-radio-group>
            </el-form-item>
            
            <el-form-item label="是否上架">
                <!-- 2. 同样使用 el-radio-group 并绑定 v-model -->
                <el-radio-group v-model="GoodFormModel.status">
                    <el-radio :value="1" border>是</el-radio>
                    <el-radio :value="0" border>否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="CloseDialog">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </template>
    </el-dialog>
</template>
<script setup>
import { reactive, ref,watch} from 'vue';
import SelectImage from './SelectImage.vue'
import { insertGoodsFn ,editGoodsFn} from '../api/goods';
import { ElMessage } from 'element-plus';
 let isDialog=ref(false)
 const GoodFormModel=reactive({
    title:'',
    category_id:null,
    cover:'',
    unit:'件',
    stock:100,
    min_stock:10,
    min_oprice:null,
    min_price:null,
    desc:'',
    stock_display:1,
    status:1,
 })
 const props=defineProps({
    propTitle:String,
    propCategory:Object,
    editData:{},
 })
 const emits=defineEmits(['update:propTitle','success'])
 watch(()=>props.propTitle,(newval)=>{

   newval!=''?OpenDialog():CloseDialog()
 } )
//  watch(()=>props.editData,()=>{
//         GoodFormModel.title=props.editData.title
//         GoodFormModel.category_id=props.editData.category_id
//         GoodFormModel.cover=props.editData.cover
//         GoodFormModel.unit=props.editData.unit
//         GoodFormModel.stock=props.editData.stock
//         GoodFormModel.min_oprice=props.editData.min_oprice
//         GoodFormModel.min_price=props.editData.min_price
//         GoodFormModel.desc=props.editData.desc
//         GoodFormModel.stock_display=props.editData.stock_display
//         GoodFormModel.status=props.editData.status
//  } )

 const OpenDialog=( )=>{ 
    switch(props.propTitle){
      case '新增商品':
        GoodFormModel.title=''
        GoodFormModel.category_id=null
        GoodFormModel.cover=''
        GoodFormModel.unit='件'
        GoodFormModel.stock=100
        GoodFormModel.min_oprice=null
        GoodFormModel.min_price=null
        GoodFormModel.desc=''
        GoodFormModel.stock_display=1
        GoodFormModel.status=1
        break;
      case '编辑商品':
      GoodFormModel.title=props.editData.title
        GoodFormModel.category_id=props.editData.category_id
        GoodFormModel.cover=props.editData.cover
        GoodFormModel.unit=props.editData.unit
        GoodFormModel.stock=props.editData.stock
        GoodFormModel.min_oprice=props.editData.min_oprice
        GoodFormModel.min_price=props.editData.min_price
        GoodFormModel.desc=props.editData.desc
        GoodFormModel.stock_display=props.editData.stock_display
        GoodFormModel.status=props.editData.status
        break;
    }
    isDialog.value=true
 }
 const CloseDialog=( )=>{ 
    isDialog.value=false
    emits('update:propTitle','')
 }
 const submit=async ()=>{ 
    let result=null;
    switch (props.propTitle) {
      case '新增商品':
        result=await insertGoodsFn(GoodFormModel)
        if(result.msg!='ok'||!result.data)return ElMessage.error(result.msg)
        ElMessage.success(result.msg)
        break;
      case '编辑商品':
        console.log(props.editData);
        result=await editGoodsFn(props.editData.id,GoodFormModel)
        if(result.msg!='ok'||!result.data)return ElMessage.error(result.msg)
        ElMessage.success(result.msg)
        break;
    }
    emits('success')
    CloseDialog()
 }
</script>