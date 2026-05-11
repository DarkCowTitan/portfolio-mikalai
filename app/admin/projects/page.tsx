import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Plus, Edit, Eye, EyeOff, ExternalLink } from 'lucide-react'

async function getAllProjets() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase
    .from('projets')
    .select('id, titre, description, annee, est_publie, est_mis_en_avant, ordre_affichage, image_principale, created_at')
    .order('ordre_affichage', { ascending: true })

  if (error) throw error
  return data ?? []
}

export default async function AdminProjectsPage() {
  const projects = await getAllProjets()

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-white">Projets</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} projet{projects.length !== 1 ? 's' : ''} au total</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary gap-2">
          <Plus size={16} />
          Nouveau
        </Link>
      </div>

      {/* Table */}
      <div className="bg-bg-card border border-bg-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-border">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Projet</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Année</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Featured</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((projet: any, i: number) => (
                <tr
                  key={projet.id}
                  className="border-b border-bg-border last:border-0 hover:bg-bg-secondary/50 transition-colors"
                >
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
                  <td className="py-3 px-4 hidden sm:table-cell">
                    <span className="text-sm text-slate-400">{projet.annee ?? '—'}</span>
                  </td>
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
                  <td className="py-3 px-4 hidden md:table-cell">
                    {projet.est_mis_en_avant ? (
                      <span className="text-xs text-violet-400">✦ Featured</span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
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
    </div>
  )
}
