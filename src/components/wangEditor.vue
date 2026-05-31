<template>
    <div class="wang_editor_com">
        <!-- 工具栏 -->
        <Toolbar
            v-if="editorReady"
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            mode="default"
        />
        <!-- 编辑器 -->
        <Editor
            style="height: 400px; overflow-y: hidden;"
            v-model="valueHtml"
            :defaultConfig="editorConfig"
            mode="default"
            @onCreated="handleCreated"
        />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, watch, ref, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { image } from '@/api/pics';
import { ElMessage } from 'element-plus';

// 编辑器实例化，使用shallowRef
const editorRef = shallowRef();
const editorReady = ref(false);

// 工具栏配置
const toolbarConfig = {
    excludeKeys: [],
    toolbarKeys: [
        'headerSelect',
        '|',
        'bold',
        'italic',
        'underline',
        'through',
        '|',
        'color',
        'bgColor',
        '|',
        'fontSize',
        'fontFamily',
        'lineHeight',
        '|',
        'bulletedList',
        'numberedList',
        'todo',
        '|',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyJustify',
        '|',
        'indent',
        'delIndent',
        '|',
        'insertLink',
        'insertImage',
        'insertVideo',
        'insertTable',
        '|',
        'undo',
        'redo',
        '|',
        'clearStyle',
        'fullScreen'
    ]
};

// 编辑器配置
const editorConfig = {
    placeholder: '请输入商品详情内容...',
    MENU_CONF: {
        uploadImage: {
            async customUpload(file, insertFn) {
                const formData = new FormData();
                formData.append('file', file);
                try {
                    const res = await image(formData);
                    if (res.url) {
                        insertFn(res.url);
                    } else {
                        ElMessage.error('图片上传失败');
                    }
                } catch (e) {
                    ElMessage.error('图片上传失败');
                    console.error(e);
                }
            }
        }
    }
};

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
    editorReady.value = true;
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
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
}
</style>