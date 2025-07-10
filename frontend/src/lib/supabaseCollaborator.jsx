import { supabase } from "./supabaseClient";


export async function addCollaborator(itineraryId, collaboratorUserId, role = "viewer") {
  const { data, error } = await supabase
    .from("itinerary_members")
    .insert([{
      itinerary_id: itineraryId,
      user_id: collaboratorUserId,
      role: role,
    }]);
  if (error) throw error;
  return data;
}

export async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users") // mirror of auth.users
    .select("id")
    .eq("email", email)
    .single();

  if (error) {
    console.error("User not found:", error.message);
    return null;
  }

  return data;
}

