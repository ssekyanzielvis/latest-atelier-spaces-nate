'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { AboutSection } from '@/types'

const aboutSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().min(1, 'Image is required'),
  mission: z.string().optional(),
  vision: z.string().optional(),
  values: z.string().optional(),
})

type AboutFormData = z.infer<typeof aboutSchema>

export default function EditAboutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [aboutId, setAboutId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
  })

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('about_section')
          .select('*')
          .single()

        if (error || !data) {
          setError('About section not found')
          return
        }

        const about = data as AboutSection
        setAboutId(about.id)
        Object.keys(about).forEach((key) => {
          const value = (about as any)[key]
          if (value !== null && value !== undefined && key !== 'id') {
            setValue(key as keyof AboutFormData, value)
          }
        })
      } catch (err) {
        setError('Failed to load about section')
        console.error('Error loading about section:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAbout()
  }, [setValue])

  const onSubmit = async (data: AboutFormData) => {
    if (!aboutId) {
      setError('About section ID not found')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/about?id=${aboutId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update about section')
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
        <h1 className="text-3xl font-bold text-gray-900">Edit About Section</h1>
        <p className="text-gray-600 mt-2">Update your about page content</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">✓ About section updated successfully. Redirecting...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Section Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="About us"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              Main Content *
            </label>
            <textarea
              id="content"
              {...register('content')}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Main about page content"
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Section Image *
            </label>
            <ImageUpload folder="about" onChange={(url: string) => setValue('image', url)} />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
          </div>

          <div>
            <label htmlFor="mission" className="block text-sm font-semibold text-gray-700 mb-2">
              Mission Statement
            </label>
            <textarea
              id="mission"
              {...register('mission')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Our mission is..."
            />
          </div>

          <div>
            <label htmlFor="vision" className="block text-sm font-semibold text-gray-700 mb-2">
              Vision Statement
            </label>
            <textarea
              id="vision"
              {...register('vision')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Our vision is..."
            />
          </div>

          <div>
            <label htmlFor="values" className="block text-sm font-semibold text-gray-700 mb-2">
              Core Values
            </label>
            <textarea
              id="values"
              {...register('values')}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Our core values are..."
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update About Section'}
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
