<template>
    <div class="piclist">
        <el-card :style="{height:cardHeight+'px'}">
            <el-container style="height: 100%;">
                <el-header class="p_title">
                    <el-button type="primary" size="small" @click="isDialog=true">新增分类</el-button>
                    <el-button type="warning" size="small" @click="uploadDialog = true">上传图片</el-button>
                </el-header>
                <el-container>
                    <PicListAside ref="childFn" @edit="editCateItem" @changeid="changeCateList"/>
                    <PicListMain  ref="picmainRef"/>
                </el-container>                
            </el-container>

        </el-card>
        <el-dialog v-model="isDialog" :title="titleval" width="40%" @close="closeDialog">
            <el-form ref="ruleAddPicDOM" :model="AddPicData" :rules="ruleAddPic">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="AddPicData.name"></el-input>
                </el-form-item>
                <el-form-item label="分类排序" prop="order">
                    <el-input-number v-model="AddPicData.order" @change="handleChangeOrder"></el-input-number>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="info" @click="isDialog=false" @close="closeDialog">取消</el-button>
                    <el-button type="primary" @click="addPicCate" >确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
    <el-dialog v-model="uploadDialog" title="上传图片" width="50%">
      <UploadCom :data="{image_class_id}"   @uploadSuccess="handleUploadSuccess"/>
    </el-dialog>
</template>
<script setup>
import { reactive, ref } from 'vue';
import PicListAside from '../components/PicListAside.vue';
import PicListMain from '../components/PicListMain.vue';
import { addPicsCateList,editPicsList} from '../api/pics';
import UploadCom from'../components/UploadCom.vue';

const windowHeight=window.innerHeight||document.body.clientHeight;
let cardHeight=ref(windowHeight-170)
let isDialog=ref(false);
const childFn=ref(null)
let ruleAddPicDOM=ref(null)
let titleval=ref("新增图库分类")
let edit_id=ref(null)
const picmainRef=ref(null)
const uploadDialog = ref(false)
const image_class_id=ref(0)
let AddPicData=reactive({
    name:'',
    order:10,
})
const ruleAddPic=reactive({
    name:[
        {required :true,message:"请输入图库分类名称",trigger:'blur'}
    ],
    order :[
    {required :true,message:"请输入分类排序",trigger:'blur'}
        
    ]
})
const handleChangeOrder=(val)=>{
    AddPicData.order=val;
}
//添加编辑图库
const addPicCate=()=>{
    ruleAddPicDOM.value.validate(async isVali=>{
        if(!isVali){
            return
        }
        if(titleval.value=="新增图库分类"){
                    
        let result=await addPicsCateList(AddPicData)
        if(result.msg!='ok'|| !result.data){
            return
        }
        }else if(titleval.value=='编辑图库分类'){
            let result=await editPicsList(edit_id.value,AddPicData)
            if (result.msg!='ok'||!result.data){
                return
            }
        }
        childFn.value.getData()
        closeDialog()
    })
}
const changeCateList=(cate_id)=>{
    image_class_id.value=cate_id
  console.log(cate_id);
  if (!picmainRef.value) return;
  picmainRef.value.getCateID(cate_id)
}
const editCateItem=(val)=>{
titleval.value="编辑图库分类"
AddPicData.name=val.name;
AddPicData.order=val.order;
edit_id.value=val.id
isDialog.value=true
}
const closeDialog=()=>{
    titleval.value="新增图库分类"
    AddPicData.name='';
    AddPicData.order=10;
    edit_id.value=null;

    ruleAddPicDOM.value.resetFields();
    isDialog.value=false
}
const handleUploadSuccess = () => {
  // 关闭弹窗
  uploadDialog.value = false;
  
  // 刷新右侧图片
  if (picmainRef.value) {
    picmainRef.value.getPics();
  }
};
</script>
<style scoped lang="less">
.piclist{
    width: 100%;
    height: 100%;
    .el_card{
    margin-top: 20px;
    padding-top: 0px !important;
    
        .p_title{
            border-bottom: 1px solid #dbdbdb;
            display: flex;
            align-items: center;
        }
    :deep(.el_card__body){
        padding-top: 0px !important;
        height: 100%;
    }
    }


}

</style>