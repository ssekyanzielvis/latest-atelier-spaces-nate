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
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{article.excerpt}</p>
        )}
      </div>
    </Link>
  )
}
