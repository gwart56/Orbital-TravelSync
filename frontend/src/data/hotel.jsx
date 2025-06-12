//IM NOT USING CLASSES ANYMORE JUST PLAIN JS OBJEC
import {v4 as genId} from "uuid";

export function newHotel(name, price) {
    return {
        id: genId(),
        name: name, 
        price: price
    };
}

export function deleteHotelFromArr(id, hotelArray) {
    return hotelArray.filter(h => h.id != id);
}

export function addHotelToArr(hotelArray) {
    return [...hotelArray, newHotel("new", "$0")];
}

export function editHotelInArr(targetId, hotelArray, updatedHotel) {
    return hotelArray.map(h => h.id == targetId? updatedHotel: h);
}