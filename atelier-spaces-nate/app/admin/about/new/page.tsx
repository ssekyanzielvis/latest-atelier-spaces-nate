'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'

const aboutSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  mission: z.string().optional(),
  vision: z.string().optional(),
  values: z.string().optional(),
  image: z.string().optional(),
})

type AboutFormData = z.infer<typeof aboutSchema>

export default function NewAboutPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
  })

  const onSubmit = async (data: AboutFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const submitData = {
        ...data,
        image: imageUrl || undefined,
      }

      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to create about section')
      }

      router.push('/admin/about')
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
        <h1 className="text-3xl font-bold text-gray-900">Create About Section</h1>
        <p className="text-gray-600 mt-2">Add your studio&apos;s story and information</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="About Atelier Spaces Nate"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            Content *
          </label>
          <textarea
            id="content"
            {...register('content')}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Your studio's story, philosophy and approach, what makes you unique..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
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
            placeholder="Your core purpose and what you aim to achieve (1-2 sentences)"
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
            placeholder="Your future goals and where you're heading (1-2 sentences)"
          />
        </div>

        <div>
          <label htmlFor="values" className="block text-sm font-semibold text-gray-700 mb-2">
            Core Values
          </label>
          <textarea
            id="values"
            {...register('values')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="What you stand for and your guiding principles (can be bullet points)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            About Section Image <span className="text-gray-500 font-normal">(800x600 recommended)</span>
          </label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="about"
            label="Upload About Image"
          />
          <p className="mt-1 text-xs text-gray-500">Team photo, studio photo, or project photo</p>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create About Section'}
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
