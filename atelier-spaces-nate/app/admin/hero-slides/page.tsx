import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { FiPlus, FiSliders } from 'react-icons/fi'
import { HeroSlide } from '@/types'
import HeroSlidesList from '@/components/admin/HeroSlidesList'

async function getHeroSlides(): Promise<HeroSlide[]> {
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
        <HeroSlidesList slides={slides} />
      )}
    </div>
  )
}
