'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { FiMenu, FiX, FiClock, FiCalendar } from 'react-icons/fi'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/works', label: 'Works' },
    { href: '/news', label: 'News' },
    { href: '/team', label: 'Team' },
    { href: '/collaborate', label: 'Collaborate' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">ATELIER</span>
          </Link>

          {/* Date and Time Display - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-1.5">
              <FiCalendar className="text-gray-500" size={16} />
              <span className="font-medium">{currentDateTime.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FiClock className="text-gray-500" size={16} />
              <span className="font-mono">{currentDateTime.time}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
