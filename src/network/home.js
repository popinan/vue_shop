import { request } from "./request";

export function getMenuList() {
    return request({
        url: '/menus',
        method: 'get',
    })
}
// User组件使用
export function getUserList(queryInfo) {
    return request({
        url: '/users',
        method: 'get',
        params : queryInfo,
    })
}
export function addUser(userInfo) {
    return request({
        url: '/users',
        method: 'post',
        data: userInfo,
    })
}
export function userStateChange(uid, type) {
    return request({
        url: `/users/${uid}/state/${type}`,
        method: 'put',
    })
}
export function getIdInfo(id) {
    return request({
        url: `/users/${id}`,
        method: 'get',
    })
}
export function editUser(userInfo) {
    return request({
        url: `/users/${userInfo.id}`,
        method: 'put',
        data: {email:userInfo.email, mobile:userInfo.mobile}
    })
}
export function deleteUser(id) {
    return request({
        url: `/users/${id}`,
        method: 'delete',
    })
}
export function saveRole(userId, roleId) {
    return request({
        url: `/users/${userId}/role`,
        method: 'put',
        data: {rid:roleId}
    })
}
// Rights组件使用
export function getRightsList() {
    return request({
        url: `/rights/list`,
        method: 'get',
    })
}
// Roles组件使用
export function getRolesList() {
    return request({
        url: '/roles',
        method: 'get',
    })
}
export function getRoleInfo(id) {
    return request({
        url: `/roles/${id}`,
        method: 'get',
    })
}
export function editRole(roleInfo) {
    return request({
        url: `/roles/${roleInfo.roleId}`,
        method: 'put',
        data: {roleName:roleInfo.roleName, roleDesc:roleInfo.roleDesc}
    })
}
export function deleteRole(id) {
    return request({
        url: `/roles/${id}`,
        method: 'delete',
    })
}
export function addRole(roleInfo) {
    return request({
        url: '/roles',
        method: 'post',
        data: roleInfo,
    })
}
export function deleteRoleRight(roleId, rightId) {
    return request({
        url: `/roles/${roleId}/rights/${rightId}`,
        method: 'delete',
    })
}
export function getRightsTree() {
    return request({
        url: `/rights/tree`,
        method: 'get',
    })
}
export function allocateRights(roleId, idStr) {
    return request({
        url: `/roles/${roleId}/rights`,
        method: 'post',
        data: {rids: idStr}
    })
}