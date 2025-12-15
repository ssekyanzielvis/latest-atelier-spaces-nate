'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { TeamMember } from '@/types'

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  image: z.string().min(1, 'Image is required'),
  bio: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  order_position: z.number().optional(),
  is_active: z.boolean().optional(),
})

type TeamMemberFormData = z.infer<typeof teamMemberSchema>

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      is_active: true,
      order_position: 0,
    },
  })

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('id', memberId)
          .single()

        if (error || !data) {
          setError('Team member not found')
          return
        }

        const member = data as TeamMember
        Object.keys(member).forEach((key) => {
          const value = (member as any)[key]
          if (value !== null && value !== undefined) {
            setValue(key as keyof TeamMemberFormData, value)
          }
        })
      } catch (err) {
        setError('Failed to load team member')
        console.error('Error loading team member:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMember()
  }, [memberId, setValue])

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/team?id=${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update team member')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/team')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Team Member</h1>
        <p className="text-gray-600 mt-2">Update team member details</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">✓ Team member updated successfully. Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">
                Position *
              </label>
              <input
                id="position"
                type="text"
                {...register('position')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Job title"
              />
              {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Profile Image *
            </label>
            <ImageUpload folder="team" onChange={(url: string) => setValue('image', url)} />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              {...register('bio')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Brief bio or description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="email@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                id="phone"
                type="text"
                {...register('phone')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="linkedin" className="block text-sm font-semibold text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                id="linkedin"
                type="text"
                {...register('linkedin')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-semibold text-gray-700 mb-2">
                Twitter Handle
              </label>
              <input
                id="twitter"
                type="text"
                {...register('twitter')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="@username"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="order_position" className="block text-sm font-semibold text-gray-700 mb-2">
                Display Order
              </label>
              <input
                id="order_position"
                type="number"
                {...register('order_position', { valueAsNumber: true })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div className="flex items-end">
              <label htmlFor="is_active" className="flex items-center gap-3 cursor-pointer">
                <input id="is_active" type="checkbox" {...register('is_active')} className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black" />
                <span className="text-sm font-semibold text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Team Member'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
