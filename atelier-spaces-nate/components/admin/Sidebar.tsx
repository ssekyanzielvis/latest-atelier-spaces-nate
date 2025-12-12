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
  FiLayout
} from 'react-icons/fi'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/admin/projects', label: 'Projects', icon: FiFolder },
  { href: '/admin/works', label: 'Works', icon: FiImage },
  { href: '/admin/news', label: 'News', icon: FiFileText },
  { href: '/admin/team', label: 'Team', icon: FiUsers },
  { href: '/admin/hero-slides', label: 'Hero Slides', icon: FiSliders },
  { href: '/admin/about', label: 'About', icon: FiInfo },
  { href: '/admin/slogan', label: 'Slogan', icon: FiLayout },
  { href: '/admin/collaborations', label: 'Collaborations', icon: FiMessageSquare },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <aside className="w-64 bg-foreground text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard">
          <h2 className="text-2xl font-bold">ATELIER</h2>
          <p className="text-sm text-white/60">Admin Panel</p>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-white text-foreground'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full text-white/80 hover:bg-white/10 hover:text-white rounded-md transition-colors"
        >
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
