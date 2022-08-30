import PageTool from './PageTool'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import TagsView from './TagsView'
export default {
    install(Vue) {
        Vue.component('PageTool', PageTool)
        Vue.component('UploadExcel', UploadExcel)
        Vue.component('ImageUpload', ImageUpload)
        Vue.use(Print)
        Vue.component('ScreenFull', ScreenFull)
        Vue.component('ThemePicker', ThemePicker)
        Vue.component('TagsView', TagsView)
    },
}
