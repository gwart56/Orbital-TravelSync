// import { supabase } from "./supabaseClient";
// import { createNewItin, Itinerary } from "../data/activity";

import { useNavigate } from "react-router-dom";

// export async function addItineraryForUser(userId, name, startDate, numDays) {
//     const plainItin = JSON.parse(JSON.stringify(createNewItin(name, startDate, numDays))); // convert class to plain object

//     const { data, error } = await supabase
//     .from('itineraries')
//     .insert([
//       {
//         user_id: userId,
//         title: plainItin.name,
//         itinerary_data: plainItin,
//       }
//     ])
//     .select(); // get inserted row back (optional, may or may not remove this later)

//     console.log("Adding to supabase, itin with userId: " + userId);

//     if (error) throw error;
//     return data[0]; // contains the inserted row with 'id' and other columns
// }

// export async function updateItineraryById(itinDbId, updatedItin) {
//     const plainItinerary = JSON.parse(JSON.stringify(updatedItin));

//     const { data, error } = await supabase
//         .from('itineraries')
//         .update({
//             title: plainItinerary.name,
//             itinerary_data: plainItinerary,
//         })
//         .eq('id', itinDbId)
//         .select(); // get updated row back (optional)

//     if (error) throw error;

//     console.log("Updating supabase, itin with itinId: " + itinDbId);

//     return data[0];
// }

// export async function loadAllItineraryForUser(userId) {
//     const { data, error } = await supabase
//     .from('itineraries')
//     .select('*')
//     .eq('user_id', userId)
//     .order('created_at', { ascending: false });

//     if (error) throw error;

//     const formatDate = (dateStr) => {
//       const date = new Date(dateStr);

//       // Format it to your local timezone (e.g. Singapore, GMT+8)
//       const formatted = date.toLocaleString('en-SG', {
//         year: 'numeric',
//         month: 'short',
//         day: '2-digit',
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true
//       });

//       return formatted;
//     }


//     // Convert raw data to your Itinerary class instances
//     const itinArray = data.map(row => ({
//         itinDbId: row.id, // supabase db row ID, useful for updates/deletes
//         itin: Itinerary.fromJSON(row.itinerary_data),
//         dateCreated: formatDate(row.created_at)
//     }));

//     return itinArray;
// }

// export async function loadItineraryById(itinDbId) {
//     //TODO: maybe might use ltr idk
//     const { data, error } = await supabase
//     .from('itineraries')
//     .select('*')
//     .eq('id', itinDbId)
//     .single();

//     if (error) throw error;
//     return Itinerary.fromJSON(data.itinerary_data);
// }

// export async function deleteItineraryById(itinDbId) {
//   const { error } = await supabase
//     .from('itineraries') 
//     .delete()
//     .eq('id', itinDbId);

//   if (error) {
//     console.error("Failed to delete itinerary:", error.message);
//     throw error;
//   }

//   console.log("Successfully deleted itinerary with ID:", itinDbId);
// }
// const navigate = useNavigate();

// export const fetchItin = async (itinDbId, setItin, setItinMeta) => {
//         try {
//           // const loadedItin = await loadItineraryById(itinDbId); //wait to get itin class obj by id from supabase
//           const data = await loadItineraryRowById(itinDbId); // gives {id, user_id, itinerary_data, created_at, itinerary_members(ARRAY)}
          
//           setItinMeta(data);

//           const creatorId = data.user_id;
//           const itinMembers = data.itinerary_members;
//           const memberDetails = itinMembers.find(m => m.user_id == sessionUserId);

//           console.log("session user", sessionUserId);
//           console.log("itin user id", creatorId);

//           if (sessionUserId !== creatorId && !memberDetails) {
//             alert("You do not have permission to view this itinerary.");
//             navigate('/');
//             return;
//           }

//           const loadedItin = data.itinerary_data;
//           setItin(loadedItin);
//         } catch (err) {
//           console.error("Failed to load itinerary", err);
//         }
//       }