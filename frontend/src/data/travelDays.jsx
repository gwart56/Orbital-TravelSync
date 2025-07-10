import { supabase } from "../lib/supabaseClient";
import {v4 as genId} from "uuid";

//-------------------------------------------------------
//TRAVELDAY DATA TYPE
// {
//     travelDayId;
//     itineraryId; <---foreign key
//     index;
// }

function newTravelDay(itineraryId, index) {
    return {
        travelDayId: genId(),
        itineraryId,
        index
    };
}

//CREATE : Create new numOfDays-length array of travelDays
export async function createNewTravelDays(itineraryId, numOfDays) { 
    const travelDays = Array.from({ length: numOfDays }, (_, i) => (
        newTravelDay(itineraryId, i)
    ));
    await addTravelDaysIntoDB(travelDays);
}

//FOR ADDING TRAVELDAY(S) INTO SUPABASE
async function addTravelDaysIntoDB(travelDays) {// can accept one travel day or array of traveldays
    const { error: daysError } = await supabase
    .from('travel_days')
    .insert(travelDays);

    if (daysError) {
        console.error('Failed to store travel days:', daysError);
        throw daysError;
    }
}


// LOAD: Get all traveldays for a specific itinerary
export async function loadTravelDaysByItineraryId(itineraryId) {//TODO: IMPLEMENT THIS CORRECTLY
  const { data, error } = await supabase
    .from('travel_days')
    .select('*')
    .eq('itineraryId', itineraryId)
    .order('index', { ascending: true }); // ensures days are in order

  if (error) {
    console.error('Error fetching travel days:', error);
    return [];
  }

  return data;
}


// LOAD: Get travelday by id
export async function loadTravelDayById(travelDayId) {
    //TODO: maybe might use ltr idk
    const { data, error } = await supabase
    .from('travel_days')
    .select('*')
    .eq('travelDayId', travelDayId)
    .single();

    if (error) throw error;
    return data;
}

// UPDATE: Update travelday by id
export async function updateTravelDayById(travelDayId, updatedTravelDay) {
    const { data, error } = await supabase
        .from('travel_days')
        .update(updatedTravelDay)
        .eq('travelDayId', travelDayId)
        .select(); // get updated row back (optional)

    if (error) throw error;

    console.log("Updating supabase, travelDay with id: " + travelDayId);

    return data[0];
}

// DELETE: Delete travelday by id
export async function deleteTravelDayById(travelDayId) {
  const { error } = await supabase
    .from('travel_days') 
    .delete()
    .eq('id', travelDayId);

  if (error) {
    console.error("Failed to delete travelday:", error.message);
    throw error;
  }

  console.log("Successfully deleted travelday with ID:", travelDayId);
}