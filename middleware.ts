import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function computeAdminToken(password: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET ?? 'portfolio-secret-2024'
  const encoder = new TextEncoder()
  const data = encoder.encode(password + secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (but NOT /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value
    const adminPassword = process.env.ADMIN_PASSWORD

    const expectedToken = adminPassword ? await computeAdminToken(adminPassword) : null
    const isAuthenticated = expectedToken && token === expectedToken

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
