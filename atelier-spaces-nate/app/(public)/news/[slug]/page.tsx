import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { NewsArticle } from '@/types'
import { formatDate } from '@/lib/utils'

async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching news article:', error)
    return null
  }

  return data
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsArticle(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} | Atelier News`,
    description: article.excerpt || article.content.substring(0, 160),
  }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsArticle(slug)

  if (!article) {
    notFound()
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              {formatDate(article.published_date)}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
            {article.author && (
              <p className="text-lg text-muted-foreground">By {article.author}</p>
            )}
          </header>

          {/* Featured Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg mb-8">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="prose max-w-none">
            <div className="text-lg leading-relaxed whitespace-pre-wrap">{article.content}</div>
          </div>
        </article>
      </div>
    </div>
  )
}
