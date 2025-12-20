import { supabaseAdmin } from '@/lib/supabase/server'
import ImageWithError from '@/components/ImageWithError'
import { Database } from '@/types/database'

export const revalidate = 0

type AboutSection = Database['public']['Tables']['about_section']['Row']

async function getAboutSection(): Promise<AboutSection | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('about_section')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching about section:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Exception fetching about section:', err)
    return null
  }
}



export default async function AboutPage() {
  const aboutSection = await getAboutSection()

  if (!aboutSection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">About Section Not Available</h1>
          <p className="text-gray-600">Please check back later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section with Image */}
      {aboutSection.image && (
        <section className="relative h-[400px] md:h-[500px] lg:h-[600px]">
          <div className="absolute inset-0">
            <ImageWithError
              src={aboutSection.image}
              alt="About Atelier Spaces Nate"
              fill
              className="object-cover"
              errorMessage="Failed to load about image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 pb-12 md:pb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {aboutSection.title}
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Main Description */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10 lg:p-12 mb-12">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
              {aboutSection.content}
            </p>
          </div>

          {/* Mission, Vision, Values in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-12">
            {/* Mission */}
            {aboutSection.mission && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-blue-600">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {aboutSection.mission}
                  </p>
                </div>
              </div>
            )}

            {/* Vision */}
            {aboutSection.vision && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-purple-600">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {aboutSection.vision}
                  </p>
                </div>
              </div>
            )}

            {/* Core Values */}
            {aboutSection.values && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-600">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900">Core Values</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {aboutSection.values}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  )
}
