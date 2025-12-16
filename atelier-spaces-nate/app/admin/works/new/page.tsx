'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'

const workSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Main image is required'),
  category_id: z.string().optional(),
  year: z.string().optional(),
  client: z.string().optional(),
  featured: z.boolean().optional(),
  gallery_image_1: z.string().optional(),
  gallery_image_2: z.string().optional(),
  gallery_image_3: z.string().optional(),
  gallery_image_4: z.string().optional(),
})

type WorkFormData = z.infer<typeof workSchema>

export default function NewWorkPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<WorkFormData>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      featured: false,
    },
  })

  const onSubmit = async (data: WorkFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Convert string year to number
      const submitData = {
        ...data,
        year: data.year ? parseInt(data.year) : undefined,
      }

      const response = await fetch('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to create work')
      }

      router.push('/admin/works')
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
        <h1 className="text-3xl font-bold text-gray-900">Add New Work</h1>
        <p className="text-gray-600 mt-2">Showcase your creative work</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Work Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter work title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
              Slug * <span className="text-gray-500 font-normal">(URL-friendly version)</span>
            </label>
            <input
              id="slug"
              type="text"
              {...register('slug')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="work-title"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Design concept, materials used, purpose and function, design process"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Main Work Image * <span className="text-gray-500 font-normal">(1200x1200 recommended)</span>
            </label>
            <ImageUpload
              folder="works"
              onChange={(url: string) => setValue('image', url)}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Best angle of the work in high resolution</p>
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-semibold text-gray-700 mb-2">
              Client
            </label>
            <input
              id="client"
              type="text"
              {...register('client')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Client name"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
              Year
            </label>
            <input
              id="year"
              type="number"
              {...register('year')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="2024"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              {...register('featured')}
              className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
              Feature this work on homepage
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <input
              id="category_id"
              type="text"
              {...register('category_id')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter category ID (optional)"
            />
            <p className="mt-1 text-xs text-gray-500">Select which category this work belongs to</p>
          </div>

          <div className="md:col-span-2 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery Images (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">Add up to 4 additional images to showcase your work from different angles</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gallery Image 1
                </label>
                <ImageUpload
                  value={undefined}
                  folder="works"
                  onChange={(url: string) => setValue('gallery_image_1', url)}
                  label="Upload Gallery Image 1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gallery Image 2
                </label>
                <ImageUpload
                  value={undefined}
                  folder="works"
                  onChange={(url: string) => setValue('gallery_image_2', url)}
                  label="Upload Gallery Image 2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gallery Image 3
                </label>
                <ImageUpload
                  value={undefined}
                  folder="works"
                  onChange={(url: string) => setValue('gallery_image_3', url)}
                  label="Upload Gallery Image 3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gallery Image 4
                </label>
                <ImageUpload
                  value={undefined}
                  folder="works"
                  onChange={(url: string) => setValue('gallery_image_4', url)}
                  label="Upload Gallery Image 4"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Work'}
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
