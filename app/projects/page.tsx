import { Suspense } from 'react'
import ProjectsClient from './projects-client'
import { getProjets, getPoles, getTags } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Découvrez tous mes projets MMI : développement web, design graphique, motion design, communication digitale et plus encore.',
}

export const revalidate = 3600

export default async function ProjectsPage() {
  const [projects, poles, tags] = await Promise.all([
    getProjets(),
    getPoles(),
    getTags(),
  ])

  return (
    <div className="min-h-screen pt-24 pb-16">
      <ProjectsClient
        initialProjects={projects}
        poles={poles}
        tags={tags}
      />
    </div>
  )
}
