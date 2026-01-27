'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { MoonVoyage, MoonVoyageInsert, MoonVoyageUpdate } from '@/types'
import { Button } from '@/components/ui/button'
import { FiSave, FiX } from 'react-icons/fi'

interface MoonVoyageFormProps {
    initialData?: MoonVoyage
    mode: 'create' | 'edit'
}

export default function MoonVoyageForm({ initialData, mode }: MoonVoyageFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<Partial<MoonVoyageInsert>>({
        title: initialData?.title || '',
        subtitle: initialData?.subtitle || '',
        hero_image: initialData?.hero_image || '',
        vision_title: initialData?.vision_title || '',
        vision_content: initialData?.vision_content || '',
        vision_image: initialData?.vision_image || '',
        challenge_title: initialData?.challenge_title || '',
        challenge_content: initialData?.challenge_content || '',
        challenge_date: initialData?.challenge_date || '',
        challenge_location: initialData?.challenge_location || '',
        funding_goal: initialData?.funding_goal || '',
        funding_description: initialData?.funding_description || '',
        funding_image: initialData?.funding_image || '',
        board_price: initialData?.board_price || '',
        support_price: initialData?.support_price || '',
        payment_momo: initialData?.payment_momo || '',
        payment_bank: initialData?.payment_bank || '',
        payment_message: initialData?.payment_message || '',
        is_active: initialData?.is_active ?? true,
    })

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const url = '/api/moon-voyage'
            const method = mode === 'create' ? 'POST' : 'PUT'
            const body = mode === 'edit' && initialData
                ? { ...formData, id: initialData.id }
                : formData

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to save')
            }

            router.push('/admin/moon-voyage')
            router.refresh()
        } catch (err) {
            console.error('Error saving moon voyage:', err)
            setError(err instanceof Error ? err.message : 'Failed to save')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="THE Omweso MOON VOYAGE"
                        />
                    </div>

                    <div>
                        <label htmlFor="subtitle" className="block text-sm font-semibold text-gray-700 mb-2">
                            Subtitle
                        </label>
                        <input
                            type="text"
                            id="subtitle"
                            name="subtitle"
                            value={formData.subtitle || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Quote or tagline"
                        />
                    </div>

                    <div>
                        <label htmlFor="hero_image" className="block text-sm font-semibold text-gray-700 mb-2">
                            Hero Image URL
                        </label>
                        <input
                            type="text"
                            id="hero_image"
                            name="hero_image"
                            value={formData.hero_image || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>
            </div>

            {/* Vision Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Vision Section</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="vision_title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Vision Title *
                        </label>
                        <input
                            type="text"
                            id="vision_title"
                            name="vision_title"
                            value={formData.vision_title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Our Vision: From our land to the Universe."
                        />
                    </div>

                    <div>
                        <label htmlFor="vision_content" className="block text-sm font-semibold text-gray-700 mb-2">
                            Vision Content *
                        </label>
                        <textarea
                            id="vision_content"
                            name="vision_content"
                            value={formData.vision_content}
                            onChange={handleChange}
                            required
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Enter the vision statement and mission..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Separate paragraphs with double line breaks</p>
                    </div>

                    <div>
                        <label htmlFor="vision_image" className="block text-sm font-semibold text-gray-700 mb-2">
                            Vision Image URL
                        </label>
                        <input
                            type="text"
                            id="vision_image"
                            name="vision_image"
                            value={formData.vision_image || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="https://example.com/vision-image.jpg"
                        />
                    </div>
                </div>
            </div>

            {/* Challenge Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Challenge Section</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="challenge_title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Challenge Title *
                        </label>
                        <input
                            type="text"
                            id="challenge_title"
                            name="challenge_title"
                            value={formData.challenge_title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Challenge 01: The Moon Voyage (Margherita Peak)"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="challenge_date" className="block text-sm font-semibold text-gray-700 mb-2">
                                Challenge Date
                            </label>
                            <input
                                type="text"
                                id="challenge_date"
                                name="challenge_date"
                                value={formData.challenge_date || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="June 2026"
                            />
                        </div>

                        <div>
                            <label htmlFor="challenge_location" className="block text-sm font-semibold text-gray-700 mb-2">
                                Challenge Location
                            </label>
                            <input
                                type="text"
                                id="challenge_location"
                                name="challenge_location"
                                value={formData.challenge_location || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="Margherita Peak (5,109 m), Rwenzori Mountains"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="challenge_content" className="block text-sm font-semibold text-gray-700 mb-2">
                            Challenge Content *
                        </label>
                        <textarea
                            id="challenge_content"
                            name="challenge_content"
                            value={formData.challenge_content}
                            onChange={handleChange}
                            required
                            rows={8}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Enter the challenge description..."
                        />
                    </div>
                </div>
            </div>

            {/* Funding Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Funding Section</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="funding_goal" className="block text-sm font-semibold text-gray-700 mb-2">
                            Funding Goal
                        </label>
                        <input
                            type="text"
                            id="funding_goal"
                            name="funding_goal"
                            value={formData.funding_goal || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="40,000,000 UGX"
                        />
                    </div>

                    <div>
                        <label htmlFor="funding_description" className="block text-sm font-semibold text-gray-700 mb-2">
                            Funding Description
                        </label>
                        <textarea
                            id="funding_description"
                            name="funding_description"
                            value={formData.funding_description || ''}
                            onChange={handleChange}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Enter the funding call description..."
                        />
                    </div>

                    <div>
                        <label htmlFor="funding_image" className="block text-sm font-semibold text-gray-700 mb-2">
                            Funding Image URL
                        </label>
                        <input
                            type="text"
                            id="funding_image"
                            name="funding_image"
                            value={formData.funding_image || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="https://example.com/funding-image.jpg"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="board_price" className="block text-sm font-semibold text-gray-700 mb-2">
                                Board Price
                            </label>
                            <input
                                type="text"
                                id="board_price"
                                name="board_price"
                                value={formData.board_price || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="200,000 SHS - Limited Edition Moon Voyage Board"
                            />
                        </div>

                        <div>
                            <label htmlFor="support_price" className="block text-sm font-semibold text-gray-700 mb-2">
                                Support Price
                            </label>
                            <input
                                type="text"
                                id="support_price"
                                name="support_price"
                                value={formData.support_price || ''}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                                placeholder="1,000,000 SHS - In Kind Support"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="payment_momo" className="block text-sm font-semibold text-gray-700 mb-2">
                            Mobile Money
                        </label>
                        <input
                            type="text"
                            id="payment_momo"
                            name="payment_momo"
                            value={formData.payment_momo || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="MTN MoMo: 0770697466 (Ssakka Abudusalam)"
                        />
                    </div>

                    <div>
                        <label htmlFor="payment_bank" className="block text-sm font-semibold text-gray-700 mb-2">
                            Bank Account
                        </label>
                        <input
                            type="text"
                            id="payment_bank"
                            name="payment_bank"
                            value={formData.payment_bank || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Bank: UBA | Acc: 1057011889 (Mugabi Arafatih)"
                        />
                    </div>

                    <div>
                        <label htmlFor="payment_message" className="block text-sm font-semibold text-gray-700 mb-2">
                            Payment Message
                        </label>
                        <textarea
                            id="payment_message"
                            name="payment_message"
                            value={formData.payment_message || ''}
                            onChange={handleChange}
                            rows={6}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            placeholder="Enter the payment confirmation message..."
                        />
                    </div>
                </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Status</h2>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                        Active (visible to visitors)
                    </label>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => router.push('/admin/moon-voyage')}
                    className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center gap-2"
                >
                    <FiX size={18} />
                    Cancel
                </button>
                <Button type="submit" disabled={loading} className="gap-2">
                    <FiSave size={18} />
                    {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save Changes'}
                </Button>
            </div>
        </form>
    )
}
