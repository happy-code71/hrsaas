import store from "@/store"

export default {
    methods: {
        // 传入控制按钮显示的标识
        // 这个方法在全局中注册，会添加到每一个组件的中methods
        isHasPermission(key) {
            const { userInfo } = store.state.user
            if (userInfo.roles && userInfo.roles.points) {
                // 有这个标识就返回true，否则就是false
                return userInfo.roles.points.some(item => item === key)
            }
            return false
        }
    },
}