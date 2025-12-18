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
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Explore our diverse portfolio of creative works and designs
          </p>
        </div>

        {/* Works Grid */}
        {works.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No works available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/works/${work.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <ImageWithError
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    errorMessage="Failed to load work image"
                  />
                  {work.featured && (
                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700">
                    {work.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-3">{work.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    {work.client && <span>{work.client}</span>}
                    {work.year && <span>{work.year}</span>}
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
