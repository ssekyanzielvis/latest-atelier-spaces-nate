import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

async function getGalleryItems() {
  try {
    console.log('🔄 Admin fetching gallery items...')
    
    const { data, error } = await (supabaseAdmin
      .from('gallery') as any)
      .select('*')
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching gallery:', error)
      throw new Error(`Database error: ${error.message}`)
    }

    console.log(`✅ Fetched ${data?.length || 0} gallery items`)
    return { data: data || [], error: null }
  } catch (err: any) {
    console.error('❌ Exception fetching gallery:', err)
    return { data: [], error: err.message }
  }
}

export default async function AdminGalleryPage() {
  const { data: galleryItems, error } = await getGalleryItems()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
          <p className="text-gray-600 mt-1">Manage your gallery images and media</p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FiPlus size={20} />
          Add Gallery Item
        </Link>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Gallery</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {galleryItems.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {galleryItems.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-16 w-24 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.category ? (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {item.category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">No category</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.order_position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                          <FiEye size={12} />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                          <FiEyeOff size={12} />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/gallery/${item.id}/edit`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <FiEdit2 size={18} />
                        </Link>
                        <Link
                          href={`/admin/gallery/${item.id}/delete`}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No gallery items yet.</p>
          <Link
            href="/admin/gallery/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <FiPlus size={20} />
            Add First Gallery Item
          </Link>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Gallery Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-600">Total Items:</span>{' '}
            <span className="font-medium text-blue-900">{galleryItems.length}</span>
          </div>
          <div>
            <span className="text-blue-600">Active:</span>{' '}
            <span className="font-medium text-blue-900">
              {galleryItems.filter((item: any) => item.is_active).length}
            </span>
          </div>
          <div>
            <span className="text-blue-600">Inactive:</span>{' '}
            <span className="font-medium text-blue-900">
              {galleryItems.filter((item: any) => !item.is_active).length}
            </span>
          </div>
          <div>
            <span className="text-blue-600">Categories:</span>{' '}
            <span className="font-medium text-blue-900">
              {new Set(galleryItems.map((item: any) => item.category).filter(Boolean)).size}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
