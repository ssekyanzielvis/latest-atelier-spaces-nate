'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { HeroSlide } from '@/types'
import { FiArrowLeft, FiEdit, FiExternalLink } from 'react-icons/fi'

export default function ViewHeroSlidePage() {
  const router = useRouter()
  const params = useParams()
  const slideId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slide, setSlide] = useState<HeroSlide | null>(null)

  useEffect(() => {
    const fetchSlide = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .eq('id', slideId)
          .single()

        if (error || !data) {
          setError('Hero slide not found')
          return
        }

        setSlide(data as HeroSlide)
      } catch (err) {
        setError('Failed to load hero slide')
        console.error('Error loading hero slide:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlide()
  }, [slideId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  if (error || !slide) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <FiArrowLeft size={20} /> Back
        </button>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error || 'Hero slide not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <FiArrowLeft size={20} /> Back
        </button>
        <Link href={`/admin/hero-slides/${slideId}/edit`} className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <FiEdit size={18} /> Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Hero Image */}
        {slide.image && (
          <div className="w-full h-96 overflow-hidden">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8 space-y-8">
          {/* Title and Subtitle */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{slide.title}</h1>
            {slide.subtitle && <p className="text-xl text-gray-600">{slide.subtitle}</p>}
          </div>

          {/* Link */}
          {slide.cta_link && (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">CTA Link</h3>
              <a href={slide.cta_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors">
                <span className="break-all">{slide.cta_link}</span>
                <FiExternalLink size={18} className="flex-shrink-0" />
              </a>
            </div>
          )}

          {/* CTA Text */}
          {slide.cta_text && (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">CTA Text</h3>
              <p className="text-gray-900">{slide.cta_text}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t space-y-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Order Position</h3>
                <p className="text-lg text-gray-900">{slide.order_position || '-'}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Status</h3>
                {slide.is_active ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Active
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ID Reference */}
          <div className="pt-6 border-t">
            <p className="text-xs text-gray-500 font-mono">ID: {slideId}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
