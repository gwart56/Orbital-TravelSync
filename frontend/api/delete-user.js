// This API route handles the deletion of a user and their associated data

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'Missing userId' })

  try {
    // Step 1: Delete user-related data from your custom tables
    const tablesToClean = ['itineraries'] // Add any other tables with user data

    for (const table of tablesToClean) {
      const { error: tableError } = await supabaseAdmin
        .from(table)
        .delete()
        .eq('user_id', userId)

      if (tableError) {
        throw new Error(`Failed to delete data from ${table}: ${tableError.message}`)
      }
    }

    // Step 2: Delete user from Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (deleteError) throw new Error(deleteError.message)

    return res.status(200).json({ message: 'User and associated data deleted successfully' })
  } catch (err) {
    console.error('Error deleting user and data:', err.message)
    return res.status(500).json({ error: err.message })
  }
}

