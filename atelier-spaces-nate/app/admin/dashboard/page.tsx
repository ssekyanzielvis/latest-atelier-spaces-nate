import { supabaseAdmin } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FiFolder, FiFileText, FiImage, FiUsers, FiMessageSquare, FiLayers, FiTag } from 'react-icons/fi'
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
    { title: 'Projects', value: stats.projects, icon: FiFolder, href: '/admin/projects', color: 'blue' },
    { title: 'Works', value: stats.works, icon: FiImage, href: '/admin/works', color: 'purple' },
    { title: 'News Articles', value: stats.news, icon: FiFileText, href: '/admin/news', color: 'green' },
    { title: 'Team Members', value: stats.team, icon: FiUsers, href: '/admin/team', color: 'orange' },
    { title: 'Hero Slides', value: stats.heroSlides, icon: FiLayers, href: '/admin/hero-slides', color: 'pink' },
    { title: 'Categories', value: stats.categories, icon: FiTag, href: '/admin/categories', color: 'indigo' },
    { title: 'Collaborations', value: stats.collaborations, icon: FiMessageSquare, href: '/admin/collaborations', color: 'red' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back to the admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Content Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/projects/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">Create New Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Add a new architectural project</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/news/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">Publish News Article</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Share latest updates and insights</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/works/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">Add New Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Showcase your creative work</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/team/new">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">Add Team Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Introduce new team members</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Site Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/about">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">About Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Edit about page content</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/slogan">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">Slogan Section</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Update site slogan and tagline</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/hero-slides">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">Hero Slides</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Manage homepage hero carousel</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/admin/categories">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-base">Manage Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Organize projects and works</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Content Items</span>
                <span className="font-medium">{stats.projects + stats.news + stats.works}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending Collaborations</span>
                <span className="font-medium">{stats.collaborations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Team Members</span>
                <span className="font-medium">{stats.team}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
