//IM NOT USING CLASSES ANYMORE JUST PLAIN JS OBJEC
import {v4 as genId} from "uuid";
import dayjs from 'dayjs'; // handles dates
import isSameOrAfter  from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter); //FOR PLUGINS
dayjs.extend(isSameOrBefore); //FOR PLUGINS

export function newHotel(name, price) {
    return {
        id: genId(),
        name: name, 
        price: price
    };
}

export function newHotelGroup(name, hotels) {
    return {
        id: genId(),
        name: name, 
        hotels: hotels
    };
}

export function newConfirmedHotel(name, price, checkInDate, checkInTime, checkOutDate, checkOutTime) {
    return {
        id: genId(),
        name, 
        price,
        checkInDate,
        checkInTime,
        checkOutDate,
        checkOutTime
    };
}

export const defConfirmedHotelArr
    = [newConfirmedHotel("Hotel A", "$100", "20-06-2025","15:00","22-06-2025","11:00"),
    newConfirmedHotel("Hotel B", "$100", "22-06-2025","15:00","23-06-2025","10:00"),
    newConfirmedHotel("Hotel C", "$100", "23-06-2025","15:00","24-06-2025","10:30")];

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

//functions dealing with array of CONFIRMED (assuming no overlap)
export function getHotelCheckInOutForDate(d, hotelArr) {
    const date = dayjs(d, 'DD-MM-YYYY');
    const checkIns = hotelArr.filter(hotel => dayjs(hotel.checkInDate, 'DD-MM-YYYY').isSame(date));
    const checkOuts = hotelArr.filter(hotel => dayjs(hotel.checkOutDate, 'DD-MM-YYYY').isSame(date));
    return { checkIns, checkOuts };
}

export function getHotelForDate(date, hotelArr) {
  return hotelArr.find(hotel => {
    return dayjs(date, 'DD-MM-YYYY').isSameOrAfter(dayjs(hotel.checkInDate,'DD-MM-YYYY')) 
        && dayjs(date, 'DD-MM-YYYY').isSameOrBefore(dayjs(hotel.checkOutDate, 'DD-MM-YYYY'));
  });
}