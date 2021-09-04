import request from '@/utils/request'

const api = {
  fetching_summary: '/home/summary',
  fetching_chart: '/home/chart',
  fetching_activities: '/home/activities'
}

export default api

export function fetching_summary() {
  return request({
    url: api.fetching_summary,
    method: 'get'
  })
}

export function fetching_chart() {
  return request({
    url: api.fetching_chart,
    method: 'get'
  })
}

export function fetching_activities() {
  return request({
    url: api.fetching_activities,
    method: 'get'
  })
}