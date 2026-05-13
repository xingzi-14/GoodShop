
import request from '@/utils/request'
export const getCouponListFn = (page) => {
    return request({
      url: `admin/coupon/${page}`,
      method: 'GET',
    
    })
  }

export const addCouponFn=(data)=>{
  return request({
    url:'admin/coupon',
    method:'POST',
    data
 })
}


export const EditCouponFn=(id,data)=>{
  return request({
    url:`admin/coupon/${id}`,
    method:'POST',
    data
 })
}


// 单条/批量删除商品规格（共用同一个接口）
export const DeleteCoupon = (id) => { 
  return request({
    url: `admin/coupon/${id}/delete`,
    method: 'POST',
    
  })
}


export const CouponStatu = (id, status) => {
    return request({
      url: `admin/coupon/${id}/update_status`,
      method: 'POST',
      data: { status } 
    })
  }