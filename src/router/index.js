import Vue from 'vue'
import Router from 'vue-router'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import settingRouter from './modules/setting'
import salarysRouter from './modules/salarys'
import socialRouter from './modules/social'
import attendancesRouter from './modules/attendances'
import approvalsRouter from './modules/approvals'
import permissionRouter from './modules/permission'
import userRouter from './modules/user'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/import')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    name: 'dashboard',
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  userRouter
  // 404 page must be placed at the end !!!
]
export const asyncRoutes = [
  approvalsRouter,
  departmentsRouter,
  employeesRouter,
  permissionRouter,
  attendancesRouter,
  salarysRouter,
  settingRouter,
  socialRouter
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  base: '/hr',// 路由前缀
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  // 重新设置路由的可匹配路径
  router.matcher = newRouter.matcher // reset router
}

export default router
