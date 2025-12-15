'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FiEdit, FiEye } from 'react-icons/fi'
import DeleteButton from './DeleteButton'
import { Work } from '@/types'

interface WorksListProps {
  works: Work[]
}

export default function WorksList({ works }: WorksListProps) {
  return (
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
              <Link href={`/admin/works/${work.id}/view`}>
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
              <DeleteButton
                id={work.id}
                endpoint="/api/works"
                itemName="work"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
