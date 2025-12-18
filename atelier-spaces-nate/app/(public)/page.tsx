import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import HeroSection from '@/components/public/HeroSection'
import ImageWithError from '@/components/ImageWithError'
import { Database } from '@/types/database'

export const revalidate = 0

type HeroSlide = Database['public']['Tables']['hero_slides']['Row']
type Work = Database['public']['Tables']['works']['Row']
type WorkCategory = Database['public']['Tables']['work_categories']['Row']
type AboutSection = Database['public']['Tables']['about_section']['Row']
type TeamMember = Database['public']['Tables']['team_members']['Row']
type SloganSection = Database['public']['Tables']['slogan_section']['Row']
type AboutMedia = Database['public']['Tables']['about_media']['Row']

async function getHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabaseAdmin
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true })

  if (error) {
    console.error('Error fetching hero slides:', error)
    return []
  }

  return data || []
}

async function getFeaturedWorks(): Promise<Work[]> {
  const { data, error } = await supabaseAdmin
    .from('works')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching featured works:', error)
    return []
  }

  return data || []
}

async function getWorkCategories(): Promise<WorkCategory[]> {
  const { data, error } = await supabaseAdmin
    .from('work_categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching work categories:', error)
    return []
  }

  return data || []
}

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

    if (data) {
      const aboutData = data as AboutSection
      console.log('Fetched about section:', {
        id: aboutData.id,
        title: aboutData.title,
        hasImage: !!aboutData.image,
        hasMission: !!aboutData.mission,
        hasVision: !!aboutData.vision,
        hasValues: !!aboutData.values,
      })
    }

    return data
  } catch (err) {
    console.error('Exception fetching about section:', err)
    return null
  }
}

async function getAboutMedia(): Promise<AboutMedia[]> {
  try {
    console.log('🔄 Fetching about media for homepage...')
    
    const { data, error } = await supabaseAdmin
      .from('about_media')
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true })

    if (error) {
      console.error('❌ Error fetching about media:', error)
      return []
    }

    console.log(`✅ Fetched ${data?.length || 0} active about media items`)
    if (data && data.length > 0) {
      console.log('📸 Media items:', data.map(m => ({
        id: m.id,
        title: m.title,
        type: m.file_type,
        url: m.file_url
      })))
    }

    return data || []
  } catch (err) {
    console.error('❌ Exception fetching about media:', err)
    return []
  }
}

async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true })
    .limit(4)

  if (error) {
    console.error('Error fetching team members:', error)
    return []
  }

  return data || []
}

async function getSloganSection(): Promise<SloganSection | null> {
  const { data, error } = await supabaseAdmin
    .from('slogan_section')
    .select('*')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching slogan section:', error)
  }

  return data
}

