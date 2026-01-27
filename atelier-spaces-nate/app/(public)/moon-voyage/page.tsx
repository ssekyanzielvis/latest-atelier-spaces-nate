'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MoonVoyage } from '@/types'
import { FiMapPin, FiCalendar, FiTarget } from 'react-icons/fi'

export default function MoonVoyagePage() {
    const [content, setContent] = useState<MoonVoyage | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchContent()
    }, [])

    const fetchContent = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/moon-voyage')

            if (!response.ok) {
                throw new Error('Failed to fetch content')
            }

            const data = await response.json()
            setContent(data)
        } catch (err) {
            console.error('Error fetching moon voyage content:', err)
            setError('Failed to load content')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (error || !content) {
        return (
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Content</h3>
                    <p className="text-red-700">{error || 'Content not available'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white">
            {/* 1. Main Section (THE Omweso MOON VOYAGE) */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                        {content.title}
                    </h1>
                    {content.subtitle && (
                        <p className="text-xl text-gray-600 italic mb-8 border-l-4 border-gray-900 pl-4">
                            {content.subtitle}
                        </p>
                    )}
                </div>
                {content.hero_image && (
                    <div className="order-1 md:order-2 relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src={content.hero_image}
                            alt={content.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            priority
                        />
                    </div>
                )}
            </section>

            {/* 2. Vision Section (Our Vision) */}
            <section className="bg-gray-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                    {content.vision_image && (
                        <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src={content.vision_image}
                                alt={content.vision_title}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    )}
                    <div className={`${!content.vision_image ? 'col-span-2 max-w-4xl mx-auto text-center' : ''}`}>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                            {content.vision_title}
                        </h2>
                        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                            {content.vision_content.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="mb-6">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Challenge Details Section (Text only, kept as requested in original PDF scope) */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                        {content.challenge_title}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {content.challenge_date && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                                <FiCalendar className="text-gray-900 mb-3 mx-auto" size={28} />
                                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">When</h3>
                                <p className="text-lg font-medium text-gray-900">{content.challenge_date}</p>
                            </div>
                        )}
                        {content.challenge_location && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                                <FiMapPin className="text-gray-900 mb-3 mx-auto" size={28} />
                                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Where</h3>
                                <p className="text-lg font-medium text-gray-900">{content.challenge_location}</p>
                            </div>
                        )}
                        {content.funding_goal && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                                <FiTarget className="text-gray-900 mb-3 mx-auto" size={28} />
                                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Goal</h3>
                                <p className="text-lg font-medium text-gray-900">{content.funding_goal}</p>
                            </div>
                        )}
                    </div>

                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-center">
                        {content.challenge_content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-6">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Funding / Our Kind Call Section */}
            {(content.funding_description || content.funding_image) && (
                <section className="py-16 md:py-24 bg-gray-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">
                                Our Kind Call
                            </h2>
                            {content.funding_description && (
                                <div className="prose prose-lg prose-invert max-w-none leading-relaxed">
                                    {content.funding_description.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className="mb-6 text-gray-300">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                        {content.funding_image && (
                            <div className="order-1 md:order-2 relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                                <Image
                                    src={content.funding_image}
                                    alt="Our Kind Call"
                                    fill
                                    className="object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Support Cards & Payment */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {content.board_price && (
                            <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200 hover:border-gray-900 transition-colors">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{content.board_price}</h3>
                                <p className="text-gray-700 mb-6">Own a piece of history with the Limited Edition Moon Voyage Board</p>
                                <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                                    Buy the Board
                                </button>
                            </div>
                        )}
                        {content.support_price && (
                            <div className="bg-gray-900 text-white rounded-xl p-8 border-2 border-gray-900 hover:border-gray-700 transition-colors">
                                <h3 className="text-2xl font-bold mb-4">{content.support_price}</h3>
                                <p className="text-gray-300 mb-6">Make a significant contribution to the voyage logistics</p>
                                <button className="w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                    In-Kind Support
                                </button>
                            </div>
                        )}
                    </div>

                    {(content.payment_momo || content.payment_bank) && (
                        <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8">Payment Accounts</h3>
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {content.payment_momo && (
                                    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Mobile Money</p>
                                        <p className="text-lg font-bold text-gray-900 font-mono">{content.payment_momo}</p>
                                    </div>
                                )}
                                {content.payment_bank && (
                                    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
                                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Bank Transfer</p>
                                        <p className="text-lg font-bold text-gray-900 font-mono">{content.payment_bank}</p>
                                    </div>
                                )}
                            </div>
                            {content.payment_message && (
                                <p className="text-gray-600 italic">{content.payment_message}</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
