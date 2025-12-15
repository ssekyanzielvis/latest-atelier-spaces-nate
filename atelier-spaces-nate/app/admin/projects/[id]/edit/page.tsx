'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'

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

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single()

        if (error || !data) {
          setError('Project not found')
          return
        }

        // Populate form with project data
        Object.keys(data).forEach((key) => {
          const value = (data as any)[key]
          if (value !== null && value !== undefined) {
            setValue(key as keyof ProjectFormData, value)
          }
        })
      } catch (err) {
        setError('Failed to load project')
        console.error('Error loading project:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId, setValue])

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const submitData = {
        ...data,
        year: data.year ? parseInt(data.year) : undefined,
        area: data.area ? parseFloat(data.area) : undefined,
      }

      const response = await fetch(`/api/projects?id=${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update project')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/projects')
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
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-600 mt-2">Update project details</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">✓ Project updated successfully. Redirecting...</p>
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
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
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
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
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
              placeholder="Describe your project"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Main Project Image * <span className="text-gray-500 font-normal">(1920x1080 recommended)</span>
            </label>
            <ImageUpload folder="projects" onChange={(url: string) => setValue('image', url)} />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
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
              {...register('year')}
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
              step="0.01"
              {...register('area')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="1000"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select {...register('status')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent">
              <option value="">Select status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="proposed">Proposed</option>
            </select>
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
              placeholder="Category ID"
            />
          </div>

          <div className="flex items-center gap-3">
            <input id="featured" type="checkbox" {...register('featured')} className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black" />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
              Featured Project
            </label>
          </div>

          {/* Gallery Images */}
          {[1, 2, 3, 4].map((num) => (
            <div className="md:col-span-2" key={num}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Gallery Image {num} <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <ImageUpload folder="projects" onChange={(url: string) => setValue(`gallery_image_${num}` as keyof ProjectFormData, url)} />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Project'}
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
