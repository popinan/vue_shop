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
        params: queryInfo,
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
        data: { email: userInfo.email, mobile: userInfo.mobile }
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
        data: { rid: roleId }
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
        data: { roleName: roleInfo.roleName, roleDesc: roleInfo.roleDesc }
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
        data: { rids: idStr }
    })
}
// Categories组件使用
export function getGoodsList(queryInfo) {
    return request({
        url: '/categories',
        method: 'get',
        params: queryInfo,
    })
}
export function addCategory(cateInfo) {
    return request({
        url: `/categories`,
        method: 'post',
        data: cateInfo
    })
}
export function getCateInfo(id) {
    return request({
        url: `/categories/${id}`,
        method: 'get',
    })
}
export function editCategory(cateInfo) {
    return request({
        url: `/categories/${cateInfo.cat_id}`,
        method: 'put',
        data: { cat_name: cateInfo.cat_name }
    })
}
export function deletCategory(id) {
    return request({
        url: `/categories/${id}`,
        method: 'delete',
    })
}
// Params组件使用
export function getParamsList(cateid, sel) {
    return request({
        url: `/categories/${cateid} /attributes`,
        method: 'get',
        params: { sel: sel },
    })
}
export function addParams(cateid, paramInfo) {
    return request({
        url: `/categories/${cateid} /attributes`,
        method: 'post',
        data: paramInfo,
    })
}
export function getParamInfo(cateid, attrinfo) {
    return request({
        url: `/categories/${cateid}/attributes/${attrinfo.id}`,
        method: 'get',
        params: { attr_sel: attrinfo.attr_sel },
    })
}
export function editParam(cateid, attrinfo) {
    return request({
        url: `/categories/${cateid}/attributes/${attrinfo.id}`,
        method: 'put',
        data: { attr_name: attrinfo.attr_name, attr_sel: attrinfo.attr_sel, attr_vals: attrinfo.attr_vals }
    })
}
export function deletParam(cateid, attrid) {
    return request({
        url: `/categories/${cateid}/attributes/${attrid}`,
        method: 'delete',
    })
}
// List组件使用
export function getGoods(queryInfo) {
    return request({
        url: '/goods',
        method: 'get',
        params: queryInfo,
    })
}
export function editGoods(goodsInfo) {
    return request({
        url: `/goods/${goodsInfo.id}`,
        method: 'put',
        data: { email: goodsInfo.email, mobile: goodsInfo.mobile }
    })
}
export function getGoodsInfo(id) {
    return request({
        url: `/goods/${id}`,
        method: 'get',
    })
}
export function deleteGoods(id) {
    return request({
        url: `/goods/${id}`,
        method: 'delete',
    })
}
export function addGoods(goodsInfo) {
    return request({
        url: `/goods`,
        method: 'post',
        data: goodsInfo,
    })
}
// Order组件使用
export function getOrders(queryInfo) {
    return request({
        url: '/orders',
        method: 'get',
        params: queryInfo,
    })
}
export function getProgress(id='1106975712662') {
    return request({
        url:  `/kuaidi/${id}`,
        method: 'get',
    })
}
// Report组件使用
export function getReport() {
    return request({
        url:  `/reports/type/1`,
        method: 'get',
    })
}