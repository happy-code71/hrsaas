import request from '@/utils/request'
export function getDepartments() {
    return request({
        url: '/company/department',
        method: 'get'
    })
}
export function getEmployeeSimple() {
    return request({
        url: '/sys/user/simple'
    })
}
export function addDepartment(data) {
    return request({
        url: '/company/department',
        method: 'post',
        data
    })
}

export function getDepartmentDetail(id) {
    return request({
        url: `/company/department/${id}`,
        method: 'get'
    })
}
export function editDepartmentDetail(data) {
    return request({
        url: `/company/department/${data.id}`,
        method: 'put',
        data
    })
}
export function deleteDepartment(id) {
    return request({
        url: `/company/department/${id}`,
        method: 'DELETE'
    })
}