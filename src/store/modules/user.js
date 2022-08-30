import { login, getInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userInfo: {},
}
const mutations = {
  'SET_TOKEN': (state, token) => {
    state.token = token
  },
  "SET_USERINFO": (state, data) => {
    state.userInfo = { ...data }
  },
}
const actions = {
  async login({ commit }, body) {
    let rel = await login(body)
    setToken(rel)
    commit('SET_TOKEN', rel)
  },
  async getInfo({ commit }) {
    let rel = await getInfo()
    try {
      let baseRel = await getUserDetailById(rel.userId)
      commit('SET_USERINFO', { ...rel, ...baseRel })
      // 把数据返回出去，到后面获取路由标识
      return { ...rel, ...baseRel }
    } catch (error) {
      console.log(error)
    }

  },
  logout({ commit }) {
    removeToken()
    // 重置路由
    resetRouter()
    // 情况 permission 中的权限路由
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    commit('permission/SET_ROUTES', [], { root: true })
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
    commit('SET_TOKEN', null)
    commit('SET_USERINFO', {})
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
