<template>
<div class="iconselect">
    <el-select v-model="currentIcon" placehoder="请选择icon图标" @change="ChangeIconFn" filterable>
       <el-option v-for="item in iconsList" :key="item" :labei="item" :value="item">
            <el-icon size="20" v-if="currentIcon">
                <component :is="currentIcon"></component>
            </el-icon>
            {{ item }}
       </el-option>
    </el-select>
</div>


</template>
<script setup>
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {ref} from 'vue';

const iconsList=ref(Object.keys(ElementPlusIconsVue))
let currentIcon=ref('')
defineProps({
    propicon :String
})
const emits =defineEmits(['update:propicon'])
const ChangeIconFn=(val)=>{
    currentIcon.value=val;
    emits('update:propicon',val)
}
</script>
<style scoped lang="less">
.iconselect{
    width: 100%;
    display: flex;
    align-items: center;
    .el-select{
        width: 200px;
        margin-right: 8px;
    }
}
</style>
