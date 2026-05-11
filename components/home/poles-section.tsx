'use client'

import { motion } from 'framer-motion'
import { Code2, Palette, Megaphone } from 'lucide-react'

const poleConfig = [
  {
    key: 'Développement',
    icon: Code2,
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.2)',
    description: 'Développement web front-end et back-end, intégration, bases de données, APIs.',
    skills: ['Next.js', 'React', 'TypeScript', 'PHP', 'SQL'],
  },
  {
    key: 'Création',
    icon: Palette,
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.08)',
    border: 'rgba(236,72,153,0.2)',
    description: 'Design graphique, motion design, photographie, identité visuelle et UX/UI.',
    skills: ['Figma', 'Adobe Suite', 'Blender', 'After Effects'],
  },
  {
    key: 'Communication',
    icon: Megaphone,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.2)',
    description: 'Stratégie digitale, réseaux sociaux, community management et rédaction web.',
    skills: ['SEO', 'Community Mgmt', 'Copywriting', 'Analytics'],
  },
]

interface PolesSectionProps {
  poles?: any[]
}

export default function PolesSection({ poles }: PolesSectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label mb-4 inline-flex">Compétences BUT</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
            Trois pôles, une vision
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            La formation MMI structure mes apprentissages autour de trois axes complémentaires,
            couvrant tout le spectre du numérique.
          </p>
        </motion.div>

        {/* Poles grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {poleConfig.map((pole, i) => (
            <motion.div
              key={pole.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative group p-6 rounded-2xl border transition-all duration-300"
              style={{
                background: pole.bg,
                borderColor: pole.border,
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: `${pole.color}20`, border: `1px solid ${pole.color}40` }}
              >
                <pole.icon size={22} style={{ color: pole.color }} />
              </div>

              {/* Content */}
              <h3 className="font-display font-bold text-xl text-white mb-2">
                {pole.key}
              </h3>
              <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                {pole.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {pole.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium border"
                    style={{
                      color: pole.color,
                      background: `${pole.color}10`,
                      borderColor: `${pole.color}25`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 30px ${pole.color}08`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
