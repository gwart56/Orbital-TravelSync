import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'Missing userId' })

  try {
    // Step 1: Delete all itineraries for this user (cascade takes care of all related tables)
    const { error: itinDelError } = await supabaseAdmin
      .from('itins')
      .delete()
      .eq('user_id', userId)

    if (itinDelError) throw new Error(`Failed to delete itineraries: ${itinDelError.message}`)

    // Step 2: Delete user from Supabase Auth
    const { error: deleteUserError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (deleteUserError) throw new Error(deleteUserError.message)

    return res.status(200).json({ message: 'User and all associated data deleted successfully' })
  } catch (err) {
    console.error('Error deleting user and data:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
