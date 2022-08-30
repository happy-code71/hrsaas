import request from '@/utils/request'
export function getUserList({ page = 1, size = 10 }) {
    return request({
        url: '/sys/user',
        params: {
            page, size
        }
    })
}
export function addEmployees(data) {
    return request({
        url: '/sys/user',
        method: 'post',
        data
    })
}

export function deleteEmployee(id) {
    return request({
        url: `/sys/user/${id}`,
        method: 'delete'
    })
}
export function importEmployees(data) {
    return request({
        url: '/sys/user/batch',
        method: 'post',
        data
    })
}

export function saveUserDetailById(data) {
    return request({
        url: `/sys/user/${data.id}`,
        method: 'put',
        data
    })
}
/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
    return request({
        url: `/employees/${id}/personalInfo`
    })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
    return request({
        url: `/employees/${data.userId}/personalInfo`,
        method: 'put',
        data
    })
}


/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
    return request({
        url: `/employees/${id}/jobs`
    })
}


/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
    return request({
        url: `/employees/${data.userId}/jobs`,
        method: 'put',
        data
    })
}
// 给员工分配角色
export function assignRoles(data) {
    return request({
        url: '/sys/user/assignRoles',
        method: 'PUT',
        data
    })
}