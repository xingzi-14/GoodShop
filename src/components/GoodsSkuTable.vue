<template>
   <el-form-item label="规格设置"> 
        <table cellpading="0" cellspacing="0">
            <thead>
                <tr>
                    <th v-for="(item,index) in tableTitle" :key="index" :colspan="item.col" :rowspan="item.row">{{ item.name }}</th>
                </tr>
                <tr>
                    <th v-for="(item,index) in isSkuVal" :key="index" width="60">{{ item.name }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in skuTable" :key="item.id">
                    <td v-for="val in  item.skus" :key="val.id" >{{ val.value }}</td>
                    <td>
                        <input type="number" />
                    </td>
                    <td>
                        <input type="number" />
                    </td>                <td>
                        <input type="number" />
                    </td>                <td>
                        <input type="number" />
                    </td>                <td>
                        <input type="number" />
                    </td>                <td>
                        <input type="number" />
                    </td>                <td>
                        <input type="number" />
                    </td>
                </tr>

            </tbody>
        </table >
   </el-form-item>
</template>
<script setup>
import { initTableData } from '../utils/useSku';
const{
isSkuVal,tableTitle,skuTable
}=initTableData()
</script>
<style scoped lang="less">
table {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
  border-collapse: collapse;

  thead tr th {
    border: 1px solid #e4e7ed;
    background: #f5f7fa;
    padding: 8px 4px;
    font-size: 13px;
    font-weight: 600;
    color: #606266;
  }

  tbody tr td {
    border: 1px solid #ebeef5;
    text-align: center;
    padding: 4px;

    input {
      width: 100%;
      height: 28px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding: 0 6px;
      font-size: 13px;
      transition: border-color 0.3s;

      &:focus {
        outline: none;
        border-color: #409eff;
      }
    }
  }

  tbody tr:hover td {
    background: #fafbfc;
  }
}
</style>