import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ProjectsTable from './projects-table'

async function getAllProjets() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase
    .from('projets')
    .select('id, titre, description, annee, est_publie, est_mis_en_avant, ordre_affichage')
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

      <ProjectsTable initialProjects={projects} />
    </div>
  )
}
