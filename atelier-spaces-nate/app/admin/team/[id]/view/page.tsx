'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { TeamMember } from '@/types'
import { FiArrowLeft, FiEdit, FiLinkedin, FiTwitter, FiMail, FiPhone } from 'react-icons/fi'

export default function ViewTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [member, setMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('team_members')
          .select('*')
          .eq('id', memberId)
          .single()

        if (error || !data) {
          setError('Team member not found')
          return
        }

        setMember(data as TeamMember)
      } catch (err) {
        setError('Failed to load team member')
        console.error('Error loading team member:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMember()
  }, [memberId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8">
          <FiArrowLeft size={20} /> Back
        </button>
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error || 'Team member not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
          <FiArrowLeft size={20} /> Back
        </button>
        <Link href={`/admin/team/${memberId}/edit`} className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          <FiEdit size={18} /> Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          {/* Profile Image */}
          <div className="md:col-span-1">
            {member.image && (
              <img src={member.image} alt={member.name} className="w-full rounded-lg object-cover" />
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{member.name}</h1>
              <p className="text-xl text-gray-600 mt-2">{member.position}</p>
            </div>

            {member.bio && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Biography</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{member.bio}</p>
              </div>
            )}

            {/* Contact Info */}
            <div className="pt-4 border-t space-y-3">
              {member.email && (
                <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                  <FiMail size={18} className="text-gray-500" />
                  <span>{member.email}</span>
                </a>
              )}

              {member.phone && (
                <a href={`tel:${member.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-black transition-colors">
                  <FiPhone size={18} className="text-gray-500" />
                  <span>{member.phone}</span>
                </a>
              )}
            </div>

            {/* Social Links */}
            {(member.linkedin || member.twitter) && (
              <div className="pt-4 border-t flex items-center gap-4">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <FiLinkedin size={20} className="text-gray-700" />
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <FiTwitter size={20} className="text-gray-700" />
                  </a>
                )}
              </div>
            )}

            {/* Status */}
            <div className="pt-4 border-t flex items-center gap-4">
              {member.is_active ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Active
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  Inactive
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
