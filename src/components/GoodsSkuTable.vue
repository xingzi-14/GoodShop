<template>
   <el-form-item label="规格设置"> 
        <table cellpading="0" cellspacing="0">
            <thead>
                <tr>
                    <th colspan="2">商品规格</th>
                    <th rowspan="2">市场价</th>
                    <th rowspan="2">销售价</th>
                    <th rowspan="2">成本价</th>
                    <th rowspan="2">库存</th>
                    <th rowspan="2">商品体积</th>
                    <th rowspan="2">商品重量</th>
                    <th rowspan="2">编码</th>
                </tr>
                <tr>
                    <th width="80">尺寸</th>
                    <th width="80">颜色</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>L</td>
                    <td>绿色</td>
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