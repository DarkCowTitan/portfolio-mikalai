import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function computeAdminToken(password: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET ?? 'portfolio-secret-2024'
  const encoder = new TextEncoder()
  const data = encoder.encode(password + secret)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword || password !== adminPassword) {
      return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 })
    }

    // Create a token using Web Crypto API (Edge-compatible)
    const token = await computeAdminToken(password)

    // Set cookie
    const cookieStore = cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = cookies()
  cookieStore.delete('admin_token')
  return NextResponse.json({ success: true })
}
