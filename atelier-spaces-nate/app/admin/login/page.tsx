'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { signInWithPassword } from '@/lib/supabase/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
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
      const { data: authData, error: authError } = await signInWithPassword(
        data.email,
        data.password
      )

      if (authError || !authData.user) {
        setError('Invalid email or password')
        return
      }

      // Verify user is an admin
      const { data: admin, error: adminError } = await supabaseAdmin
        .from('admins')
        .select('id, is_active, role')
        .eq('email', data.email)
        .single()

      if (adminError || !admin || !admin.is_active) {
        setError('Access denied. Admin account required.')
        await signInWithPassword(data.email, data.password) // Sign out
        return
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', err)
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

        <p className="text-center text-sm text-muted-foreground mt-4">
          Protected area - Authorized personnel only
        </p>
      </div>
    </div>
  )
}
