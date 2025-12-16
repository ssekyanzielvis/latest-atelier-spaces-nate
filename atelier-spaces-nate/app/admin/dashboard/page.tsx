import { supabaseAdmin } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FiFolder, FiFileText, FiImage, FiUsers, FiMessageSquare, FiLayers, FiTag, FiInfo, FiSliders, FiLayout } from 'react-icons/fi'
import Link from 'next/link'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const [
      projectsResult,
      newsResult,
      worksResult,
      teamResult,
      collaborationsResult,
      categoriesResult,
      heroSlidesResult,
    ] = await Promise.all([
      supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('news_articles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('works').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('team_members').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('collaborations').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('hero_slides').select('*', { count: 'exact', head: true }),
    ])

    return {
      projects: projectsResult.count || 0,
      news: newsResult.count || 0,
      works: worksResult.count || 0,
      team: teamResult.count || 0,
      collaborations: collaborationsResult.count || 0,
      categories: categoriesResult.count || 0,
      heroSlides: heroSlidesResult.count || 0,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      projects: 0,
      news: 0,
      works: 0,
      team: 0,
      collaborations: 0,
      categories: 0,
      heroSlides: 0,
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statsCards = [
    { title: 'Projects', value: stats.projects, icon: FiFolder, href: '/admin/projects' },
    { title: 'Works', value: stats.works, icon: FiImage, href: '/admin/works' },
    { title: 'News', value: stats.news, icon: FiFileText, href: '/admin/news' },
    { title: 'Team', value: stats.team, icon: FiUsers, href: '/admin/team' },
    { title: 'Hero Slides', value: stats.heroSlides, icon: FiLayers, href: '/admin/hero-slides' },
    { title: 'Categories', value: stats.categories, icon: FiTag, href: '/admin/categories' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Monitor and manage your website content</p>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => {
            const Icon = stat.icon
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer border-gray-200 bg-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-5 w-5 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Management */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'New Project', href: '/admin/projects/new', icon: FiFolder },
              { title: 'New Work', href: '/admin/works/new', icon: FiImage },
              { title: 'New Article', href: '/admin/news/new', icon: FiFileText },
              { title: 'New Member', href: '/admin/team/new', icon: FiUsers },
              { title: 'About Section', href: '/admin/about', icon: FiInfo },
              { title: 'About Gallery', href: '/admin/about-media', icon: FiImage },
              { title: 'Hero Slides', href: '/admin/hero-slides', icon: FiSliders },
              { title: 'Slogan', href: '/admin/slogan', icon: FiLayout },
            ].map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.href} href={action.href}>
                  <Card className="hover:shadow-md transition-all cursor-pointer border-gray-200 bg-white h-full hover:border-gray-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium text-gray-900">
                        {action.title}
                      </CardTitle>
                      <Icon className="h-5 w-5 text-gray-400" />
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Info Card */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <Card className="border-gray-200 bg-white">
            <CardHeader>
              <CardTitle className="text-base">Total Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Projects</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.projects}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-600">Works</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.works}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-600">News</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.news}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                  <span className="text-sm text-gray-600">Team</span>
                  <span className="text-lg font-semibold text-gray-900">{stats.team}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
