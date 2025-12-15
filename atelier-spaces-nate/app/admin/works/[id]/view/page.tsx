'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { Work } from '@/types'
import { FiArrowLeft, FiEdit } from 'react-icons/fi'

export default function ViewWorkPage() {
  const router = useRouter()
  const params = useParams()
  const workId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [work, setWork] = useState<Work | null>(null)

  useEffect(() => {
    const fetchWork = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('works')
          .select('*')
          .eq('id', workId)
          .single()

        if (error || !data) {
          setError('Work not found')
          return
        }

        setWork(data as Work)
      } catch (err) {
        setError('Failed to load work')
        console.error('Error loading work:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWork()
  }, [workId])

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

  if (error || !work) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <FiArrowLeft size={20} /> Back
        </button>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error || 'Work not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <FiArrowLeft size={20} /> Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{work.title}</h1>
        </div>
        <Link href={`/admin/works/${workId}/edit`} className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <FiEdit size={18} /> Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {work.image && (
          <div className="w-full h-96 overflow-hidden">
            <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{work.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t">
            {work.featured && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Featured</h3>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">⭐ Yes</span>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">Slug</h3>
              <p className="text-gray-900 text-sm">{work.slug}</p>
            </div>
          </div>

          {/* Gallery */}
          {(work.gallery_image_1 || work.gallery_image_2 || work.gallery_image_3 || work.gallery_image_4) && (
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {work.gallery_image_1 && (
                  <img src={work.gallery_image_1} alt="Gallery 1" className="w-full h-48 object-cover rounded-lg" />
                )}
                {work.gallery_image_2 && (
                  <img src={work.gallery_image_2} alt="Gallery 2" className="w-full h-48 object-cover rounded-lg" />
                )}
                {work.gallery_image_3 && (
                  <img src={work.gallery_image_3} alt="Gallery 3" className="w-full h-48 object-cover rounded-lg" />
                )}
                {work.gallery_image_4 && (
                  <img src={work.gallery_image_4} alt="Gallery 4" className="w-full h-48 object-cover rounded-lg" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
