'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/projects', label: 'Projets' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
]

const socials = [
  { href: 'https://github.com/DarkC343', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:bydark.cow@gmail.com', icon: Mail, label: 'Email' },
]

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null

  return (
    <footer className="border-t border-bg-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="font-display font-semibold text-white">Mikalai Yeuseyenka</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 max-w-xs">
              Étudiant en MMI — Développement, création et communication digitale.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-bg-card border border-bg-border text-slate-400 hover:text-violet-400 hover:border-violet-500/30 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Navigation</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-violet-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Formation */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Formation</p>
            <p className="text-sm text-slate-400">
              BUT Métiers du Multimédia<br />et de l&apos;Internet (MMI)
            </p>
            <div className="mt-3 flex flex-col gap-1">
              <span className="inline-flex items-center gap-1.5 text-xs text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Pôle Développement
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-pink-400">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                Pôle Création
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Pôle Communication
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-bg-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Mikalai Yeuseyenka. Tous droits réservés.
          </p>
          <p className="text-xs text-slate-600">
            Fait avec Next.js, Supabase &amp; Framer Motion
          </p>
        </div>
      </div>
    </footer>
  )
}
