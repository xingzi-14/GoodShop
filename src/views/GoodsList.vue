<template>
    <div class="goodslist">
        <el-card>
            <el-tabs v-model="queryData.tab" @tab-change="getGoodsList">
                <el-tab-pane label="全部" name="all"/>
                <el-tab-pane label="审核中" name="checking"/>
                <el-tab-pane label="出售中" name="saling"/>
                <el-tab-pane label="已下架" name="off"/>
                <el-tab-pane label="库存预警" name="min_stock"/>
                <el-tab-pane label="回收站" name="delete"/>
            </el-tabs>
            <el-row :gutter="30">
                <el-col :span="10">
                    <el-input clearable v-model="queryData.title">
                        <template #prepend>
                            <el-select placeholder="请选择商品分类" style="width: 150px;" v-model="queryData.category_id" clearable>
                                <el-option v-for="item in categoryData" :label="item.name" :value="item.id" :key="item.id"/>
                            </el-select>
                        </template>
                        <template #append>
                            <el-button @click="getGoodsList"><el-icon><Search /></el-icon></el-button>
                        </template>
                    </el-input>
                </el-col>
    
                <el-col :span="10">
                    <el-button size="small" plain type="primary" @click="dia_title='新增商品'">新增商品</el-button>
                    <el-button size="small" plain type="danger" @click="handleBatchDelete">批量删除</el-button>
                    <el-button size="small" plain @click="handleBatchOn">上架</el-button>
                    <el-button size="small" plain @click="handleBatchOff">下架</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%; margin-bottom: 20px; margin-top: 15px; height: 600px;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45" />
                <el-table-column label="商品信息">
                    <template #default="scoped">
                        <div class="goodinfo">
                            <el-avatar :src="scoped.row.cover" shape="square"fit=cover />
                            <h1>{{ scoped.row.title }}</h1>
                            <span>￥{{ scoped.row.min_oprice }}</span>
                            <strong>分类:{{ scoped.row.category!=null? scoped.row.category.name:'无'}}</strong>
                        </div> 
                    </template>
                </el-table-column>
                <el-table-column label="商品状态">
                    <template #default="scoped"> 
                         <div>
                        <el-tag v-show="scoped.row.status==1" type="warning">上架</el-tag>
                        <el-tag v-show="scoped.row.status==0" type="info" >下架</el-tag>
                        </div> 
                    </template>
                </el-table-column>
                <el-table-column label="审核状态">
                    <template #default="scoped"> 
                         <div>
                        <el-tag v-show="scoped.row.ischeck==1" type="success">通过</el-tag>
                        <el-tag v-show="scoped.row.ischeck==0" type="info" >审核中</el-tag>
                        </div> 
                    </template>
                </el-table-column>
                <el-table-column label="商品库存" prop="stock"/>
                <el-table-column label="操作" width="400px">
                    <template #default="scoped"> 
                        <el-button type="primary" size="small" @click="sendRowData(scoped.row)"><el-icon><Edit /></el-icon></el-button>
                        <el-button type="info"size="small" @click="goodID=scoped.row.id">设置轮播图</el-button>
                        <el-button type="info"size="small" @click="infoID=scoped.row.id">设置商品详情</el-button>
                        <el-button type="info"size="small" @click="skuID=scoped.row.id">设置商品规格</el-button>
                    </template>
                </el-table-column>
            </el-table>
                       <!-- 分页 -->
            <div class="pageArea">
                <el-pagination
                
               
               
                :current-page="page"
                :page-size="queryData.limit"
                 :page-sizes="[5, 10, 15, 20]"
                layout="total,sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
               :total="total"
                > 
                
                </el-pagination>
            </div>
        </el-card>
        <UpdateGood v-model:prop-title="dia_title" :propCategory="categoryData" @success="getGoodsList" :editData="RowData"/>
        <GoodBanner ref="goodBannerRef" v-model:propID="goodID" @success="getGoodsList"/>
        <GoodInfo ref="goodinfoRef" v-model:propID="infoID" @success="getGoodsList"/>
        <GoodsSku v-model:propID="skuID" />
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { getGoodsListFn,getGoodsCategoryFn,delGoodsAllFn,setGoodsStatusFn } from '../api/goods';
import { ElMessage,ElMessageBox } from 'element-plus';
import UpdateGood from '../components/UpdateGood.vue';
import GoodBanner from '../components/GoodBanner.vue';
import GoodInfo from '../components/GoodInfo.vue';
import GoodsSku from '../components/GoodsSku.vue';
let tableData = ref([]);
let page=ref(1);
let total=ref(0);
let queryData=reactive({
    tab:'all',
    title:'',
    category_id:null,
    limit:8,
});
let categoryData=ref([]);
let dia_title=ref('');
let RowData=ref({});
let goodID=ref(0)
let infoID=ref(0)   //商品详情id
let goodBannerRef=ref(null)
let goodinfoRef=ref(null)
let skuID=ref(null)
let selectRows=ref([])

