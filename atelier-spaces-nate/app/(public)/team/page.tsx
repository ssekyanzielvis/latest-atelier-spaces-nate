import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { TeamMember } from '@/types'
import { FiMail, FiLinkedin, FiTwitter } from 'react-icons/fi'

async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .eq('is_active', true)
    .order('order_position', { ascending: true })

  if (error) {
    console.error('Error fetching team members:', error)
    return []
  }

  return data || []
}

export const metadata = {
  title: 'Team | Atelier',
  description: 'Meet our talented team of architects and designers',
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers()

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented professionals behind our innovative designs
          </p>
        </div>

        {teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <h3 className="font-semibold text-xl">{member.name}</h3>
                <p className="text-muted-foreground">{member.position}</p>
                {member.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{member.bio}</p>
                )}
                <div className="flex gap-3 mt-3">
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
