import request from '@/utils/request'

// 获取新闻公告列表（分页）
export const getNewsListFn = (page, params) => {
  return request({
    url: `admin/news/${page}`,
    method: 'GET',
    params
  })
}

// 新增新闻公告
export const addNewsFn = (data) => {
  return request({
    url: 'admin/news',
    method: 'POST',
    data
  })
}

// 编辑新闻公告
export const editNewsFn = (id, data) => {
  return request({
    url: `admin/news/${id}`,
    method: 'POST',
    data
  })
}

// 删除新闻公告
export const deleteNewsFn = (id) => {
  return request({
    url: `admin/news/${id}/delete`,
    method: 'POST'
  })
}
