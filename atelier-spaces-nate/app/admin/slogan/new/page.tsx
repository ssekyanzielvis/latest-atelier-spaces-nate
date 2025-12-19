'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const sloganSchema = z.object({
  slogan: z.string().min(1, 'Slogan is required'),
  founder_name: z.string().min(1, 'Founder name is required'),
})

type SloganFormData = z.infer<typeof sloganSchema>

export default function NewSloganPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SloganFormData>({
    resolver: zodResolver(sloganSchema),
  })

  const onSubmit = async (data: SloganFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/slogan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to create slogan section')
      }

      router.push('/admin/slogan')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Slogan Section</h1>
        <p className="text-gray-600 mt-2">Add your company slogan and founder name</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div>
          <label htmlFor="slogan" className="block text-sm font-semibold text-gray-700 mb-2">
            Slogan *
          </label>
          <textarea
            id="slogan"
            {...register('slogan')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter your slogan text"
          />
          {errors.slogan && (
            <p className="mt-1 text-sm text-red-600">{errors.slogan.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="founder_name" className="block text-sm font-semibold text-gray-700 mb-2">
            Founder Name *
          </label>
          <input
            id="founder_name"
            type="text"
            {...register('founder_name')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter founder name"
          />
          {errors.founder_name && (
            <p className="mt-1 text-sm text-red-600">{errors.founder_name.message}</p>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Slogan Section'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
