export const dynamic = 'force-dynamic'
export const revalidate = 0

import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { FiPlus, FiFolder } from 'react-icons/fi'
import { Project } from '@/types'
import ProjectsList from '@/components/admin/ProjectsList'

async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }

    console.log('Fetched projects:', data)
    return (data as Project[]) || []
  } catch (err) {
    console.error('Exception fetching projects:', err)
    return []
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage your architectural projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <FiPlus size={18} />
            Add New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFolder size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first project</p>
            <Link href="/admin/projects/new">
              <Button className="gap-2">
                <FiPlus size={18} />
                Create Project
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <ProjectsList projects={projects} />
      )}
    </div>
  )
}
