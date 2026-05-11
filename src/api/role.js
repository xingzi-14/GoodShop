import request from '@/utils/request'

export const getRolesListFn=(page)=>{
    return request({
      url:`admin/role/${page}`,
      method:'GET'
   })
  }

  export const InsertRoleFn=(data)=>{
    return request({
        url:'admin/role',
        method:'POST',
        data
    })
  }

  export const EditRoleFn=(id,data)=>{
    return request({
        url:`admin/role/${id}`,
        method:'POST',
        data
    })
  }

  export const DelRoleFn=(id)=>{
    return request({
        url:`admin/role/${id}/delete`,
        method:'POST'
    })
  }

  export const EditRoleStatuFn=(id,status)=>{
    return request({
        url:`admin/role/${id}/update_status`,
        method:'POST',
        data:{
            status
        }
    })
  }


  export const setRoleFn=(id,rules_ids)=>{
    return request({
        url:`admin/role/set_rules`,
        method:'POST',
        data:{
           id,rules_ids
        }
    })
  }
  