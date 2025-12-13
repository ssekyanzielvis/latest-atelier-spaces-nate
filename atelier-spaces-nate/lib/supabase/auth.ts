import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

// Client-side Supabase Auth client
export function createSupabaseAuthClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Server-side admin client for user management
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
  )
}

export const supabaseAuthAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Sign in with email and password
export async function signInWithPassword(email: string, password: string) {
  const supabase = createSupabaseAuthClient()
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

// Sign out
export async function signOut() {
  const supabase = createSupabaseAuthClient()
  return await supabase.auth.signOut()
}

// Get current session
export async function getSession() {
  const supabase = createSupabaseAuthClient()
  return await supabase.auth.getSession()
}

// Get current user
export async function getCurrentUser() {
  const supabase = createSupabaseAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Create admin user in Supabase Auth
export async function createAuthUser(email: string, password: string, metadata: {
  username: string
  full_name: string
  role: string
}) {
  const { data, error } = await supabaseAuthAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  })

  return { data, error }
}

// Update admin user password
export async function updateUserPassword(userId: string, password: string) {
  const { data, error } = await supabaseAuthAdmin.auth.admin.updateUserById(
    userId,
    { password }
  )

  return { data, error }
}

// Delete admin user from Supabase Auth
export async function deleteAuthUser(userId: string) {
  const { data, error } = await supabaseAuthAdmin.auth.admin.deleteUser(userId)
  return { data, error }
}
