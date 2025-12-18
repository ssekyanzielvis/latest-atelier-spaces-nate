export const revalidate = 0

import ImageWithError from '@/components/ImageWithError'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type Work = Database['public']['Tables']['works']['Row']

async function getWork(slug: string): Promise<Work | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('works')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching work:', error)
      return null
    }

    console.log('Fetched work:', data)
    return (data as Work) || null
  } catch (err) {
    console.error('Exception fetching work:', err)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = await getWork(slug)

  if (!work) {
    return {
      title: 'Work Not Found',
    }
  }

  return {
    title: `${work.title} | Atelier Works`,
    description: work.description,
  }
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const work = await getWork(slug)

  if (!work) {
    notFound()
  }

  const galleryImages = [
    work.gallery_image_1,
    work.gallery_image_2,
    work.gallery_image_3,
    work.gallery_image_4,
  ].filter((img): img is string => !!img)

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Hero Image */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg mb-8">
          <ImageWithError
            src={work.image}
            alt={work.title}
            fill
            className="object-cover"
            priority
            errorMessage="Failed to load work image"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{work.title}</h1>
            <div className="prose max-w-none text-muted-foreground">
              <p className="text-lg leading-relaxed">{work.description}</p>
            </div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                      <ImageWithError
                        src={image}
                        alt={`${work.title} gallery ${index + 1}`}
                        fill
                        className="object-cover"
                        errorMessage="Failed to load gallery image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-gray-100 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Work Details</h3>
              <dl className="space-y-4">
                {work.client && (
                  <div>
                    <dt className="text-sm text-gray-600">Client</dt>
                    <dd className="font-medium">{work.client}</dd>
                  </div>
                )}
                {work.year && (
                  <div>
                    <dt className="text-sm text-gray-600">Year</dt>
                    <dd className="font-medium">{work.year}</dd>
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
