'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FiEdit } from 'react-icons/fi'
import DeleteButton from './DeleteButton'
import { HeroSlide } from '@/types'

interface HeroSlidesListProps {
  slides: HeroSlide[]
}

export default function HeroSlidesList({ slides }: HeroSlidesListProps) {
  return (
    <div className="space-y-4">
      {slides.map((slide) => (
        <div key={slide.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex flex-col md:flex-row">
            {slide.image && (
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full md:w-48 h-48 object-cover"
              />
            )}
            <div className="flex-1 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{slide.title}</h3>
                  {slide.subtitle && (
                    <p className="text-sm text-gray-600 mt-1">{slide.subtitle}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-sm text-gray-500">Order: {slide.order_position}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      slide.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/hero-slides/${slide.id}/edit`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <FiEdit size={14} />
                      Edit
                    </Button>
                  </Link>
                  <DeleteButton
                    id={slide.id}
                    endpoint="/api/hero-slides"
                    itemName="slide"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
