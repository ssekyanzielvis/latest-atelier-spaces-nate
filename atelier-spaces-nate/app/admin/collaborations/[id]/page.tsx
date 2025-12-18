'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Database } from '@/types/database'
import { Button } from '@/components/ui/button'

type Collaboration = Database['public']['Tables']['collaborations']['Row']

const STATUS_OPTIONS = ['new', 'pending', 'reviewed', 'accepted', 'rejected']

export default function CollaborationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [collaboration, setCollaboration] = useState<Collaboration | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCollaboration()
  }, [id])

  const fetchCollaboration = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Fetching collaboration:', id)

      const response = await fetch(`/api/collaborate?id=${id}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch' }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      const data = result.data || result

      console.log('✅ Fetched collaboration:', data)
      setCollaboration(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch collaboration'
      console.error('❌ Error fetching collaboration:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!collaboration) return

    try {
      setUpdating(true)
      console.log('🔄 Updating status to:', newStatus)

      const response = await fetch(`/api/collaborate?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to update' }))
        throw new Error(errorData.error || 'Failed to update status')
      }

      console.log('✅ Status updated')
      setCollaboration({ ...collaboration, status: newStatus })
    } catch (err) {
      console.error('❌ Error updating status:', err)
      alert(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const deleteCollaboration = async () => {
    if (!confirm('Are you sure you want to delete this collaboration request? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      console.log('🔄 Deleting collaboration:', id)

      const response = await fetch(`/api/collaborate?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to delete' }))
        throw new Error(errorData.error || 'Failed to delete')
      }

      console.log('✅ Collaboration deleted')
      router.push('/admin/collaborations')
    } catch (err) {
      console.error('❌ Error deleting collaboration:', err)
      alert(err instanceof Error ? err.message : 'Failed to delete collaboration')
      setDeleting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-purple-100 text-purple-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading collaboration details...</p>
        </div>
      </div>
    )
  }

  if (error || !collaboration) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/collaborations">
            <Button variant="outline">← Back to Collaborations</Button>
          </Link>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Collaboration</h3>
              <p className="text-sm text-red-700 mb-4">{error || 'Collaboration not found'}</p>
              <button
                onClick={fetchCollaboration}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/collaborations">
            <Button variant="outline">← Back</Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collaboration Request</h1>
            <p className="text-gray-600 mt-1">View and manage request details</p>
          </div>
        </div>
        <button
          onClick={deleteCollaboration}
          disabled={deleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {deleting ? 'Deleting...' : 'Delete Request'}
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900 mt-1">{collaboration.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <a href={`mailto:${collaboration.email}`} className="text-blue-600 hover:text-blue-700 mt-1 block">
                  {collaboration.email}
                </a>
              </div>
              {collaboration.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <a href={`tel:${collaboration.phone}`} className="text-blue-600 hover:text-blue-700 mt-1 block">
                    {collaboration.phone}
                  </a>
                </div>
              )}
              {collaboration.company && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Company</label>
                  <p className="text-gray-900 mt-1">{collaboration.company}</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900 mt-1">{collaboration.description}</p>
              </div>
              {collaboration.project_type && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Project Type</label>
                  <p className="text-gray-900 mt-1">{collaboration.project_type}</p>
                </div>
              )}
              {collaboration.budget && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Budget</label>
                  <p className="text-gray-900 mt-1">{collaboration.budget}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-700">Message</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{collaboration.message}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Current Status:</span>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(collaboration.status)}`}>
                  {collaboration.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Update Status:</label>
                <select
                  value={collaboration.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  disabled={updating}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Submitted:</span>
                <p className="text-gray-900 mt-1">
                  {new Date(collaboration.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Request ID:</span>
                <p className="text-gray-900 mt-1 font-mono text-xs break-all">
                  {collaboration.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
