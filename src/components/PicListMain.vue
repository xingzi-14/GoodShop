<template>
    <div class="main">  
          <el-main>
                <div class="piclistmain">
            <el-row :gutter="20">
                <el-col :span=6 v-for="item in data.piclist" :key="item.id">
                    <el-card shadow="hover">
                        <el-image fit="cover" :src="item.url" :preview-src-list="[item.url]" :initial-index="0" />
                        <p>{{ item.name }}</p>
                        <div class="pic_edit" v-if="$route.path=='/admin/image/list'">
                            <span @click="openDiaChangePicName(item)">{{item.name }}</span>
                            <span @click="delPicFn(item)">删除 </span>
                        </div>
                        <div class="pic_edit" v-else>
                            <el-checkbox v-model="item.checked" @change="selectImgFn(item)"/>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div class="page"> 
        <el-pagination
          v-model:current-page="queryData.page"
          layout="total, prev, pager, next,jumper"
          :total="data.total"
          @current-change="handleCurrentChange"
        /></div>
        </el-main>
    
     <el-dialog v-model="data.isDialog" title="图片重命名" width='30%' @close="cancelDia">
    <el-form :model="formPicName">
        <el-form-item label="图片ID">
            <el-input  v-model="formPicName.id" :readonly="true"/>
        </el-form-item>
        <el-form-item >
            <el-input placeholder="请输入图片名称" v-model="formPicName.name"/>
        </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
            <el-button type="info" @click="cancelDia">取消</el-button>
            <el-button type="primary" @click="editPicNameFn">确认</el-button>
        </span>
    </template>
     </el-dialog>
    </div>
    
    </template>
    
    <script setup>
    import { computed, reactive } from 'vue';
    import { editPicName, getPicList, delPic } from '../api/pics';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import { useRoute } from 'vue-router';
    
    const queryData = reactive({
        id: 0,
        page: 1,
        limit: 8
    })
    
    const data = reactive({
        piclist: [],
        total: 0,
        isDialog: false,
    })
    
    const formPicName = reactive({
        id: 0,
        name: ''
    })
    
    const route = useRoute();
    const emits = defineEmits(['selectImgData'])
    const props = defineProps({
        maxSelect: {
            type: Number,
            default: 1
        }
    })
    
    // 分页
    const handleCurrentChange = (p) => {
        queryData.page = p;
        getPics();
    }
    
    // 取消重命名
    const cancelDia = () => {
        formPicName.id = 0;
        formPicName.name = '';
        data.isDialog = false;
    }
    
    // 分类切换
    const getCateID = (cate_id) => {
        queryData.id = cate_id
        queryData.page = 1
        getPics();
    }
    
    // 打开重命名
    const openDiaChangePicName = (val) => {
        data.isDialog = true;
        formPicName.id = val.id
        formPicName.name = val.name;
    }
    
    // 提交修改名称
    const editPicNameFn = async () => {
        let result = await editPicName(formPicName.id, formPicName.name)
        if (result.msg != 'ok') return ElMessage.error(result.msg)
        ElMessage.success('修改成功')
        getPics();
        cancelDia();
    }
    
    // 删除图片
    const delPicFn = async (val) => {
        try {
            await ElMessageBox.confirm(
                '此操作将永久删除该图片, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            )
            const result = await delPic([val.id])
            if (result.msg === 'ok') {
                ElMessage.success('删除成功')
                getPics()
            } else {
                ElMessage.error('删除失败')
            }
        } catch (e) {
            ElMessage.info('已取消删除')
        }
    }
    
    // ✅【修复完成】获取图片列表
    const getPics = async () => {
        let result = await getPicList(queryData.id, queryData.page, queryData.limit);
        console.log(queryData);
        // ✅修复判断
        if (result.msg !== 'ok' || !result.data) return
    
        // // ✅ 修复 switch 判断（不再覆盖）
        // switch (route.path) {
        //     case '/admin/manager/list':
        //         data.piclist = result.data.list.map(item => {
        //             item.checked = false
        //             return item
        //         })
        //         break;
        //     case '/admin/image/list':
        //         data.piclist = result.data.list
        //         break;
        //     default:
        //         data.piclist = result.data.list
        // }
    
         if(route.path=='/admin/image/list'){
            data.piclist = result.data.list
         }else{
            data.piclist = result.data.list.map(item=>{
                item.checked = false
                return item
            })
        }
        data.total = result.data.totalCount;
    }

    
    // 计算属性选中的图片
    const checkedIMG = computed(() => {
        return data.piclist.filter(item => item.checked)
    })
    
    // 选择图片（上限由 maxSelect prop 控制）
    const selectImgFn = (val) => {
        if (val.checked && checkedIMG.value.length > props.maxSelect) {
            val.checked = false;
            return ElMessage.warning(`最多只能选择 ${props.maxSelect} 张图片`)
        }
        emits('selectImgData', checkedIMG.value)
    }
    
    // 暴露给父组件
    defineExpose({
        getCateID,
        getPics
    })
    
 
    </script>
    
    <style scoped lang="less">
.main {
  height: 100%;
  width: 100%;
}

.el-main {
  height: 100%;
  position: relative;

  .piclistmain {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 50px;
    right: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 15px;
    box-sizing: border-box;

    .el-card {
      margin-bottom: 15px;
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12) !important;
      }

      :deep(.el-card__body) {
        padding: 0 !important;
      }

      .el-image {
        height: 150px;
        width: 100%;
      }

      p {
        text-align: center;
        width: 100%;
        height: 30px;
        line-height: 30px;
        background-color: rgba(0, 0, 0, 0.65);
        color: #fff;
        position: absolute;
        bottom: 30px;
        left: 0;
        overflow: hidden;
        font-size: 13px;
      }

      .pic_edit {
        text-align: center;
        height: 30px;
        line-height: 30px;
        padding-bottom: 5px;
        background: #fafbfc;

        span {
          padding: 0 12px;
          color: #409eff;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;

          &:hover {
            color: #66b1ff;
          }
        }
      }
    }
  }

  .page {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>