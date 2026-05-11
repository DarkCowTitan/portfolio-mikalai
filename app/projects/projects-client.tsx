'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Grid3X3, List } from 'lucide-react'
import ProjectCard from '@/components/project-card'
import { extractPolesFromProjet } from '@/lib/supabase'

interface ProjectsClientProps {
  initialProjects: any[]
  poles: any[]
  tags: any[]
}

const poleColors: Record<string, { text: string; bg: string; border: string }> = {
  'Développement': { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  'Création': { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/30' },
  'Communication': { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
}

export default function ProjectsClient({ initialProjects, poles, tags }: ProjectsClientProps) {
  const [search, setSearch] = useState('')
  const [selectedPole, setSelectedPole] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)

  // Extract unique years
  const years = useMemo(() => {
    const ys = initialProjects.map(p => p.annee).filter(Boolean)
    return Array.from(new Set(ys)).sort((a, b) => b - a)
  }, [initialProjects])

  // Filter projects
  const filtered = useMemo(() => {
    return initialProjects.filter(projet => {
      // Search
      if (search) {
        const q = search.toLowerCase()
        const inTitle = projet.titre?.toLowerCase().includes(q)
        const inDesc = projet.description?.toLowerCase().includes(q)
        const inTags = projet.tags?.some((t: any) => t.nom.toLowerCase().includes(q))
        if (!inTitle && !inDesc && !inTags) return false
      }

      // Pole filter
      if (selectedPole) {
        const projectPoles = extractPolesFromProjet(projet)
        if (!projectPoles.includes(selectedPole)) return false
      }

      // Tag filter
      if (selectedTag) {
        if (!projet.tags?.some((t: any) => t.id === selectedTag)) return false
      }

      // Year filter
      if (selectedYear && projet.annee !== selectedYear) return false

      return true
    })
  }, [initialProjects, search, selectedPole, selectedTag, selectedYear])

  const hasFilters = search || selectedPole || selectedTag || selectedYear
  const clearFilters = () => {
    setSearch('')
    setSelectedPole(null)
    setSelectedTag(null)
    setSelectedYear(null)
  }

  // Pole names from projects (not DB, to only show used poles)
  const usedPoles = useMemo(() => {
    const all = new Set<string>()
    initialProjects.forEach(p => extractPolesFromProjet(p).forEach(pole => all.add(pole)))
    return Array.from(all)
  }, [initialProjects])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="section-label mb-4 inline-flex">Portfolio</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
          Tous mes projets
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          {initialProjects.length} projets réalisés dans le cadre de ma formation MMI et en dehors.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10 space-y-4"
      >
        {/* Search */}
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-10 pr-4"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Pole filters */}
          <div className="flex flex-wrap gap-2">
            {usedPoles.map((pole) => {
              const colors = poleColors[pole] ?? { text: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' }
              const isActive = selectedPole === pole
              return (
                <button
                  key={pole}
                  onClick={() => setSelectedPole(isActive ? null : pole)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    isActive
                      ? `${colors.text} ${colors.bg} ${colors.border}`
                      : 'text-slate-400 bg-transparent border-bg-border hover:border-slate-500'
                  }`}
                >
                  {pole}
                </button>
              )
            })}
          </div>

          {/* Year filters */}
          {years.length > 0 && (
            <div className="flex gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    selectedYear === year
                      ? 'text-violet-400 bg-violet-500/10 border-violet-500/30'
                      : 'text-slate-400 bg-transparent border-bg-border hover:border-slate-500'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all"
            >
              <X size={11} />
              Effacer
            </button>
          )}
        </div>
      </motion.div>

      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <span className="text-white font-medium">{filtered.length}</span> projet{filtered.length !== 1 ? 's' : ''}
          {hasFilters && <span className="text-slate-600"> (filtré{filtered.length !== 1 ? 's' : ''})</span>}
        </p>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((projet, i) => (
              <ProjectCard key={projet.id} projet={projet} index={i} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 rounded-2xl bg-bg-card border border-bg-border flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-500" />
            </div>
            <h3 className="text-white font-semibold mb-2">Aucun projet trouvé</h3>
            <p className="text-slate-500 text-sm mb-4">Essayez d&apos;autres filtres ou termes de recherche.</p>
            <button onClick={clearFilters} className="btn-secondary text-sm py-2 px-4">
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
