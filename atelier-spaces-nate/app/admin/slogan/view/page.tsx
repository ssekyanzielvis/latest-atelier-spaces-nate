'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { SloganSection } from '@/types'
import { FiArrowLeft, FiEdit } from 'react-icons/fi'

export default function ViewSloganPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [slogan, setSlogan] = useState<SloganSection | null>(null)

  useEffect(() => {
    const fetchSlogan = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('slogan_section')
          .select('*')
          .single()

        if (error || !data) {
          setError('Slogan section not found')
          return
        }

        setSlogan(data as SloganSection)
      } catch (err) {
        setError('Failed to load slogan section')
        console.error('Error loading slogan section:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlogan()
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

  if (error || !slogan) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <FiArrowLeft size={20} /> Back
        </button>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error || 'Slogan section not found'}</p>
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
        <Link href="/admin/slogan/edit" className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <FiEdit size={18} /> Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Slogan */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Slogan</h3>
            <p className="text-4xl font-bold text-gray-900">{(slogan as any).slogan || slogan.main_slogan}</p>
          </div>

          {/* Founder Name */}
          {(slogan as any).founder_name && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Founder Name</h3>
              <p className="text-xl text-gray-700">{(slogan as any).founder_name}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Last updated:</strong> {new Date(slogan.updated_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
