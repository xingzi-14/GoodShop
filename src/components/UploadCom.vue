<template>
<el-upload 
action="/api/admin/image/upload"
method='post'
:headers='{token}'
:data="data"
:on-success='onSuccessFn'
:on-error='onErrorFn'
drag
name="img"
>
<el-icon class="el-icon--upload"><upload-filled/></el-icon>
<div class="el-upload__text">
    拖拽到此处或者<em>点击此处上传图片</em>
</div>
<template #tip>
    <div class="el-upload__tip">
        所上传的图片文件大小不超过500kb
    </div>
</template>
</el-upload>
</template>
<script setup>

import { reactive, ref } from 'vue';
const token=ref(window.sessionStorage.getItem('token'))
const emit = defineEmits(['uploadSuccess']);
const prop=defineProps({
    data : Object
   
})
console.log(prop.data.image_class_id);
const onSuccessFn=(response,uploadFile,uploadFiles)=>{
    
    console.log(response);
    if (response.msg === 'ok') {
    
    // ✅ 关键：通知父组件刷新图片列表
    emit('uploadSuccess');
  }
}
const onErrorFn=(error,uploadFile,uploadFiles)=>{
    console.log(error);
}
</script>
