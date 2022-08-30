import request from '@/utils/request'
export function getRole({ page = 1, pagesize = 10 }) {
    return request({
        url: "/sys/role",
        method: 'get',
        params: {
            page,
            pagesize
        }

    })
}
export function addRole(data) {
    return request({
        url: '/sys/role',
        method: 'post',
        data
    })
}
export function roleDetail(id) {
    return request({
        url: `/sys/role/${id}`
    })
}

export function updaeRole(data) {
    return request({
        url: `/sys/role/${data.id}`,
        method: 'PUT',
        data
    })
}
export function deleteRole(id) {
    return request({
        url: `/sys/role/${id}`,
        method: 'DELETE'
    })
}

export function getCompanyInfo(id) {
    return request({
        url: `/company/${id}`
    })
}
export function assignPrem(data) {
    return request({
        url: '/sys/role/assignPrem',
        method: 'PUT',
        data
    })
}