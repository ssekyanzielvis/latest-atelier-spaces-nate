import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { FiPlus, FiEdit, FiTrash2, FiUsers } from 'react-icons/fi'

async function getTeamMembers() {
  const { data, error } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .order('order_position', { ascending: true })

  if (error) {
    console.error('Error fetching team members:', error)
    return []
  }

  return data || []
}

export default async function AdminTeamPage() {
  const teamMembers = await getTeamMembers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage your team members</p>
        </div>
        <Link href="/admin/team/new">
          <Button className="gap-2">
            <FiPlus size={18} />
            Add Team Member
          </Button>
        </Link>
      </div>

      {teamMembers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-600 mb-6">Add your team members to showcase them on your site</p>
            <Link href="/admin/team/new">
              <Button className="gap-2">
                <FiPlus size={18} />
                Add Team Member
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {member.photo && (
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{member.role}</p>
                {member.bio && (
                  <p className="text-sm text-gray-500 mt-3 line-clamp-2">{member.bio}</p>
                )}
                <div className="flex items-center gap-2 mt-4">
                  <Link href={`/admin/team/${member.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <FiEdit size={14} />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <FiTrash2 size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
