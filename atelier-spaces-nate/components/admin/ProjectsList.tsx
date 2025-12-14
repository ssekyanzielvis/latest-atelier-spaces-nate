'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FiEdit, FiEye } from 'react-icons/fi'
import DeleteButton from './DeleteButton'
import { Project } from '@/types'

interface ProjectsListProps {
  projects: Project[]
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Project
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Featured
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{project.location}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {project.featured ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ⭐ Featured
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/projects/${project.slug}`} target="_blank">
                      <Button variant="outline" size="sm" className="gap-1">
                        <FiEye size={14} />
                      </Button>
                    </Link>
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-1">
                        <FiEdit size={14} />
                      </Button>
                    </Link>
                    <DeleteButton
                      id={project.id}
                      endpoint="/api/projects"
                      itemName="project"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
