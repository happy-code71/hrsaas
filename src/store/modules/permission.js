import { constantRoutes, asyncRoutes } from "@/router"
const state = {
    // 静态路由为初试路由
    routes: [...constantRoutes]
}
const mutations = {
    'SET_ROUTES': (state, routes) => {
        // 用户身上的标识和动态路由的name ，比较后 形成一个可访问的路由数组
        state.routes = [...constantRoutes, ...routes]
    }
}
const actions = {
    // routes: 用户身上的标识,用于和动态路由比较
    setRouters({ commit }, routes) {
        let newArr = []
        routes.forEach(name => {
            let itemArr = asyncRoutes.filter(item => item.name === name)
            newArr.push(...itemArr)
        });
        commit('SET_ROUTES', newArr)
        return newArr
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}