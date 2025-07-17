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

export async function deleteCollaboratorById(itineraryId, collaboratorUserId) {
  const { data, error } = await supabase
    .from("itinerary_members")
    .delete()
    .eq('user_id', collaboratorUserId)
    .eq('itinerary_id', itineraryId);
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

export async function findEmailByUserId(userId) {
  const { data, error } = await supabase
    .from("users") // mirror of auth.users
    .select("email")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Email not found:", error.message);
    return null;
  }

  console.log(data);
  return data;
}

export async function checkIfCollaboratorExists(itineraryId, userId) {
  const { data, error } = await supabase
    .from("itinerary_members")
    .select("*")
    .eq("itinerary_id", itineraryId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

// Loads all collaborators for a given itinerary, including their email and role
export async function loadCollaboratorsForItinerary(itineraryId) {
  const { data, error } = await supabase
    .from("itinerary_members")
    .select("user_id, role, users(email)")
    .eq("itinerary_id", itineraryId);

  if (error) throw error;

  // Format the result: { userId, role, email }
  return data.map((row) => ({
    userId: row.user_id,
    role: row.role,
    email: row.users?.email || "Unknown",
  }));
}

export async function updateCollaboratorRole(itineraryId, collaboratorUserId, newRole) {
  const { data, error } = await supabase
    .from("itinerary_members")
    .update([{
      role: newRole,
    }])
    .eq('user_id', collaboratorUserId)
    .eq('itinerary_id', itineraryId);
  if (error) throw error;
  return data;
}

