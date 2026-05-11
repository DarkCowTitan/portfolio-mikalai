'use client'

import { usePathname } from 'next/navigation'
import AdminNav from './admin-nav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <div className={`min-h-screen flex bg-bg ${!isLoginPage ? '' : ''}`}>
      <AdminNav />
      <main className={`flex-1 min-h-screen overflow-y-auto ${isLoginPage ? '' : 'ml-64 p-8'}`}>
        {children}
      </main>
    </div>
  )
}
