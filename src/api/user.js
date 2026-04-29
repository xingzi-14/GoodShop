import request from '@/utils/request'

// 用户列表（分页）
export const UserPage = (page) => {
    return request({
      url: `admin/user/${page}`,
      method: 'GET'
    })
  }
  
  // 修改 用户状态
  export const UserStatu = (id, data) => {
    return request({
      url: `admin/user/${id}/update_status`,
      method: 'POST',
      data
    })
  }
  
  // 新增 用户
  export const AddUser = (data) => {
    return request({
      url: 'admin/user',
      method: 'POST',
      data
    })
  }
  
  // 删除 用户
  export const DeleteUser = (id) => {
    return request({
      url: `admin/user/${id}/delete`,
      method: 'POST'
    })
  }
  
  // 编辑 用户信息
  export const EditUser = (id, data) => {
    return request({
      url: `admin/user/${id}`,
      method: 'POST',
      data
    })
  }
  //搜索用户
  export const SelectUser = ( data) => {
    return request({
      url: 'admin/user/register',
      method: 'POST',
      data
    })
  } 