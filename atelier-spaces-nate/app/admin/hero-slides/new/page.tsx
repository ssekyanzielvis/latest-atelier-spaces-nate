'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'

const heroSlideSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  image: z.string().min(1, 'Image is required'),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  order_position: z.string().optional(),
  is_active: z.boolean().optional(),
})

type HeroSlideFormData = z.infer<typeof heroSlideSchema>

export default function NewHeroSlidePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<HeroSlideFormData>({
    resolver: zodResolver(heroSlideSchema),
    mode: 'onChange',
    defaultValues: {
      is_active: true,
      image: '',
    },
  })

  const onSubmit = async (data: HeroSlideFormData) => {
    console.log('🎯 onSubmit called!')
    console.log('📋 Form data:', data)
    console.log('🖼️ Image URL:', imageUrl)
    
    setIsSubmitting(true)
    setError(null)

    try {
      if (!imageUrl) {
        const errorMsg = '❌ Image Required: Please upload a hero slide image before submitting'
        console.error(errorMsg)
        setError(errorMsg)
        alert(errorMsg)
        setIsSubmitting(false)
        return
      }

      const submitData = {
        ...data,
        image: imageUrl,
        order_position: data.order_position ? parseInt(data.order_position) : 1,
      }

      console.log('Submitting hero slide:', submitData)

      const response = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response data:', result)

      if (!response.ok) {
        let errorMessage = ''
        
        switch (response.status) {
          case 400:
            errorMessage = `❌ Validation Error: ${result.error || 'Invalid data provided'}`
            break
          case 401:
            errorMessage = '❌ Authentication Error: Please log in again'
            break
          case 403:
            errorMessage = '❌ Permission Denied: You don\'t have access to create hero slides'
            break
          case 500:
            errorMessage = `❌ Server Error: ${result.error || 'Database error occurred'}`
            break
          default:
            errorMessage = `❌ Error (${response.status}): ${result.error || 'Failed to create hero slide'}`
        }
        
        console.error('API Error:', {
          status: response.status,
          error: result.error,
          details: result
        })
        
        throw new Error(errorMessage)
      }

      console.log('✅ Hero slide created successfully:', result)
      router.push('/admin/hero-slides')
      router.refresh()
    } catch (err) {
      let errorMessage = 'An unexpected error occurred'
      
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = '❌ Network Error: Cannot connect to server. Check your internet connection.'
        } else if (err.message.includes('NetworkError')) {
          errorMessage = '❌ Network Error: Server is not responding. Try again later.'
        } else {
          errorMessage = err.message
        }
      }
      
      console.error('❌ Create hero slide error:', {
        error: err,
        message: errorMessage,
        timestamp: new Date().toISOString()
      })
      
      alert(`Failed to create hero slide: ${errorMessage}`)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add Hero Slide</h1>
        <p className="text-gray-600 mt-2">Create a new slide for your homepage hero section</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">Failed to Create Hero Slide</h3>
              <p className="text-sm text-red-700 whitespace-pre-wrap">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form 
        onSubmit={(e) => {
          console.log('📝 Form submit event triggered!')
          console.log('Form errors:', errors)
          console.log('Has validation errors:', Object.keys(errors).length > 0)
          handleSubmit(onSubmit)(e)
        }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6"
      >
        {/* Validation Errors Display */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <h3 className="font-semibold text-amber-800 mb-2">⚠️ Form Validation Errors:</h3>
            <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
              {errors.title && <li>Title: {errors.title.message}</li>}
              {errors.image && <li>Image: {errors.image.message}</li>}
              {errors.subtitle && <li>Subtitle: {errors.subtitle.message}</li>}
            </ul>
          </div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Slide Title * <span className="text-gray-500 font-normal">(3-6 words)</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Innovative Architectural Design"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Large text shown on the image</p>
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
            Subtitle <span className="text-gray-500 font-normal">(Supporting text)</span>
          </label>
          <input
            id="subtitle"
            type="text"
            {...register('subtitle')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Blending form with function"
          />
          <p className="mt-1 text-xs text-gray-500">Additional context or tagline (1-2 short sentences)</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Background Image * <span className="text-gray-500 font-normal">(1920x1080 or larger)</span>
          </label>
          <ImageUpload
            value={imageUrl}
            onChange={(url) => {
              console.log('🖼️ Image uploaded:', url)
              setImageUrl(url)
              setValue('image', url, { shouldValidate: true })
              console.log('✅ Form image field updated')
            }}
            folder="hero-slides"
            label="Upload Hero Slide Image"
          />
          {!imageUrl && (
            <p className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
              ⚠️ Image is required to create a hero slide
            </p>
          )}
          {imageUrl && (
            <p className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              ✓ Image uploaded successfully
            </p>
          )}
          {errors.image && (
            <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
              {errors.image.message}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">High-quality image - will fill entire screen width</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="cta_text" className="block text-sm font-semibold text-gray-700 mb-2">
              Call-to-Action Text
            </label>
            <input
              id="cta_text"
              type="text"
              {...register('cta_text')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="View Our Work"
            />
            <p className="mt-1 text-xs text-gray-500">Button text (leave empty for no button)</p>
          </div>

          <div>
            <label htmlFor="cta_link" className="block text-sm font-semibold text-gray-700 mb-2">
              Call-to-Action Link
            </label>
            <input
              id="cta_link"
              type="text"
              {...register('cta_link')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="/projects"
            />
            <p className="mt-1 text-xs text-gray-500">Where the button links to</p>
          </div>
        </div>

        <div>
          <label htmlFor="order_position" className="block text-sm font-semibold text-gray-700 mb-2">
            Display Order
          </label>
          <input
            id="order_position"
            type="number"
            {...register('order_position')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="1"
          />
          <p className="mt-1 text-xs text-gray-500">Lower numbers show first (1 for first slide, 2 for second)</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="is_active"
            type="checkbox"
            {...register('is_active')}
            defaultChecked
            className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black"
          />
          <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
            Show this slide in rotation
          </label>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={() => console.log('🔘 Submit button clicked!')}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              'Add Hero Slide'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          {!imageUrl && (
            <span className="text-sm text-amber-600 font-medium">
              ⚠️ Upload an image to enable submission
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
