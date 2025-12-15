'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseAuthClient()

      console.log('Attempting login with email:', data.email)

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (authError || !authData.user) {
        console.error('Auth error:', authError)
        setError(authError?.message || 'Invalid email or password')
        return
      }

      console.log('Login successful for user:', authData.user.id)

      // Verify user is an admin in the admins table
      const { data: adminData, error: adminError } = (await (supabase
        .from('admins') as any)
        .select('id, is_active, role')
        .eq('email', data.email)
        .single()) as any

      const admin = adminData as { id: string; is_active: boolean; role: string } | null

      if (adminError || !admin || !admin.is_active) {
        console.error('Admin check error:', adminError)
        setError('Access denied. Admin account required.')
        await supabase.auth.signOut()
        return
      }

      console.log('Admin verified:', admin.id)
      
      // Get current session to verify it's set
      const { data: sessionData } = await supabase.auth.getSession()
      console.log('Session after login:', sessionData?.session?.user?.id)
      const accessToken = sessionData?.session?.access_token
      const refreshToken = sessionData?.session?.refresh_token
      console.log('Auth token:', accessToken?.substring(0, 20) + '...')
      
      // Call server API to set cookies with the tokens
      if (accessToken) {
        console.log('Calling API to set cookies...')
        try {
          const cookieResponse = await fetch('/api/admin/set-cookies', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              accessToken,
              refreshToken,
            }),
          })

          if (cookieResponse.ok) {
            console.log('Cookies set successfully via API')
          } else {
            console.error('Failed to set cookies via API:', cookieResponse.status)
          }
        } catch (cookieErr) {
          console.error('Error calling set-cookies API:', cookieErr)
        }
      }
      
      // Check cookies in browser
      console.log('Document cookies:', document.cookie.substring(0, 100))
      
      // Wait a moment for session to be established and cookies to be set
      await new Promise(resolve => setTimeout(resolve, 800))
      
      console.log('Redirecting to dashboard...')
      console.log('Before router.push - pathname:', window.location.pathname)
      
      try {
        router.push('/admin/dashboard')
        console.log('router.push called successfully')
      } catch (routerErr) {
        console.error('router.push error:', routerErr)
      }
      
      try {
        router.refresh()
        console.log('router.refresh called successfully')
      } catch (refreshErr) {
        console.error('router.refresh error:', refreshErr)
      }
      
      console.log('After redirect - pathname:', window.location.pathname)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.'
      console.error('[CATCH ERROR]', errorMessage)
      console.error('[FULL ERROR OBJECT]', err)
      if (err instanceof Error) {
        console.error('[ERROR STACK]', err.stack)
      }
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-black rounded-xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-3 text-sm">Sign in to access the admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter your email"
                className="h-12 text-base border-gray-300 focus:border-black focus:ring-black"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter your password"
                className="h-12 text-base border-gray-300 focus:border-black focus:ring-black"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-sm text-red-700 flex items-start gap-2">
                <span className="text-lg">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base font-semibold bg-black hover:bg-gray-800 transition-colors" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          Protected area - Authorized personnel only
        </p>
      </div>
    </div>
  )
}
