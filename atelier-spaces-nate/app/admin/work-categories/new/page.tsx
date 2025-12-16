'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { FiUpload, FiX } from 'react-icons/fi'

export default function NewWorkCategoryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    order_position: 0,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setFile(selectedFile)

    // Generate preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPreview(event.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
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

      let coverImageUrl: string | null = null

      // Upload cover image if provided
      if (file) {
        console.log('Uploading cover image:', { name: file.name, size: file.size, type: file.type })

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('work-categories')
          .upload(fileName, file)

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(uploadError.message || 'Failed to upload cover image')
        }

        console.log('File uploaded successfully:', uploadData)

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('work-categories')
          .getPublicUrl(fileName)

        coverImageUrl = urlData?.publicUrl

        if (!coverImageUrl) {
          throw new Error('Failed to get cover image URL')
        }

        console.log('Cover image URL:', coverImageUrl)
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
          cover_image: coverImageUrl,
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
        <p className="text-gray-600 mt-2">Add a new work category with cover image</p>
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

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Cover Image
          </label>
          {preview ? (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                }}
                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-700 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 100MB</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
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
