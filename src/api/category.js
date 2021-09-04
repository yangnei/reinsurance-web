import request from '@/utils/request'

const api = {
  fetching_categories: '/category/all',
  saving_category: '/category/save',
  deleting_categories: '/category/delete'
}

export function fetching_categories() {
  return request({
    url: api.fetching_categories,
    method: 'get'
  })
}

export function saving_category(parameter) {
  return request({
    url: api.saving_category,
    method: 'post',
    data: parameter
  })
}

export function deleting_categories(parameter) {
  return request({
    url: api.deleting_categories,
    method: 'post',
    data: parameter
  })
}
