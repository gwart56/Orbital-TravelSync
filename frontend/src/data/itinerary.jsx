import {v4 as genId} from "uuid";
import dayjs from 'dayjs'; // handles dates
import { createNewTravelDays } from "./travelDays";
import { supabase } from "../lib/supabaseClient";

//-------------------------------------------------------
//ITINERARY DATA TYPE
// {
//     id;
//     name;
//     startDate;
//     numOfDays;
// }


function newItinerary(name, startDate, numOfDays) {
    return {
        id: genId(),
        name,
        startDate,
        numOfDays
    };
}

export async function createNewItinForUser(userId, name, startDate, numOfDays) {
    const newItin = newItinerary(name, startDate, numOfDays);
    await addNewItineraryForUser(userId, newItin);
    await createNewTravelDays(newItin.id, numOfDays);
    return newItin;
}

async function addNewItineraryForUser(userId, newItin) {//STORES ITIN INTO SUPABASE 
    const { data, error } = await supabase
        .from('itins')
        .insert([{
            user_id: userId,
            id: newItin.id,
            title: newItin.name,
            itinerary_data: newItin,
        }
        ]);
    if (error) {
        console.error('Failed to create itinerary:', error);
        throw error;
    }
    return data; // contains the inserted row with 'id' and other columns
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

    console.log('itinarr',itinArray);
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

//LOAD: collaborating itins
export async function loadCollaboratingItineraries(userId) {
  // Step 1: get all itinerary IDs the user is a member of
  const { data: memberRows, error: memberError } = await supabase
    .from('itinerary_members')
    .select('itinerary_id')
    .eq('user_id', userId);

  if (memberError) throw memberError;

  const itineraryIds = memberRows.map(row => row.itinerary_id);
  if (itineraryIds.length === 0) return [];

  // Step 2: fetch all itins where the user is NOT the owner
  const { data: itins, error: itinsError } = await supabase
    .from('itins')
    .select('*')
    .in('id', itineraryIds)
    .neq('user_id', userId)
    .order('created_at', { ascending: false });

  if (itinsError) throw itinsError;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-SG', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  return itins.map(row => ({
    itinDbId: row.id,
    itin: row.itinerary_data,
    dateCreated: formatDate(row.created_at),
    owner: row.user_id,
  }));
}

// Load itineraries BUT ALSO WITH MEMBERS USER IDS
export async function loadItineraryRowById(itinDbId) {
  const { data, error } = await supabase
    .from('itins')
    .select('*, itinerary_members ( user_id )')
    .eq('id', itinDbId)
    .single();

  if (error) throw error;

  //returns data in this form:
//   {
//     id: "abc123",
//     user_id: "creator-user-id",
//     title: "Israel trip",
//     itinerary_data: {
//         id: "abc123",
//         name: "Israel trip",
//         startDate: "2025-08-01",
//         numOfDays: 5
//     },
//     created_at: "2025-07-01T12:00:00.000Z",
//     itinerary_members: [
//         { user_id: "collab-user-id-1" },
//         { user_id: "collab-user-id-2" }
//     ]
//   }
  return data;
}
