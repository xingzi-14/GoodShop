<template>
<div class="selectimage">

<el-icon 
  class="addbut" 
  size="40" 
  @click="isDialog=true" 
>
  <Plus/>
</el-icon>
<main v-if="modelValue">
    <el-image 
        :src="modelValue" 
        fit="cover" 
        v-if="typeof modelValue=='string'" 
        class="plusicon" 
        @click="isDialog=true"
    />
    <article v-else>
        <div class="pic_container" v-for="(item,index) in modelValue" :key=index>
            <span @click="removeImage(index)">x</span>
            <el-image class="plusicon" :src="item" fit="cover" />
        </div>
    </article>
</main>



    <el-dialog title="选择图库" width="80%" top="2vh" v-model="isDialog">
        <el-card class="imagecard">
            <el-container style="height: 100%;">
                <el-container>
                    <PicListAisde ref="chidFn" @changeid="changeCateList"/>
                    <PicListMain ref="picmainRef"@selectImgData="SelectImgFn"/>
                </el-container>                
            </el-container>
        </el-card>
        <template #footer>
            <span class="dislog-footer">
                <el-button type="info" plain @click="isDialog=false">取消</el-button>
                <el-button type="primary" plain @click="submit
                ">确认</el-button>
            </span>
        </template>
    </el-dialog>
</div>    
</template>
<script setup>
import { ref } from 'vue';
import PicListAisde from './PicListAside.vue'
import PicListMain from './PicListMain.vue'


let isDialog=ref(false)
let avatarUrl=[]

const picmainRef=ref(null)
const props=defineProps({
    modelValue:[String,Array],
    propnum:{
        type:Number,
        default:1
    }
})
const emits=defineEmits(['update:modelValue'])
const changeCateList=(cate_id)=>{
    picmainRef.value.getCateID(cate_id)
}
const SelectImgFn=(val)=>{
    
    avatarUrl=val.map(item=>item.url)
    console.log(avatarUrl);
}
const submit = () => {
    // 修复：GoodBanner 期望接收数组数据，此处应返回完整的 avatarUrl 数组而非单个元素
    // 同时移除长度判断，以便在用户取消所有选择时能正确传递空数组
    emits('update:modelValue', avatarUrl);
    isDialog.value = false;
};
const removeImage = (index) => {
    // 修复直接修改 prop 导致的 Vue 警告，改为通过 emit 更新 v-model
    if (Array.isArray(props.modelValue)) {
        emits('update:modelValue', props.modelValue.filter((_, i) => i !== index));
    }
}

</script>

<style scoped lang="less">
.selectimage{
    .addbut{
    width: 150px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed black;
    cursor: pointer; 
    }
    article{
        width: 90%;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
    }
    .pic_container{
        width: 150px;
        height: 100px;
        position: relative;
    }
    .plusicon{
        width: 100%;
        height: 100%;
    }
    span{
        z-index: 100;
        position: absolute;
        right: 10px;
        top:10px;
        padding: 6px;
        border-radius: 50%;
        border: 2px solid white;
        color: greenyellow;
        background-color: rgba(0, 0, 0,0);
        font-weight: 800;
    }
    .imagecard{
        height: 490px;
        padding-top: 20px  !important;
        padding-bottom: 20px !important;
    }
}
</style>