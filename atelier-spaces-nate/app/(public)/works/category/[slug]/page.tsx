import { createServerClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

type Work = Database['public']['Tables']['works']['Row']
type WorkCategory = Database['public']['Tables']['work_categories']['Row']

async function getCategory(slug: string): Promise<WorkCategory | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('work_categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

async function getWorksByCategory(categoryId: string): Promise<Work[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('works')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching works:', error)
    return []
  }

  return data || []
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug)
  
  if (!category) {
    notFound()
  }

  const works = await getWorksByCategory(category.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-xl text-white/80">{category.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {works.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {works.map((work) => (
                <Link 
                  key={work.id} 
                  href={`/works/${work.slug}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700">
                      {work.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">{work.description}</p>
                    {work.year && (
                      <p className="text-sm text-gray-500 mt-2">{work.year}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No works available in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Back Navigation */}
      <div className="container mx-auto px-4 pb-16">
        <Link 
          href="/#work-categories"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          ← Back to Categories
        </Link>
      </div>
    </div>
  )
}
