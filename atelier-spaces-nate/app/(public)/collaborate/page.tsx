'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { collaborationSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { z } from 'zod'

type CollaborationFormData = z.infer<typeof collaborationSchema>

export default function CollaboratePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CollaborationFormData>({
    resolver: zodResolver(collaborationSchema),
  })

  const onSubmit = async (data: CollaborationFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/collaborate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setIsSuccess(true)
      reset()
    } catch (err) {
      setError('Failed to submit. Please try again.')
      console.error('Error submitting form:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's Collaborate</h1>
            <p className="text-xl text-muted-foreground">
              Have a project in mind? We'd love to hear from you. Fill out the form below and we'll get back to you soon.
            </p>
          </div>

          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold text-green-900 mb-2">Thank You!</h2>
              <p className="text-green-700">
                Your message has been sent successfully. We'll get back to you soon.
              </p>
              <Button
                onClick={() => setIsSuccess(false)}
                variant="outline"
                className="mt-4"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Your full name"
                    className="mt-1"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    {...register('company')}
                    placeholder="Your company name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    placeholder="+1 234 567 890"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="project_type">Project Type</Label>
                  <Input
                    id="project_type"
                    {...register('project_type')}
                    placeholder="e.g., Residential, Commercial"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input
                    id="budget"
                    {...register('budget')}
                    placeholder="e.g., $50k - $100k"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Brief description of your project"
                  rows={4}
                  className="mt-1"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="message">Detailed Message *</Label>
                <Textarea
                  id="message"
                  {...register('message')}
                  placeholder="Tell us more about your project and requirements"
                  rows={6}
                  className="mt-1"
                />
                {errors.message && (
                  <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
