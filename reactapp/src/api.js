import requests from "./requests"

export async function getAllSerials({sort, page, sortDirection, filter, filterField, page_size}) {
    let data = {
        page: page,
        sort: sort,
        sort_direction: sortDirection
    }
    if (filter && filterField) {
        data = Object.assign(data, {filter: filter, filter_field: filterField})
    }
    if (page_size) {
        data = Object.assign(data, {page_size: page_size})
    }
    let result = await requests.get('api/serials/serials/', { params: data });
    if (result.status === 200){
        return result.data
    }
}

export async function getSerial({serial_no}) {
    let data = {'serial_no': serial_no}
    let result = await requests.get('api/serials/serial/', { params:data });
    if (result.status === 200){
        return result.data
    }
}

export async function getShops() {
    let data = {'page_size': 100000}
    let result = await requests.get('api/serials/shops', { params:data })
    if (result.status === 200){
        return result.data
    }
}

export async function setSerialShopNo({serial_id, shopId}) {
    let data = {
        id: serial_id,
        shop_id: shopId
    }
    let result = await requests.post("api/serials/serial/", data)
    if (result.status === 200) {
        return result.data
    }
}

export async function changeSerialNo({serial_id, shop_id, new_number}){
    let data = {
        serial_id: serial_id,
        shop_id: shop_id,
        number: new_number
    }
    let result = await requests.post("api/serials/change_cash_number/", data)
    if (result.status === 200) {
        return result.data
    }
}

export async function changeAcceptSerial({serial_id, acceptSerial}){
    let data = {
        id:serial_id,
        accept_serial: !acceptSerial
    }
    console.log(data)
    let result = await requests.post("api/serials/serial/", data)
    if (result.status === 200) {
        return result.data
    }
}

export async function acceptFeatures({features, serial_id}){
    let f = []
    Object.keys(features).map((f_key)=>{
        let feature = features[f_key]
        if (!feature.hasOwnProperty("id")){
            feature.id = null
        }
        f.push(feature)
    })
    let data = {
        serial_id: serial_id,
        features: f,
    }


    let result = await requests.post("api/serials/feature/", data)
    return result.data
}

export async function getSerialsFromShop(shop_id){
    let data = {'shop_id': shop_id};
    let result = await requests.get("api/serials/serial_from_shop/", { params:data });
    if (result.status === 200) {
        return result.data
    }

}