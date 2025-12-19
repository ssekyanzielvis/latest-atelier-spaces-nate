'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname?.startsWith('/admin')) {
      return
    }

    // Track page visit
    const trackVisit = async () => {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page_path: pathname || '/',
          }),
        })
      } catch (error) {
        console.error('Failed to track visit:', error)
      }
    }

    trackVisit()
  }, [pathname])

  return null
}
