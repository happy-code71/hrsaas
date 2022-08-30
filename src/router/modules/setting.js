import Layout from "@/layout"
export default {
    path: '/setting',
    name: 'settings',
    component: Layout,
    children: [
        {
            path: '',// 选择为空的原因是  访问该 路由 /approvals 时，也会显示二级路由的组件
            component: () => import('@/views/setting'),
            name: 'settings',
            //  路由的元信息, 保存数据的对象 可以在侧边栏遍历路由信息的时候 添加标题
            meta: {
                title: '公司设置',
                icon: 'setting'
            }
            // 当你的访问地址 是 /approvals layout组件会显示 此时 你的二级路由的默认组件  也会显示
        }
    ]
}