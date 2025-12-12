/**
 * Create First Admin User
 * 
 * This script creates the first admin user in your Supabase database.
 * Run this after setting up the database schema.
 * 
 * Usage:
 * 1. Update SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * 2. Run: node scripts/create-admin.js
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

async function createAdmin() {
  const username = 'admin'
  const email = 'admin@atelier.com'
  const password = 'admin123' // Change this to a secure password
  const fullName = 'Administrator'

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    // Insert admin user
    const { data, error } = await supabase
      .from('admins')
      .insert([
        {
          username,
          email,
          password_hash: passwordHash,
          full_name: fullName,
          role: 'admin',
          is_active: true,
        },
      ])
      .select()

    if (error) {
      if (error.code === '23505') {
        console.log('Admin user already exists')
      } else {
        throw error
      }
    } else {
      console.log('✅ Admin user created successfully!')
      console.log('Username:', username)
      console.log('Email:', email)
      console.log('Password:', password)
      console.log('\n⚠️  IMPORTANT: Change the password after first login!')
    }
  } catch (error) {
    console.error('Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()
