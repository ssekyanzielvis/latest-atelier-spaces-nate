'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiEdit, FiTrash2, FiPlus, FiImage, FiVideo } from 'react-icons/fi'
import ImageWithError from '@/components/ImageWithError'

interface MediaItem {
  id: string
  title: string
  caption: string
  file_url: string
  file_type: 'image' | 'video'
  order_position: number
  is_active: boolean
  created_at: string
}

export default function AboutMediaListPage() {
  const router = useRouter()
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Fetching about media items...')
      
      const response = await fetch('/api/about-media')
      const data = await response.json()

      console.log('📦 API Response:', { status: response.status, data })

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch items')
      }

      const items = Array.isArray(data) ? data : []
      console.log(`✅ Loaded ${items.length} media items`)
      setItems(items)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred'
      console.error('❌ Error fetching media items:', err)
      setError(errorMsg)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/about-media?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      setItems(items.filter((item) => item.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting item')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Media Gallery</h1>
          <p className="text-gray-600 mt-1">Manage images and videos for the about section</p>
        </div>
        <Link
          href="/admin/about-media/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FiPlus size={20} />
          Add Media
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No media items yet</p>
          <Link
            href="/admin/about-media/new"
            className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create First Media Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items
            .sort((a, b) => a.order_position - b.order_position)
            .map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Thumbnail */}
                <div className="h-40 bg-gray-100 overflow-hidden flex items-center justify-center relative group">
                  {item.file_type === 'image' ? (
                    <div className="relative w-full h-full">
                      <ImageWithError
                        src={item.file_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        errorMessage="Image failed to load"
                        onError={() => console.error('❌ Failed to load image:', item.file_url)}
                      />
                    </div>
                  ) : (
                    <video
                      src={item.file_url}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('❌ Failed to load video:', item.file_url)
                        console.error('Video error:', e)
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Link
                      href={`/admin/about-media/${item.id}/edit`}
                      className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    {item.file_type === 'image' ? (
                      <FiImage className="text-blue-600" size={16} />
                    ) : (
                      <FiVideo className="text-purple-600" size={16} />
                    )}
                    <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{item.caption}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Position: {item.order_position}</span>
                    {item.is_active && (
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
