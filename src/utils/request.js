import axios from 'axios'
import { Message } from 'element-ui';
import store from '@/store'

import { isOvertime } from './auth';
import router from '@/router';
const timeOut = 3600 * 24 * 30
const serve = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 6000
})
serve.interceptors.request.use(
    config => {
        if (store.getters.token) {
            if (isOvertime(timeOut)) {
                Message({
                    type: 'error',
                    message: '请求错误，登录已经失效，请重新登录！！！'
                }
                )
                store.dispatch('user/logout')
                router.push('/login')
                return Promise.reject("token 失效")
            }
            config.headers['Authorization'] = `Bearer ${store.getters.token}`
            config.headers['Content-Type'] = 'application/json'
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)
serve.interceptors.response.use(
    res => {
        if (res.data.success) {
            return res.data.data
        }
        else {
            Message({
                message: res.data.message,
                type: 'error',
                center: true
            })
            return Promise.reject(res.data.message)
        }
    },
    error => {
        if (error.response && error.response.data && error.response.data.code === 10002) {
            // 当等于10002的时候 表示 后端告诉我token超时了
            store.dispatch('user/logout') // 登出action 删除token
            router.push('/login')
        } else {
            Message.error(error.message) // 提示错误信息
        }
        return Promise.reject(error)
    }
)

export default serve