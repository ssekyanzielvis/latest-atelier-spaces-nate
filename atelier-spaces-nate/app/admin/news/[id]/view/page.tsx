'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { NewsArticle } from '@/types'
import { FiArrowLeft, FiEdit } from 'react-icons/fi'
import { format } from 'date-fns'

export default function ViewNewsPage() {
  const router = useRouter()
  const params = useParams()
  const newsId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [article, setArticle] = useState<NewsArticle | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('news_articles')
          .select('*')
          .eq('id', newsId)
          .single()

        if (error || !data) {
          setError('Article not found')
          return
        }

        setArticle(data as NewsArticle)
      } catch (err) {
        setError('Failed to load article')
        console.error('Error loading article:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [newsId])

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

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <FiArrowLeft size={20} /> Back
        </button>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error || 'Article not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
            <FiArrowLeft size={20} /> Back
          </button>
          <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
        </div>
        <Link href={`/admin/news/${newsId}/edit`} className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <FiEdit size={18} /> Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {article.image && (
          <div className="w-full h-96 overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="space-y-2">
              {article.published_date && (
                <p className="text-sm text-gray-600">
                  Published: <strong>{format(new Date(article.published_date), 'MMMM dd, yyyy')}</strong>
                </p>
              )}
            </div>
            {article.featured ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ⭐ Featured
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Not Featured
              </span>
            )}
          </div>

          {article.excerpt && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Excerpt</h3>
              <p className="text-lg text-gray-700 italic">{article.excerpt}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Content</h3>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{article.content}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Article Slug</h3>
            <p className="text-gray-900 text-sm font-mono">{article.slug}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
