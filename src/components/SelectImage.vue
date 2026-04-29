<template>
<div class="selectimage">
    <el-image 
  :src="modelValue" 
  fit="cover" 
  v-if="modelValue" 
  class="plusicon" 
  @click="isDialog=true"
/>

<el-icon 
  class="plusicon" 
  size="40" 
  @click="isDialog=true"
  v-else  
>
  <Plus/>
</el-icon>
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
const chidFn=ref(null)
const picmainRef=ref(null)
const props=defineProps({
    modelValue:[String,Array]
})
const emits=defineEmits(['update:modelValue'])
const changeCateList=(cate_id)=>{
    picmainRef.value.getCateID(cate_id)
}
const SelectImgFn=(val)=>{
    
    avatarUrl=val.map(item=>item.url)
    console.log(avatarUrl);
}
const submit=()=>{
if(avatarUrl.length){
    emits('update:modelValue',avatarUrl[0])
}
isDialog.value=false
}
</script>
<style scoped lang="less">
.selectimage{
    width: 150px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed black;
    cursor: pointer;
    .plusicon{
        width: 100%;
        height: 100%;
    }
    .imagecard{
        height: 490px;
        padding-top: 20px  !important;
        padding-bottom: 20px !important;
    }
}

</style>