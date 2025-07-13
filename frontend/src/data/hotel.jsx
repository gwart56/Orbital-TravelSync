//IM NOT USING CLASSES ANYMORE JUST PLAIN JS OBJEC
import {v4 as genId} from "uuid";
import dayjs from 'dayjs'; // handles dates
import isSameOrAfter  from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { supabase } from "../lib/supabaseClient";
dayjs.extend(isSameOrAfter); //FOR PLUGINS
dayjs.extend(isSameOrBefore); //FOR PLUGINS

export function newHotel(groupId, name, price, address, link, checkInDate, checkInTime, checkOutDate, checkOutTime, isConfirmed, rating, latLng) {
    return {
        id: genId(),
        groupId,
        name: name, // default name if not provided
        price: price || 0, // default price if not provided
        address: address || "", // default address if not provided
        link,
        checkInDate,
        checkInTime: checkInTime || "15:00", // default check-in time
        checkOutDate,
        checkOutTime: checkOutTime || "11:00", // default check-out time
        isConfirmed: isConfirmed ?? false, // default to false if not provided
        rating: rating || "",
        latLng: latLng || null
    };
}

export function newHotelGroup(itineraryId, name, startDate, endDate) {
    return {
        id: genId(),
        itineraryId,
        name: name,
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

export function getAllConfirmedHotelsFromArr(hgArray) { // This function extracts all confirmed hotels from an array of hotel groups
    if (!Array.isArray(hgArray)) return [];
    return hgArray
        .map(hg => {
            const hotel = hg.hotels.find(h => h.isConfirmed);
            return hotel
                ? { ...hotel, checkInDate: hg.startDate, checkOutDate: hg.endDate }
                : undefined;
        })
        .filter(hotel => hotel !== undefined); // Filter out those without confirmed hotels
}

//functions dealing with array of CONFIRMED (assuming no overlap)
export function getHotelCheckInOutForDate(d, hotelArr) {
    const date = dayjs(d, 'D MMMM YYYY');
    const checkIns = hotelArr.filter(hotel => dayjs(hotel.checkInDate, 'DD-MM-YYYY').isSame(date));
    const checkOuts = hotelArr.filter(hotel => dayjs(hotel.checkOutDate, 'DD-MM-YYYY').isSame(date));
    return { checkIns, checkOuts };
}

export function getHotelForDate(date, hotelArr) {
  return hotelArr.find(hotel => {
    return dayjs(date, 'D MMMM YYYY').isSameOrAfter(dayjs(hotel.checkInDate,'DD-MM-YYYY')) 
        && dayjs(date, 'D MMMM YYYY').isBefore(dayjs(hotel.checkOutDate, 'DD-MM-YYYY'));
  });
}

export function doesHGOverlap(hg, hotelArr) {
    console.log("DOES OVERLAP?", hg.startDate);
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

//SUPABSE

// LOAD: Get all traveldays for a specific itinerary
export async function loadHotelGroupsByItineraryId(itineraryId) {//TODO: IMPLEMENT THIS CORRECTLY
  const { data, error } = await supabase
    .from('hotelGroups')
    .select('*')
    .eq('itineraryId', itineraryId)
    .order('startDate', { ascending: true }); // ensures days are in order

  if (error) {
    console.error('Error fetching hotel groups:', error);
    return [];
  }

  return data;
}

//-----------------------------------HOTELGRPS SUPABASE---------------
//FOR ADDING HOTELGRPS(S) INTO SUPABASE
export async function addHotelGrpsIntoDB(hg) {// can accept one activity or array of activity
    const { error: daysError } = await supabase
    .from('hotelGroups')
    .insert(hg);

    if (daysError) {
        console.error('Failed to store hotelgroup:', daysError);
        throw daysError;
    }
}

export async function loadHotelGroupById(id) {
  const { data, error } = await supabase
    .from('hotelGroups')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateHotelGroupById(id, updatedHotelGroup) {
  const { data, error } = await supabase
    .from('hotelGroups')
    .update(updatedHotelGroup)
    .eq('id', id)
    .select(); // get updated row back (optional)

  if (error) throw error;

  console.log("Updating Supabase, hotel group with id: " + id);
  return data[0];
}

export async function deleteHotelGroupById(id) {
  const { error } = await supabase
    .from('hotelGroups')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Failed to delete hotel group:", error.message);
    throw error;
  }

  console.log("Successfully deleted hotel group with ID:", id);
}

//-----------------------------------HOTELS SUPABASE---------------
// LOAD: Get all hotels for a specific hotel group
export async function loadHotelsByGroupId(hotelGroupId) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('groupId', hotelGroupId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }

  return data;
}

// ADD: Insert one or more hotels into Supabase
export async function addHotelsIntoDB(hotels) {
  const { error } = await supabase
    .from('hotels')
    .insert(hotels); // accepts array or single object

  if (error) {
    console.error('Failed to store hotel(s):', error);
    throw error;
  }
}

// LOAD: Get one hotel by ID
export async function loadHotelById(id) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// UPDATE: Update hotel by ID
export async function updateHotelById(id, updatedHotel) {
  const { data, error } = await supabase
    .from('hotels')
    .update(updatedHotel)
    .eq('id', id)
    .select(); // get updated row

  if (error) throw error;

  console.log("Updated hotel with id:", id);
  return data[0];
}

// DELETE: Delete hotel by ID
export async function deleteHotelById(id) {
  const { error } = await supabase
    .from('hotels')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Failed to delete hotel:", error.message);
    throw error;
  }

  console.log("Deleted hotel with ID:", id);
}

//GETTING ALL CONFIRMED HOTELS

export async function loadAllConfirmedHotelsByItineraryId(itineraryId) {
  const confirmedHotels = [];

  // Step 1: Get all hotel groups for this itinerary
  const { data: groups, error: groupError } = await supabase
    .from('hotelGroups')
    .select('*')
    .eq('itineraryId', itineraryId)
    .order('startDate', { ascending: true });

  if (groupError) {
    console.error("Failed to load hotel groups:", groupError.message);
    return [];
  }

  // Step 2: For each hotel group, check if it has a confirmed hotel
  for (const group of groups) {
    const { data: hotels, error: hotelError } = await supabase
      .from('hotels')
      .select('*')
      .eq('groupId', group.id);

    if (hotelError) {
      console.error(`Failed to load hotels for group ${group.id}:`, hotelError.message);
      continue;
    }

    const confirmed = hotels.find(h => h.isConfirmed);
    if (confirmed) {
      confirmedHotels.push(confirmed);
    }
  }

  return confirmedHotels;
}