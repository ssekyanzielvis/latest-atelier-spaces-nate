'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
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
  FiShield
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
  { href: '/admin/slogan', label: 'Slogan', icon: FiLayout },
  { href: '/admin/collaborations', label: 'Collaborations', icon: FiMessageSquare },
  { href: '/admin/admins', label: 'Admin Users', icon: FiShield },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="block hover:opacity-80 transition-opacity">
          <h2 className="text-2xl font-bold tracking-tight">ATELIER</h2>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-lg scale-105'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white hover:translate-x-1'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all duration-200 font-medium text-sm"
        >
          <FiLogOut size={20} className="flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
