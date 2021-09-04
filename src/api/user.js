import request from '@/utils/request'

const api = {
  fetching_users: '/user/list',
  fetching_user: '/user/detail',
  saving_user: '/user/save',
  updating_user: '/user/update',
  updating_password: '/user/password/update',
  deleting_user: '/user/delete',
}

export default api

export function fetching_users(parameter) {
  return request({
    url: api.fetching_users,
    method: 'get',
    params: parameter,
  })
}

export function fetching_user(id) {
  return request({
    url: api.fetching_user,
    method: 'get',
    params: { id: id },
  })
}

export function saving_user(parameter) {
  return request({
    url: api.saving_user,
    method: 'post',
    data: parameter,
  })
}

export function deleting_user(id) {
  return request({
    url: api.deleting_user,
    method: 'get',
    params: { id: id },
  })
}

export function updating_user(parameter) {
  return request({
    url: api.updating_user,
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: parameter,
  })
}

export function updating_password(parameter) {
  return request({
    url: api.updating_password,
    method: 'post',
    data: parameter,
  })
}
