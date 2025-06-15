//IM NOT USING CLASSES ANYMORE JUST PLAIN JS OBJEC
import {v4 as genId} from "uuid";

export function newHotel(name, price, address, link, checkInDate, checkInTime, checkOutDate, checkOutTime, isConfirmed) {
    return {
        id: genId(),
        name: name || "New Hotel", // default name if not provided
        price: price || "$0", // default price if not provided
        address,
        link,
        checkInDate,
        checkInTime: checkInTime || "15:00", // default check-in time
        checkOutDate,
        checkOutTime: checkOutTime || "11:00", // default check-out time
        isConfirmed: isConfirmed ?? false // default to false if not provided
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
    return [...hotelArray, newHotel()];
}

export function editHotelInArr(targetId, hotelArray, updatedHotel) {
    return hotelArray.map(h => h.id == targetId? updatedHotel: h);
}

//functions dealinf with array of HotelGroups
//hgArray means HOTEL GROUP ARRAY
export function deleteHGFromArr(id, hgArray) {
    return hgArray.filter(h => h.id != id);
}

export function addHGToArr(hgArray) {
    return [...hgArray, newHotelGroup("New Group", [newHotel()])];
}

export function editHGInArr(targetId, hgArray, updatedHG) {
    return hgArray.map(h => h.id == targetId? updatedHG: h);
}

export function getAllConfirmedHotelsFromArr(hgArray) { //RETURNS ARRAY OF CONFIRMED HOTELS
    return hgArray.map(hg => hg.hotels.find(h => h.isConfirmed));
}