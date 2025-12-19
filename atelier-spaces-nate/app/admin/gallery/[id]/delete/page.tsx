'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi'
import Image from 'next/image'
import { showToast } from '@/components/ToastNotifications'

export default function DeleteGalleryItemPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [galleryItem, setGalleryItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGalleryItem()
  }, [])

  const fetchGalleryItem = async () => {
    try {
      const response = await fetch(`/api/gallery/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setGalleryItem(data)
      } else {
        setError('Gallery item not found')
      }
    } catch (err) {
      setError('Failed to load gallery item')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('⚠️ Are you absolutely sure you want to delete this gallery item? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    setError('')

    try {
      console.log('🗑️ Deleting gallery item:', params.id)

      const response = await fetch(`/api/gallery?id=${params.id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete gallery item')
      }

      console.log('✅ Gallery item deleted successfully')
      showToast('Gallery item deleted successfully! 🗑️', 'success')
      setTimeout(() => {
        router.push('/admin/gallery')
        router.refresh()
      }, 1000)
    } catch (err: any) {
      console.error('❌ Error deleting gallery item:', err)
      setError(err.message || 'Failed to delete gallery item')
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery item...</p>
        </div>
      </div>
    )
  }

  if (error && !galleryItem) {
    return (
      <div className="max-w-2xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-medium">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Delete Gallery Item</h1>
        <p className="text-gray-600 mt-1">Permanently remove this item from the gallery</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <FiX className="flex-shrink-0" size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Warning Header */}
        <div className="bg-red-50 border-b border-red-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-red-600" size={24} />
            <div>
              <h2 className="text-lg font-bold text-red-900">Confirm Deletion</h2>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. The gallery item will be permanently removed from your database.
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Item Preview */}
        {galleryItem && (
          <div className="p-6 space-y-4">
            <div className="relative h-64 w-full bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={galleryItem.image_url}
                alt={galleryItem.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">{galleryItem.title}</h3>
              {galleryItem.description && (
                <p className="text-gray-600 mt-2">{galleryItem.description}</p>
              )}
              {galleryItem.category && (
                <span className="inline-block mt-3 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded">
                  {galleryItem.category}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isDeleting}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <FiTrash2 size={18} />
                Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
