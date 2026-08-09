'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import Link from 'next/link'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password is required'),
  fullName: z.string().min(2, 'Full name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

// Reusable eye icon button
function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1"
      tabIndex={-1}
      aria-label={show ? 'Hide password' : 'Show password'}
    >
      {show ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  )
}

export default function AdminRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      console.log('Registering new admin:', data.email)

      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Registration error:', result)
        setError(result.error || 'Failed to register admin')
        return
      }

      console.log('Admin registered successfully:', result)
      setSuccess(true)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 2000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.'
      console.error('Register error:', errorMessage, err)
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10">
            <div className="text-center">
              <div className="inline-block p-3 bg-green-100 rounded-xl mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Registered!</h1>
              <p className="text-gray-600 mt-3 text-sm">New admin account has been successfully created.</p>
              <p className="text-gray-500 mt-2 text-sm">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-black rounded-xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Register Admin</h1>
            <p className="text-gray-600 mt-3 text-sm">Create a new admin account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                {...register('fullName')}
                placeholder="Enter full name"
                className="h-12 text-base border-gray-300 focus:border-black focus:ring-black"
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Enter email address"
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="At least 8 characters"
                  className="h-12 text-base border-gray-300 focus:border-black focus:ring-black pr-12"
                  autoComplete="new-password"
                />
                <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="Confirm password"
                  className="h-12 text-base border-gray-300 focus:border-black focus:ring-black pr-12"
                  autoComplete="new-password"
                />
                <EyeToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.confirmPassword.message}
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
                  Registering...
                </span>
              ) : 'Register Admin'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link href="/admin/dashboard" className="block text-center text-sm text-gray-600 hover:text-gray-900 font-medium">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
