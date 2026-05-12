'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Globe, Calendar, Code2, Palette, Megaphone } from 'lucide-react'
import PagePreloader from '@/components/page-preloader'

const poleConfig: Record<string, { color: string; bg: string; border: string; Icon: any }> = {
  'Développement': { color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', Icon: Code2 },
  'Création': { color: '#EC4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.2)', Icon: Palette },
  'Communication': { color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', Icon: Megaphone },
}

interface Props {
  projet: any
  poles: string[]
  imageUrl: string | null
}

export default function ProjectDetailClient({ projet, poles, imageUrl }: Props) {
  return (
    <div className="min-h-screen pt-20">
      <PagePreloader title={projet.titre} />
      {/* Hero image */}
      <div className="relative h-[40vh] sm:h-[50vh] bg-bg-secondary overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={projet.titre}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl font-bold text-violet-400/20">
              {projet.titre.charAt(0)}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-4 sm:left-8">
          <Link
            href="/projects"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-bg/80 backdrop-blur-sm border border-bg-border text-slate-300 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Poles */}
              {poles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {poles.map((pole) => {
                    const cfg = poleConfig[pole]
                    return (
                      <span
                        key={pole}
                        className="px-3 py-1 rounded-full text-sm font-medium border"
                        style={cfg ? { color: cfg.color, background: cfg.bg, borderColor: cfg.border } : {}}
                      >
                        {pole}
                      </span>
                    )
                  })}
                </div>
              )}

              {/* Title */}
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                {projet.titre}
              </h1>

              {/* Description */}
              {projet.description && (
                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                  {projet.description}
                </p>
              )}

              {/* Long description */}
              {projet.description_longue && (
                <div className="prose prose-invert prose-sm max-w-none mb-8">
                  <div className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {projet.description_longue}
                  </div>
                </div>
              )}

              {/* Additional images */}
              {projet.images && projet.images.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-white mb-4">Galerie</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projet.images.map((img: any) => {
                      const src = img.url.startsWith('http')
                        ? img.url
                        : `https://yeuseyenka-mikalai.com/fichiers_projets/${img.url}`
                      return (
                        <motion.div
                          key={img.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          className="relative aspect-video rounded-xl overflow-hidden bg-bg-secondary border border-bg-border"
                        >
                          <Image src={src} alt={img.alt ?? projet.titre} fill className="object-cover" />
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Apprentissages critiques */}
              {projet.apprentissages && projet.apprentissages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mt-10"
                >
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Apprentissages Critiques
                  </h2>
                  <div className="space-y-3">
                    {projet.apprentissages.map((ac: any) => {
                      const poleName = ac?.competence?.pole?.nom
                      const cfg = poleName ? poleConfig[poleName] : null
                      return (
                        <div
                          key={ac.id}
                          className="flex items-start gap-3 p-3 rounded-xl bg-bg-card border border-bg-border"
                        >
                          <span
                            className="mt-0.5 shrink-0 px-2 py-0.5 rounded-md text-xs font-mono font-bold border"
                            style={cfg ? { color: cfg.color, background: cfg.bg, borderColor: cfg.border } : { color: '#a78bfa', background: 'rgba(124,58,237,0.1)', borderColor: 'rgba(124,58,237,0.2)' }}
                          >
                            {ac.code}
                          </span>
                          <span className="text-sm text-slate-400">{ac.description}</span>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-5"
          >
            {/* Links */}
            <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Liens</h3>
              <div className="space-y-3">
                {projet.lien_demo && (
                  <a
                    href={projet.lien_demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-bg-border hover:border-violet-500/30 text-slate-300 hover:text-white transition-all group"
                  >
                    <Globe size={16} className="text-violet-400" />
                    <span className="text-sm">Voir la démo</span>
                    <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {projet.lien_github && (
                  <a
                    href={projet.lien_github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-bg-border hover:border-slate-500 text-slate-300 hover:text-white transition-all group"
                  >
                    <Github size={16} />
                    <span className="text-sm">GitHub</span>
                    <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {projet.lien_behance && (
                  <a
                    href={projet.lien_behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-bg-border hover:border-blue-500/30 text-slate-300 hover:text-white transition-all group"
                  >
                    <ExternalLink size={16} className="text-blue-400" />
                    <span className="text-sm">Behance</span>
                    <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                )}
                {!projet.lien_demo && !projet.lien_github && !projet.lien_behance && (
                  <p className="text-xs text-slate-500">Aucun lien disponible</p>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Infos</h3>
              <dl className="space-y-3">
                {projet.annee && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-500" />
                    <dt className="text-xs text-slate-500 w-16">Année</dt>
                    <dd className="text-sm text-white">{projet.annee}</dd>
                  </div>
                )}
                {projet.type_projet && (
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-sm border border-violet-500/40 bg-violet-500/10 inline-block" />
                    <dt className="text-xs text-slate-500 w-16">Type</dt>
                    <dd className="text-sm text-white">{projet.type_projet.nom}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Logiciels */}
            {projet.logiciels && projet.logiciels.length > 0 && (
              <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Outils</h3>
                <div className="flex flex-wrap gap-2">
                  {projet.logiciels.map((logiciel: any) => (
                    <span
                      key={logiciel.id}
                      className="px-2.5 py-1 rounded-lg text-xs text-slate-300 bg-bg-secondary border border-bg-border"
                    >
                      {logiciel.nom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {projet.tags && projet.tags.length > 0 && (
              <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {projet.tags.map((tag: any) => (
                    <span
                      key={tag.id}
                      className="px-2.5 py-1 rounded-full text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20"
                    >
                      #{tag.nom}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      </div>
    </div>
  )
}
