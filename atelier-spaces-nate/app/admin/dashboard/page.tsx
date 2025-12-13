import { supabaseAdmin } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FiFolder, FiFileText, FiImage, FiUsers, FiMessageSquare, FiLayers, FiTag } from 'react-icons/fi'
import Link from 'next/link'

async function getStats() {
  const [
    { count: projectsCount },
    { count: newsCount },
    { count: worksCount },
    { count: teamCount },
    { count: collaborationsCount },
    { count: categoriesCount },
    { count: heroSlidesCount },
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
    projects: projectsCount || 0,
    news: newsCount || 0,
    works: worksCount || 0,
    team: teamCount || 0,
    collaborations: collaborationsCount || 0,
    categories: categoriesCount || 0,
    heroSlides: heroSlidesCount || 0,
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
        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link
                href="/admin/projects/new"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Create New Project</h3>
                <p className="text-sm text-muted-foreground">Add a new architectural project</p>
              </Link>
              <Link
                href="/admin/news/new"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Publish News Article</h3>
                <p className="text-sm text-muted-foreground">Share latest updates and insights</p>
              </Link>
              <Link
                href="/admin/works/new"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Add New Work</h3>
                <p className="text-sm text-muted-foreground">Showcase your creative work</p>
              </Link>
              <Link
                href="/admin/team/new"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Add Team Member</h3>
                <p className="text-sm text-muted-foreground">Introduce new team members</p>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link
                href="/admin/about"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">About Section</h3>
                <p className="text-sm text-muted-foreground">Edit about page content</p>
              </Link>
              <Link
                href="/admin/slogan"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Slogan Section</h3>
                <p className="text-sm text-muted-foreground">Update site slogan and tagline</p>
              </Link>
              <Link
                href="/admin/hero-slides"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Hero Slides</h3>
                <p className="text-sm text-muted-foreground">Manage homepage hero carousel</p>
              </Link>
              <Link
                href="/admin/categories"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Manage Categories</h3>
                <p className="text-sm text-muted-foreground">Organize projects and works</p>
              </Link>
            </div>
          </CardContent>
        </Card>

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
