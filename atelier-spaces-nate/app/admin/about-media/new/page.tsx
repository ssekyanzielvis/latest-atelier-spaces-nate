'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { FiUpload, FiX } from 'react-icons/fi'

export default function AddAboutMediaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    order_position: 0,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const type = selectedFile.type.startsWith('video/') ? 'video' : 'image'
    setFile(selectedFile)
    setFileType(type)

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!file || !fileType) {
        throw new Error('Please select a file')
      }

      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }

      if (!formData.caption.trim()) {
        throw new Error('Caption is required')
      }

      console.log('Uploading file:', { name: file.name, size: file.size, type: file.type })

      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('about-media')
        .upload(fileName, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(uploadError.message || 'Failed to upload file')
      }

      console.log('File uploaded successfully:', uploadData)

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('about-media')
        .getPublicUrl(fileName)

      const fileUrl = urlData?.publicUrl

      if (!fileUrl) {
        throw new Error('Failed to get file URL')
      }

      console.log('File URL:', fileUrl)

      // Create media item in database
      const response = await fetch('/api/about-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          caption: formData.caption,
          file_url: fileUrl,
          file_type: fileType,
          order_position: formData.order_position,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create media item')
      }

      console.log('Media item created:', result)
      router.push('/admin/about-media')
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
        <h1 className="text-3xl font-bold text-gray-900">Add Media to About Gallery</h1>
        <p className="text-gray-600 mt-2">Upload an image or video for the about section</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Image or Video *
          </label>
          {preview ? (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              {fileType === 'image' ? (
                <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
              ) : (
                <video src={preview} controls className="w-full h-64 object-cover" />
              )}
              <button
                type="button"
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                  setFileType(null)
                }}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              >
                <FiX size={20} className="text-gray-900" />
              </button>
            </div>
          ) : (
            <label className="block">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
                <FiUpload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">PNG, JPG, GIF, MP4, WebM (max 100MB)</p>
              </div>
            </label>
          )}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Title *
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="e.g., Mweso Board, Uganda Cup, Londonga Arch"
          />
        </div>

        {/* Caption */}
        <div>
          <label htmlFor="caption" className="block text-sm font-semibold text-gray-700 mb-2">
            Caption *
          </label>
          <textarea
            id="caption"
            name="caption"
            value={formData.caption}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            placeholder="Add a descriptive caption for this media item"
          />
        </div>

        {/* Order Position */}
        <div>
          <label htmlFor="order_position" className="block text-sm font-semibold text-gray-700 mb-2">
            Display Order
          </label>
          <input
            id="order_position"
            type="number"
            name="order_position"
            value={formData.order_position}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !file}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Media Item'}
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
