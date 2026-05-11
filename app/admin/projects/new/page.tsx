import { createClient } from '@supabase/supabase-js'
import ProjectForm from '../project-form'

async function getFormData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [{ data: tags }, { data: logiciels }, { data: typesProjet }, { data: poles }] = await Promise.all([
    supabase.from('tags').select('*').order('nom'),
    supabase.from('logiciels').select('*').order('nom'),
    supabase.from('types_projets').select('*').order('nom'),
    supabase.from('poles').select('id, nom'),
  ])
  return { tags: tags ?? [], logiciels: logiciels ?? [], typesProjet: typesProjet ?? [], poles: poles ?? [] }
}

export default async function NewProjectPage() {
  const formData = await getFormData()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Nouveau projet</h1>
        <p className="text-slate-400 text-sm mt-1">Créez un nouveau projet dans votre portfolio.</p>
      </div>
      <ProjectForm {...formData} />
    </div>
  )
}
