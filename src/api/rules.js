import request from '@/utils/request'
export const getRulesListFn=()=>{
  return request({
    url:'admin/rule/1',
    method:'GET'
 })
}

export const addRulesFn=(data)=>{
  return request({
    url:'admin/rule',
    method:'POST',
    data
 })
}

export const RulesStatu = (id, status) => {
  return request({
    url: `admin/rule/${id}/update_status`,
    method: 'POST',
    data: { status } 
  })
}

export const EditRulesFn=(id,data)=>{
  return request({
    url:`admin/rule/${id}`,
    method:'POST',
    data
 })
}

export const DeleteRules = (id) => {
  return request({
    url: `admin/rule/${id}/delete`,
    method: 'POST'
  })
}