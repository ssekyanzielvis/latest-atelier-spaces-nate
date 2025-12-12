import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import HeroSection from '@/components/public/HeroSection'
import ProjectCard from '@/components/public/ProjectCard'
import NewsCard from '@/components/public/NewsCard'
import { HeroSlide, Project, NewsArticle } from '@/types'
import { Button } from '@/components/ui/button'

async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true })

  if (error) {
    console.error('Error fetching hero slides:', error)
    return []
  }

  return data || []
}

async function getFeaturedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }

  return data || []
}

async function getLatestNews(): Promise<NewsArticle[]> {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Error fetching latest news:', error)
    return []
  }

  return data || []
}

export default async function HomePage() {
  const [heroSlides, featuredProjects, latestNews] = await Promise.all([
    getHeroSlides(),
    getFeaturedProjects(),
    getLatestNews(),
  ])

  return (
    <>
      {/* Hero Section */}
      <HeroSection slides={heroSlides} />

      {/* Featured Projects */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
              <p className="text-muted-foreground mt-2">Explore our latest architectural works</p>
            </div>
            <Link href="/projects">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No featured projects available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Atelier</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We are a team of passionate architects and designers dedicated to creating innovative
              and sustainable spaces. Our approach combines creativity, functionality, and
              environmental consciousness to deliver exceptional results.
            </p>
            <Link href="/team" className="inline-block mt-8">
              <Button>Meet Our Team</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Latest News</h2>
              <p className="text-muted-foreground mt-2">Stay updated with our latest insights</p>
            </div>
            <Link href="/news">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No news articles available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Let's collaborate to bring your architectural vision to life
          </p>
          <Link href="/collaborate">
            <Button variant="secondary" size="lg">
              Get In Touch
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
