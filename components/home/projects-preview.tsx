'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProjectCard from '@/components/project-card'

interface ProjectsPreviewProps {
  projects: any[]
}

export default function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  if (!projects.length) return null

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-violet-500/30" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="section-label mb-3 inline-flex">Réalisations</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Projets mis en avant
            </h2>
          </div>
          <Link
            href="/projects"
            className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors group"
          >
            Voir tout
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((projet, i) => (
            <ProjectCard key={projet.id} projet={projet} index={i} />
          ))}
        </div>

        {/* View all CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/projects" className="btn-secondary inline-flex">
            Voir tous les projets
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
