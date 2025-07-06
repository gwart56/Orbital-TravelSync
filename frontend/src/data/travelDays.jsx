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

export async function createNewTravelDays(itineraryId, numOfDays) { //intitialises numOfDays length array of travelDays
    const travelDays = Array.from({ length: numOfDays }, (_, i) => (
        newTravelDay(itineraryId, i)
    ));
    await addTravelDaysForItin(travelDays);
}

//FOR ADDING TRAVELDAY(S) INTO SUPABASE
async function addTravelDaysForItin(travelDays) {// can accept one travel day or array of traveldays
    const { error: daysError } = await supabase
    .from('travel_days')
    .insert(travelDays);

    if (daysError) {
        console.error('Failed to store travel days:', daysError);
        throw daysError;
    }
}

export async function getTravelDaysByItineraryId(itineraryId) {//TODO: IMPLEMENT THIS CORRECTLY
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