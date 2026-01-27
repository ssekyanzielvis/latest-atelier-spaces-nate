'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MoonVoyage } from '@/types'
import MoonVoyageForm from '@/components/admin/MoonVoyageForm'

export default function EditMoonVoyagePage() {
    const params = useParams()
    const id = params.id as string

    const [moonVoyage, setMoonVoyage] = useState<MoonVoyage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchMoonVoyage()
    }, [id])

    const fetchMoonVoyage = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/moon-voyage?id=${id}`)

            if (!response.ok) {
                throw new Error('Failed to fetch')
            }

            const data = await response.json()

            // Check if the fetched data matches the ID
            if (data && data.id === id) {
                setMoonVoyage(data)
            } else {
                setError('Moon Voyage content not found')
            }
        } catch (err) {
            console.error('Error fetching moon voyage:', err)
            setError('Failed to load content')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (error || !moonVoyage) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Edit Moon Voyage Content</h1>
                    <p className="text-gray-600 mt-1">Update Moon Voyage page content</p>
                </div>

                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                    <p className="text-red-700">{error || 'Content not found'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Moon Voyage Content</h1>
                <p className="text-gray-600 mt-1">Update Moon Voyage page content</p>
            </div>

            <MoonVoyageForm mode="edit" initialData={moonVoyage} />
        </div>
    )
}
