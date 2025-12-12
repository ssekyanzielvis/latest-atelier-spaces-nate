import Link from 'next/link'
import { supabaseAdmin } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiImage } from 'react-icons/fi'
import { Work } from '@/types'
import Image from 'next/image'

async function getWorks(): Promise<Work[]> {
  const { data, error } = await supabaseAdmin
    .from('works')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching works:', error)
    return []
  }

  return data || []
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work) => (
            <div key={work.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {work.image && (
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{work.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{work.description}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Link href={`/works/${work.slug}`} target="_blank">
                    <Button variant="outline" size="sm" className="gap-1">
                      <FiEye size={14} />
                    </Button>
                  </Link>
                  <Link href={`/admin/works/${work.id}/edit`} className="flex-1">
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
