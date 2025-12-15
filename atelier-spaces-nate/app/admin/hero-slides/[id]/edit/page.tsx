'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { HeroSlide } from '@/types'

const heroSlideSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  link_url: z.string().optional(),
  order_position: z.number().optional(),
  is_active: z.boolean().optional(),
})

type HeroSlideFormData = z.infer<typeof heroSlideSchema>

export default function EditHeroSlidePage() {
  const router = useRouter()
  const params = useParams()
  const slideId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HeroSlideFormData>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      is_active: true,
      order_position: 0,
    },
  })

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('id', slideId)
          .single()

        if (error || !data) {
          setError('Hero slide not found')
          return
        }

        const slide = data as HeroSlide
        Object.keys(slide).forEach((key) => {
          const value = (slide as any)[key]
          if (value !== null && value !== undefined) {
            setValue(key as keyof HeroSlideFormData, value)
          }
        })
      } catch (err) {
        setError('Failed to load hero slide')
        console.error('Error loading hero slide:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlide()
  }, [slideId, setValue])

  const onSubmit = async (data: HeroSlideFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/hero-slides?id=${slideId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update hero slide')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/hero-slides')
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Hero Slide</h1>
        <p className="text-gray-600 mt-2">Update slide content and image</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">✓ Hero slide updated successfully. Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Slide Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter slide title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
              Subtitle
            </label>
            <textarea
              id="subtitle"
              {...register('subtitle')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Optional subtitle text"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slide Image *
            </label>
            <ImageUpload folder="hero-slides" onChange={(url: string) => setValue('image', url)} />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
          </div>

          <div>
            <label htmlFor="link_url" className="block text-sm font-semibold text-gray-700 mb-2">
              Link URL
            </label>
            <input
              id="link_url"
              type="text"
              {...register('link_url')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="https://example.com"
            />
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
            {isSubmitting ? 'Updating...' : 'Update Hero Slide'}
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
