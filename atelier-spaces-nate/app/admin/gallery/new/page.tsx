'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiUpload, FiCheck, FiX } from 'react-icons/fi'
import ImageUpload from '@/components/admin/ImageUpload'
import { showToast } from '@/components/ToastNotifications'

export default function NewGalleryItemPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    order_position: 0,
    is_active: true,
  })

  const handleImageUpload = (url: string) => {
    console.log('🖼️ Image uploaded:', url)
    setFormData(prev => ({ ...prev, image_url: url }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    if (!formData.image_url) {
      setError('Please upload an image')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('📤 Submitting gallery item...')
      
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('❌ API error:', result)
        
        // Handle different error types
        if (result.details && Array.isArray(result.details)) {
          // Validation errors
          throw new Error(`Validation failed: ${result.details.join(', ')}`)
        } else if (result.details) {
          // Database or other detailed errors
          throw new Error(`${result.error}: ${result.details}`)
        } else {
          throw new Error(result.error || 'Failed to create gallery item')
        }
      }

      console.log('✅ Gallery item created successfully:', result.id)
      showToast('Gallery item created successfully! 🎉', 'success')
      setTimeout(() => {
        router.push('/admin/gallery')
        router.refresh()
      }, 1000)
    } catch (err: any) {
      console.error('❌ Error creating gallery item:', err)
      setError(err.message || 'An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Gallery Item</h1>
        <p className="text-gray-600 mt-1">Upload a new image to your gallery</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <FiX className="flex-shrink-0" size={20} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image <span className="text-red-500">*</span>
          </label>
          <ImageUpload
            value={formData.image_url}
            onChange={handleImageUpload}
            folder="gallery"
          />
          {formData.image_url && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <FiCheck size={16} />
              <span>Image uploaded successfully</span>
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter image title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter description (optional)"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Architecture, Interior, Planning"
          />
        </div>

        {/* Order Position */}
        <div>
          <label htmlFor="order_position" className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            id="order_position"
            value={formData.order_position}
            onChange={(e) => setFormData(prev => ({ ...prev, order_position: parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
          <p className="mt-1 text-sm text-gray-500">Lower numbers appear first</p>
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Active (visible on website)
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <FiUpload size={18} />
                Add to Gallery
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
