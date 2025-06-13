//IM NOT USING CLASSES ANYMORE JUST PLAIN JS OBJEC
import {v4 as genId} from "uuid";

export function newHotel(name, price, address, link) {
    return {
        id: genId(),
        name: name, 
        price: price,
        address: address,
        link: link
    };
}

export function newHotelGroup(name, hotels) {
    return {
        id: genId(),
        name: name, 
        hotels: hotels
    };
}

//functions dealing with array of Hotels
export function deleteHotelFromArr(id, hotelArray) {
    return hotelArray.filter(h => h.id != id);
}

export function addHotelToArr(hotelArray) {
    return [...hotelArray, newHotel("new", "$0")];
}

export function editHotelInArr(targetId, hotelArray, updatedHotel) {
    return hotelArray.map(h => h.id == targetId? updatedHotel: h);
}

//functions dealinf with array of HotelGroups
export function deleteHGFromArr(id, hgArray) {
    return hgArray.filter(h => h.id != id);
}

export function addHGToArr(hgArray) {
    return [...hgArray, newHotelGroup("New Group", [newHotel("new", "$0")])];
}

export function editHGInArr(targetId, hgArray, updatedHG) {
    return hgArray.map(h => h.id == targetId? updatedHG: h);
}