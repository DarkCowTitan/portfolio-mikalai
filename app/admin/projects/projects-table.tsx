'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Edit, Eye, EyeOff, ExternalLink, Star, ChevronUp, ChevronDown } from 'lucide-react'

interface Projet {
  id: number
  titre: string
  description: string | null
  annee: number | null
  est_publie: boolean
  est_mis_en_avant: boolean
  ordre_affichage: number | null
}

export default function ProjectsTable({ initialProjects }: { initialProjects: Projet[] }) {
  const [projects, setProjects] = useState<Projet[]>(initialProjects)
  const [updating, setUpdating] = useState<number | null>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const toggleFeatured = async (projet: Projet) => {
    const newVal = !projet.est_mis_en_avant
    setUpdating(projet.id)
    // Optimistic
    setProjects(prev => prev.map(p => p.id === projet.id ? { ...p, est_mis_en_avant: newVal } : p))
    await supabase.from('projets').update({ est_mis_en_avant: newVal }).eq('id', projet.id)
    setUpdating(null)
  }

  const moveOrder = async (projet: Projet, direction: 'up' | 'down') => {
    const currentOrder = projet.ordre_affichage ?? 99
    const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1
    if (newOrder < 1) return

    const other = projects.find(p => (p.ordre_affichage ?? 99) === newOrder)

    setUpdating(projet.id)
    // Optimistic swap
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projet.id) return { ...p, ordre_affichage: newOrder }
        if (other && p.id === other.id) return { ...p, ordre_affichage: currentOrder }
        return p
      }).sort((a, b) => (a.ordre_affichage ?? 99) - (b.ordre_affichage ?? 99))
    )

    await supabase.from('projets').update({ ordre_affichage: newOrder }).eq('id', projet.id)
    if (other) {
      await supabase.from('projets').update({ ordre_affichage: currentOrder }).eq('id', other.id)
    }
    setUpdating(null)
  }

  return (
    <div className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bg-border">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Projet</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Année</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell text-center">Featured</th>
              <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell text-center">Ordre</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((projet, i) => (
              <tr
                key={projet.id}
                className={`border-b border-bg-border last:border-0 transition-colors ${
                  updating === projet.id ? 'opacity-60' : 'hover:bg-bg-secondary/50'
                }`}
              >
                {/* Title + order badge */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-bg-secondary border border-bg-border flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                      {projet.ordre_affichage ?? i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{projet.titre}</p>
                      {projet.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 hidden md:block">{projet.description}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Year */}
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span className="text-sm text-slate-400">{projet.annee ?? '—'}</span>
                </td>

                {/* Published */}
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                    projet.est_publie
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : 'text-slate-400 bg-bg-secondary border-bg-border'
                  }`}>
                    {projet.est_publie ? <Eye size={11} /> : <EyeOff size={11} />}
                    {projet.est_publie ? 'Publié' : 'Brouillon'}
                  </span>
                </td>

                {/* Featured toggle */}
                <td className="py-3 px-4 hidden md:table-cell text-center">
                  <button
                    onClick={() => toggleFeatured(projet)}
                    disabled={updating === projet.id}
                    title={projet.est_mis_en_avant ? 'Retirer des mis en avant' : 'Mettre en avant'}
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all disabled:cursor-wait ${
                      projet.est_mis_en_avant
                        ? 'text-violet-400 bg-violet-500/10 border-violet-500/30 hover:bg-violet-500/20'
                        : 'text-slate-500 border-bg-border hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5'
                    }`}
                  >
                    <Star
                      size={11}
                      className={projet.est_mis_en_avant ? 'fill-violet-400' : ''}
                    />
                    {projet.est_mis_en_avant ? 'Featured' : '—'}
                  </button>
                </td>

                {/* Order up/down */}
                <td className="py-3 px-4 hidden md:table-cell">
                  <div className="flex items-center justify-center gap-0.5">
                    <button
                      onClick={() => moveOrder(projet, 'up')}
                      disabled={updating === projet.id || (projet.ordre_affichage ?? 99) <= 1}
                      title="Monter"
                      className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-bg-secondary transition-colors disabled:opacity-25 disabled:cursor-default"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => moveOrder(projet, 'down')}
                      disabled={updating === projet.id}
                      title="Descendre"
                      className="p-1.5 rounded text-slate-500 hover:text-white hover:bg-bg-secondary transition-colors disabled:opacity-25 disabled:cursor-default"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/projects/${projet.id}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-bg-secondary transition-colors"
                      title="Voir le projet"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <Link
                      href={`/admin/projects/${projet.id}`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 transition-colors"
                      title="Modifier"
                    >
                      <Edit size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
