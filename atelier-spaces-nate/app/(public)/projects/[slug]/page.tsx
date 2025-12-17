'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageWithError from '@/components/ImageWithError'

interface Project {
  id: string
  title: string
  slug: string
  location: string
  description: string
  client?: string
  year?: number
  designer?: string
  duration?: string
  image: string
  other_info?: string
  is_published?: boolean
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // First try to find by slug
        const response = await fetch(`/api/projects?published=true`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }

        const projects = result.data || []
        const foundProject = projects.find((p: Project) => p.slug === slug)

        if (!foundProject) {
          setError('Project not found')
          return
        }

        setProject(foundProject)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        console.error('Error fetching project:', errorMessage, err)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchProject()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin">
          <svg className="w-12 h-12 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <Link href="/projects" className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Image */}
      <div className="relative w-full h-96 md:h-[500px] overflow-hidden bg-gray-200">
        <ImageWithError
          src={project.image}
          alt={project.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <Link
                href="/projects"
                className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
              >
                ← Back to Projects
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <p className="text-lg text-gray-600">{project.location}</p>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>

            {project.other_info && (
              <div className="bg-gray-50 p-6 md:p-8 rounded-lg mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{project.other_info}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-gray-100 rounded-lg p-8 sticky top-20">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Project Details</h3>
              <dl className="space-y-6">
                {project.client && (
                  <div>
                    <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Client</dt>
                    <dd className="mt-2 text-lg text-gray-900">{project.client}</dd>
                  </div>
                )}

                {project.year && (
                  <div>
                    <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Year</dt>
                    <dd className="mt-2 text-lg text-gray-900">{project.year}</dd>
                  </div>
                )}

                {project.designer && (
                  <div>
                    <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Designer</dt>
                    <dd className="mt-2 text-lg text-gray-900">{project.designer}</dd>
                  </div>
                )}

                {project.duration && (
                  <div>
                    <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Duration</dt>
                    <dd className="mt-2 text-lg text-gray-900">{project.duration}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
