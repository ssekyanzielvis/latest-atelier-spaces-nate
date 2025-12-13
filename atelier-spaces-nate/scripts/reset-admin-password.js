/**
 * Reset Admin Password
 * 
 * This script resets the admin user password
 */

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetPassword() {
  const username = 'admin'
  const newPassword = 'admin123'

  try {
    // First, let's check if the user exists and see what's in the database
    const { data: existingAdmin, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .single()

    if (fetchError) {
      console.error('Error fetching admin:', fetchError)
      console.log('\nLet me check all admins in the database...')
      
      const { data: allAdmins, error: allError } = await supabase
        .from('admins')
        .select('id, username, email, is_active, role')
      
      if (allError) {
        console.error('Error fetching all admins:', allError)
        return
      }
      
      console.log('All admins in database:')
      console.log(JSON.stringify(allAdmins, null, 2))
      return
    }

    console.log('Found admin user:')
    console.log(`- Username: ${existingAdmin.username}`)
    console.log(`- Email: ${existingAdmin.email}`)
    console.log(`- Role: ${existingAdmin.role}`)
    console.log(`- Active: ${existingAdmin.is_active}`)

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10)

    // Update the password
    const { error: updateError } = await supabase
      .from('admins')
      .update({ 
        password_hash: passwordHash,
        is_active: true
      })
      .eq('username', username)

    if (updateError) {
      console.error('Error updating password:', updateError)
      return
    }

    console.log('\n✅ Password reset successfully!')
    console.log(`Username: ${username}`)
    console.log(`New Password: ${newPassword}`)

  } catch (error) {
    console.error('Error:', error)
  }
}

resetPassword()
