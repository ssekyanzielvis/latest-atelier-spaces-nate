'use client'

import Link from 'next/link'
import { MoonVoyage } from '@/types'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'

interface MoonVoyageListProps {
    moonVoyage: MoonVoyage[]
    onDelete: (id: string) => void
}

export default function MoonVoyageList({ moonVoyage, onDelete }: MoonVoyageListProps) {
    if (moonVoyage.length === 0) {
        return null
    }

    return (
        <div className="space-y-4">
            {moonVoyage.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                            {item.subtitle && (
                                <p className="text-gray-600 italic mb-4">{item.subtitle}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="font-semibold text-gray-700">Vision:</span>
                                    <p className="text-gray-600 line-clamp-2">{item.vision_title}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-700">Challenge:</span>
                                    <p className="text-gray-600 line-clamp-2">{item.challenge_title}</p>
                                </div>
                                {item.challenge_date && (
                                    <div>
                                        <span className="font-semibold text-gray-700">Date:</span>
                                        <p className="text-gray-600">{item.challenge_date}</p>
                                    </div>
                                )}
                                {item.funding_goal && (
                                    <div>
                                        <span className="font-semibold text-gray-700">Funding Goal:</span>
                                        <p className="text-gray-600">{item.funding_goal}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.is_active
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {item.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    Updated: {new Date(item.updated_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Link
                                href="/moon-voyage"
                                target="_blank"
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View Page"
                            >
                                <FiEye size={18} />
                            </Link>
                            <Link
                                href={`/admin/moon-voyage/${item.id}/edit`}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                            >
                                <FiEdit2 size={18} />
                            </Link>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <FiTrash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
