'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FiPlus, FiFileText } from 'react-icons/fi'
import { NewsArticle } from '@/types'
import NewsList from '@/components/admin/NewsList'

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Fetching news articles...')
      
      const response = await fetch('/api/news')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch' }))
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch news articles`)
      }

      const data = await response.json()
      
      console.log('✅ Fetched news articles:', data)
      setNews(Array.isArray(data) ? data : [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news articles'
      console.error('❌ Error fetching news:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading news articles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News & Articles</h1>
          <p className="text-gray-600 mt-1">Manage your news articles and updates</p>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load News Articles</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              
              <div className="bg-white rounded p-4 mb-4">
                <h4 className="font-semibold text-red-900 mb-2">Possible causes:</h4>
                <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                  <li>The <code className="bg-red-100 px-1 rounded">news_articles</code> table doesn't exist in Supabase</li>
                  <li>RLS policies are blocking access</li>
                  <li>Database connection issue</li>
                  <li>Authentication required</li>
                </ul>
              </div>

              <button
                onClick={fetchNews}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News & Articles</h1>
          <p className="text-gray-600 mt-1">Manage your news articles and updates</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchNews}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
          <Link href="/admin/news/new">
            <Button className="gap-2">
              <FiPlus size={18} />
              Add New Article
            </Button>
          </Link>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFileText size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-600 mb-6">Start publishing news and updates</p>
            <Link href="/admin/news/new">
              <Button className="gap-2">
                <FiPlus size={18} />
                Create Article
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <NewsList news={news} />
      )}
    </div>
  )
}
