import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Github, Globe, Calendar, Tag } from 'lucide-react'
import { getProjet, getProjets, extractPolesFromProjet, getPoleColor } from '@/lib/supabase'
import type { Metadata } from 'next'
import ProjectDetailClient from './project-detail-client'

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  const projects = await getProjets().catch(() => [])
  return projects.map(p => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projet = await getProjet(Number(params.id)).catch(() => null)
  if (!projet) return { title: 'Projet introuvable' }
  return {
    title: projet.titre,
    description: projet.description ?? undefined,
  }
}

export const revalidate = 3600

export default async function ProjectDetailPage({ params }: Props) {
  const id = Number(params.id)
  if (isNaN(id)) notFound()

  const projet = await getProjet(id).catch(() => null)
  if (!projet) notFound()

  const poles = extractPolesFromProjet(projet)

  const imageUrl = projet.image_principale
    ? projet.image_principale.startsWith('http')
      ? projet.image_principale
      : `https://yeuseyenka-mikalai.com/admin/fichiers_projets/${projet.image_principale}`
    : null

  return (
    <ProjectDetailClient projet={projet} poles={poles} imageUrl={imageUrl} />
  )
}
