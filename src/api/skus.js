// d:/Vue3/day0316/src/api/skus.js

import request from '@/utils/request'


export const getSkusListFn = ( page) => {
  return request({
  
    url: `admin/skus/${page}`,
    method: 'GET',
  })
}

// ... 其他代码保持不变
export const addSkusFn=(data)=>{
  return request({
    url:'admin/skus',
    method:'POST',
    data
 })
}


export const EditSkusFn=(id,data)=>{
  return request({
    url:`admin/skus/${id}`,
    method:'POST',
    data
 })
}


// 单条/批量删除商品规格（共用同一个接口）
export const DeleteRules = (ids) => {
  // 如果传的是单个数字，转成数组
  const idsArr = Array.isArray(ids) ? ids : [ids]
  
  return request({
    url: '/admin/skus/delete_all',
    method: 'POST',
    data: {
      ids: idsArr
    }
  })
}