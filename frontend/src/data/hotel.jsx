//IM NOT USING CLASSES ANYMORE JUST PLAIN JS OBJEC
import {v4 as genId} from "uuid";
import dayjs from 'dayjs'; // handles dates
import isSameOrAfter  from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter); //FOR PLUGINS
dayjs.extend(isSameOrBefore); //FOR PLUGINS

export function newHotel(name, price, address, link, checkInDate, checkInTime, checkOutDate, checkOutTime, isConfirmed, rating) {
    return {
        id: genId(),
        name: name, // default name if not provided
        price: price, // default price if not provided
        address: address, // default address if not provided
        link,
        checkInDate,
        checkInTime: checkInTime || "15:00", // default check-in time
        checkOutDate,
        checkOutTime: checkOutTime || "11:00", // default check-out time
        isConfirmed: isConfirmed ?? false, // default to false if not provided
        rating: rating || ""
    };
}

export function newHotelGroup(name, hotels, startDate, endDate) {
    return {
        id: genId(),
        name: name, 
        hotels: hotels || [],
        startDate: startDate || dayjs().format('DD-MM-YYYY'),
        endDate: endDate || dayjs().add(1,'day').format('DD-MM-YYYY'),
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
    return hgArray.map(hg => {
        const hotel = hg.hotels.find(h => h.isConfirmed);
        return hotel? {...hotel, checkInDate: hg.startDate, checkOutDate: hg.endDate} : undefined;
    })
    .filter(hotel => hotel !== undefined); // filter out those without confirmed;
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

export function doesHGOverlap(hg, hotelArr) {
    const newCheckIn = dayjs(hg.startDate, 'DD-MM-YYYY');
    const newCheckOut = dayjs(hg.endDate, 'DD-MM-YYYY');

    return hotelArr.some(existingHotel => {
        const existingCheckIn = dayjs(existingHotel.checkInDate, 'DD-MM-YYYY');
        const existingCheckOut = dayjs(existingHotel.checkOutDate, 'DD-MM-YYYY');
        // Check if ranges has no overlap
        const noOverlap =
            newCheckOut.isSameOrBefore(existingCheckIn) || newCheckIn.isSameOrAfter(existingCheckOut);
        if (!noOverlap) {
            console.log("AHHHH",existingHotel);
            alert(`Error: Cannot confirm this hotel. There is an overlap with ${existingHotel.name}, 
                which has a Check-In date: ${existingCheckIn.format('DD-MM-YYYY')} 
                and Check-Out date: ${existingCheckOut.format('DD-MM-YYYY')}`);
        }
        return !noOverlap;
    });
}