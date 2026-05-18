import request from '@/utils/request'

export const getCommentListFn=(page,title)=>{
    return request({
      url:`admin/goods_comment/${page}`,
      method:'GET',
      params:{title}
   })
  }
  

  export const reviewCommentFn = (id, data) => {
    return request({
      url: `admin/goods_comment/review/${id}`,
      method: 'POST',
      data
    })
  }
  
  

  
  
  export const updateCommentStatu = (id, status) => {
      return request({
        url: `admin/goods_comment/${id}/update_status`,
        method: 'POST',
        data: { status } 
      })
    }