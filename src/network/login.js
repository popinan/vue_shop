import { request } from "./request";

export function getLoginData(logindata) {
    return request({
        url: '/login',
        method: 'post',
        data: logindata,
    })
}

// export function getHomeGoods(type, page) {
//     return request({
//         url: '/home/data',
//         params: {
//             type,
//             page
//         }
//     })
// }