'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'

const teamMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.string().min(1, 'Position is required'),
  image: z.string().min(1, 'Photo is required'),
  bio: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  order_position: z.string().optional(),
  is_active: z.boolean().optional(),
})

type TeamMemberFormData = z.infer<typeof teamMemberSchema>

export default function NewTeamMemberPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
  })

  const onSubmit = async (data: TeamMemberFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Prepare data for submission
      const submitData: any = {
        name: data.name,
        position: data.position,
        image: data.image,
        bio: data.bio || null,
        email: data.email || null,
        phone: data.phone || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
        order_position: data.order_position ? parseInt(String(data.order_position)) : 0,
        is_active: data.is_active ?? true,
      }

      console.log('Submitting team member:', submitData)

      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()
      console.log('Response:', result)

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add team member')
      }

      router.push('/admin/team')
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Team Member</h1>
        <p className="text-gray-600 mt-2">Add a new member to your team</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-semibold text-gray-700 mb-2">
              Position / Role *
            </label>
            <input
              id="position"
              type="text"
              {...register('position')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Senior Architect"
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
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
              placeholder="+1234567890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Professional Photo * <span className="text-gray-500 font-normal">(500x500 recommended, square)</span>
            </label>
            <ImageUpload
              folder="team"
              onChange={(url: string) => setValue('image', url)}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Clear headshot with white or neutral background preferred</p>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
              Biography
            </label>
            <textarea
              id="bio"
              {...register('bio')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Education background, experience, specializations, achievements (2-3 paragraphs)"
            />
          </div>

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
              Twitter URL
            </label>
            <input
              id="twitter"
              type="text"
              {...register('twitter')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label htmlFor="order_position" className="block text-sm font-semibold text-gray-700 mb-2">
              Display Order
            </label>
            <input
              id="order_position"
              type="number"
              {...register('order_position')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="1"
            />
            <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="is_active"
              type="checkbox"
              {...register('is_active')}
              defaultChecked
              className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
              Show on website
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add Team Member'}
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
