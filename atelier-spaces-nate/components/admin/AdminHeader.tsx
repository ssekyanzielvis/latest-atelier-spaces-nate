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
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage your content</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/register">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            >
              <FiUsers size={16} />
              <span className="hidden sm:inline">Register Admin</span>
            </Button>
          </Link>
          <Link href="/" target="_blank">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            >
              <FiEye size={16} />
              <span className="hidden sm:inline">View Site</span>
            </Button>
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md border border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiLogOut size={16} />
            <span className="hidden sm:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
