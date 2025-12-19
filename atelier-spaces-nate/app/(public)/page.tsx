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

type GalleryItem = {
  id: string
  title: string
  description: string | null
  image_url?: string
  media_url?: string
  media_type?: 'image' | 'video'
  category: string | null
  order_position: number
  is_active: boolean
  created_at: string
  updated_at: string
}


async function getHeroSlides(): Promise<HeroSlide[]> {
  console.log('🔄 Fetching hero slides...')
  
  const { data, error } = await supabaseAdmin
    .from('hero_slides')
    .select('*')
    // Removed .eq('is_active', true) to show all slides
    .order('order_position', { ascending: true })

  if (error) {
    console.error('❌ Error fetching hero slides:', error)
    return []
  }

  console.log(`✅ Fetched ${data?.length || 0} hero slides`)
  
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

async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await (supabaseAdmin
    .from('gallery') as any)
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true })
    .limit(4)

  if (error) {
    console.error('Error fetching gallery items:', error)
    return []
  }

  return data || []
}

export default async function HomePage() {
  const [heroSlides, featuredWorks, workCategories, aboutSection, teamMembers, sloganSection, galleryItems] = await Promise.all([
    getHeroSlides(),
    getFeaturedWorks(),
    getWorkCategories(),
    getAboutSection(),
    getTeamMembers(),
    getSloganSection(),
    getGalleryItems(),
  ])

  return (
    <>
      {/* Dynamic Images Section (Hero Slides) */}
      <HeroSection slides={heroSlides} />

      {/* About Us Section */}
      {aboutSection && (
        <section id="about" className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Us</h2>
                <div className="w-24 h-1 bg-black mx-auto"></div>
              </div>
              <div className="prose prose-2xl max-w-none">
                <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed whitespace-pre-wrap text-center">
                  {(aboutSection as any).about || aboutSection.content}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview Section - 4 Items in 2x2 Grid */}
      <section id="gallery-preview" className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Gallery</h2>
            <Link 
              href="/gallery"
              className="text-sm md:text-base font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galleryItems.map((item) => {
                const mediaUrl = item.media_url || item.image_url || ''
                return (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-[300px]"
                >
                  {/* Gallery Media */}
                  <div className="absolute inset-0 w-full h-full">
                    {item.media_type === 'video' ? (
                      <>
                        <video
                          src={mediaUrl}
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                          playsInline
                        >
                          Your browser does not support the video tag.
                        </video>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </>
                    ) : (
                      <>
                        <ImageWithError
                          src={mediaUrl}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          errorMessage="Failed to load gallery image"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      </>
                    )}
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                    <h3 className="text-xl font-bold mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-200 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.category && (
                      <span className="inline-block mt-2 px-3 py-1 text-xs bg-white/20 rounded-full">
                        {item.category}
                      </span>
                    )}
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">No gallery items available yet.</p>
              <Link 
                href="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Visit Gallery
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Works Section */}
      <section id="featured-works" className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Works</h2>
            </div>
          </div>

          {featuredWorks.length > 0 ? (
            <>
              {/* Display first 3 works in 2-column grid - Full Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {featuredWorks.slice(0, 3).map((work) => (
                  <Link 
                    key={work.id} 
                    href={`/works/${work.slug}`}
                    className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-[400px] sm:h-[450px] md:h-[500px]"
                  >
                    {/* Full Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                      <ImageWithError
                        src={work.image}
                        alt={work.title}
                        fill
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        errorMessage="Failed to load work image"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                    </div>

                    {/* Content Overlay - Max 3 Lines */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                      <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-1 group-hover:text-gray-200 transition-colors">
                        {work.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-4">{work.description}</p>
                      <div className="flex items-center justify-end pt-3 border-t border-white/20">
                        <span className="text-white font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
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
          className="py-24 md:py-32 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center">
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
                {(sloganSection as any).slogan || sloganSection.main_slogan}
              </p>
              {(sloganSection as any).founder_name && (
                <p className="text-xl md:text-2xl text-gray-800 font-light italic">
                  — {(sloganSection as any).founder_name}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Other Works Section (Categories) */}
      <section id="work-categories" className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Other Works</h2>
          </div>

          {workCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {workCategories.map((category) => {
                const coverMediaUrl = (category as any).cover_media || category.cover_image || ''
                const mediaType = (category as any).media_type || 'image'

                return (
                  <Link
                    key={category.id}
                    href={`/works?category=${category.slug}`}
                    className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    {coverMediaUrl && (
                      <>
                        {mediaType === 'video' ? (
                          <video
                            src={coverMediaUrl}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <ImageWithError
                            src={coverMediaUrl}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            errorMessage="Failed to load category image"
                          />
                        )}
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-1 group-hover:scale-105 transition-transform">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-white/90 text-sm md:text-base line-clamp-2 mb-3">
                          {category.description}
                        </p>
                      )}
                      <div className="flex items-center justify-end pt-3 border-t border-white/20">
                        <span className="text-white font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Explore
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No work categories available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Our Team Section */}
      <section id="team" className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Team</h2>
          </div>

          {teamMembers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {teamMembers.map((member: TeamMember) => (
                  <Link
                    key={member.id}
                    href="/team"
                    className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 h-[350px]"
                  >
                    {/* Full Background Image */}
                    <div className="absolute inset-0 w-full h-full">
                      <ImageWithError
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        errorMessage="Failed to load team member image"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
                    </div>

                    {/* Content Overlay - Max 3 Lines */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                      <h3 className="text-xl font-bold mb-1 line-clamp-1">{member.name}</h3>
                      <p className="text-sm text-gray-300 mb-2 line-clamp-1">{member.position}</p>
                      {member.bio && (
                        <p className="text-sm text-gray-200 line-clamp-1 mb-3">{member.bio}</p>
                      )}
                      <div className="flex items-center justify-end pt-3 border-t border-white/20">
                        <span className="text-white font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-sm">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Profile
                        </span>
                      </div>
                    </div>
                  </Link>
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
      <section className="py-12 md:py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-lg text-white/80 mb-6 line-clamp-2">
            Let's collaborate to bring your creative vision to life
          </p>
          <Link 
            href="/collaborate"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Get In Touch
          </Link>
        </div>
      </section>
    </>
  )
}
