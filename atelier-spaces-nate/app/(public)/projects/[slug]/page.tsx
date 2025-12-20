export const revalidate = 0

import Link from 'next/link'
import { notFound } from 'next/navigation'
import ImageWithError from '@/components/ImageWithError'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type Project = Database['public']['Tables']['projects']['Row']

async function getProject(slug: string): Promise<Project | null> {
  try {
    // Decode the URL-encoded slug
    const decodedSlug = decodeURIComponent(slug)
    console.log('🔍 Looking for project with slug:', slug, '→ decoded:', decodedSlug)
    
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('slug', decodedSlug)
      .eq('is_published', true)
      .maybeSingle()

    if (error) {
      console.error('❌ Error fetching project:', error)
      return null
    }

    if (!data) {
      console.error('❌ No project found with slug:', decodedSlug)
      // Try to fetch all projects to see what slugs exist
      const { data: allProjects } = await supabaseAdmin
        .from('projects')
        .select('id, title, slug')
        .eq('is_published', true)
        .limit(10)
      console.log('Available projects:', allProjects)
      return null
    }

    console.log('✅ Fetched project:', data)
    return data as Project
  } catch (err) {
    console.error('❌ Exception fetching project:', err)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: `${project.title} | Atelier Projects`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
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
          errorMessage="Failed to load project image"
        />
        {project.featured && (
          <div className="absolute top-6 right-6 bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">
            Featured Project
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Projects
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{project.title}</h1>
              <p className="text-xl text-gray-600 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {project.location}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Project</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>
            </div>

            {project.other_info && (
              <div className="bg-gray-50 p-6 md:p-8 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{project.other_info}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-24 shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b pb-3">Project Details</h3>
              <dl className="space-y-5">
                {project.client && (
                  <div className="border-l-4 border-black pl-4">
                    <dt className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Client</dt>
                    <dd className="text-lg font-medium text-gray-900">{project.client}</dd>
                  </div>
                )}

                {project.year && (
                  <div className="border-l-4 border-black pl-4">
                    <dt className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Year</dt>
                    <dd className="text-lg font-medium text-gray-900">{project.year}</dd>
                  </div>
                )}

                {project.designer && (
                  <div className="border-l-4 border-black pl-4">
                    <dt className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Designer</dt>
                    <dd className="text-lg font-medium text-gray-900">{project.designer}</dd>
                  </div>
                )}

                {project.duration && (
                  <div className="border-l-4 border-black pl-4">
                    <dt className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Duration</dt>
                    <dd className="text-lg font-medium text-gray-900">{project.duration}</dd>
                  </div>
                )}

                {project.featured && (
                  <div className="border-l-4 border-black pl-4">
                    <dt className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Status</dt>
                    <dd className="text-lg font-medium text-gray-900">Featured</dd>
                  </div>
                )}
              </dl>

              {/* Back Button */}
              <div className="mt-8 pt-6 border-t">
                <Link
                  href="/projects"
                  className="block w-full text-center bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  ← Back to All Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
