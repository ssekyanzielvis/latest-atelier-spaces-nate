'use client'

import { useState, useEffect } from 'react'
import ImageWithError from '@/components/ImageWithError'
import Link from 'next/link'
import { HeroSlide } from '@/types'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

interface HeroSectionProps {
  slides: HeroSlide[]
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-[60vh] lg:h-[80vh] bg-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Atelier</h1>
          <p className="text-xl text-muted-foreground">Creating spaces that inspire</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[60vh] lg:h-[80vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ImageWithError
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
            errorMessage="Failed to load hero slide"
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4 text-center text-white">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 animate-fade-in">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in-delay">
                  {slide.subtitle}
                </p>
              )}
              {slide.cta_text && slide.cta_link && (
                <Link
                  href={slide.cta_link}
                  className="inline-block bg-white text-foreground px-8 py-3 rounded-md font-semibold hover:bg-white/90 transition-colors animate-fade-in-delay-2"
                >
                  {slide.cta_text}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            aria-label="Previous slide"
          >
            <FiChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
            aria-label="Next slide"
          >
            <FiChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
