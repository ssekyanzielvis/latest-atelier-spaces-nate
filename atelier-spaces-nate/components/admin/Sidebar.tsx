'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/supabase/auth'
import { 
  FiHome, 
  FiFolder, 
  FiFileText, 
  FiImage, 
  FiUsers, 
  FiSliders, 
  FiInfo, 
  FiMessageSquare,
  FiLogOut,
  FiLayout,
  FiTag,
  FiLayers,
  FiShield,
  FiX
} from 'react-icons/fi'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/admin/projects', label: 'Projects', icon: FiFolder },
  { href: '/admin/works', label: 'Works', icon: FiImage },
  { href: '/admin/news', label: 'News', icon: FiFileText },
  { href: '/admin/team', label: 'Team', icon: FiUsers },
  { href: '/admin/hero-slides', label: 'Hero Slides', icon: FiSliders },
  { href: '/admin/categories', label: 'Categories', icon: FiTag },
  { href: '/admin/work-categories', label: 'Work Categories', icon: FiLayers },
  { href: '/admin/about', label: 'About', icon: FiInfo },
  { href: '/admin/gallery', label: 'Gallery', icon: FiImage },
  { href: '/admin/slogan', label: 'Slogan', icon: FiLayout },
  { href: '/admin/collaborations', label: 'Collaborations', icon: FiMessageSquare },
  { href: '/admin/admins', label: 'Admin Users', icon: FiShield },
]

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-30
      w-64 bg-gray-900 text-white flex flex-col shadow-xl border-r border-gray-800
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="block hover:opacity-90 transition-opacity">
          <h2 className="text-2xl font-bold tracking-tight text-white">ATELIER</h2>
          <p className="text-xs text-gray-500 mt-1.5 uppercase tracking-wide">Admin Portal</p>
        </Link>
        
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-800 rounded-md transition-colors"
          aria-label="Close sidebar"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 font-medium text-sm ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 rounded-md transition-all duration-200 font-medium text-sm"
        >
          <FiLogOut size={18} className="flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
