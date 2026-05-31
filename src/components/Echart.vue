<template>
     <div class="echart">
        <el-card>
          <h1 class="t_title">
            订单统计
            <span>
              <el-check-tag v-for="item in TagList" :key="item.value" 
              :checked="currentTag==item.value" @change="editCurrent(item.value)">
                {{ item.title }}
              </el-check-tag>
            </span>
          </h1>
          <div class="t_main" id="t_main" ></div>
        </el-card>
     </div>

  
  </template>
  
  <script setup>

import { reactive,ref,onMounted,onBeforeUnmount } from 'vue';
  import * as echarts from 'echarts'
  import { Echarts } from '../api/home'



let currentTag =ref('week')
const TagList=reactive([
  {title:'月',value:'month'},
  {title:'周',value:'week'},
  {title:'天',value:'hour'},

])
const editCurrent=(val)=>{
  currentTag.value=val;
}
var myChart;
onMounted(()=>{
 let mainDom=document.getElementById('t_main');
 myChart =echarts.init(mainDom)
 MakeEcharts();
})
const MakeEcharts= async()=>{
    let  option = {
  
        title: { text: '订单数据' },
        xAxis: {
          type : "category",
          data: [] // 接口的X轴

        },
        yAxis: {
                type: 'value'
            }, 
        series: [
          {
            name: '数量',
            type: 'bar',
            data:[] ,
            barWidth: '40%', 
   
            itemStyle: {
            shadowBlur: 15,      
            shadowColor: 'rgba(0,0,0,0.3)', 
            shadowOffsetX: 2,
            shadowOffsetY: 4
            }
          }
        ]
      }
      myChart.showLoading();
      let result =await Echarts(currentTag.value)
      if(result.msg!='ok'||!result.data){
        return
      }
      myChart.hideLoading();
      option.xAxis.data=result.data.x;
      option.series[0].data=result.data.y
      myChart.setOption(option)
}
onBeforeUnmount(()=>{
  if(myChart){
    echarts.dispose(myChart)
  }
})
  </script>

<style scoped lang="less">
.echart {
  width: 100%;
  margin-top: 10px;

  .t_title {
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    line-height: 36px;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 10px;
    color: #303133;
  }

  span {
    margin-left: auto;

    .el-check-tag {
      margin-left: 10px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
  }
}

.t_main {
  width: 100%;
  height: 330px;
  margin-top: 10px;
}
</style>