import request from '@/utils/request'

const api = {
  querying_projects: '/project/list',
  fetching_new_projects: '/project/new',
  fetching_project: '/project/detail',
  fetching_project_status: '/project/status',
  saving_project: '/project/save',
  deleting_project: '/project/delete',
  calculate: '/project/calculate',
  updating_status: '/project/status/update',
  updating_accepted_ratio: '/project/accepted-ratio/update',
  exporting_projects: '/project/exporting',
}

export default api

export function querying_projects(pagingParams, queryParams) {
  return request({
    url: api.querying_projects,
    method: 'post',
    params: pagingParams,
    data: queryParams,
  })
}

export function fetching_new_projects() {
  return request({
    url: api.fetching_new_projects,
    method: 'get',
  })
}

export function fetching_project(id) {
  return request({
    url: api.fetching_project,
    method: 'get',
    params: {
      id: id,
    },
  })
}

export function fetching_project_status(id) {
  return request({
    url: `${api.fetching_project_status}/${id}`,
    method: 'get',
  })
}

export function saving_project(parameter) {
  return request({
    url: api.saving_project,
    method: 'post',
    data: parameter,
  })
}

export function deleting_project(id) {
  return request({
    url: api.deleting_project,
    method: 'get',
    params: { id: id },
  })
}

export function updating_status(parameter) {
  return request({
    url: api.updating_status,
    method: 'post',
    data: parameter,
  })
}

export function updating_accepted_ratio(id, ratio) {
  return request({
    url: api.updating_accepted_ratio,
    method: 'post',
    params: {
      id: id,
      ratio: ratio,
    },
  })
}

export function exporting_projects(queryParams) {
  return request({
    url: api.exporting_projects,
    method: 'post',
    responseType: 'blob',
    data: queryParams,
  })
}
