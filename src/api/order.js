import request from '@/utils/request'

// 1. 获取订单列表（分页 + 状态 + 搜索 + 时间）
export const getOrderListFn = (page, tab, no, starttime, endtime) => {
  return request({
    url: `/admin/order/${page}`,
    method: 'GET',
    params: { tab, no, starttime, endtime }
  })
}

// 2. 批量删除订单
export const deleteBatchOrderFn = (ids) => {
  return request({
    url: '/admin/order/delete_all',
    method: 'POST',
    data: { ids }
  })
}

// 3. 导出订单 Excel
export const exportOrderExcelFn = (tab, starttime, endtime) => {
  return request({
    url: '/admin/order/excelexport',
    method: 'POST',
    responseType: 'blob', // 必须加！导出文件
    params: { tab, starttime, endtime }
  })
}