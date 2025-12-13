'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'

const sloganSchema = z.object({
  main_slogan: z.string().min(1, 'Main slogan is required'),
  sub_slogan: z.string().optional(),
  background_image: z.string().optional(),
})

type SloganFormData = z.infer<typeof sloganSchema>

export default function NewSloganPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SloganFormData>({
    resolver: zodResolver(sloganSchema),
  })

  const onSubmit = async (data: SloganFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const submitData = {
        ...data,
        background_image: imageUrl || undefined,
      }

      const response = await fetch('/api/slogan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to create slogan section')
      }

      router.push('/admin/slogan')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Slogan Section</h1>
        <p className="text-gray-600 mt-2">Add a prominent banner with your main slogan</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <label htmlFor="main_slogan" className="block text-sm font-semibold text-gray-700 mb-2">
            Main Slogan * <span className="text-gray-500 font-normal">(3-8 words recommended)</span>
          </label>
          <input
            id="main_slogan"
            type="text"
            {...register('main_slogan')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Design That Transforms Spaces"
          />
          {errors.main_slogan && (
            <p className="mt-1 text-sm text-red-600">{errors.main_slogan.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Bold, impactful statement - shows large on homepage</p>
        </div>

        <div>
          <label htmlFor="sub_slogan" className="block text-sm font-semibold text-gray-700 mb-2">
            Sub Slogan <span className="text-gray-500 font-normal">(Supporting text)</span>
          </label>
          <textarea
            id="sub_slogan"
            {...register('sub_slogan')}
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Creating architectural excellence across Uganda"
          />
          <p className="mt-1 text-xs text-gray-500">Elaborates on main slogan (1-2 sentences)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Image <span className="text-gray-500 font-normal">(1920x600 recommended)</span>
          </label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="slogan"
            label="Upload Background Image"
          />
          <p className="mt-1 text-xs text-gray-500">Full-width background - use image with neutral areas for text overlay</p>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Slogan Section'}
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
