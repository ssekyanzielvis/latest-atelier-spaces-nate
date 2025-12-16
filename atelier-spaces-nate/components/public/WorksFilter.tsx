'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ImageWithError from '@/components/ImageWithError'
import { Database } from '@/types/database'
import { Work } from '@/types'

type WorkCategory = Database['public']['Tables']['work_categories']['Row']

interface WorksFilterProps {
  initialWorks: Work[]
  initialCategories: WorkCategory[]
}

export default function WorksFilter({ initialWorks, initialCategories }: WorksFilterProps) {
  const searchParams = useSearchParams()
  const [filteredWorks, setFilteredWorks] = useState<Work[]>(initialWorks)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  )

  useEffect(() => {
    if (selectedCategory) {
      const filtered = initialWorks.filter((work) => work.category_id === selectedCategory)
      setFilteredWorks(filtered)
    } else {
      setFilteredWorks(initialWorks)
    }
  }, [selectedCategory, initialWorks])

  return (
    <div>
      {/* Category Filters */}
      {initialCategories.length > 0 && (
        <div className="mb-12">
          <div className="flex gap-3 overflow-x-auto pb-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              All Works
            </button>
            {initialCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Works Grid */}
      {filteredWorks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((work) => (
            <Link key={work.id} href={`/works/${work.slug}`} className="group">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-200">
                <ImageWithError
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  errorMessage="Failed to load work image"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg group-hover:text-black transition-colors">
                  {work.title}
                </h3>
                {work.client && (
                  <p className="text-sm text-gray-600 mt-1">{work.client}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">No works in this category yet.</p>
        </div>
      )}
    </div>
  )
}
