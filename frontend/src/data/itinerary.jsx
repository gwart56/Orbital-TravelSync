import {v4 as genId} from "uuid";
import dayjs from 'dayjs'; // handles dates
import { createNewTravelDays } from "./travelDays";

//-------------------------------------------------------
//ITINERARY DATA TYPE
// {
//     id;
//     name;
//     startDate;
// }


function newItinerary(name, startDate) {
    return {
        id: genId(),
        name,
        startDate
    };
}

export async function createNewItinForUser(userId, name, startDate, numOfDays) {
    const newItin = newItinerary(name, startDate);
    await addNewItineraryForUser(userId, newItin);
    await createNewTravelDays(newItin.id, numOfDays);
    return newItin;
}

export async function addNewItineraryForUser(userId, newItin) {//STORES ITIN INTO SUPABASE 
    const { data, error } = await supabase
        .from('itins')
        .insert([{
            user_id: userId,
            title: newItin.name,
            itinerary_data: newItin,
        }
        ]);
    if (error) {
        console.error('Failed to create itinerary:', error);
        throw error;
    }
    return data[0]; // contains the inserted row with 'id' and other columns
}

export async function updateItineraryById(itinDbId, updatedItin) {

    const { data, error } = await supabase
        .from('itins')
        .update({
            title: updatedItin.name,
            itinerary_data: updatedItin,
        })
        .eq('id', itinDbId)
        .select(); // get updated row back (optional)

    if (error) throw error;

    console.log("Updating supabase, itin with itinId: " + itinDbId);

    return data[0];
}

export async function loadAllItineraryForUser(userId) {
    const { data, error } = await supabase
    .from('itins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

    if (error) throw error;

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);

      // Format it to your local timezone (e.g. Singapore, GMT+8)
      const formatted = date.toLocaleString('en-SG', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      return formatted;
    }


    // Convert raw data to your Itinerary class instances
    const itinArray = data.map(row => ({
        itinDbId: row.id, // supabase db row ID, useful for updates/deletes
        itin: row.itinerary_data,
        dateCreated: formatDate(row.created_at)
    }));

    return itinArray;
}

export async function loadItineraryById(itinDbId) {
    //TODO: maybe might use ltr idk
    const { data, error } = await supabase
    .from('itins')
    .select('*')
    .eq('id', itinDbId)
    .single();

    if (error) throw error;
    return data.itinerary_data;
}

export async function deleteItineraryById(itinDbId) {
  const { error } = await supabase
    .from('itins') 
    .delete()
    .eq('id', itinDbId);

  if (error) {
    console.error("Failed to delete itinerary:", error.message);
    throw error;
  }

  console.log("Successfully deleted itinerary with ID:", itinDbId);
}