import request from '@/utils/request'
export const getGoodsListFn = (page,params) => {
  return request({
    url: `admin/goods/${page}`,
    method: 'GET',
    params
  })
}

export const getGoodsCategoryFn = () => {
  return request({
    url: 'admin/category',
    method: 'GET',
  })
}
// 添加

export const insertGoodsFn = (data) => {
  return request({
    url: 'admin/goods',
    method: 'POST',
    data
  })
}
// 编辑
export const editGoodsFn = (id, data) => {
  return request({
    url: `admin/goods/${id}`,
    method: 'POST',
    data
  })
}
//轮播图
export const setGoodsBannersFn = (id, data) => {
  return request({
    url: `admin/goods/banners/${id}`,
    method: 'POST',
    data
  })
}
//根据商品id获取商品信息
export  const getCategoryGoodsFn=(id)=>{
    return request({
      url: `admin/goods/read/${id}`,
      method: 'GET',
    })
}
// 设置商品详情
export const setGoodsContenTFn = (id, data) => { 
    return request({
      url: `admin/goods/${id}`,
      method: 'POST',
      data
    })
}
// 设置商品规格
export const editGoodsSkuFn=(id,data)=>{
    return request({
      url: `admin/goods/updateskus/${id}`,
      method: 'POST',
      data
    })
}
export const insertGoodsSkusFn=(data)=>{
    return request({
      url: `admin/goods_skus_card`,
      method: 'POST',
      data
    })
}
// 编辑商品规格
export const editGoodsSkusCardFn=(id,data)=>{
    return request({
      url: `admin/goods_skus_card/${id}`,
      method: 'POST',
      data
    })
}


export const editGoodSkusValFn=(id,data)=>{ 
    return request({
      url: `admin/goods_skus_card_value/${id}`,
      method: 'POST',
      data
    })
}
// 删除商品规格
export const delGoodsSkusCardFn=(id)=>{
    return request({
      url: `admin/goods_skus_card/${id}/delete`,
      method: 'POST',
    })
}
// 新增商品规格选项值
export const insertGoodsSkusCardValueFn=(data)=>{
    return request({
      url: `admin/goods_skus_card_value`,
      method: 'POST',
      data
    })
}
// 删除商品规格选项值
export const delGoodsSkusCardValueFn=(id)=>{
    return request({
      url: `admin/goods_skus_card_value/${id}/delete`,
      method: 'POST',
    })
}

// 批量上架下架
export const setGoodsStatusFn=(data)=>{ 
    return request({
      url: `admin/goods/changestatus`,
      method: 'POST',
      data
    })
} 

// 批量删除
export const delGoodsAllFn=(ids)=>{ 
    return request({
      url: 'admin/goods/delete_all',
      method: 'POST',
      data:{
        ids
      }
    })
}
export const restoreGoodsFn=(ids)=>{ 
    return request({
      url: 'admin/goods/destroy',
      method: 'POST',
      data:{
        ids
      }
    })
}