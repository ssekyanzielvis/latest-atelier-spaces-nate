'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FiEdit, FiEye } from 'react-icons/fi'
import DeleteButton from './DeleteButton'
import { NewsArticle } from '@/types'
import { format } from 'date-fns'

interface NewsListProps {
  news: NewsArticle[]
}

export default function NewsList({ news }: NewsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Author
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
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">
                        {article.excerpt || article.content.substring(0, 100)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{article.author || '—'}</td>
                <td className="px-6 py-4 text-gray-700">
                  {article.published_date ? format(new Date(article.published_date), 'MMM dd, yyyy') : '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/news/${article.id}/view`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FiEye size={14} />
                      </Button>
                    </Link>
                    <Link href={`/admin/news/${article.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FiEdit size={14} />
                      </Button>
                    </Link>
                    <DeleteButton
                      id={article.id}
                      endpoint="/api/news"
                      itemName="article"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
