import {get, post} from "./httpUtils";

export const api = {
    createOrder(req) {
        return post('/v2/inscribe/order/create', req)
    },
    listOrder(req){
        return get('/v2/inscribe/order/list', req)
    },
    orderInfo(orderId) {
        return get(`/v2/inscribe/order/${orderId}`)
    },
}