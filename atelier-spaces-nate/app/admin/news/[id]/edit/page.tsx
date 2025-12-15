'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUpload from '@/components/admin/ImageUpload'
import { createSupabaseAuthClient } from '@/lib/supabase/auth'
import { NewsArticle } from '@/types'

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  image: z.string().min(1, 'Image is required'),
  excerpt: z.string().optional(),
  published_date: z.string().optional(),
  category: z.string().optional(),
  is_published: z.boolean().optional(),
})

type NewsFormData = z.infer<typeof newsSchema>

export default function EditNewsPage() {
  const router = useRouter()
  const params = useParams()
  const newsId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      is_published: true,
    },
  })

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true)
        const supabase = createSupabaseAuthClient()
        const { data, error } = await supabase
          .from('news_articles')
          .select('*')
          .eq('id', newsId)
          .single()

        if (error || !data) {
          setError('Article not found')
          return
        }

        const article = data as NewsArticle
        Object.keys(article).forEach((key) => {
          const value = (article as any)[key]
          if (value !== null && value !== undefined) {
            setValue(key as keyof NewsFormData, value)
          }
        })
      } catch (err) {
        setError('Failed to load article')
        console.error('Error loading article:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [newsId, setValue])

  const onSubmit = async (data: NewsFormData) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(`/api/news?id=${newsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to update article')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/news')
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit News Article</h1>
        <p className="text-gray-600 mt-2">Update article details</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">✓ Article updated successfully. Redirecting...</p>
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
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
              Slug *
            </label>
            <input
              id="slug"
              type="text"
              {...register('slug')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="article-title"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              {...register('excerpt')}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Brief summary of the article"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              id="content"
              {...register('content')}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Full article content"
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Featured Image *
            </label>
            <ImageUpload folder="news" onChange={(url: string) => setValue('image', url)} />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <input
                id="category"
                type="text"
                {...register('category')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Article category"
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
            <input id="is_published" type="checkbox" {...register('is_published')} className="w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-black" />
            <label htmlFor="is_published" className="text-sm font-semibold text-gray-700">
              Publish this article
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Article'}
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
