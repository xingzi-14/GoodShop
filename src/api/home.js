import request from '@/utils/request'
 // 订单统计
 export const orderState = () => {
    return request({
      url: 'admin/orderState',
      method: 'GET'
    })
  }
  
  // 图表数据
  export const Echarts = (type) => {
    return request({
      url: 'admin/echartsData',
      method: 'GET',
      params : {
        type
      }
    })
  }
  
  // 店铺数据
  export const GoodsState = () => {
    return request({
      url: 'admin/goodsState',
      method: 'GET'
    })
  }
  
