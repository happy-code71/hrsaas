import router from '@/router/index'
import store from './store'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 没有token 也可以跳转的白名单
const whileList = ['/login', '/404']
// next() 继续执行路由
// next(false) 取消跳转
// next(path) 跳转到路径
router.beforeEach(async (to, from, next) => {
    nprogress.start()
    if (store.getters.token) {
        if (to.path === '/login') {
            next('/')
        }
        else if (!store.state.user.userInfo.username) {
            let rel = await store.dispatch('user/getInfo')
            // 把用户身上的路由标识，存到vuex 中
            // 再把比较之后，用户拥有的路由添加到当前路由集合中
            let userRoutes = await store.dispatch('permission/setRouters', rel.roles.menus)
            router.addRoutes([...userRoutes, { path: '*', redirect: '/404', hidden: true, name: 'to404' }])
            next(to.path)
            // next()
        }
        else {
            next()
        }
    } else {
        if (whileList.indexOf(to.path) > -1) {
            next()
        } else {
            next('/login')
        }
    }
    nprogress.done()
})
router.afterEach(() => {
    nprogress.done()
})
