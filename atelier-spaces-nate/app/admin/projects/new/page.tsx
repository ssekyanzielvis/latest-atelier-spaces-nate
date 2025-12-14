'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Main image is required'),
  client: z.string().optional(),
  location: z.string().optional(),
  year: z.string().optional(),
  area: z.string().optional(),
  category_id: z.string().optional(),
  status: z.string().optional(),
  featured: z.boolean().optional(),
  gallery_image_1: z.string().optional(),
  gallery_image_2: z.string().optional(),
  gallery_image_3: z.string().optional(),
  gallery_image_4: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      featured: false,
    },
  })

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Convert string numbers to actual numbers
      const submitData = {
        ...data,
        year: data.year ? parseInt(data.year) : undefined,
        area: data.area ? parseFloat(data.area) : undefined,
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to create project')
      }

      router.push('/admin/projects')
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
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-2">Add a new architectural project</p>
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
              Project Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter project title"
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
              placeholder="project-title"
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
              placeholder="Describe your project - tell the story, explain design choices, mention challenges and solutions"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Main Project Image * <span className="text-gray-500 font-normal">(1920x1080 recommended)</span>
            </label>
            <ImageUpload
              folder="projects"
              onChange={(url: string) => setValue('image', url)}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
            )}
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
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              type="text"
              {...register('location')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Project location"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
              Year
            </label>
            <input
              id="year"
              type="number"
              {...register('year', { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="2024"
            />
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-semibold text-gray-700 mb-2">
              Area <span className="text-gray-500 font-normal">(square meters)</span>
            </label>
            <input
              id="area"
              type="number"
              {...register('area', { valueAsNumber: true })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="450"
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <input
              id="category_id"
              type="text"
              {...register('category_id')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., Residential, Commercial"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Select status</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Proposed">Proposed</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
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
