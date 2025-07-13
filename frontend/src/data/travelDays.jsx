import { supabase } from "../lib/supabaseClient";
import {v4 as genId} from "uuid";

//-------------------------------------------------------
//TRAVELDAY DATA TYPE
// {
//     id;
//     itineraryId; <---foreign key
//     index;
// }

export function newTravelDay(itineraryId, index) {
    return {
        id: genId(),
        itineraryId,
        index
    };
}

//SUPABASE STUFF --------------------------------------------

//CREATE : Create new numOfDays-length array of travelDays
export async function createNewTravelDays(itineraryId, numOfDays) { 
    const travelDays = Array.from({ length: numOfDays }, (_, i) => (
        newTravelDay(itineraryId, i)
    ));
    await addTravelDaysIntoDB(travelDays);
}

//FOR ADDING TRAVELDAY(S) INTO SUPABASE
export async function addTravelDaysIntoDB(travelDays) {// can accept one travel day or array of traveldays
    const { data, error: daysError } = await supabase
    .from('travelDays')
    .insert(travelDays)
    .select();

    if (daysError) {
        console.error('Failed to store travel days:', daysError);
        throw daysError;
    }

    return data;
}


// LOAD: Get all traveldays for a specific itinerary
export async function loadTravelDaysByItineraryId(itineraryId) {//TODO: IMPLEMENT THIS CORRECTLY
  const { data, error } = await supabase
    .from('travelDays')
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
export async function loadTravelDayById(id) {
    //TODO: maybe might use ltr idk
    const { data, error } = await supabase
    .from('travelDays')
    .select('*')
    .eq('id', id)
    .single();

    if (error) throw error;
    return data;
}

// UPDATE: Update travelday by id
export async function updateTravelDayById(id, updatedTravelDay) {
  console.log("ALLCHANNELS -UODATE A", supabase.getChannels());
    const { data, error } = await supabase
        .from('travelDays')
        .update(updatedTravelDay)
        .eq('id', id)
        .select(); // get updated row back (optional)
        
    console.log("ALLCHANNELS -UPDATE B", supabase.getChannels());
    
    if (error) throw error;

    console.log("Updating supabase, travelDay with id: " + id);

    return data[0];
}

// DELETE: Delete travelday by id
export async function deleteTravelDayById(id) {
  const { error } = await supabase
    .from('travelDays') 
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Failed to delete travelday:", error.message);
    throw error;
  }

  console.log("Successfully deleted travelday with ID:", id);
}