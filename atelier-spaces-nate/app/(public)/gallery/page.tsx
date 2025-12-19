import { supabaseAdmin } from '@/lib/supabase/server'
import Image from 'next/image'

export const revalidate = 0

async function getGalleryItems() {
  try {
    const { data, error } = await (supabaseAdmin
      .from('gallery') as any)
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching gallery:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Exception fetching gallery:', err)
    return []
  }
}

export default async function GalleryPage() {
  const galleryItems = await getGalleryItems()

  // Group by category
  const categories = new Set(galleryItems.map((item: any) => item.category).filter(Boolean))
  const uncategorized = galleryItems.filter((item: any) => !item.category)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-gray-300">
            Explore our collection of creative works and achievements
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          {galleryItems.length > 0 ? (
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