export default async function HomePage() {
  const [heroSlides, featuredWorks, workCategories, aboutSection, aboutMedia, teamMembers, sloganSection] = await Promise.all([
    getHeroSlides(),
    getFeaturedWorks(),
    getWorkCategories(),
    getAboutSection(),
    getAboutMedia(),
    getTeamMembers(),
    getSloganSection(),
  ])

  return (
    <>
      {/* Dynamic Images Section (Hero Slides) */}
      <HeroSection slides={heroSlides} />

      {/* About Us Section - First Section */}
      {aboutSection && (
        <section id="about" className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
          <div className="w-full px-4">
            {/* Card Container - Full Width */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Single Column Layout: Image first, then content below */}
              <div className="flex flex-col">
                {/* Image Section - Full Width at Top */}
                {aboutSection.image && (
                  <div className="relative w-full h-64 md:h-80 lg:h-96">
                    <ImageWithError
                      src={aboutSection.image}
                      alt="About Atelier Spaces Nate"
                      fill
                      className="object-cover"
                      errorMessage="Failed to load about image"
                    />
                  </div>
                )}
                
                {/* Content Section */}
                <div className="p-6 md:p-10 lg:p-12">
                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {aboutSection.title}
                  </h2>
                  
                  {/* Main Content */}
                  <div className="space-y-6">
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {aboutSection.content}
                    </p>
                    
                    {/* Mission Statement */}
                    {aboutSection.mission && (
                      <div className="bg-gray-50 rounded-lg p-4 md:p-6 border-l-4 border-black">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Our Mission</h3>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{aboutSection.mission}</p>
                      </div>
                    )}
                    
                    {/* Vision Statement */}
                    {aboutSection.vision && (
                      <div className="bg-gray-50 rounded-lg p-4 md:p-6 border-l-4 border-black">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Our Vision</h3>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{aboutSection.vision}</p>
                      </div>
                    )}
                    
                    {/* Core Values */}
                    {aboutSection.values && (
                      <div className="bg-gray-50 rounded-lg p-4 md:p-6 border-l-4 border-black">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Core Values</h3>
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{aboutSection.values}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Media Gallery Section */}
      {aboutMedia.length > 0 && (
        <section id="about-gallery" className="py-12 md:py-20 bg-white">
          <div className="w-full px-4">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Gallery</h2>
              <p className="text-gray-600 text-base md:text-lg">Explore our creative work and achievements</p>
            </div>

            {/* Gallery Grid - 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {aboutMedia.map((media) => (
                <div key={media.id} className="group">
                  {/* Media Container */}
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-4 shadow-md hover:shadow-xl transition-shadow">
                    {media.file_type === 'image' ? (
                      <ImageWithError
                        src={media.file_url}
                        alt={media.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        errorMessage="Failed to load gallery image"
                        onError={() => console.error('❌ Failed to load gallery image:', media.file_url, 'for:', media.title)}
                      />
                    ) : (
                      <video
                        src={media.file_url}
                        controls
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('❌ Failed to load gallery video:', media.file_url, 'for:', media.title)
                          console.error('Video error:', e)
                        }}
                      />
                    )}
                  </div>

                  {/* Caption Section */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{media.title}</h3>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed">{media.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Works Section */}
      <section id="featured-works" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Works</h2>
              <p className="text-gray-600 mt-2">Explore our outstanding creative projects</p>
            </div>
          </div>

          {featuredWorks.length > 0 ? (
            <>
              {/* Display first 3 works in 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {featuredWorks.slice(0, 3).map((work) => (
                  <Link 
                    key={work.id} 
                    href={`/works/${work.slug}`}
                    className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-64 md:h-80 overflow-hidden">
                      <ImageWithError
                        src={work.image}
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        errorMessage="Failed to load work image"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                        {work.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-2 mb-4">{work.description}</p>
                      <div className="flex items-center justify-end pt-3 border-t border-gray-200">
                        <span className="text-black font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Full Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* View More button - only show if there are more than 3 works */}
              {featuredWorks.length > 3 && (
                <div className="flex justify-center">
                  <Link 
                    href="/works"
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  >
                    View More Works ({featuredWorks.length - 3} more)
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No featured works available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Slogan Section */}
      {sloganSection && (
        <section 
          id="slogan" 
          className="py-24 md:py-32 relative overflow-hidden"
          style={{
            backgroundImage: sloganSection.background_image 
              ? `url(${sloganSection.background_image})` 
              : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {sloganSection.main_slogan}
              </p>
              {sloganSection.sub_slogan && (
                <p className="text-xl md:text-2xl text-white/90 font-light">
                  {sloganSection.sub_slogan}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Other Works Section (Categories) */}
      <section id="work-categories" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Other Works</h2>
            <p className="text-gray-600 text-lg">Explore our diverse portfolio across different categories</p>
          </div>

          {workCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {workCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/works?category=${category.slug}`}
                  className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  {category.cover_image && (
                    <ImageWithError
                      src={category.cover_image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      errorMessage="Failed to load category image"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-3xl font-bold text-white group-hover:scale-105 transition-transform">
                        {category.name}
                      </h3>
                      <svg className="w-8 h-8 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    {category.description && (
                      <p className="text-white/90 text-base line-clamp-3">
                        {category.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No work categories available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-600 text-lg">Meet the creative minds behind our success</p>
          </div>

          {teamMembers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {teamMembers.map((member: TeamMember) => (
                  <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-64">
                      <ImageWithError
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        errorMessage="Failed to load team member image"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-gray-600 font-medium mb-2">{member.position}</p>
                      {member.bio && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{member.bio}</p>
                      )}
                      <div className="flex items-center justify-center pt-3 border-t border-gray-200 mt-3">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <Link 
                  href="/team"
                  className="inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View All Team Members
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No team members available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Let's collaborate to bring your creative vision to life
          </p>
          <Link 
            href="/collaborate"
            className="inline-block px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  )
}
