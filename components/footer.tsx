'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/projects', label: 'Projets' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

const socials = [
  { href: 'https://github.com/DarkCowTitan', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/mikalai-yeuseyenka/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:yeuseyenka.mikalai@gmail.com', icon: Mail, label: 'Email' },
]

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <footer className="border-t border-white/6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-zinc-900 font-bold text-sm">
                M
              </div>
              <span className="font-display font-semibold text-white">Mikalai Yeuseyenka</span>
            </Link>
            <p className="mt-3 text-sm text-zinc-500 max-w-xs">
              Étudiant en MMI — Développement, création et communication digitale.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-white/4 border border-white/8 text-zinc-400 hover:text-white hover:border-white/20 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-4">Navigation</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Formation */}
          <div>
            <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-4">Formation</p>
            <p className="text-sm text-zinc-500">
              BUT Métiers du Multimédia<br />et de l&apos;Internet (MMI)
            </p>
            <p className="text-sm text-zinc-600 mt-2">IUT MMI Toulon · 2024–2026</p>
            <a
              href="/CV_Mikalai_YEUSEYENKA.pdf"
              download
              className="mt-4 inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              ↓ Télécharger le CV
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/6 flex items-center justify-center">
          <p className="text-xs text-zinc-700">
            © {new Date().getFullYear()} Mikalai Yeuseyenka. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
