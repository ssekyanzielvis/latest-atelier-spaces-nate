import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'
import { Database } from '@/types/database'

type SloganSection = Database['public']['Tables']['slogan_section']['Row']

export default async function SloganAdminPage() {
  const supabase = supabaseAdmin
  
  const { data, error } = await supabase
    .from('slogan_section')
    .select('*')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching slogan section:', error)
  }
  
  const sloganSection = data as SloganSection | null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slogan Section</h1>
          <p className="text-gray-600 mt-1">Manage your website&apos;s main slogan and tagline</p>
        </div>
        {!sloganSection && (
          <Link
            href="/admin/slogan/new"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create Slogan
          </Link>
        )}
      </div>

      {sloganSection ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Main Slogan</h3>
              <p className="text-2xl font-bold text-gray-900">{sloganSection.main_slogan}</p>
            </div>

            {sloganSection.sub_slogan && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Sub Slogan</h3>
                <p className="text-lg text-gray-700">{sloganSection.sub_slogan}</p>
              </div>
            )}

            {sloganSection.background_image && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Background Image</h3>
                <img 
                  src={sloganSection.background_image} 
                  alt="Slogan background" 
                  className="w-full max-w-2xl rounded-lg"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t">
              <Link
                href="/admin/slogan/edit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Edit Slogan
              </Link>
              <span className="text-sm text-gray-500">
                Last updated: {new Date(sloganSection.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No slogan content yet.</p>
          <Link
            href="/admin/slogan/new"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create Slogan
          </Link>
        </div>
      )}
    </div>
  )
}
