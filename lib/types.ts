export interface Pole {
  id: number
  nom: string
  couleur: string
  description: string | null
}

export interface Competence {
  id: number
  code: string
  nom: string
  description: string | null
  pole_id: number
  pole?: Pole
}

export interface ApprentissageCritique {
  id: number
  code: string
  description: string
  competence_id: number
  competence?: Competence
}

export interface Logiciel {
  id: number
  nom: string
  categorie: string | null
  icone_url: string | null
}

export interface TypeProjet {
  id: number
  nom: string
  description: string | null
}

export interface Tag {
  id: number
  nom: string
  couleur: string | null
}

export interface ProjetImage {
  id: number
  projet_id: number
  url: string
  ordre: number
  alt: string | null
}

export interface Projet {
  id: number
  titre: string
  description: string | null
  description_longue: string | null
  image_principale: string | null
  annee: number | null
  lien_demo: string | null
  lien_github: string | null
  lien_behance: string | null
  est_publie: boolean
  est_mis_en_avant: boolean
  ordre_affichage: number
  created_at: string
  updated_at: string
  type_projet?: TypeProjet | null
  type_projet_id: number | null
  // joined relations
  poles?: Pole[]
  tags?: Tag[]
  logiciels?: Logiciel[]
  apprentissages?: ApprentissageCritique[]
  images?: ProjetImage[]
}

export interface ProjetWithRelations extends Projet {
  poles: Pole[]
  tags: Tag[]
  logiciels: Logiciel[]
  apprentissages: ApprentissageCritique[]
  images: ProjetImage[]
  type_projet: TypeProjet | null
}

export interface ContactMessage {
  id: number
  nom: string
  email: string
  sujet: string | null
  message: string
  lu: boolean
  created_at: string
}
