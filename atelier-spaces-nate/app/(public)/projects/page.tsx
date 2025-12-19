'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ImageWithError from '@/components/ImageWithError'

interface Project {
  id: string
  title: string
  slug: string
  location: string
  description: string
  image: string
  year?: number
  client?: string
  designer?: string
  featured?: boolean
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/projects?published=true')
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch projects')
        }

        setProjects(result.data || [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        console.error('Error fetching projects:', errorMessage, err)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

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

  return (
    <main className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
          <p className="text-lg text-gray-300">Explore our latest architectural projects and designs</p>
        </div>
      </div>

      {/* Projects Grid - Full Width */}
      <div className="w-full px-4 py-16 md:py-24">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center max-w-4xl mx-auto">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No projects available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-[400px] sm:h-[450px] md:h-[500px]"
              >
                {/* Full Background Image */}
                <div className="absolute inset-0 w-full h-full">
                  <ImageWithError
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                </div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 text-xs font-semibold rounded shadow-lg z-10">
                    Featured
                  </div>
                )}

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                  <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-gray-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-200 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {project.location}
                  </p>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-4">{project.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.year && (
                        <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded">
                          {project.year}
                        </span>
                      )}
                      {project.client && (
                        <span className="text-xs bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded">
                          {project.client}
                        </span>
                      )}
                    </div>
                    <span className="text-white font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-sm">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
