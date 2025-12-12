import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiFileText } from 'react-icons/fi'
import { format } from 'date-fns'

async function getNews() {
  const { data, error } = await supabaseAdmin
    .from('news_articles')
    .select('*')
    .order('published_date', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return data || []
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Published Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {news.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {article.cover_image && (
                          <img
                            src={article.cover_image}
                            alt={article.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{article.title}</div>
                          <div className="text-sm text-gray-600 line-clamp-1">
                            {article.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {format(new Date(article.published_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/news/${article.slug}`} target="_blank">
                          <Button variant="outline" size="sm" className="gap-1">
                            <FiEye size={14} />
                          </Button>
                        </Link>
                        <Link href={`/admin/news/${article.id}/edit`}>
                          <Button variant="outline" size="sm" className="gap-1">
                            <FiEdit size={14} />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <FiTrash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
