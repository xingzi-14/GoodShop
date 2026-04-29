import request from '@/utils/request'
// 管理员列表（分页）
export const ManagePage = (page,limit=6,keyword='') => {
    return request({
      url: `admin/manager/${page}`, 
      method: 'GET',
      params:{
        limit,keyword
      }
    })
  }
  
  // 修改管理员状态
  export const ManageStatu = (id, status) => {
    return request({
      url: `admin/manager/${id}/update_status`,
      method: 'POST',
      data: { status } 
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
    