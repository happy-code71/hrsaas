export const imgerr = {
    inserted(el, binding) {
        // 当src 上的地址为null 的时候， 图片却不会报错,只是显示不出来而已
        // 这个时候我们就需要做一下判断
        el.src = el.src || binding.value
        el.onerror = (err) => {
            //加载异常是，把他替换为 固定的图片
            el.src = binding.value
        }
    },
    // inserted 方法只会在指令初始化的时候执行一次，在后续中却不会执行了
    // componentUpdated 是和inserted 一样的钩子函数
    // 组件的数据一旦更新，就会进入componentUpdated 钩子函数
    componentUpdated(el, binding) {
        el.src = el.src || binding.value
    }
}