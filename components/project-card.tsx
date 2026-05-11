'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Calendar, ExternalLink } from 'lucide-react'
import { extractPolesFromProjet, getPoleColor } from '@/lib/supabase'

interface ProjectCardProps {
  projet: any
  index?: number
  compact?: boolean
}

const poleClasses: Record<string, string> = {
  'Développement': 'pole-badge-dev',
  'Création': 'pole-badge-crea',
  'Communication': 'pole-badge-com',
}

export default function ProjectCard({ projet, index = 0, compact = false }: ProjectCardProps) {
  const poles = extractPolesFromProjet(projet)
  const imageUrl = projet.image_principale
    ? projet.image_principale.startsWith('http')
      ? projet.image_principale
      : `https://yeuseyenka-mikalai.com/admin/fichiers_projets/${projet.image_principale}`
    : null

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative"
    >
      <Link href={`/projects/${projet.id}`}>
        <div className="relative bg-bg-card border border-bg-border rounded-2xl overflow-hidden card-hover">
          {/* Image */}
          <div className={`relative overflow-hidden ${compact ? 'h-44' : 'h-52'} bg-bg-secondary`}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={projet.titre}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-400/20 border border-violet-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-violet-400">
                    {projet.titre.charAt(0)}
                  </span>
                </div>
              </div>
            )}

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Hover arrow */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
              <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                <ArrowUpRight size={14} className="text-white" />
              </div>
            </div>

            {/* Featured badge */}
            {projet.est_mis_en_avant && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-violet-600/80 text-white backdrop-blur-sm border border-violet-400/30">
                  ✦ Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Poles */}
            {poles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {poles.map((pole) => (
                  <span key={pole} className={poleClasses[pole] ?? 'pole-badge-dev'}>
                    {pole}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h3 className="font-display font-semibold text-white text-lg leading-snug mb-2 group-hover:text-violet-300 transition-colors">
              {projet.titre}
            </h3>

            {/* Description */}
            {!compact && projet.description && (
              <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                {projet.description}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-bg-border">
              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {projet.tags?.slice(0, 3).map((tag: any) => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 rounded-full text-xs text-slate-400 bg-bg-secondary border border-bg-border"
                  >
                    {tag.nom}
                  </span>
                ))}
                {projet.tags?.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full text-xs text-slate-500">
                    +{projet.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Year */}
              {projet.annee && (
                <span className="flex items-center gap-1 text-xs text-slate-500 shrink-0 ml-2">
                  <Calendar size={11} />
                  {projet.annee}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
