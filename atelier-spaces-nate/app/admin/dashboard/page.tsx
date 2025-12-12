import { supabaseAdmin } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FiFolder, FiFileText, FiImage, FiUsers, FiMessageSquare } from 'react-icons/fi'

async function getStats() {
  const [
    { count: projectsCount },
    { count: newsCount },
    { count: worksCount },
    { count: teamCount },
    { count: collaborationsCount },
  ] = await Promise.all([
    supabaseAdmin.from('projects').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('news_articles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('works').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('team_members').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('collaborations').select('*', { count: 'exact', head: true }),
  ])

  return {
    projects: projectsCount || 0,
    news: newsCount || 0,
    works: worksCount || 0,
    team: teamCount || 0,
    collaborations: collaborationsCount || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statsCards = [
    { title: 'Projects', value: stats.projects, icon: FiFolder, href: '/admin/projects' },
    { title: 'Works', value: stats.works, icon: FiImage, href: '/admin/works' },
    { title: 'News Articles', value: stats.news, icon: FiFileText, href: '/admin/news' },
    { title: 'Team Members', value: stats.team, icon: FiUsers, href: '/admin/team' },
    { title: 'Collaborations', value: stats.collaborations, icon: FiMessageSquare, href: '/admin/collaborations' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back to the admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
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
          )
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a
                href="/admin/projects/new"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Create New Project</h3>
                <p className="text-sm text-muted-foreground">Add a new architectural project</p>
              </a>
              <a
                href="/admin/news/new"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Publish News Article</h3>
                <p className="text-sm text-muted-foreground">Share latest updates and insights</p>
              </a>
              <a
                href="/admin/works/new"
                className="block p-3 rounded-md hover:bg-muted transition-colors"
              >
                <h3 className="font-medium">Add New Work</h3>
                <p className="text-sm text-muted-foreground">Showcase your creative work</p>
              </a>
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
