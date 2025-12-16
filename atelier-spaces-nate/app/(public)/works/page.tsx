import { supabaseAdmin } from '@/lib/supabase/server'
import { Database } from '@/types/database'
import { Work } from '@/types'
import WorksFilter from '@/components/public/WorksFilter'

export const revalidate = 0

type WorkCategory = Database['public']['Tables']['work_categories']['Row']

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

async function getCategories(): Promise<WorkCategory[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('work_categories')
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Exception fetching categories:', err)
    return []
  }
}

export const metadata = {
  title: 'Works | Atelier',
  description: 'Explore our creative works and designs',
}

export default async function WorksPage() {
  const [works, categories] = await Promise.all([getWorks(), getCategories()])

  return (
    <div className="py-12 md:py-20">
      <div className="w-full px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Works</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Explore our diverse portfolio across different categories
          </p>
        </div>

        {/* Category Cards Section */}
        {categories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`/works?category=${category.slug}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-200 h-48">
                    {category.cover_image ? (
                      <img
                        src={category.cover_image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-white font-bold text-2xl">{category.name}</h3>
                      {category.description && (
                        <p className="text-gray-100 text-sm mt-2 line-clamp-2">{category.description}</p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Works Filter Component */}
        <WorksFilter initialWorks={works} initialCategories={categories} />
      </div>
    </div>
  )
}
