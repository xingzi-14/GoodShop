import request from '@/utils/request'
export const LoginFn = (data) => {
    return request({
      url: 'admin/login',
      method: 'POST',
      data
    })
  }
  
  // 获取用户信息
  export const getUserInfoFn = () => {
    return request({
      url: 'admin/getUserInfo',
      method: 'POST'
    })
  }
  
  // 修改密码
  export const editUserPwd = (data) => {
    return request({
      url: 'admin/editPassword',
      method: 'POST',
      data
    })
  }
  
 