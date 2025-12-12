import Link from 'next/link'
import { FiEye } from 'react-icons/fi'
import { Button } from '@/components/ui/button'

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-border h-16 flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <Link href="/" target="_blank">
          <Button variant="outline" size="sm">
            <FiEye className="mr-2" size={16} />
            View Site
          </Button>
        </Link>
      </div>
    </header>
  )
}
