<template>
   <el-from-item label="添加规格">
     <div class="sku_main" v-for="(item,index) in  skuList" :key=index>
        <div class="sku_top">
            <span>
                <el-button size="small" type="primary" @click="DelSku(item.id)">
                    <el-icon><Delete /></el-icon>
                </el-button>
            </span>
            <el-input class="inputStyle" v-model="item.text">
                <template #append>
                    <el-button @click="Editsku(item)"><el-icon><Edit /></el-icon></el-button>
                </template>
            </el-input>
        </div>
        <div class="sku_bottom">
            <GoodsSkuAddTag :skuID="item.id" />
        </div>
        
     </div>
     <el-button color="#1AA094" type="primary" @click="AddTag">添加</el-button>
   </el-from-item>

</template>
<script setup>
import GoodsSkuAddTag from './GoodsSkuAddTag.vue';
import { skuList,initSkuFn} from '../utils/useSku.js';
const{
    AddTag,DelSku,Editsku
}=initSkuFn()
</script>
<style lang="less" scoped>
.sku_main{
    width: 100%;
    height:auto;
    border: 1px solid #dbdbdb;
    margin-bottom: 20px;
        .sku_top{
            width: 100%;
            height: 45px;
            line-height: 45px;
            border-bottom: #dbdbdb 1px solid;
            .span{
              float: right;
              margin-right: 20px;
            }
            :deep(.el-input){
                height: 24px !important;
                font-size: 12px;
            }
        }
        .sku_bottom{
            padding: 10px;
        }
        .inputStyle{
            width: 150px;
            margin-top: 8px;
            margin-left: 10px;
        }
}

</style>