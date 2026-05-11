import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fetch all published projects with their relations
export async function getProjets(options?: {
  poleId?: number
  tagId?: number
  annee?: number
  enAvant?: boolean
  limit?: number
}) {
  let query = supabase
    .from('projets')
    .select(`
      *,
      type_projet:types_projets(*),
      images:projet_images(*),
      projet_tags(tag:tags(*)),
      projet_logiciels(logiciel:logiciels(*)),
      projet_apprentissages(ac:apprentissages_critiques(*, competence:competences_but(*, pole:poles(*))))
    `)
    .eq('est_publie', true)
    .order('ordre_affichage', { ascending: true })

  if (options?.enAvant) query = query.eq('est_mis_en_avant', true)
  if (options?.annee) query = query.eq('annee', options.annee)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) throw error

  return data?.map(normalizeProjet) ?? []
}

export async function getProjet(id: number) {
  const { data, error } = await supabase
    .from('projets')
    .select(`
      *,
      type_projet:types_projets(*),
      images:projet_images(*),
      projet_tags(tag:tags(*)),
      projet_logiciels(logiciel:logiciels(*)),
      projet_apprentissages(ac:apprentissages_critiques(*, competence:competences_but(*, pole:poles(*))))
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return normalizeProjet(data)
}

export async function getPoles() {
  const { data, error } = await supabase
    .from('poles')
    .select('*')
    .order('id')
  if (error) throw error
  return data ?? []
}

export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('nom')
  if (error) throw error
  return data ?? []
}

export async function getLogiciels() {
  const { data, error } = await supabase
    .from('logiciels')
    .select('*')
    .order('nom')
  if (error) throw error
  return data ?? []
}

export async function getTypesProjet() {
  const { data, error } = await supabase
    .from('types_projets')
    .select('*')
    .order('nom')
  if (error) throw error
  return data ?? []
}

// Normalize the nested relations from Supabase join format
function normalizeProjet(raw: any) {
  return {
    ...raw,
    tags: raw.projet_tags?.map((pt: any) => pt.tag).filter(Boolean) ?? [],
    logiciels: raw.projet_logiciels?.map((pl: any) => pl.logiciel).filter(Boolean) ?? [],
    apprentissages: raw.projet_apprentissages?.map((pa: any) => pa.ac).filter(Boolean) ?? [],
    images: raw.images ?? [],
    type_projet: raw.type_projet ?? null,
  }
}

// Extract unique poles from projects (via ACs → competences → poles)
export function extractPolesFromProjet(projet: any): string[] {
  const poles: Set<string> = new Set()
  projet.apprentissages?.forEach((ac: any) => {
    const poleName = ac?.competence?.pole?.nom
    if (poleName) poles.add(poleName)
  })
  return Array.from(poles)
}

export function getPoleColor(poleName: string): string {
  const colors: Record<string, string> = {
    'Développement': '#3B82F6',
    'Création': '#EC4899',
    'Communication': '#10B981',
  }
  return colors[poleName] ?? '#8b5cf6'
}
