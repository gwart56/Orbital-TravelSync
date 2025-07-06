import { supabase } from "../lib/supabaseClient";
import {v4 as genId} from "uuid";

//-------------------------------------------------------
//ACTIVITY DATA TYPE
// {
//     activityId;
//     travelDayId; <---foreign key
//     name;
//     time;
//     locName;
//     locAddress;
// }

function newActivity(travelDayId, name, time, locName, locAddress) {
    return {
        activityId: genId(),
        travelDayId,
        name,
        time,
        locName,
        locAddress
    };
}

export async function createNewActivity(travelDayId) {
    const newAct = newActivity(travelDayId, "", "", "", "");
    await addActivityIntoDB(newAct);
    return newAct;
}

//FOR ADDING ACTIVITY(S) INTO SUPABASE
export async function addActivityIntoDB(activity) {// can accept one activity or array of activity
    const { error: daysError } = await supabase
    .from('activities')
    .insert(activity);

    if (daysError) {
        console.error('Failed to store activity:', daysError);
        throw daysError;
    }
}

export async function loadActivitiesByTravelDaysId(travelDayId) {//TODO: IMPLEMENT THIS CORRECTLY
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('travelDayId', travelDayId)
    // .order('time', { ascending: true }); // ensures days are in order

  if (error) {
    console.error('Error fetching activities: ', error);
    return [];
  }

  return data;
}

export async function loadactivityById(activityId) {
    //TODO: maybe might use ltr idk
    const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('activityId', activityId)
    .single();

    if (error) throw error;
    return data;
}

export async function updateactivityById(activityId, updatedactivity) {

    const { data, error } = await supabase
        .from('activities')
        .update(updatedactivity)
        .eq('activityId', activityId)
        .select(); // get updated row back (optional)

    if (error) throw error;

    console.log("Updating supabase, activity with id: " + activityId);

    return data[0];
}

export async function deleteactivityById(activityId) {
  const { error } = await supabase
    .from('activities') 
    .delete()
    .eq('activityId', activityId);

  if (error) {
    console.error("Failed to delete activity:", error.message);
    throw error;
  }

  console.log("Successfully deleted activity with ID:", activityId);
}