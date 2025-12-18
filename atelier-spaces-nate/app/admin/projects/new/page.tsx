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
      // Validate image upload
      if (!imageUrl) {
        setError('❌ Image Required: Please upload a project image before submitting')
        setIsSubmitting(false)
        return
      }

      const submitData = {
        ...data,
        image: imageUrl,
        year: data.year ? parseInt(data.year) : null,
      }

      console.log('🚀 Creating project:', { title: submitData.title, slug: submitData.slug })
      console.log('📦 Full submit data:', submitData)

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      console.log('📡 Response status:', response.status, response.statusText)

      let result
      try {
        result = await response.json()
        console.log('📥 Response data:', result)
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError)
        alert('Server returned invalid response. Check console for details.')
        throw new Error('Server returned invalid response. Please check your connection.')
      }

      if (!response.ok) {
        // Detailed error handling based on status code
        let errorMessage = ''
        
        switch (response.status) {
          case 400:
            errorMessage = `❌ Validation Error: ${result.error || 'Invalid data provided'}`
            break
          case 401:
            errorMessage = '❌ Authentication Error: Please log in again'
            break
          case 403:
            errorMessage = '❌ Permission Denied: You don\'t have access to create projects'
            break
          case 409:
            errorMessage = '❌ Duplicate Error: A project with this slug already exists'
            break
          case 500:
            errorMessage = `❌ Server Error: ${result.error || 'Database error occurred. Check if table exists.'}`
            break
          default:
            errorMessage = `❌ Error (${response.status}): ${result.error || 'Failed to create project'}`
        }
        
        console.error('API Error:', {
          status: response.status,
          error: result.error,
          details: result
        })
        
        throw new Error(errorMessage)
      }

      console.log('✅ Project created successfully:', result.data?.id)
      router.push('/admin/projects')
      router.refresh()
    } catch (err) {
      let errorMessage = 'An unexpected error occurred'
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = '❌ Network Error: Cannot connect to server. Check your internet connection.'
        } else if (err.message.includes('NetworkError')) {
          errorMessage = '❌ Network Error: Server is not responding. Try again later.'
        } else {
          errorMessage = err.message
        }
      }
      
      console.error('❌ Create project error:', {
        error: err,
        message: errorMessage,
        timestamp: new Date().toISOString()
      })
      
      // Show alert to ensure error is visible
      alert(`Failed to create project: ${errorMessage}`)
      
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
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Failed to Create Project</h3>
              <p className="text-sm text-red-700 whitespace-pre-wrap">{error}</p>
              <div className="mt-3 text-xs text-red-600">
                <p className="font-medium mb-1">Common solutions:</p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Make sure you're logged in as admin</li>
                  <li>Check that projects table exists in database</li>
                  <li>Verify storage bucket 'projects' is created</li>
                  <li>Ensure all required fields are filled</li>
                </ul>
              </div>
            </div>
          </div>
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
