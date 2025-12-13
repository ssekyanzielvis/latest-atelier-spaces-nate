import { supabaseAdmin } from '@/lib/supabase/server'
import Link from 'next/link'
import { Database } from '@/types/database'

type Category = Database['public']['Tables']['categories']['Row']

export default async function CategoriesAdminPage() {
  const supabase = supabaseAdmin
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Categories</h1>
          <p className="text-gray-600 mt-1">Manage categories for your projects</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Add Category
        </Link>
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: Category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Link
                  href={`/admin/categories/${category.id}/edit`}
                  className="text-sm px-3 py-1.5 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                >
                  Edit
                </Link>
                <span className="text-xs text-gray-500">
                  Slug: {category.slug}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 mb-4">No categories yet. Create your first project category.</p>
          <Link
            href="/admin/categories/new"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Add First Category
          </Link>
        </div>
      )}
    </div>
  )
}
