import request from '@/utils/request'

const api = {
  fetching_contracts: '/contract/all',
  querying_contracts: '/contract/list',
  fetching_active_contracts: '/contract/active',
  fetching_contract: '/contract/detail',
  saving_contract: '/contract/save',
  deleting_contracts: '/contract/delete',
}

export default api

export function fetching_active_contracts(date) {
  return request({
    url: api.fetching_active_contracts,
    method: 'get',
    params: {
      date: date,
    },
  })
}

export function fetching_contracts(parameter) {
  return request({
    url: api.querying_contracts,
    method: 'get',
    params: parameter,
  })
}

export function fetching_contract(id) {
  return request({
    url: api.fetching_contract,
    method: 'get',
    params: {
      id: id,
    },
  })
}

export function saving_contract(parameter) {
  return request({
    url: api.saving_contract,
    method: 'post',
    data: parameter,
  })
}

export function deleting_contracts(parameter) {
  return request({
    url: api.deleting_contracts,
    method: 'post',
    data: parameter,
  })
}
