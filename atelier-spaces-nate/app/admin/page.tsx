'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AdminPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  useEffect(() => {
    if (status === 'loading') return
    
    if (session) {
      router.replace('/admin/dashboard')
    } else {
      router.replace('/admin/login')
    }
  }, [session, status, router])
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
