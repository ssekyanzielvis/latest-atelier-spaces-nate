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
            console.log('[Auth] Missing credentials')
            return null
          }

          const loginValue = String(credentials.username).trim()
          const submittedPassword = String(credentials.password)

          console.log('[Auth] Login attempt for:', loginValue)

          // Fix: .or() breaks with emails containing '@' in PostgREST filter strings.
          // Instead, run two separate queries — one by username, one by email.
          let admin: AdminRow | null = null

          // Try by username first
          const { data: byUsername, error: usernameError } = await supabaseAdmin
            .from('admins')
            .select('id, username, email, password_hash, full_name, role, is_active')
            .eq('username', loginValue)
            .maybeSingle() as { data: AdminRow | null; error: any }

          if (usernameError) {
            console.error('[Auth] Username query error:', usernameError)
          }

          if (byUsername) {
            admin = byUsername
            console.log('[Auth] Found admin by username')
          } else {
            // Try by email
            const { data: byEmail, error: emailError } = await supabaseAdmin
              .from('admins')
              .select('id, username, email, password_hash, full_name, role, is_active')
              .eq('email', loginValue)
              .maybeSingle() as { data: AdminRow | null; error: any }

            if (emailError) {
              console.error('[Auth] Email query error:', emailError)
            }

            if (byEmail) {
              admin = byEmail
              console.log('[Auth] Found admin by email')
            }
          }

          if (!admin) {
            console.log('[Auth] No admin found for:', loginValue)
            return null
          }

          if (!admin.is_active) {
            console.log('[Auth] Admin account is inactive:', loginValue)
            return null
          }

          const storedPasswordHash = typeof admin.password_hash === 'string'
            ? admin.password_hash
            : null

          if (!storedPasswordHash) {
            console.error('[Auth] No password_hash for admin:', {
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
            console.log('[Auth] bcrypt compare result:', isValid)
          } else {
            isValid = submittedPassword === storedPasswordHash
            if (isValid) {
              console.log('[Auth] Migrating plain-text password to bcrypt')
              const migratedHash = await hash(submittedPassword, 10)
              const adminsTable = supabaseAdmin.from('admins') as any
              await adminsTable
                .update({ password_hash: migratedHash })
                .eq('id', admin.id)
            }
          }

          if (!isValid) {
            console.log('[Auth] Password mismatch for:', loginValue)
            return null
          }

          // Update last login
          await supabaseAdmin
            .from('admins')
            // @ts-expect-error - Supabase type inference issue with RLS policies
            .update({ last_login: new Date().toISOString() })
            .eq('id', admin.id)

          console.log('[Auth] Login successful for:', loginValue)

          return {
            id: admin.id,
            name: admin.full_name || admin.username,
            email: admin.email,
          }
        } catch (error) {
          console.error('[Auth] Unexpected error:', error)
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
