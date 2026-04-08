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
  

  
  // 1. 获取图库分类列表（修复分页 params）
  export const getPicsCateList = (params) => {
    return request({
      url: 'admin/getPicsCateList',
      method: 'GET',
      params  // GET 用 params 传 page/limit
    })
  }
  
  // 2. 新增图库分类
  export const addPicsCateList = (data) => {
    return request({
      url: 'admin/addPicsCateList',
      method: 'POST',
      data
    })
  }
  
  // 3. 修改图库分类（修复路径参数 id）
  export const editPicsList = (id, data) => {
    return request({
      url: `admin/editPicName/${id}`,
      method: 'POST',
      data
    })
  }
  
  // 4. 删除图库分类（修复路径）
  export const delPicsCateList = (id) => {
    return request({
      url: `admin/delPicsCateList/${id}/delete`,
      method: 'POST',
      data: { id }
    })
  }
  
  // 5. 根据分类ID获取图片列表（修复路径）
  export const getPicList = (id, params) => {
    return request({
      url: `admin/getPicList/${id}/image`,
      method: 'GET',
      params
    })
  }
  
  // 6. 图片重命名（修复路径）
  export const editPicName = (id, data) => {
    return request({
      url: `admin/editPicName/${id}`,
      method: 'POST',
      data
    })
  }
  
  // 7. 删除图片
  export const delPic = (data) => {
    return request({
      url: 'admin/delete_all',
      method: 'POST',
      data
    })
  }
  
  // 8. 上传图片
  export const image = (data) => {
    return request({
      url: 'admin/image/upload',
      method: 'POST',
      data
    })
  }