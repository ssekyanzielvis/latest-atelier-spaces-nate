'use client'

import Link from 'next/link'
import { FiEye, FiLogOut, FiUsers, FiMenu, FiClock, FiCalendar } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface AdminHeaderProps {
  onMenuClick: () => void
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' })

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setCurrentDateTime({
        date: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      })
    }
    updateDateTime()
    const interval = setInterval(updateDateTime, 1000)
    return () => clearInterval(interval)
  }, [])

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
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 shadow-sm">
      <div className="flex items-center justify-between w-full gap-4">
        {/* Menu button for mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={24} className="text-gray-700" />
        </button>
        
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Admin Dashboard</h1>
          <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">Manage your content</p>
        </div>

        {/* Date and Time Display */}
        <div className="hidden lg:flex items-center gap-4 text-sm text-gray-700 mr-4">
          <div className="flex items-center gap-1.5">
            <FiCalendar className="text-gray-500" size={16} />
            <span className="font-medium">{currentDateTime.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiClock className="text-gray-500" size={16} />
            <span className="font-mono">{currentDateTime.time}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/admin/register">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            >
              <FiUsers size={16} />
              <span className="hidden md:inline">Register Admin</span>
            </Button>
          </Link>
          <Link href="/" target="_blank" className="hidden sm:block">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
            >
              <FiEye size={16} />
              <span className="hidden md:inline">View Site</span>
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            size="sm"
            variant="outline"
            className="gap-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
          >
            <FiLogOut size={16} />
            <span className="hidden md:inline">{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
