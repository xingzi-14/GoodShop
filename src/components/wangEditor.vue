<template>
    <div class="wang_editor_com"> 
        <!-- 工具栏 -->
        <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            mode="default"
        />
        <!-- 编辑器 -->
        <Editor
            style="height: 300px; overflow-y: hidden;"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            mode="default"
            @onCreated="handleCreated"
        />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
// 引入响应式函数以及钩子函数
import { onBeforeUnmount, watch, ref, shallowRef } from 'vue';
// 导入插件的组件
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

// 编辑器实例化，使用shallowRef
const editorRef = shallowRef();

// 工具栏组件的默认配置
const toolbarConfig = {};

// 编辑器的默认配置
const editorConfig = { placeholder: '请输入内容...' };

// 接收父组件传递过来的数据
const props = defineProps({
    modelValue: String
});

// 自定义事件
const emits = defineEmits(['update:modelValue']);

// 接收父组件传递过来的商品详情内容
let valueHtml = ref(props.modelValue);

// 监听父组件传递的数据变化
watch(() => props.modelValue, (newVal) => {
    valueHtml.value = newVal;
});

// 监听内部数据变化，同步给父组件
watch(valueHtml, (newVal) => {
    emits('update:modelValue', newVal);
});

// 编辑器创建完成时的回调
const handleCreated = (editor) => {
    editorRef.value = editor;
};

// 组件销毁时，及时销毁编辑器实例
onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
});

</script>

<style scoped lang="less">
.wang_editor_com {
    width: 100%;
    border: 1px solid #ccc;
}
</style>