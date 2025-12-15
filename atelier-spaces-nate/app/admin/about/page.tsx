import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'
import { Database } from '@/types/database'

type AboutSection = Database['public']['Tables']['about_section']['Row']

export default async function AboutAdminPage() {
  const supabase = supabaseAdmin
  
  const { data, error } = await supabase
    .from('about_section')
    .select('*')
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching about section:', error)
  }
  
  const aboutSection = data as AboutSection | null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Section</h1>
          <p className="text-gray-600 mt-1">Manage your website&apos;s about section content</p>
        </div>
        {!aboutSection && (
          <Link
            href="/admin/about/new"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create About Section
          </Link>
        )}
      </div>

      {aboutSection ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Title</h3>
              <p className="text-gray-900">{aboutSection.title}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Content</h3>
              <p className="text-gray-900 whitespace-pre-wrap">{aboutSection.content}</p>
            </div>

            {aboutSection.mission && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Mission</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{aboutSection.mission}</p>
              </div>
            )}

            {aboutSection.vision && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Vision</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{aboutSection.vision}</p>
              </div>
            )}

            {aboutSection.values && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Values</h3>
                <p className="text-gray-900 whitespace-pre-wrap">{aboutSection.values}</p>
              </div>
            )}

            {aboutSection.image && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Image</h3>
                <img 
                  src={aboutSection.image} 
                  alt="About section" 
                  className="w-full max-w-md rounded-lg"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-4 border-t">
              <Link
                href="/admin/about/view"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View
              </Link>
              <Link
                href="/admin/about/edit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Edit About Section
              </Link>
              <span className="text-sm text-gray-500">
                Last updated: {new Date(aboutSection.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No about section content yet.</p>
          <Link
            href="/admin/about/new"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create About Section
          </Link>
        </div>
      )}
    </div>
  )
}
