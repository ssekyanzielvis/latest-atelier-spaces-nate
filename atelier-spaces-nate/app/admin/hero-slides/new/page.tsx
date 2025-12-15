'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'

const heroSlideSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  order_position: z.string().optional(),
  is_active: z.boolean().optional(),
})

type HeroSlideFormData = z.infer<typeof heroSlideSchema>

export default function NewHeroSlidePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HeroSlideFormData>({
    resolver: zodResolver(heroSlideSchema),
    defaultValues: {
      is_active: true,
    },
  })

  const onSubmit = async (data: HeroSlideFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      if (!imageUrl) {
        throw new Error('Please upload an image first')
      }

      const submitData = {
        ...data,
        image: imageUrl,
        order_position: data.order_position ? parseInt(data.order_position) : 1,
      }

      console.log('Submitting hero slide:', submitData)

      const response = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Failed response:', result)
        throw new Error(result.error || `Failed to create hero slide (${response.status})`)
      }

      console.log('Hero slide created successfully:', result)
      router.push('/admin/hero-slides')
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error in onSubmit:', errorMessage)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Hero Slide</h1>
        <p className="text-gray-600 mt-2">Create a new slide for your homepage hero section</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Slide Title * <span className="text-gray-500 font-normal">(3-6 words)</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Innovative Architectural Design"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Large text shown on the image</p>
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
            Subtitle <span className="text-gray-500 font-normal">(Supporting text)</span>
          </label>
          <input
            id="subtitle"
            type="text"
            {...register('subtitle')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Blending form with function"
          />
          <p className="mt-1 text-xs text-gray-500">Additional context or tagline (1-2 short sentences)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Image * <span className="text-gray-500 font-normal">(1920x1080 or larger)</span>
          </label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="hero-slides"
            label="Upload Hero Slide Image"
          />
          {!imageUrl && errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">High-quality image - will fill entire screen width</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cta_text" className="block text-sm font-semibold text-gray-700 mb-2">
              Call-to-Action Text
            </label>
            <input
              id="cta_text"
              type="text"
              {...register('cta_text')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="View Our Work"
            />
            <p className="mt-1 text-xs text-gray-500">Button text (leave empty for no button)</p>
          </div>

          <div>
            <label htmlFor="cta_link" className="block text-sm font-semibold text-gray-700 mb-2">
              Call-to-Action Link
            </label>
            <input
              id="cta_link"
              type="text"
              {...register('cta_link')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="/projects"
            />
            <p className="mt-1 text-xs text-gray-500">Where the button links to</p>
          </div>
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
          <p className="mt-1 text-xs text-gray-500">Lower numbers show first (1 for first slide, 2 for second)</p>
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
            Show this slide in rotation
          </label>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting || !imageUrl}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Add Hero Slide'}
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
