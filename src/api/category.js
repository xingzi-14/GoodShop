
import request from '@/utils/request'
export const getCategoryListFn=()=>{
  return request({
    url:"admin/category",
    method:'GET'
 })
}

export const addCategoryFn=(data)=>{
  return request({
    url:'admin/category',
    method:'POST',
    data
 })
}


export const EditCategoryFn=(id,data)=>{
  return request({
    url:`admin/category/${id}`,
    method:'POST',
    data
 })
}


// 单条/批量删除商品规格（共用同一个接口）
export const DeleteCategory = (id) => { 
  return request({
    url: `admin/category/${id}/delete`,
    method: 'POST',
    
  })
}


export const CategoryStatu = (id, status) => {
    return request({
      url: `admin/category/${id}/update_status`,
      method: 'POST',
      data: { status } 
    })
  }