import { createServerClient } from '@/lib/supabase/server'
import { Database } from '@/types/database'

type Collaboration = Database['public']['Tables']['collaborations']['Row']

export default async function CollaborationsAdminPage() {
  const supabase = await createServerClient()
  
  const { data: collaborations, error } = await supabase
    .from('collaborations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching collaborations:', error)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Collaboration Requests</h1>
          <p className="text-gray-600 mt-1">Manage incoming collaboration inquiries</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Total: {collaborations?.length || 0} requests
          </span>
        </div>
      </div>

      {collaborations && collaborations.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Project Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {collaborations.map((collab) => (
                  <tr key={collab.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{collab.name}</p>
                        {collab.company && (
                          <p className="text-sm text-gray-600">{collab.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{collab.email}</p>
                        {collab.phone && (
                          <p className="text-gray-600">{collab.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {collab.project_type || 'Not specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {collab.budget || 'Not specified'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(collab.status)}`}>
                        {collab.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(collab.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/admin/collaborations/${collab.id}`}
                        className="text-black hover:text-gray-700 font-medium text-sm"
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600">No collaboration requests yet.</p>
        </div>
      )}
    </div>
  )
}
