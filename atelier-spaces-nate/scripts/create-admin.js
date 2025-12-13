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
  const admins = [
    {
      username: 'admin',
      email: 'admin@atelier.com',
      password: 'admin123',
      full_name: 'Administrator',
      role: 'admin',
    },
    {
      username: 'ssekyanzi',
      email: 'abdulsalamssekyanzi@gmail.com',
      password: 'Su4at3#0',
      full_name: 'Abdul Salam Ssekyanzi',
      role: 'super_admin',
    },
  ]

  try {
    for (const admin of admins) {
      // Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: admin.email,
        password: admin.password,
        email_confirm: true,
        user_metadata: {
          username: admin.username,
          full_name: admin.full_name,
          role: admin.role,
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`ℹ️  Auth user ${admin.email} already exists`)
        } else {
          console.error(`Error creating auth user ${admin.email}:`, authError.message)
          continue
        }
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(admin.password, 10)

      // Insert admin user in admins table
      const { data, error } = await supabase
        .from('admins')
        .insert([
          {
            id: authData?.user?.id,
            username: admin.username,
            email: admin.email,
            password_hash: passwordHash,
            full_name: admin.full_name,
            role: admin.role,
            is_active: true,
          },
        ])
        .select()

      if (error) {
        if (error.code === '23505') {
          console.log(`ℹ️  Admin record ${admin.username} already exists`)
        } else {
          throw error
        }
      } else {
        console.log(`✅ Admin user created successfully!`)
        console.log(`Username: ${admin.username}`)
        console.log(`Email: ${admin.email}`)
        console.log(`Role: ${admin.role}`)
        console.log('')
      }
    }
    console.log('\n🎉 All admin users processed!')
  } catch (error) {
    console.error('Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()
