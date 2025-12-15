'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { AboutSection } from '@/types'
import { FiArrowLeft, FiEdit } from 'react-icons/fi'

export default function ViewAboutPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [about, setAbout] = useState<AboutSection | null>(null)

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('about_section')
          .select('*')
          .single()

        if (error || !data) {
          setError('About section not found')
          return
        }

        setAbout(data as AboutSection)
      } catch (err) {
        setError('Failed to load about section')
        console.error('Error loading about section:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAbout()
  }, [])

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

  if (error || !about) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <FiArrowLeft size={20} /> Back
        </button>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error || 'About section not found'}</p>
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
        <Link href="/admin/about/edit" className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <FiEdit size={18} /> Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Featured Image */}
        {about.image && (
          <div className="w-full h-96 overflow-hidden">
            <img src={about.image} alt={about.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8 space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{about.title}</h1>
          </div>

          {/* Main Content */}
          {about.content && (
            <div className="prose max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">{about.content}</div>
            </div>
          )}

          {/* Mission, Vision, Values */}
          {(about.mission || about.vision || about.values) && (
            <div className="pt-6 border-t space-y-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {about.mission && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Mission</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{about.mission}</p>
                </div>
              )}

              {about.vision && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Vision</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{about.vision}</p>
                </div>
              )}

              {about.values && (
                <div className="md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Values</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{about.values}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
