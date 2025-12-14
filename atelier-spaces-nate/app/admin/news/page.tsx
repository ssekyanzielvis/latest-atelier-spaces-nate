export const dynamic = 'force-dynamic'
export const revalidate = 0

import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { FiPlus, FiFileText } from 'react-icons/fi'
import { NewsArticle } from '@/types'
import NewsList from '@/components/admin/NewsList'

async function getNews(): Promise<NewsArticle[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('news_articles')
      .select('*')
      .order('published_date', { ascending: false })

    if (error) {
      console.error('Error fetching news:', error)
      return []
    }

    console.log('Fetched news articles:', data)
    if (data && data.length > 0) {
      const first = data[0] as NewsArticle
      console.log('First article sample:', { id: first.id, title: first.title })
    }
    return (data as NewsArticle[]) || []
  } catch (err) {
    console.error('Exception fetching news:', err)
    return []
  }
}

export default async function AdminNewsPage() {
  const news = await getNews()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News & Articles</h1>
          <p className="text-gray-600 mt-1">Manage your news articles and updates</p>
        </div>
        <Link href="/admin/news/new">
          <Button className="gap-2">
            <FiPlus size={18} />
            Add New Article
          </Button>
        </Link>
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
