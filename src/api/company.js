import request from '@/utils/request'

const api = {
  fetching_companies: '/company/all',
  fetching_brokers: '/company/brokers',
  fetching_insurances: '/company/insurances',
  fetching_company: '/company/detail',
  querying_companies: '/company/list',
  saving_company: '/company/save',
  deleting_companies: '/company/delete'
}

export default api

export function fetching_companies() {
  return request({
    url: api.fetching_companies,
    method: 'get'
  })
}

export function fetching_brokers() {
  return request({
    url: api.fetching_brokers,
    method: 'get'
  })
}

export function fetching_insurances() {
  return request({
    url: api.fetching_insurances,
    method: 'get'
  })
}

export function querying_companies(parameter) {
  return request({
    url: api.querying_companies,
    method: 'get',
    params: parameter
  })
}

export function fetching_company(id) {
  return request({
    url: api.fetching_company,
    method: 'get',
    params: {
      id: id
    }
  })
}

export function saving_company(parameter) {
  return request({
    url: api.saving_company,
    method: 'post',
    data: parameter
  })
}

export function deleting_companies(parameter) {
  return request({
    url: api.deleting_companies,
    method: 'post',
    data: parameter
  })
}
