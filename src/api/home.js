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
  
// 管理员列表（分页）
export const ManagePage = (page) => {
  return request({
    url: `admin/manager/${page}`, 
    method: 'GET'
  })
}

// 修改管理员状态
export const ManageStatu = (id, data) => {
  return request({
    url: `admin/manager/${id}/update_status`,
    method: 'POST',
    data
  })
}

// 新增管理员
export const AddManage = (data) => {
  return request({
    url: 'admin/manager',
    method: 'POST',
    data
  })
}

// 删除管理员
export const DeleteManage = (id) => {
  return request({
    url: `admin/manager/${id}/delete`,
    method: 'POST'
  })
}

// 编辑管理员信息
export const EditManage = (id, data) => {
  return request({
    url: `admin/manager/${id}`,
    method: 'POST',
    data
  })
}
  