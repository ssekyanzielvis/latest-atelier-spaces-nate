import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare, hash } from 'bcryptjs'
import { supabaseAdmin } from './supabase/server'
import type { Database } from '@/types/database'

type AdminRow = Database['public']['Tables']['admins']['Row']

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null
          }

          const loginValue = String(credentials.username).trim()
          const submittedPassword = String(credentials.password)

          const { data: admin, error } = await supabaseAdmin
            .from('admins')
            .select('id, username, email, password_hash, full_name, role, is_active')
            .or(`username.eq.${loginValue},email.eq.${loginValue}`)
            .single() as { data: AdminRow | null; error: any }

          if (error || !admin || !admin.is_active) {
            return null
          }

          const storedPasswordHash = typeof admin.password_hash === 'string'
            ? admin.password_hash
            : null

          if (!storedPasswordHash) {
            console.error('Auth error: invalid password_hash type for admin', {
              username: admin.username,
              email: admin.email,
              passwordHashType: typeof admin.password_hash,
            })
            return null
          }

          let isValid = false

          // Support legacy plain-text values and migrate them to bcrypt on successful login.
          if (storedPasswordHash.startsWith('$2a$') || storedPasswordHash.startsWith('$2b$') || storedPasswordHash.startsWith('$2y$')) {
            isValid = await compare(submittedPassword, storedPasswordHash)
          } else {
            isValid = submittedPassword === storedPasswordHash
            if (isValid) {
              const migratedHash = await hash(submittedPassword, 10)
              await supabaseAdmin
                .from('admins')
                // @ts-expect-error - Supabase type inference issue with RLS policies
                .update({ password_hash: migratedHash })
                .eq('id', admin.id)
            }
          }

          if (!isValid) {
            return null
          }

          // Update last login
          await supabaseAdmin
            .from('admins')
            // @ts-expect-error - Supabase type inference issue with RLS policies
            .update({ last_login: new Date().toISOString() })
            .eq('id', admin.id)

          return {
            id: admin.id,
            name: admin.full_name || admin.username,
            email: admin.email,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  trustHost: true,
})
