<template>
<div class="selectimage">

<!-- 🟡 优化：达到上限时隐藏 + 号 -->
<el-icon
  v-if="!modelValue || (Array.isArray(modelValue) ? modelValue.length < propnum : true)"
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
    <!-- 🟡 优化：空数组时不渲染 article 容器 -->
    <article v-else-if="Array.isArray(modelValue) && modelValue.length > 0">
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
                    <PicListMain ref="picmainRef" :maxSelect="propnum" @selectImgData="SelectImgFn"/>
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
import { ElMessage } from 'element-plus';
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
const SelectImgFn = (val) => {
    avatarUrl = val.map(item => item.url)
    console.log('[SelectImage] 图库选中:', avatarUrl);
}
const submit = () => {
    let imgArr = [];
    
    // 判断当前的操作是多图模式还是单图模式
    if (props.propnum == 1) {
        // 单图：返回所有选项数组的第一位元素
        imgArr = avatarUrl[0];
    } else if (props.propnum > 1) {
        // 多图
        // 数组获取原来已经存在的图片数组，再获取新添加的图片数组
        imgArr = [...props.modelValue, ...avatarUrl];
        console.log(imgArr);
        // 判断是否超过5张图
        if (imgArr.length > props.propnum) {
            return ElMessage.error(`最多上传${props.propnum}张图片`);
        }
    }
    
    // 确认图片数组没有问题后，将结果返回给父组件
    if (imgArr) {
        emits('update:modelValue', imgArr);
    }
    
    isDialog.value = false;
};
/**
 * 删除指定索引位置的图片
 * 
 * @param {number} index - 要删除的图片在数组中的索引位置
 */
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