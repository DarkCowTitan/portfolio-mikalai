'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, FolderOpen, MessageSquare, LogOut, ExternalLink, Plus } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/projects', label: 'Projets', icon: FolderOpen },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()

  // Don't show nav on login page
  if (pathname === '/admin/login') return null

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-bg-card border-r border-bg-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-bg-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center text-white font-bold">
            M
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm">Portfolio</div>
            <div className="text-xs text-slate-500">Administration</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname?.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-bg-secondary'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Quick actions */}
      <div className="p-4 border-t border-bg-border space-y-2">
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-bg-secondary transition-all"
        >
          <Plus size={15} />
          Nouveau projet
        </Link>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-bg-secondary transition-all"
        >
          <ExternalLink size={15} />
          Voir le site
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all text-left"
        >
          <LogOut size={15} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
