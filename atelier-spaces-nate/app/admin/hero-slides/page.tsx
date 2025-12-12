import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { FiPlus, FiEdit, FiTrash2, FiSliders } from 'react-icons/fi'

async function getHeroSlides() {
  const { data, error } = await supabaseAdmin
    .from('hero_slides')
    .select('*')
    .order('order_position', { ascending: true })

  if (error) {
    console.error('Error fetching hero slides:', error)
    return []
  }

  return data || []
}

export default async function AdminHeroSlidesPage() {
  const slides = await getHeroSlides()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hero Slides</h1>
          <p className="text-gray-600 mt-1">Manage your homepage hero slides</p>
        </div>
        <Link href="/admin/hero-slides/new">
          <Button className="gap-2">
            <FiPlus size={18} />
            Add New Slide
          </Button>
        </Link>
      </div>

      {slides.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSliders size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No slides yet</h3>
            <p className="text-gray-600 mb-6">Create your first hero slide for the homepage</p>
            <Link href="/admin/hero-slides/new">
              <Button className="gap-2">
                <FiPlus size={18} />
                Create Slide
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                {slide.image_url && (
                  <img
                    src={slide.image_url}
                    alt={slide.title}
                    className="w-full md:w-64 h-48 object-cover"
                  />
                )}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{slide.title}</h3>
                      <p className="text-gray-600 mt-1">{slide.subtitle}</p>
                      {slide.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{slide.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          Order: {slide.order_position}
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          slide.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {slide.is_active ? '✓ Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/hero-slides/${slide.id}/edit`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <FiEdit size={14} />
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                        <FiTrash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
