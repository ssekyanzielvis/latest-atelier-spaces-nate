/**
 * Fix All Admin Records
 *
 * This script:
 * 1. Lists all admins in the database
 * 2. Fixes any admins missing a username or password_hash
 * 3. For admins registered via the UI (who have Supabase auth but bad DB records),
 *    it generates a username from their email
 *
 * Usage: node scripts/fix-admin-records.js
 */

const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixAdminRecords() {
  console.log('=== Admin Records Diagnostic & Fix ===\n')

  // 1. List all admins
  const { data: admins, error } = await supabase
    .from('admins')
    .select('id, username, email, full_name, is_active, role, password_hash')

  if (error) {
    console.error('❌ Failed to fetch admins:', error.message)
    return
  }

  console.log(`Found ${admins.length} admin(s):\n`)

  for (const admin of admins) {
    const hasUsername = !!admin.username
    const hasHash = !!admin.password_hash
    const hashIsValid = hasHash && (
      admin.password_hash.startsWith('$2a$') ||
      admin.password_hash.startsWith('$2b$') ||
      admin.password_hash.startsWith('$2y$')
    )

    console.log(`─── ${admin.email}`)
    console.log(`    Username:      ${admin.username || '❌ MISSING'}`)
    console.log(`    is_active:     ${admin.is_active}`)
    console.log(`    role:          ${admin.role}`)
    console.log(`    password_hash: ${hasHash ? (hashIsValid ? '✅ bcrypt' : '⚠️  plain-text') : '❌ MISSING'}`)

    // Fix missing username
    if (!hasUsername) {
      const generatedUsername = admin.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_')
      console.log(`    → Fixing username: setting to "${generatedUsername}"`)

      const { error: updateErr } = await supabase
        .from('admins')
        .update({ username: generatedUsername })
        .eq('id', admin.id)

      if (updateErr) {
        console.error(`    ❌ Failed to set username:`, updateErr.message)
      } else {
        console.log(`    ✅ Username set to "${generatedUsername}"`)
      }
    }

    // Fix missing password_hash — set a temporary password they must change
    if (!hasHash) {
      const tempPassword = 'TempPass123!'
      const hash = await bcrypt.hash(tempPassword, 10)
      console.log(`    → Fixing password_hash: setting temporary password: ${tempPassword}`)

      const { error: updateErr } = await supabase
        .from('admins')
        .update({ password_hash: hash })
        .eq('id', admin.id)

      if (updateErr) {
        console.error(`    ❌ Failed to set password_hash:`, updateErr.message)
      } else {
        console.log(`    ✅ Temporary password set. Admin must log in with: ${tempPassword}`)
      }
    }

    console.log('')
  }

  console.log('\n=== Summary ===')
  console.log('All records processed. Admins with missing data have been fixed.')
  console.log('\nTo log in, use the email and either:')
  console.log('  - Your original password (if it was set correctly)')
  console.log('  - TempPass123! (if the password_hash was missing and was just fixed)')
  console.log('\nYou can reset individual passwords with: node scripts/reset-specific-admin.js <email> <newpassword>')
}

fixAdminRecords().catch(console.error)
