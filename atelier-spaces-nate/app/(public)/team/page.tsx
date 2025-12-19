import ImageWithError from '@/components/ImageWithError'
import { supabaseAdmin } from '@/lib/supabase/server'
import { TeamMember } from '@/types'
import { FiMail, FiLinkedin, FiTwitter } from 'react-icons/fi'

export const revalidate = 0

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('team_members')
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true })

    if (error) {
      console.error('Error fetching team members:', error)
      return []
    }

    console.log('Fetched team members:', data)
    if (data && data.length > 0) {
      const first = data[0] as TeamMember
      console.log('First team member:', {
        id: first.id,
        name: first.name,
        hasImage: !!first.image,
        image: first.image,
      })
    }
    return (data as TeamMember[]) || []
  } catch (err) {
    console.error('Exception fetching team members:', err)
    return []
  }
}

export const metadata = {
  title: 'Team | Atelier',
  description: 'Meet our talented team of architects and designers',
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers()

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented professionals behind our innovative designs
          </p>
        </div>

        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted mb-4">
                  <ImageWithError
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                    errorMessage="Failed to load team member image"
                  />
                </div>
                <h3 className="font-semibold text-xl">{member.name}</h3>
                <p className="text-muted-foreground">{member.position}</p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{member.bio}</p>
                )}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                  <div className="flex gap-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Email"
                    >
                      <FiMail size={18} />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin size={18} />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Twitter"
                    >
                      <FiTwitter size={18} />
                    </a>
                  )}
                  </div>
                  <span className="text-black font-semibold inline-flex items-center gap-1 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No team members available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
