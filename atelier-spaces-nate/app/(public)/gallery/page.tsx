import { supabaseAdmin } from '@/lib/supabase/server'
import Image from 'next/image'

export const revalidate = 0

async function getGalleryItems() {
  try {
    console.log('🔄 Fetching gallery items for public view...')
    
    const { data, error } = await (supabaseAdmin
      .from('gallery') as any)
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Database error fetching gallery:', error)
      throw new Error(`Failed to load gallery: ${error.message}`)
    }

    console.log(`✅ Successfully loaded ${data?.length || 0} gallery items`)
    return { data: data || [], error: null }
  } catch (err: any) {
    console.error('❌ Exception fetching gallery:', err)
    return { 
      data: [], 
      error: err.message || 'Unable to load gallery at this time. Please try again later.' 
    }
  }
}

export default async function GalleryPage() {
  const { data: galleryItems, error } = await getGalleryItems()

  // Group by category
  const categories = new Set(galleryItems.map((item: any) => item.category).filter(Boolean))
  const uncategorized = galleryItems.filter((item: any) => !item.category)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-gray-300">
            Explore our collection of creative works and achievements
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Error Display */}
          {error && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-yellow-800">Unable to Load Gallery</h3>
                  <p className="text-sm text-yellow-700 mt-1">{error}</p>
                  <p className="text-sm text-yellow-600 mt-2">Please refresh the page or contact us if the problem persists.</p>
                </div>
              </div>
            </div>
          )}

          {!error && galleryItems.length > 0 ? (
            <div className="space-y-16">
              {/* Categorized Items */}
              {Array.from(categories).map((category: any) => {
                const categoryItems = galleryItems.filter((item: any) => item.category === category)
                return (
                  <div key={category}>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                      {category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {categoryItems.map((item: any) => (
                        <div
                          key={item.id}
                          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                        >
                          <div className="relative h-64 bg-gray-100 overflow-hidden">
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              unoptimized
                            />
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-gray-600 text-sm line-clamp-3">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Uncategorized Items */}
              {uncategorized.length > 0 && (
                <div>
                  {categories.size > 0 && (
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                      Other
                    </h2>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {uncategorized.map((item: any) => (
                      <div
                        key={item.id}
                        className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="relative h-64 bg-gray-100 overflow-hidden">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            unoptimized
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-gray-600 text-sm line-clamp-3">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-24 w-24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No gallery items yet
              </h3>
              <p className="text-gray-600">
                Check back soon for updates to our gallery
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
