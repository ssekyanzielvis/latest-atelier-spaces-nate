'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import MediaUpload from '@/components/admin/MediaUpload'
import { FiUpload } from 'react-icons/fi'

export default function NewWorkCategoryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    cover_media: '',
    media_type: 'image' as 'image' | 'video',
    order_position: 0,
  })

  const handleMediaUpload = (url: string, type: 'image' | 'video') => {
    console.log('🎬 Media uploaded:', url, type)
    setFormData(prev => ({ ...prev, cover_media: url, media_type: type }))
    setError(null)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order_position' ? parseInt(value) || 0 : value,
    }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!formData.name.trim()) {
        throw new Error('Category name is required')
      }

      if (!formData.slug.trim()) {
        throw new Error('Slug is required')
      }

      // Create category
      const response = await fetch('/api/work-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          cover_media: formData.cover_media,
          cover_image: formData.cover_media,
          media_type: formData.media_type,
          order_position: formData.order_position,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create category')
      }

      console.log('Category created:', result)
      router.push('/admin/work-categories')
      router.refresh()
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Work Category</h1>
        <p className="text-gray-600 mt-2">Add a new work category with cover image or video</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        {/* Category Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="e.g., Residential Design"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            URL Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            placeholder="residential-design"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Auto-generated from name</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of this category..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          />
        </div>

        {/* Cover Media */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Cover Image or Video
          </label>
          <MediaUpload
            value={formData.cover_media}
            mediaType={formData.media_type}
            onChange={handleMediaUpload}
            folder="work-categories"
            acceptVideo={true}
          />
        </div>

        {/* Order Position */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            name="order_position"
            value={formData.order_position}
            onChange={handleInputChange}
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
