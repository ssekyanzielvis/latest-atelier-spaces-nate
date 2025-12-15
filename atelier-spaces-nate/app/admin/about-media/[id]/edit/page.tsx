'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { FiUpload, FiX } from 'react-icons/fi'

interface MediaItem {
  id: string
  title: string
  caption: string
  file_url: string
  file_type: 'image' | 'video'
  order_position: number
  is_active: boolean
}

export default function EditAboutMediaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null)
  const [originalFileType, setOriginalFileType] = useState<'image' | 'video' | null>(null)

  const [formData, setFormData] = useState<MediaItem | null>(null)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/about-media?id=${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch item')
        }

        setFormData(data)
        setPreview(data.file_url)
        setOriginalFileType(data.file_type)
        setFileType(data.file_type)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchItem()
  }, [id])

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
    if (!formData) return

    const { name, value } = e.target
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]: name === 'order_position' ? parseInt(value) || 0 : value,
          }
        : null
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }

      if (!formData.caption.trim()) {
        throw new Error('Caption is required')
      }

      let fileUrl = formData.file_url
      let newFileType = fileType || formData.file_type

      // If a new file was selected, upload it
      if (file) {
        console.log('Uploading new file:', { name: file.name, size: file.size })

        // Delete old file if it exists
        try {
          const oldFilePath = formData.file_url.split('about-media/')[1]
          if (oldFilePath) {
            await supabase.storage
              .from('about-media')
              .remove([`about-media/${oldFilePath}`])
          }
        } catch (err) {
          console.error('Error deleting old file:', err)
        }

        // Upload new file
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
        const uploadPath = `about-media/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('about-media')
          .upload(uploadPath, file)

        if (uploadError) {
          throw new Error(uploadError.message || 'Failed to upload file')
        }

        console.log('File uploaded successfully:', uploadData)

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('about-media')
          .getPublicUrl(uploadPath)

        fileUrl = urlData?.publicUrl || formData.file_url
      }

      // Update media item in database
      const response = await fetch('/api/about-media', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: formData.title,
          caption: formData.caption,
          file_url: fileUrl,
          file_type: newFileType,
          order_position: formData.order_position,
          is_active: formData.is_active,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update media item')
      }

      console.log('Media item updated:', result)
      router.push('/admin/about-media')
      router.refresh()
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error || 'Media item not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Media Item</h1>
        <p className="text-gray-600 mt-2">Update the details and file for this media item</p>
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
            Image or Video
          </label>
          {preview ? (
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
              {fileType === 'image' ? (
                <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
              ) : (
                <video src={preview} controls className="w-full h-64 object-cover" />
              )}
              {file && (
                <button
                  type="button"
                  onClick={() => {
                    setFile(null)
                    setPreview(formData.file_url)
                    setFileType(originalFileType)
                  }}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <FiX size={20} className="text-gray-900" />
                </button>
              )}
            </div>
          ) : null}
          {!file && (
            <label className="block">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors">
                <FiUpload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-700 font-medium">Click to upload a new file</p>
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
            placeholder="e.g., Mweso Board"
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
            placeholder="Add a descriptive caption"
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
          />
          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Media Item'}
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
