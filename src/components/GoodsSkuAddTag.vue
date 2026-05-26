<template>
    <div class="goodsskuaddtag">
        <el-tag closable :disable-transitions="false" v-for="(tag,index) in tagList.goodsSkusCardValue" :key="index" @close="deleteTag(tag)">
            <el-input class="inputStyle" v-model="tag.text" @change="editTag($event,tag)"></el-input>
        </el-tag> 
        <el-input v-if="inputVisable" class="inputStyle" size="small" v-model="inputVal" ref="inputRef" @blur="InputBlur()" @keyup.enter="InputBlur()"></el-input>
        <el-button v-else size="small" @click="showInput">+New Tag</el-button>
    </div>
</template>
<script setup>
import { initSkuItemVal } from '../utils/useSku';
const props = defineProps({
    skuID:[Number,String],
})
const {
    tagList,inputVisable,inputVal,inputRef,InputBlur,deleteTag,editTag,showInput
    }=initSkuItemVal(props.skuID);
</script>
<style lang="less" scoped>
.el-tag{
    margin-right: 6px;
}
:deep(.el-input){
    height: 24px !important;
    font-size: 13px;
}
.inputStyle{
    width: 70px;
}
</style>
       