import { supabase } from '@/lib/supabase/client'
import NewsCard from '@/components/public/NewsCard'
import { NewsArticle } from '@/types'

async function getNewsArticles(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_date', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  return data || []
}

export const metadata = {
  title: 'News | Atelier',
  description: 'Latest news and insights from Atelier',
}

export default async function NewsPage() {
  const articles = await getNewsArticles()

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Stay updated with our latest projects, insights, and industry news
          </p>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No news articles available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
