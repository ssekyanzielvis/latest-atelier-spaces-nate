export const revalidate = 0

import ImageWithError from '@/components/ImageWithError'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type Work = Database['public']['Tables']['works']['Row']

async function getWork(slug: string): Promise<Work | null> {
  try {
    // Decode the URL-encoded slug
    const decodedSlug = decodeURIComponent(slug)
    console.log('🔍 Looking for work with slug:', slug, '→ decoded:', decodedSlug)
    
    const { data, error } = await supabaseAdmin
      .from('works')
      .select('*')
      .eq('slug', decodedSlug)
      .maybeSingle()

    if (error) {
      console.error('❌ Error fetching work:', error)
      return null
    }

    if (!data) {
      console.error('❌ No work found with slug:', slug)
      // Try to fetch all works to see what slugs exist
      const { data: allWorks } = await supabaseAdmin
        .from('works')
        .select('id, title, slug')
        .limit(10)
      console.log('Available works:', allWorks)
      return null
    }

    console.log('✅ Fetched work:', data)
    return (data as Work) || null
  } catch (err) {
    console.error('❌ Exception fetching work:', err)
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{work.title}</h1>
              {work.featured && (
                <span className="inline-block bg-black text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Featured Work
                </span>
              )}
            </div>

            {/* Description Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">About This Work</h2>
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">{work.description}</p>
              </div>
            </div>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {galleryImages.map((image, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                      <ImageWithError
                        src={image}
                        alt={`${work.title} gallery ${index + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        errorMessage="Failed to load gallery image"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-12 bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Work Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Work ID</p>
                  <p className="font-medium text-gray-900">{work.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Slug</p>
                  <p className="font-medium text-gray-900">{work.slug}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(work.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(work.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-24 shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b pb-3">Project Details</h3>
              <dl className="space-y-5">
                {work.client && (
                  <div className="border-l-4 border-black pl-4">
                    <dt className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Client</dt>
                    <dd className="text-lg font-medium text-gray-900">{work.client}</dd>
                  </div>
                )}
                {work.year && (
                  <div className="border-l-4 border-black pl-4">
                    <dt className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Year</dt>
                    <dd className="text-lg font-medium text-gray-900">{work.year}</dd>
                  </div>
                )}
                {work.featured && (
                  <div className="border-l-4 border-black pl-4">
                    <dt className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Status</dt>
                    <dd className="text-lg font-medium text-gray-900">Featured</dd>
                  </div>
                )}
                <div className="border-l-4 border-black pl-4">
                  <dt className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Gallery Images</dt>
                  <dd className="text-lg font-medium text-gray-900">{galleryImages.length} {galleryImages.length === 1 ? 'Image' : 'Images'}</dd>
                </div>
              </dl>

              {/* Back Button */}
              <div className="mt-8 pt-6 border-t">
                <Link
                  href="/works"
                  className="block w-full text-center bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  ← Back to All Works
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
