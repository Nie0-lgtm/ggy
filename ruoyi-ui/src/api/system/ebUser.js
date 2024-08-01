import request from '@/utils/request'

// 查询菜单列表
export function userlist() {
  return request({
    url: '/system/ebuser/list',
    method: 'get',
  })
}