// app/(public)/layout.tsx
'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import ToastNotifications from '@/components/ToastNotifications'
import '../globals.css' // Changed from './globals.css' to '../globals.css'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Render a placeholder during SSR to avoid hydration mismatches
  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">{children}</main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ToastNotifications />
      <AnalyticsTracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}