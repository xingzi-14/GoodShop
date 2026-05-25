import request from '@/utils/request'

/**
 * 获取分销员列表
 * @param {number} page   页码
 * @param {object} params { type, keyword }
 */
export function getAgentList(page, params = {}) {
  return request({
    url: `/admin/agent/${page}`,
    method: 'GET',
    params
  })
}

/**
 * 查看分销员推广明细
 * @param {number} page   页码
 * @param {object} params { type, starttime, endtime, level, user_id }
 */
export function getPromotionDetail(page, params = {}) {
  return request({
    url: `/admin/agent/${page}`,
    method: 'GET',
    params
  })
}

/**
 * 获取分销设置
 */
export function getDistributionSetting() {
  return request({
    url: '/admin/distribution_setting/get',
    method: 'GET'
  })
}

/**
 * 修改分销设置
 * @param {object} data
 */
export function updateDistributionSetting(data) {
  return request({
    url: '/admin/distribution_setting/set',
    method: 'POST',
    data
  })
}
