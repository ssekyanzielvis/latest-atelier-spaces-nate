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
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  client: z.string().optional(),
  year: z.string().optional(),
  designer: z.string().optional(),
  duration: z.string().optional(),
  image: z.string().min(1, 'Project image is required'),
  other_info: z.string().optional(),
  featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

export default function NewProjectPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
    defaultValues: {
      featured: false,
      is_published: true,
    },
  })

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      if (!imageUrl) {
        throw new Error('Please upload a project image first')
      }

      const submitData = {
        ...data,
        image: imageUrl,
        year: data.year ? parseInt(data.year) : null,
      }

      console.log('Submitting project:', submitData)

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Failed to create project (Status: ${response.status})`)
      }

      console.log('Project created successfully')
      router.push('/admin/projects')
      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      console.error('Error:', errorMessage, err)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600 mt-2">Add a new architectural project to your portfolio</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        {/* Title and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Modern Residential Complex"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
              Slug * <span className="text-gray-500 font-normal">(URL-friendly)</span>
            </label>
            <input
              id="slug"
              type="text"
              {...register('slug')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="modern-residential-complex"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
            Location *
          </label>
          <input
            id="location"
            type="text"
            {...register('location')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Nairobi, Kenya"
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Detailed project description including design concept, materials used, and key features..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="client" className="block text-sm font-semibold text-gray-700 mb-2">
              Client Name
            </label>
            <input
              id="client"
              type="text"
              {...register('client')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Client or Developer Name"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-semibold text-gray-700 mb-2">
              Year of Initiation
            </label>
            <input
              id="year"
              type="number"
              {...register('year')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="2024"
            />
          </div>

          <div>
            <label htmlFor="designer" className="block text-sm font-semibold text-gray-700 mb-2">
              Project Designer
            </label>
            <input
              id="designer"
              type="text"
              {...register('designer')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Designer or Team Name"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-2">
              Project Duration
            </label>
            <input
              id="duration"
              type="text"
              {...register('duration')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="e.g., 18 months, 2 years"
            />
          </div>
        </div>

        {/* Project Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Project Image *
          </label>
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="projects"
            label="Upload Project Image"
          />
          {!imageUrl && (
            <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ Project image is required
            </p>
          )}
        </div>

        {/* Other Info */}
        <div>
          <label htmlFor="other_info" className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Information <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <textarea
            id="other_info"
            {...register('other_info')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Any additional information about the project..."
          />
        </div>

        {/* Publication Settings */}
        <div className="border-t pt-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Publication Settings</h3>
          
          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              {...register('featured')}
              className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Feature this project on homepage
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="is_published"
              type="checkbox"
              {...register('is_published')}
              defaultChecked
              className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
              Publish this project
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting || !imageUrl}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            title={!imageUrl ? 'Please upload an image first' : ''}
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
