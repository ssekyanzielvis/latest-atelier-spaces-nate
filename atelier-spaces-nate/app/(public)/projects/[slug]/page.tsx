import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Project } from '@/types'

async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data
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

  const galleryImages = [
    project.gallery_image_1,
    project.gallery_image_2,
    project.gallery_image_3,
    project.gallery_image_4,
  ].filter((img): img is string => !!img)

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Hero Image */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg mb-8">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
            <div className="prose max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed">{project.description}</p>
            </div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={image}
                        alt={`${project.title} gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-muted/30 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Project Details</h3>
              <dl className="space-y-4">
                {project.client && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Client</dt>
                    <dd className="font-medium">{project.client}</dd>
                  </div>
                )}
                {project.location && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Location</dt>
                    <dd className="font-medium">{project.location}</dd>
                  </div>
                )}
                {project.year && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Year</dt>
                    <dd className="font-medium">{project.year}</dd>
                  </div>
                )}
                {project.area && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Area</dt>
                    <dd className="font-medium">{project.area} m²</dd>
                  </div>
                )}
                {project.status && (
                  <div>
                    <dt className="text-sm text-muted-foreground">Status</dt>
                    <dd className="font-medium capitalize">{project.status}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
