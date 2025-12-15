'use client'

import Link from 'next/link'
import { FiEye, FiLogOut, FiUsers } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminHeader() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Call logout API
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      })

      if (response.ok) {
        // Redirect to login
        router.push('/admin/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
      alert('Failed to logout. Please try again.')
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shadow-sm">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link href="/admin/register">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-100 border-gray-300">
              <FiUsers size={16} />
              Register Admin
            </Button>
          </Link>
          <Link href="/" target="_blank">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-100 border-gray-300">
              <FiEye size={16} />
              View Site
            </Button>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg border border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiLogOut size={16} />
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </header>
  )
}
