import { supabase } from "./supabaseClient";

// Upsert the user into public.users (runs on sign-up or sign-in)
export async function upsertUserToCloneTable(user) {
  const { id, email, user_metadata } = user;

  const { error } = await supabase
    .from('users')
    .upsert({
      id,
      email,
      name: user_metadata?.name || null
    });

  if (error) {
    console.error('Error syncing to public.users:', error.message);
  }
}

// Delete from public.users (runs on account delete)
export async function deleteUserFromCloneTable(userId) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    console.error('Error deleting from public.users:', error.message);
  }
}