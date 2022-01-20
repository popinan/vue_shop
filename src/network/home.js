import { request } from "./request";

export function getMenuList() {
    return request({
        url: '/menus',
        method: 'get',
    })
}

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