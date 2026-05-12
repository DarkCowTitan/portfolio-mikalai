import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import './globals.css'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'

const CursorSpotlight = dynamic(() => import('@/components/cursor-spotlight'), { ssr: false })
const DottedSurface = dynamic(
  () => import('@/components/ui/dotted-surface').then(m => ({ default: m.DottedSurface })),
  { ssr: false }
)

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Mikalai Yeuseyenka — Portfolio MMI',
    template: '%s | Mikalai Yeuseyenka',
  },
  description: 'Portfolio de Mikalai Yeuseyenka, étudiant en MMI (Métiers du Multimédia et de l\'Internet). Développement web, création graphique et communication digitale.',
  keywords: ['portfolio', 'MMI', 'développement web', 'Next.js', 'Supabase', 'design', 'communication'],
  authors: [{ name: 'Mikalai Yeuseyenka' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://portfolio-mikalai.vercel.app',
    title: 'Mikalai Yeuseyenka — Portfolio MMI',
    description: 'Portfolio de Mikalai Yeuseyenka, étudiant en MMI.',
    siteName: 'Portfolio Mikalai',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <DottedSurface />
        <CursorSpotlight />
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
