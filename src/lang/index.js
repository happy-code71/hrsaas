import VueI18n from 'vue-i18n'
import Vue from 'vue'
import elementEn from 'element-ui/lib/locale/lang/en'
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包
import Cookie from 'js-cookie'
Vue.use(VueI18n)
// 准备翻译的语言环境信息
const messages = {
    en: {
        // 引入饿了么 英文语言包
        ...elementEn,
        ...customZH
    },
    zh: {
        // 引入饿了么的中文包
        ...elementZH,
        ...customEN
    }
}
// 通过选项创建 VueI18n 实例
export default new VueI18n({
    locale: Cookie.get('language') || 'en', // 设置地区
    messages, // 设置地区信息
})