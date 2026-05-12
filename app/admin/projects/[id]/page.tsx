import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import ProjectForm from '../project-form'

async function getData(id: number) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [
    { data: projet, error },
    { data: tags },
    { data: logiciels },
    { data: typesProjet },
    { data: poles },
    { data: projetTags },
    { data: projetLogiciels },
    { data: images },
  ] = await Promise.all([
    supabase.from('projets').select('*').eq('id', id).single(),
    supabase.from('tags').select('*').order('nom'),
    supabase.from('logiciels').select('*').order('nom'),
    supabase.from('types_projets').select('*').order('nom'),
    supabase.from('poles').select('id, nom'),
    supabase.from('projet_tags').select('tag_id').eq('projet_id', id),
    supabase.from('projet_logiciels').select('logiciel_id').eq('projet_id', id),
    supabase.from('projet_images').select('id, url, alt, caption, ordre').eq('projet_id', id).order('ordre'),
  ])

  if (error || !projet) return null

  return {
    projet: { ...projet, images: images ?? [] },
    tags: tags ?? [],
    logiciels: logiciels ?? [],
    typesProjet: typesProjet ?? [],
    poles: poles ?? [],
    selectedTags: projetTags?.map(t => t.tag_id) ?? [],
    selectedLogiciels: projetLogiciels?.map(l => l.logiciel_id) ?? [],
  }
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (isNaN(id)) notFound()

  const data = await getData(id)
  if (!data) notFound()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Modifier le projet</h1>
        <p className="text-slate-400 text-sm mt-1">{data.projet.titre}</p>
      </div>
      <ProjectForm
        {...data}
        projet={data.projet}
        selectedTags={data.selectedTags}
        selectedLogiciels={data.selectedLogiciels}
      />
    </div>
  )
}
