'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiEdit, FiTrash2, FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { Database } from '@/types/database'

type WorkCategory = Database['public']['Tables']['work_categories']['Row']

export default function WorkCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<WorkCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/work-categories?includeInactive=true')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch categories')
      }

      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/work-categories?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      setCategories(categories.filter((cat) => cat.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting category')
    }
  }

  const handleReorder = async (id: string, newPosition: number) => {
    try {
      const response = await fetch('/api/work-categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, order_position: newPosition }),
      })

      if (!response.ok) {
        throw new Error('Failed to reorder category')
      }

      await fetchCategories()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error reordering category')
    }
  }

  const moveUp = (index: number) => {
    if (index > 0) {
      handleReorder(categories[index].id, categories[index - 1].order_position - 1)
    }
  }

  const moveDown = (index: number) => {
    if (index < categories.length - 1) {
      handleReorder(categories[index].id, categories[index + 1].order_position + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Work Categories</h1>
          <p className="text-gray-600 mt-1">Manage work categories with cover images</p>
        </div>
        <Link
          href="/admin/work-categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <FiPlus size={20} />
          Add Category
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No categories yet</p>
          <Link
            href="/admin/work-categories/new"
            className="inline-block px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Create First Category
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories
            .sort((a, b) => a.order_position - b.order_position)
            .map((category, index) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Cover Image */}
                {category.cover_image && (
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={category.cover_image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">/{category.slug}</p>
                    </div>
                    {!category.is_active && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                        Inactive
                      </span>
                    )}
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/work-categories/${category.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      <FiEdit size={16} />
                      Edit
                    </Link>
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="p-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <FiArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === categories.length - 1}
                      className="p-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <FiArrowDown size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
