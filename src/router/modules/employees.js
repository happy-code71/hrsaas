import Layout from "@/layout"
export default {
    path: '/employees',
    name: 'employees',
    component: Layout,
    children: [
        {
            path: '',// 选择为空的原因是  访问该 路由 /approvals 时，也会显示二级路由的组件
            component: () => import('@/views/employees'),
            name: 'employees',
            //  路由的元信息, 保存数据的对象 可以在侧边栏遍历路由信息的时候 添加标题
            meta: {
                title: '员工',
                icon: 'people'
            }
            // 当你的访问地址 是 /approvals layout组件会显示 此时 你的二级路由的默认组件  也会显示
        },
        {
            path: 'detail/:id',
            component: () => import('@/views/employees/components/detail-employee'),
            meta: {
                title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
            },
            hidden: true,
        },
        {
            path: 'print/:id',
            hidden: true,
            component: () => import('@/views/employees/components/print'),
            meta: {
                title: '员工打印' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
            },
        }
    ]
}