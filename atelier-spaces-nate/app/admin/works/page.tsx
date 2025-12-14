export const dynamic = 'force-dynamic'
export const revalidate = 0

import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { FiPlus, FiImage } from 'react-icons/fi'
import { Work } from '@/types'
import WorksList from '@/components/admin/WorksList'

async function getWorks(): Promise<Work[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('works')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching works:', error)
      return []
    }

    console.log('Fetched works:', data)
    return (data as Work[]) || []
  } catch (err) {
    console.error('Exception fetching works:', err)
    return []
  }
}

export default async function AdminWorksPage() {
  const works = await getWorks()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Works</h1>
          <p className="text-gray-600 mt-1">Manage your portfolio works</p>
        </div>
        <Link href="/admin/works/new">
          <Button className="gap-2">
            <FiPlus size={18} />
            Add New Work
          </Button>
        </Link>
      </div>

      {works.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiImage size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No works yet</h3>
            <p className="text-gray-600 mb-6">Add your portfolio works to showcase them</p>
            <Link href="/admin/works/new">
              <Button className="gap-2">
                <FiPlus size={18} />
                Add Work
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <WorksList works={works} />
      )}
    </div>
  )
}
