import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createHash } from 'crypto'

function computeAdminToken(password: string): string {
  return createHash('sha256')
    .update(password + (process.env.ADMIN_SECRET ?? 'portfolio-secret-2024'))
    .digest('hex')
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (but NOT /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value
    const adminPassword = process.env.ADMIN_PASSWORD

    const isAuthenticated = adminPassword && token === computeAdminToken(adminPassword)

    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
