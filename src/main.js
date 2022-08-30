import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import components from './components'
import '@/styles/index.scss' // global css
import * as filters from '@/filters' // 引入工具类
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import * as divectives from '@/directives'
import isHasPremission from './mixin/isHasPremission'
import i18n from '@/lang'
//  全局注册自定义指令
Object.keys(divectives).forEach(keys => {
  Vue.directive(keys, divectives[keys])
})
// Vue.use(ElementUI)

// 全局注册mixin
Vue.mixin(isHasPremission)
// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
// 注册语言
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
// 注册自定义组件
Vue.use(components)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
