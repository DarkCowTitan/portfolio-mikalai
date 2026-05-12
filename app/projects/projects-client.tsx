'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, SlidersHorizontal, ChevronDown, GraduationCap, User } from 'lucide-react'
import ProjectCard from '@/components/project-card'
import { extractPolesFromProjet } from '@/lib/supabase'

interface ProjectsClientProps {
  initialProjects: any[]
  poles: any[]
  tags: any[]
  competences: any[]
  typesProjet: any[]
}

const poleColors: Record<string, { text: string; bg: string; border: string; activeBg: string; dot: string }> = {
  'Développement': { text: 'text-blue-400', bg: 'bg-blue-500/8', border: 'border-blue-500/25', activeBg: 'bg-blue-500/15', dot: 'bg-blue-400' },
  'Création':      { text: 'text-pink-400', bg: 'bg-pink-500/8', border: 'border-pink-500/25', activeBg: 'bg-pink-500/15', dot: 'bg-pink-400' },
  'Communication': { text: 'text-emerald-400', bg: 'bg-emerald-500/8', border: 'border-emerald-500/25', activeBg: 'bg-emerald-500/15', dot: 'bg-emerald-400' },
}
const poleOrder = ['Développement', 'Création', 'Communication']

// Competence color by code
const competenceColors: Record<string, { text: string; activeBg: string; border: string }> = {
  'COMPRENDRE': { text: 'text-sky-400',     activeBg: 'bg-sky-500/15',     border: 'border-sky-500/30' },
  'CONCEVOIR':  { text: 'text-violet-400',  activeBg: 'bg-violet-500/15',  border: 'border-violet-500/30' },
  'EXPRIMER':   { text: 'text-fuchsia-400', activeBg: 'bg-fuchsia-500/15', border: 'border-fuchsia-500/30' },
  'DEVELOPPER': { text: 'text-blue-400',    activeBg: 'bg-blue-500/15',    border: 'border-blue-500/30' },
  'ENTREPREND': { text: 'text-emerald-400', activeBg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
}

function extractCompetencesFromProjet(projet: any): number[] {
  const ids = new Set<number>()
  projet.apprentissages?.forEach((ac: any) => {
    const compId = ac?.competence?.id
    if (compId) ids.add(compId)
  })
  return Array.from(ids)
}

function isAcademicProject(projet: any): boolean {
  return (projet.apprentissages?.length ?? 0) > 0
}

export default function ProjectsClient({
  initialProjects, poles, tags, competences, typesProjet,
}: ProjectsClientProps) {
  const [search, setSearch]               = useState('')
  const [selectedPoles, setSelectedPoles] = useState<string[]>([])
  const [selectedTags, setSelectedTags]   = useState<number[]>([])
  const [selectedComps, setSelectedComps] = useState<number[]>([])
  const [selectedType, setSelectedType]   = useState<number | null>(null)
  const [selectedYear, setSelectedYear]   = useState<number | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'academic' | 'personal'>('all')
  const [mobileOpen, setMobileOpen]       = useState(false)
  const [expanded, setExpanded]           = useState<Record<string, boolean>>({
    poles: true, tags: true, competences: true, type: true, year: false,
  })

  const years = useMemo(() => {
    const ys = initialProjects.map((p) => p.annee).filter(Boolean)
    return Array.from(new Set(ys)).sort((a: number, b: number) => b - a)
  }, [initialProjects])

  const usedPoles = useMemo(() => {
    const all = new Set<string>()
    initialProjects.forEach((p) => extractPolesFromProjet(p).forEach((pole) => all.add(pole)))
    return poleOrder.filter((p) => all.has(p))
  }, [initialProjects])

  // Tags grouped by dominant pole + counts
  const tagsByPole = useMemo(() => {
    const map: Record<string, { id: number; nom: string; count: number }[]> = {}
    usedPoles.forEach((p) => { map[p] = [] })
    const unassigned: { id: number; nom: string; count: number }[] = []

    tags.forEach((tag) => {
      const projectsWithTag = initialProjects.filter((p) =>
        p.tags?.some((t: any) => t.id === tag.id)
      )
      const count = projectsWithTag.length
      if (count === 0) return // hide unused tags

      const poleCounts: Record<string, number> = {}
      projectsWithTag.forEach((p) => {
        extractPolesFromProjet(p).forEach((pole) => {
          poleCounts[pole] = (poleCounts[pole] || 0) + 1
        })
      })
      const dominant = Object.entries(poleCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
      if (dominant && map[dominant] !== undefined) {
        map[dominant].push({ id: tag.id, nom: tag.nom, count })
      } else {
        unassigned.push({ id: tag.id, nom: tag.nom, count })
      }
    })
    return { byPole: map, unassigned }
  }, [initialProjects, tags, usedPoles])

  // Competence counts
  const compCounts = useMemo(() => {
    const map: Record<number, number> = {}
    competences.forEach((c) => { map[c.id] = 0 })
    initialProjects.forEach((p) => {
      extractCompetencesFromProjet(p).forEach((cid) => { map[cid] = (map[cid] || 0) + 1 })
    })
    return map
  }, [initialProjects, competences])

  // Type counts
  const typeCounts = useMemo(() => {
    const map: Record<number, number> = {}
    initialProjects.forEach((p) => {
      if (p.type_projet?.id) map[p.type_projet.id] = (map[p.type_projet.id] || 0) + 1
    })
    return map
  }, [initialProjects])

  // Category counts
  const categoryCounts = useMemo(() => ({
    academic: initialProjects.filter(isAcademicProject).length,
    personal: initialProjects.filter((p) => !isAcademicProject(p)).length,
  }), [initialProjects])

  // Filtered projects
  const filtered = useMemo(() => {
    return initialProjects.filter((projet) => {
      if (search) {
        const q = search.toLowerCase()
        if (
          !projet.titre?.toLowerCase().includes(q) &&
          !projet.description?.toLowerCase().includes(q) &&
          !projet.tags?.some((t: any) => t.nom.toLowerCase().includes(q))
        ) return false
      }
      if (selectedPoles.length > 0) {
        const pp = extractPolesFromProjet(projet)
        if (!selectedPoles.some((sp) => pp.includes(sp))) return false
      }
      if (selectedTags.length > 0) {
        if (!selectedTags.every((tid) => projet.tags?.some((t: any) => t.id === tid))) return false
      }
      if (selectedComps.length > 0) {
        const pc = extractCompetencesFromProjet(projet)
        if (!selectedComps.some((cid) => pc.includes(cid))) return false
      }
      if (selectedType !== null && projet.type_projet?.id !== selectedType) return false
      if (selectedYear && projet.annee !== selectedYear) return false
      if (categoryFilter === 'academic' && !isAcademicProject(projet)) return false
      if (categoryFilter === 'personal' && isAcademicProject(projet)) return false
      return true
    })
  }, [initialProjects, search, selectedPoles, selectedTags, selectedComps, selectedType, selectedYear, categoryFilter])

  const hasFilters = search || selectedPoles.length > 0 || selectedTags.length > 0 ||
    selectedComps.length > 0 || selectedType !== null || selectedYear !== null || categoryFilter !== 'all'
  const totalCount = selectedPoles.length + selectedTags.length + selectedComps.length +
    (selectedType !== null ? 1 : 0) + (selectedYear !== null ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0) + (search ? 1 : 0)

  const clearFilters = () => {
    setSearch(''); setSelectedPoles([]); setSelectedTags([]); setSelectedComps([])
    setSelectedType(null); setSelectedYear(null); setCategoryFilter('all')
  }

  const togglePole  = (p: string) => setSelectedPoles((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])
  const toggleTag   = (id: number) => setSelectedTags((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  const toggleComp  = (id: number) => setSelectedComps((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  const toggleExpand = (key: string) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))

  // ─── Reusable components ───────────────────────────────────────────────────

  const SectionHeader = ({ label, skey }: { label: string; skey: string }) => (
    <button
      onClick={() => toggleExpand(skey)}
      className="flex items-center justify-between w-full mb-3 group"
    >
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider group-hover:text-slate-400 transition-colors">
        {label}
      </span>
      <ChevronDown
        size={12}
        className={`text-slate-600 transition-transform duration-200 ${expanded[skey] ? 'rotate-0' : '-rotate-90'}`}
      />
    </button>
  )

  const CountBadge = ({ n }: { n: number }) => n > 0 ? (
    <span className="ml-auto text-[10px] font-mono text-slate-600 tabular-nums">{n}</span>
  ) : null

  // ─── Sidebar ───────────────────────────────────────────────────────────────

  const SidebarContent = () => (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl bg-[#0a0a18] border border-[#1e1e33] text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/60 transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Category — SAÉ vs Personnel */}
      <div>
        <SectionHeader label="Catégorie" skey="category" />
        <AnimatePresence initial={false}>
          {(expanded['category'] ?? true) && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="grid grid-cols-3 gap-1.5 pb-1">
                {([
                  { key: 'all', label: 'Tous', count: initialProjects.length, icon: null },
                  { key: 'academic', label: 'SAÉ', count: categoryCounts.academic, icon: GraduationCap },
                  { key: 'personal', label: 'Perso', count: categoryCounts.personal, icon: User },
                ] as const).map(({ key, label, count, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-xs font-medium transition-all duration-150 ${
                      categoryFilter === key
                        ? 'text-violet-300 bg-violet-500/15 border-violet-500/30'
                        : 'text-slate-500 border-[#1e1e33] hover:border-slate-600 hover:text-slate-300'
                    }`}
                  >
                    {Icon && <Icon size={13} className="opacity-70" />}
                    {label}
                    <span className="text-[10px] font-mono opacity-60">{count}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[#1a1a2e]" />

      {/* Pôles */}
      <div>
        <SectionHeader label="Pôles" skey="poles" />
        <AnimatePresence initial={false}>
          {expanded['poles'] && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="space-y-1 pb-1">
                {usedPoles.map((pole) => {
                  const colors = poleColors[pole]
                  const isActive = selectedPoles.includes(pole)
                  const count = initialProjects.filter((p) => extractPolesFromProjet(p).includes(pole)).length
                  return (
                    <button
                      key={pole}
                      onClick={() => togglePole(pole)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm border transition-all duration-150 ${
                        isActive
                          ? `${colors.text} ${colors.activeBg} ${colors.border}`
                          : 'text-slate-400 border-transparent hover:border-[#1e1e33] hover:text-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                      <span className="text-sm">{pole}</span>
                      <CountBadge n={count} />
                      {isActive && <X size={10} className="shrink-0 opacity-60" />}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[#1a1a2e]" />

      {/* Compétences BUT */}
      <div>
        <SectionHeader label="Compétences BUT" skey="competences" />
        <AnimatePresence initial={false}>
          {expanded['competences'] && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="space-y-1 pb-1">
                {competences.map((comp: any) => {
                  const colors = competenceColors[comp.code] ?? { text: 'text-violet-400', activeBg: 'bg-violet-500/15', border: 'border-violet-500/30' }
                  const isActive = selectedComps.includes(comp.id)
                  const count = compCounts[comp.id] ?? 0
                  const disabled = count === 0
                  return (
                    <button
                      key={comp.id}
                      onClick={() => !disabled && toggleComp(comp.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-all duration-150 ${
                        isActive
                          ? `${colors.text} ${colors.activeBg} ${colors.border}`
                          : disabled
                          ? 'text-slate-700 border-transparent cursor-not-allowed'
                          : 'text-slate-400 border-transparent hover:border-[#1e1e33] hover:text-slate-200'
                      }`}
                    >
                      <span className="font-mono text-[10px] opacity-60 shrink-0">{comp.code.slice(0, 6)}</span>
                      <span className="truncate">{comp.nom}</span>
                      <CountBadge n={count} />
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[#1a1a2e]" />

      {/* Tags by pole */}
      <div>
        <SectionHeader label="Tags" skey="tags" />
        <AnimatePresence initial={false}>
          {expanded['tags'] && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="space-y-3 pb-1">
                {usedPoles.map((pole) => {
                  const poleTags = tagsByPole.byPole[pole] ?? []
                  if (poleTags.length === 0) return null
                  const colors = poleColors[pole]
                  return (
                    <div key={pole}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`w-1 h-1 rounded-full ${colors.dot}`} />
                        <span className={`text-[10px] font-medium ${colors.text} opacity-60`}>{pole}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {poleTags.map((tag) => {
                          const isActive = selectedTags.includes(tag.id)
                          return (
                            <button
                              key={tag.id}
                              onClick={() => toggleTag(tag.id)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all duration-150 ${
                                isActive
                                  ? `${colors.text} ${colors.activeBg} ${colors.border}`
                                  : 'text-slate-500 border-[#1e1e33] hover:border-slate-600 hover:text-slate-300'
                              }`}
                            >
                              {tag.nom}
                              <span className="text-[9px] font-mono opacity-50">{tag.count}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                {tagsByPole.unassigned.length > 0 && (
                  <div>
                    <p className="text-[10px] text-slate-600 mb-1.5">Autres</p>
                    <div className="flex flex-wrap gap-1.5">
                      {tagsByPole.unassigned.map((tag) => {
                        const isActive = selectedTags.includes(tag.id)
                        return (
                          <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all duration-150 ${
                              isActive
                                ? 'text-violet-400 bg-violet-500/15 border-violet-500/30'
                                : 'text-slate-500 border-[#1e1e33] hover:border-slate-600 hover:text-slate-300'
                            }`}
                          >
                            {tag.nom}
                            <span className="text-[9px] font-mono opacity-50">{tag.count}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[#1a1a2e]" />

      {/* Type de média */}
      <div>
        <SectionHeader label="Type de média" skey="type" />
        <AnimatePresence initial={false}>
          {expanded['type'] && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="flex flex-wrap gap-1.5 pb-1">
                {typesProjet.map((tp: any) => {
                  const count = typeCounts[tp.id] ?? 0
                  if (count === 0) return null
                  const isActive = selectedType === tp.id
                  return (
                    <button
                      key={tp.id}
                      onClick={() => setSelectedType(isActive ? null : tp.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all duration-150 ${
                        isActive
                          ? 'text-violet-400 bg-violet-500/15 border-violet-500/30'
                          : 'text-slate-500 border-[#1e1e33] hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {tp.nom}
                      <span className="text-[9px] font-mono opacity-50">{count}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[#1a1a2e]" />

      {/* Years */}
      <div>
        <SectionHeader label="Année" skey="year" />
        <AnimatePresence initial={false}>
          {expanded['year'] && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="flex flex-wrap gap-1.5 pb-1">
                {(years as number[]).map((year) => {
                  const count = initialProjects.filter((p) => p.annee === year).length
                  return (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs border transition-all duration-150 ${
                        selectedYear === year
                          ? 'text-violet-400 bg-violet-500/15 border-violet-500/30'
                          : 'text-slate-500 border-[#1e1e33] hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      {year}
                      <span className="text-[9px] font-mono opacity-50">{count}</span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all"
        >
          <X size={11} />
          Effacer tous les filtres
        </button>
      )}
    </div>
  )

  // ─── Main render ───────────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10 pt-2"
      >
        <span className="section-label mb-4 inline-flex">Portfolio</span>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
          Tous mes projets
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          {initialProjects.length} projets réalisés dans le cadre de ma formation MMI et en dehors.
        </p>
      </motion.div>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#12121f] border border-[#1e1e33] text-slate-300 text-sm hover:border-slate-600 transition-all"
        >
          <SlidersHorizontal size={15} />
          Filtres
          {totalCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
              {totalCount}
            </span>
          )}
        </button>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-5 rounded-2xl bg-[#0d0d1a] border border-[#1e1e33]">
                <SidebarContent />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Layout */}
      <div className="flex gap-8 items-start">
        {/* Desktop sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden lg:block w-64 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide"
        >
          <div className="p-5 rounded-2xl bg-[#0d0d1a] border border-[#1e1e33]">
            <SidebarContent />
          </div>
        </motion.aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {hasFilters && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">
                <span className="text-white font-medium">{filtered.length}</span> résultat{filtered.length !== 1 ? 's' : ''}
              </span>
              {selectedPoles.map((pole) => {
                const colors = poleColors[pole]
                return (
                  <button key={pole} onClick={() => togglePole(pole)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${colors.text} ${colors.activeBg} ${colors.border}`}>
                    {pole}<X size={10} />
                  </button>
                )
              })}
              {selectedTags.map((tid) => {
                const tag = tags.find((t) => t.id === tid)
                if (!tag) return null
                return (
                  <button key={tid} onClick={() => toggleTag(tid)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border text-violet-400 bg-violet-500/10 border-violet-500/25">
                    #{tag.nom}<X size={10} />
                  </button>
                )
              })}
              {selectedComps.map((cid) => {
                const comp = competences.find((c: any) => c.id === cid)
                if (!comp) return null
                const colors = competenceColors[comp.code] ?? { text: 'text-violet-400', activeBg: 'bg-violet-500/10', border: 'border-violet-500/25' }
                return (
                  <button key={cid} onClick={() => toggleComp(cid)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${colors.text} ${colors.activeBg} ${colors.border}`}>
                    {comp.code.slice(0, 6)}<X size={10} />
                  </button>
                )
              })}
              {categoryFilter !== 'all' && (
                <button onClick={() => setCategoryFilter('all')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border text-violet-400 bg-violet-500/10 border-violet-500/25">
                  {categoryFilter === 'academic' ? 'SAÉ' : 'Perso'}<X size={10} />
                </button>
              )}
              {selectedYear && (
                <button onClick={() => setSelectedYear(null)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border text-violet-400 bg-violet-500/10 border-violet-500/25">
                  {selectedYear}<X size={10} />
                </button>
              )}
            </div>
          )}

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filtered.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
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
                <div className="w-16 h-16 rounded-2xl bg-[#12121f] border border-[#1e1e33] flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-slate-500" />
                </div>
                <h3 className="text-white font-semibold mb-2">Aucun projet trouvé</h3>
                <p className="text-slate-500 text-sm mb-4">Essayez d&apos;autres filtres.</p>
                <button onClick={clearFilters} className="btn-secondary text-sm py-2 px-4">
                  Réinitialiser
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
