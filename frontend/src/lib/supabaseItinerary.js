import { supabase } from "./supabaseClient";
import { defaultItin, Itinerary } from "../data/activity";

export async function addItineraryForUser(userId) {
    const plainItin = JSON.parse(JSON.stringify(defaultItin)); // convert class to plain object

    const { data, error } = await supabase
    .from('itineraries')
    .insert([
      {
        user_id: userId,
        title: plainItin.name,
        itinerary_data: plainItin,
      }
    ])
    .select(); // get inserted row back (optional, may or may not remove this later)

    console.log("adding to supabase, itin with userId: " + userId);

    if (error) throw error;
    return data[0]; // contains the inserted row with 'id' and other columns
}

export async function updateItineraryById(itinDbId, updatedItin) {
    const plainItinerary = JSON.parse(JSON.stringify(updatedItin));

    const { data, error } = await supabase
        .from('itineraries')
        .update({
            title: plainItinerary.name,
            itinerary_data: plainItinerary,
        })
        .eq('id', itinDbId)
        .select(); // get updated row back (optional)

    if (error) throw error;

    console.log("updating supabase, itin with itinId: " + itinDbId);

    return data[0];
}

export async function loadAllItineraryForUser(userId) {
    const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

    if (error) throw error;

    // Convert raw data to your Itinerary class instances
    const itinArray = data.map(row => ({
        itinDbId: row.id, // supabase db row ID, useful for updates/deletes
        itin: Itinerary.fromJSON(row.itinerary_data)
    }));

    return itinArray;
}

export async function loadItineraryById(itinDbId) {
    //TODO: maybe might use ltr idk
    const { data, error } = await supabase
    .from('itineraries')
    .select('*')
    .eq('id', itinDbId)
    .single();

    if (error) throw error;
    return Itinerary.fromJSON(data.itinerary_data);
}