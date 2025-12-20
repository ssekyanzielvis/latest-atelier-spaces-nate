import { supabaseAdmin } from '@/lib/supabase/server'
import { Work } from '@/types'
import Link from 'next/link'
import ImageWithError from '@/components/ImageWithError'

export const revalidate = 0

async function getWorks(): Promise<Work[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('works')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching works:', error)
      return []
    }

    return (data as Work[]) || []
  } catch (err) {
    console.error('Exception fetching works:', err)
    return []
  }
}

export const metadata = {
  title: 'Works | Atelier',
  description: 'Explore our creative works and designs',
}

export default async function WorksPage() {
  const works = await getWorks()

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Explore our diverse portfolio of creative works and designs
          </p>
        </div>

        {/* Works Grid - Full Width */}
        {works.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No works available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {works.map((work, index) => (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className={`group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${
                  index === works.length - 1 && works.length % 2 === 1
                    ? 'md:col-span-2 h-[350px] sm:h-[400px]'
                    : 'h-[400px] sm:h-[450px] md:h-[500px]'
                }`}
              >
                {/* Full Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <ImageWithError
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    errorMessage="Failed to load work image"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Featured Badge */}
                {work.featured && (
                  <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
                    Featured
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    {work.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 transform translate-y-2 group-hover:translate-y-0">{work.description}</p>
                  
                  <div className="flex items-center justify-between mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex gap-3 text-sm text-gray-200">
                      {work.client && <span className="font-medium">Client: {work.client}</span>}
                      {work.year && <span className="font-medium">Year: {work.year}</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-150 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm text-gray-300 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {work.gallery_image_1 || work.gallery_image_2 || work.gallery_image_3 || work.gallery_image_4 
                        ? 'Gallery' 
                        : 'Single'}
                    </span>
                    <span className="text-white font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
