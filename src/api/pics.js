import request from '@/utils/request'
// 1. 获取图库分类列表（修复分页 params）
export const getPicsCateList = (page,limit=10) => {
    return request({
      url: `admin/getPicsCateList/${page}`,
      method: 'GET',
      params :{
        limit
      }
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
      url: `admin/editPicsList/${id}`,
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
  export const getPicList = (id, page,limit) => {
    return request({
      url: `admin/getPicList/${id}/image/${page}`,
      method: 'GET',
      params :{
        limit
      }
    })
  }
  
  // 6. 图片重命名（修复路径）
  export const editPicName = (id, name) => {
    return request({
      url: `admin/editPicName/${id}`,
      method: 'POST',
      data:{
        name
      }
    })
  }
  
  // 7. 删除图片
  export const delPic = (ids) => {
    return request({
      url: 'admin/delPic/delete_all',
      method: 'POST',
      data:{
        ids
      }
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