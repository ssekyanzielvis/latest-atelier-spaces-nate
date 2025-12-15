'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FiEdit, FiEye } from 'react-icons/fi'
import DeleteButton from './DeleteButton'
import { TeamMember } from '@/types'

interface TeamListProps {
  teamMembers: TeamMember[]
}

export default function TeamList({ teamMembers }: TeamListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teamMembers.map((member) => (
        <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          {member.image && (
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{member.position}</p>
            {member.bio && (
              <p className="text-sm text-gray-500 mt-3 line-clamp-2">{member.bio}</p>
            )}
            <div className="flex items-center gap-2 mt-4">
              <Link href={`/admin/team/${member.id}/view`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <FiEye size={14} />
                </Button>
              </Link>
              <Link href={`/admin/team/${member.id}/edit`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <FiEdit size={14} />
                  Edit
                </Button>
              </Link>
              <DeleteButton
                id={member.id}
                endpoint="/api/team"
                itemName="team member"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
