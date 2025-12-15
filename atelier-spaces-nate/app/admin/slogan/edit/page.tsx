'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { SloganSection } from '@/types'

const sloganSchema = z.object({
  main_slogan: z.string().min(1, 'Main slogan text is required'),
  sub_slogan: z.string().optional(),
  background_image: z.string().min(1, 'Background image is required'),
})

type SloganFormData = z.infer<typeof sloganSchema>

export default function EditSloganPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sloganId, setSloganId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SloganFormData>({
    resolver: zodResolver(sloganSchema),
  })

  useEffect(() => {
    const fetchSlogan = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('slogan_section')
          .select('*')
          .single()

        if (error || !data) {
          setError('Slogan section not found')
          return
        }

        const slogan = data as SloganSection
        setSloganId(slogan.id)
        Object.keys(slogan).forEach((key) => {
          const value = (slogan as any)[key]
          if (value !== null && value !== undefined && key !== 'id') {
            setValue(key as keyof SloganFormData, value)
          }
        })
      } catch (err) {
        setError('Failed to load slogan section')
        console.error('Error loading slogan section:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlogan()
  }, [setValue])

  const onSubmit = async (data: SloganFormData) => {
    if (!sloganId) {
      setError('Slogan section ID not found')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/slogan?id=${sloganId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update slogan section')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin')
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Slogan Section</h1>
        <p className="text-gray-600 mt-2">Update your site slogan</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">✓ Slogan section updated successfully. Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="main_slogan" className="block text-sm font-semibold text-gray-700 mb-2">
              Main Slogan Text *
            </label>
            <textarea
              id="main_slogan"
              {...register('main_slogan')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your main slogan text"
            />
            {errors.main_slogan && <p className="mt-1 text-sm text-red-600">{errors.main_slogan.message}</p>}
          </div>

          <div>
            <label htmlFor="sub_slogan" className="block text-sm font-semibold text-gray-700 mb-2">
              Sub Slogan (Optional)
            </label>
            <textarea
              id="sub_slogan"
              {...register('sub_slogan')}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter your sub slogan text (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Background Image *
            </label>
            <ImageUpload folder="slogan" onChange={(url: string) => setValue('background_image', url)} />
            {errors.background_image && <p className="mt-1 text-sm text-red-600">{errors.background_image.message}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Slogan Section'}
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
