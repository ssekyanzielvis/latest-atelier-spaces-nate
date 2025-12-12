import Link from 'next/link'
import { FiEye } from 'react-icons/fi'
import { Button } from '@/components/ui/button'

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 shadow-sm">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        <Link href="/" target="_blank">
          <Button variant="outline" size="sm" className="gap-2 hover:bg-gray-100">
            <FiEye size={16} />
            View Site
          </Button>
        </Link>
      </div>
    </header>
  )
}
