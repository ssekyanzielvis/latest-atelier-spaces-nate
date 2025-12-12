import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
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

          const { data: admin, error } = await supabaseAdmin
            .from('admins')
            .select('*')
            .eq('username', credentials.username)
            .single() as { data: AdminRow | null; error: any }

          if (error || !admin || !admin.is_active) {
            return null
          }

          const isValid = await compare(
            credentials.password as string,
            admin.password_hash
          )

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
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
})
