import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, email, sujet, message } = body

    // Validate required fields
    if (!nom?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Les champs nom, email et message sont requis.' },
        { status: 400 }
      )
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide.' },
        { status: 400 }
      )
    }

    // Save to Supabase (using anon key with public insert policy)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: dbError } = await supabase
      .from('messages_contact')
      .insert({
        nom: nom.trim(),
        email: email.trim(),
        sujet: sujet?.trim() || null,
        message: message.trim(),
      })

    if (dbError) throw dbError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement du message.' },
      { status: 500 }
    )
  }
}