// 表格多选变化
const handleSelectionChange = (rows) => {
    selectRows.value = rows
}

// 获取选中行的 id 数组
const getSelectedIds = () => selectRows.value.map(row => row.id)

// 批量删除
const handleBatchDelete = async () => {
    const ids = getSelectedIds()
    if (ids.length === 0) return ElMessage.warning('请先选择商品')
    try {
        await ElMessageBox.confirm(`确定删除选中的 ${ids.length} 件商品？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        const res = await delGoodsAllFn(ids)
        if (res.msg !== 'ok') return ElMessage.error('批量删除失败：' + res.msg)
        ElMessage.success('批量删除成功')
        getGoodsList()
    } catch {
        ElMessage.info('已取消')
    }
}

// 批量上架
const handleBatchOn = async () => {
    const ids = getSelectedIds()
    if (ids.length === 0) return ElMessage.warning('请先选择商品')
    const res = await setGoodsStatusFn({ ids, status: 1 })
    if (res.msg !== 'ok') return ElMessage.error('上架失败：' + res.msg)
    ElMessage.success('批量上架成功')
    getGoodsList()
}

// 批量下架
const handleBatchOff = async () => {
    const ids = getSelectedIds()
    if (ids.length === 0) return ElMessage.warning('请先选择商品')
    const res = await setGoodsStatusFn({ ids, status: 0 })
    if (res.msg !== 'ok') return ElMessage.error('下架失败：' + res.msg)
    ElMessage.success('批量下架成功')
    getGoodsList()
}

const getGoodsList=async()=>{
    let res=await getGoodsListFn(page.value,queryData);
    console.log(res);
    if(res.msg!='ok'||!res.data)return ElMessage.error(res.msg);
    tableData.value=res.data.list;
    total.value=res.data.totalCount;
}
const getGoodsCategory=async()=>{
    let res=await getGoodsCategoryFn();
    console.log(res);
    if(res.msg!='ok'||!res.data)return ElMessage.error(res.msg);
    categoryData.value=res.data.filter(item=>item.status==1);
}
// getGoodsCategory();
const handleSizeChange = (val) => {
    queryData.limit = val; // 更新每页条数
    page.value = 1;        // 切换条数后重置到第一页
    getGoodsList();        // 重新请求数据
}
const handleCurrentChange = (val) => {
    page.value = val;      // 改变当前页
    getGoodsList();        // 获取数据
}
const sendRowData=(row)=>{ 
    dia_title.value='编辑商品'
    RowData.value=row
}
getGoodsList();
</script>
<style scoped lang="less">
.goodslist {
  width: 100%;
  height: 100%;
  padding: 12px;

  .el-card {
    margin-top: 0;
    padding: 16px;

    .goodinfo {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;

      .el-avatar {
        flex-shrink: 0;
      }

      h1 {
        font-size: 14px;
        margin: 0;
        padding: 0;
        font-weight: 500;
        color: #303133;
      }

      span {
        color: #f56c6c;
        font-size: 14px;
        font-weight: 600;
      }

      strong {
        font-size: 12px;
        font-weight: normal;
        color: #909399;
      }
    }
  }
}

.pageArea {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 16px;
}
</style>