'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().min(1, 'Cover image is required'),
  excerpt: z.string().optional(),
  author: z.string().optional(),
  published_date: z.string().optional(),
  featured: z.boolean().optional(),
})

type NewsFormData = z.infer<typeof newsSchema>

export default function NewNewsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      featured: false,
      published_date: new Date().toISOString().split('T')[0],
    },
  })

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to create news article')
      }

      router.push('/admin/news')
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
        <h1 className="text-3xl font-bold text-gray-900">Publish News Article</h1>
        <p className="text-gray-600 mt-2">Share latest updates and insights</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Article Title *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Enter article title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
              Slug * <span className="text-gray-500 font-normal">(URL-friendly version)</span>
            </label>
            <input
              id="slug"
              type="text"
              {...register('slug')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="article-title"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cover Image * <span className="text-gray-500 font-normal">(1200x630 recommended)</span>
            </label>
            <ImageUpload
              folder="news"
              onChange={(url: string) => setValue('image', url)}
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">This image appears at the top of the article</p>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-2">
              Excerpt <span className="text-gray-500 font-normal">(Short summary)</span>
            </label>
            <textarea
              id="excerpt"
              {...register('excerpt')}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Brief teaser (150-200 characters) - shown in article previews"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              {...register('content')}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Write your full article content - full story or announcement, can be several paragraphs..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="block text-sm font-semibold text-gray-700 mb-2">
                Author
              </label>
              <input
                id="author"
                type="text"
                {...register('author')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Nate Ssekyanzi"
              />
            </div>

            <div>
              <label htmlFor="published_date" className="block text-sm font-semibold text-gray-700 mb-2">
                Published Date
              </label>
              <input
                id="published_date"
                type="date"
                {...register('published_date')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              {...register('featured')}
              className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black"
            />
            <label htmlFor="featured" className="text-sm font-semibold text-gray-700">
              Feature this article on homepage (only feature 3-4 most important articles)
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
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
