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
                    <el-button size="small" plain type="danger">批量删除</el-button>
                    <el-button size="small" plain >上架</el-button>
                    <el-button size="small" plain >下架</el-button>
                </el-col>
            </el-row>
            <el-table :data="tableData" style="width: 100%; margin-bottom: 20px; margin-top: 15px; height: 600px;" >
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
                        <el-button type="info"size="small">设置商品详情</el-button>
                        <el-button type="info"size="small">设置商品规格</el-button>
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
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { getGoodsListFn,getGoodsCategoryFn } from '../api/goods';
import { ElMessage } from 'element-plus';
import UpdateGood from '../components/UpdateGood.vue';
import GoodBanner from '../components/GoodBanner.vue';
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
let goodBannerRef=ref(null)
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
getGoodsCategory();
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
.goodslist{
    width: 100%;
    height: 100%;
    .el-card{
        margin-top: 20px;
        .goodinfo{
            width: 100%;
            .el-avatar{
                margin-right: 10px;
                float: left;
            }
            h1{
                font-size: 14px;
                margin: 0;
                padding: 0;
            }
            span{
                color: red;
                display:block;
                font-size: 12px;
            }
            strong{
                font-size: 12px;
                font-weight: normal;
            }
        }
    }
}
.pageArea{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>