'use client'

import ImageWithError from '@/components/ImageWithError'
import Link from 'next/link'
import { NewsArticle } from '@/types'
import { formatDate } from '@/lib/utils'
import { useEffect } from 'react'

interface NewsCardProps {
  article: NewsArticle
}

export default function NewsCard({ article }: NewsCardProps) {
  useEffect(() => {
    if (!article.image) {
      console.warn(`NewsCard: Missing image for article "${article.title}"`, article)
    } else {
      console.log(`NewsCard: Image found for "${article.title}":`, article.image)
    }
  }, [article])

  return (
    <Link href={`/news/${article.slug}`} className="group">
      <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
        {article.image ? (
          <ImageWithError
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            errorMessage="Failed to load article image"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600">No image</span>
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs text-muted-foreground">{formatDate(article.published_date)}</p>
        <h3 className="font-semibold text-lg mt-1 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 mb-3">{article.excerpt}</p>
        )}
        <div className="flex items-center justify-end pt-3 border-t border-gray-200 mt-3">
          <span className="text-black font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Full Details
          </span>
        </div>
      </div>
    </Link>
  )
}
