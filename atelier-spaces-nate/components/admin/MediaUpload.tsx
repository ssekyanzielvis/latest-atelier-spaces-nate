'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { FiUpload, FiX, FiImage, FiVideo } from 'react-icons/fi'

interface MediaUploadProps {
  value?: string
  mediaType?: 'image' | 'video'
  onChange: (url: string, type: 'image' | 'video') => void
  folder?: string
  label?: string
  acceptVideo?: boolean
}

export default function MediaUpload({ 
  value, 
  mediaType = 'image',
  onChange, 
  folder = 'general', 
  label = 'Upload Media',
  acceptVideo = false 
}: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Determine file type
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    // Validate file type
    if (!isImage && !isVideo) {
      setError('Please select an image or video file')
      return
    }

    if (isVideo && !acceptVideo) {
      setError('Video files are not allowed')
      return
    }

    // Validate file size (max 50MB for videos, 5MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError(isVideo ? 'Video size must be less than 50MB' : 'Image size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }

      const { url } = await response.json()
      onChange(url, isVideo ? 'video' : 'image')
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange('', 'image')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const acceptedTypes = acceptVideo 
    ? 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm'
    : 'image/jpeg,image/png,image/webp,image/gif'

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative w-full max-w-md overflow-hidden rounded-lg border">
          {mediaType === 'video' ? (
            <div className="relative aspect-video bg-black">
              <video 
                src={value} 
                controls 
                className="w-full h-full"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <FiVideo size={12} />
                VIDEO
              </div>
            </div>
          ) : (
            <div className="relative aspect-video">
              <Image src={value} alt="Uploaded" fill className="object-cover" />
              <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <FiImage size={12} />
                IMAGE
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <FiUpload className="mx-auto text-muted-foreground mb-2" size={32} />
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          {acceptVideo && (
            <p className="text-xs text-gray-500 mb-4">
              Supports images (JPG, PNG, WebP, GIF) and videos (MP4, WebM)
            </p>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : acceptVideo ? 'Select Image or Video' : 'Select Image'}
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Uploading...</span>
        </div>
      )}
    </div>
  )
}
