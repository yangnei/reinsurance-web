import { BasicLayout, BlankLayout, UserLayout } from '@/layouts'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view'),
}

export const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home', permission: ['ROLE_USER'] },
    redirect: '/home',
    children: [
      // home
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/Home'),
        meta: { title: 'menu.dashboard.workplace', icon: 'home', permission: ['ROLE_USER'] },
      },

      // projects
      {
        path: '/project/list',
        name: 'ProjectList',
        component: () => import('@/views/project/ProjectList'),
        meta: { title: 'menu.project.list', icon: 'windows', permission: ['ROLE_USER'] },
      },

      // projects
      {
        path: '/project',
        name: 'Project',
        component: RouteView,
        meta: { title: 'menu.project.list', icon: 'windows', permission: ['ROLE_USER'] },
        redirect: '/project/list',
        hidden: true,
        children: [
          {
            path: '/project/edit',
            name: 'ProjectEdit',
            component: () => import('@/views/project/ProjectEdit'),
            meta: { title: '录入要约', permission: ['ROLE_USER'] },
          },
          {
            path: '/project/decision-making',
            name: 'DecisionMaking',
            component: () => import('@/views/project/DecisionMaking'),
            meta: { title: '辅助决策', permission: ['ROLE_USER'] },
          },
          {
            path: '/project/detail',
            name: 'ProjectDetail',
            component: () => import('@/views/project/ProjectDetail'),
            meta: { title: '项目信息', permission: ['ROLE_USER'] },
          },
          {
            path: '/data/project/success',
            name: 'ProjectSuccess',
            component: () => import('@/views/project/ProjectSuccess'),
            meta: { title: '项目保存成功', permission: ['ROLE_USER'] },
          },
        ],
      },

      // reports
      {
        path: '/report',
        name: 'Report',
        hidden: true,
        component: BlankLayout,
        meta: { title: 'menu.report', icon: 'copy', permission: ['ROLE_USER'] },
      },

      // data
      {
        path: '/data',
        name: 'Data',
        component: RouteView,
        meta: { title: 'menu.data', icon: 'database', permission: ['ROLE_USER'] },
        children: [
          {
            path: '/data/contract',
            name: 'ContractList',
            component: () => import('@/views/contract/ContractList'),
            meta: { title: 'menu.data.contract', permission: ['ROLE_USER'] },
          },
          {
            path: '/data/contract/edit',
            name: 'ContractEdit',
            component: () => import('@/views/contract/ContractEdit'),
            meta: { title: '新增合约', permission: ['ROLE_USER'] },
            hidden: true,
          },
          {
            path: '/data/company',
            name: 'CompanyList',
            component: () => import('@/views/company/CompanyList'),
            meta: { title: 'menu.data.company', permission: ['ROLE_USER'] },
          },
          {
            path: '/data/company/edit',
            name: 'CompanyEdit',
            component: () => import('@/views/company/CompanyEdit'),
            meta: { title: '新增机构', permission: ['ROLE_USER'] },
            hidden: true,
          },
          {
            path: '/data/company/detail',
            name: 'CompanyDetail',
            component: () => import('@/views/company/CompanyDetail'),
            meta: { title: '机构信息', permission: ['ROLE_USER'] },
            hidden: true,
          },
          {
            path: '/data/company/success',
            name: 'CompanySuccess',
            component: () => import('@/views/company/CompanySuccess'),
            meta: { title: '公司保存成功', permission: ['ROLE_USER'] },
            hidden: true,
          },
          {
            path: '/data/category',
            name: 'CategoryList',
            component: () => import('@/views/category/CategoryList'),
            meta: { title: 'menu.data.category', permission: ['ROLE_USER'] },
          },
        ],
      },

      // utilities
      {
        path: '/utils',
        name: 'Utilities',
        hidden: true,
        component: RouteView,
        meta: { title: 'menu.utilities', icon: 'tool', permission: ['ROLE_USER'] },
        children: [
          {
            path: '/utils/exchange',
            name: 'UtilsExchange',
            component: BlankLayout,
            meta: { title: '汇率查询', permission: ['ROLE_USER'] },
          },
        ],
      },

      // result
      {
        path: '/result',
        name: 'result',
        component: RouteView,
        redirect: '/result/success',
        meta: { title: 'menu.result', icon: 'check-circle-o' },
        hidden: true,
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: 'menu.result.success', keepAlive: false, hiddenHeaderContent: true },
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: 'menu.result.fail', keepAlive: false, hiddenHeaderContent: true },
          },
        ],
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: 'menu.exception', icon: 'warning', permission: ['exception'] },
        hidden: true,
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: 'menu.exception.not-permission', permission: ['exception'] },
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: 'menu.exception.not-find', permission: ['exception'] },
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: 'menu.exception.server-error', permission: ['exception'] },
          },
        ],
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/settings',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['ROLE_USER', 'ROLE_ADMIN'] },
        hidden: true,
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['ROLE_USER', 'ROLE_ADMIN'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: {
                  title: 'account.settings.menuMap.basic',
                  hidden: true,
                  permission: ['ROLE_USER', 'ROLE_ADMIN'],
                },
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['ROLE_USER', 'ROLE_ADMIN'],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home', permission: ['ROLE_ADMIN'] },
    redirect: '/admin/user',
    children: [
      // admin
      {
        path: '/admin',
        name: 'Admin',
        component: RouteView,
        meta: { title: '系统管理', icon: 'setting', permission: ['ROLE_ADMIN'] },
        children: [
          {
            path: '/admin/user',
            name: 'UserList',
            component: () => import('@/views/admin/UserList'),
            meta: { title: '用户管理', permission: ['ROLE_ADMIN'] },
          },
          {
            path: '/admin/user/edit',
            name: 'UserEdit',
            component: () => import('@/views/admin/UserEdit'),
            meta: { title: '用户编辑', permission: ['ROLE_ADMIN'] },
            hidden: true,
          },
        ],
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/settings',
        name: 'account',
        meta: { title: 'menu.account', icon: 'user', keepAlive: true, permission: ['ROLE_ADMIN'] },
        hidden: true,
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: 'menu.account.settings', hideHeader: true, permission: ['ROLE_ADMIN'] },
            redirect: '/account/settings/basic',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/basic',
                name: 'BasicSettings',
                component: () => import('@/views/account/settings/BasicSetting'),
                meta: {
                  title: 'account.settings.menuMap.basic',
                  hidden: true,
                  permission: ['ROLE_ADMIN'],
                },
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: {
                  title: 'account.settings.menuMap.security',
                  hidden: true,
                  keepAlive: true,
                  permission: ['ROLE_ADMIN'],
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login'),
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register'),
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult'),
      },
      {
        path: 'recover',
        name: 'recover',
        component: undefined,
      },
    ],
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
  },
]
