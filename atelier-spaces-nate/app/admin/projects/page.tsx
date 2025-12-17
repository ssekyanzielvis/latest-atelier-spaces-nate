'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import ImageWithError from '@/components/ImageWithError'
import { Project } from '@/types'

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/projects')
      if (!response.ok) throw new Error('Failed to fetch projects')
      const data = await response.json()
      setProjects(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
      console.error('Error fetching projects:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete project')

      setProjects(projects.filter(p => p.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Manage architectural projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button className="gap-2">
            <FiPlus size={18} />
            Add Project
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPlus size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Create your first architectural project</p>
            <Link href="/admin/projects/new">
              <Button className="gap-2">
                <FiPlus size={18} />
                Create Project
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Project Image */}
                <div className="md:w-32 md:h-32 flex-shrink-0">
                  <div className="relative w-full h-32 md:h-32 rounded-lg overflow-hidden bg-gray-100">
                    <ImageWithError
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      errorMessage="Image failed"
                    />
                  </div>
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{project.location}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {project.featured && (
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-black rounded">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                    {project.client && <span>Client: {project.client}</span>}
                    {project.year && <span>Year: {project.year}</span>}
                    {project.designer && <span>Designer: {project.designer}</span>}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      project.is_published
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {project.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-2 md:justify-center flex-shrink-0">
                  <Link href={`/projects/${project.slug}`} target="_blank" className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
                    <FiEye size={18} className="text-blue-600" title="View" />
                  </Link>
                  <Link href={`/admin/projects/${project.id}/edit`} className="p-2 hover:bg-amber-50 rounded-lg transition-colors">
                    <FiEdit2 size={18} className="text-amber-600" title="Edit" />
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(project.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <FiTrash2 size={18} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Delete Confirmation */}
              {deleteConfirm === project.id && (
                <div className="bg-red-50 border-t border-red-200 p-4 flex items-center justify-between">
                  <p className="text-sm text-red-800">
                    Are you sure you want to delete <strong>{project.title}</strong>?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
