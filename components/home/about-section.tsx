'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MapPin, GraduationCap, Download, Github, Linkedin, Mail } from 'lucide-react'
import Image from 'next/image'

const toolGroups = [
  {
    label: 'Développement',
    tools: ['Next.js', 'React', 'TypeScript', 'PHP', 'MySQL', 'Python'],
  },
  {
    label: 'Design & Création',
    tools: ['Figma', 'Illustrator', 'Photoshop', 'InDesign', 'Blender'],
  },
  {
    label: 'Motion & Vidéo',
    tools: ['After Effects', 'Premiere Pro', 'DaVinci Resolve'],
  },
]

export default function AboutSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="about" className="py-24 sm:py-32 relative">
      {/* Section divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent to-white/10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="section-label mb-4 inline-flex">À propos</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
            Qui suis-je ?
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — photo + identity */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col items-center lg:items-start gap-6"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-44 h-44 rounded-2xl overflow-hidden bg-zinc-900 border border-white/8 relative">
                <Image
                  src="/avatar.png"
                  alt="Mikalai Yeuseyenka"
                  fill
                  className="object-cover"
                  sizes="176px"
                />
              </div>
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#080810] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              </div>
            </div>

            {/* Name + title */}
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold text-white mb-1">Mikalai Yeuseyenka</h3>
              <p className="text-zinc-400 font-medium text-sm mb-3">Étudiant BUT MMI · 2024–2026</p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} className="text-zinc-600" />
                  Toulon, France
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={12} className="text-zinc-600" />
                  IUT MMI Toulon
                </span>
              </div>
            </div>

            {/* Social links */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <a
                href="https://github.com/DarkCowTitan"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 text-zinc-400 hover:text-white hover:border-white/20 text-xs transition-colors"
              >
                <Github size={13} />
                DarkCowTitan
              </a>
              <a
                href="https://www.linkedin.com/in/mikalai-yeuseyenka/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 text-zinc-400 hover:text-white hover:border-white/20 text-xs transition-colors"
              >
                <Linkedin size={13} />
                LinkedIn
              </a>
              <a
                href="mailto:yeuseyenka.mikalai@gmail.com"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 text-zinc-400 hover:text-white hover:border-white/20 text-xs transition-colors"
              >
                <Mail size={13} />
                Email
              </a>
            </div>

            {/* CV button */}
            <a
              href="/CV_Mikalai_YEUSEYENKA.pdf"
              download
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-900 text-sm font-semibold hover:bg-zinc-100 transition-colors"
            >
              <Download size={14} />
              Télécharger le CV
            </a>
          </motion.div>

          {/* Right — bio + tools */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-6"
          >
            {/* Bio */}
            <div className="p-6 rounded-2xl bg-white/3 border border-white/8 space-y-4">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Bio</h4>
              <p className="text-zinc-300 leading-relaxed">
                Étudiant en 2ᵉ année de BUT MMI à l&apos;IUT de Toulon,
                je me passionne pour la création d&apos;expériences numériques qui allient
                esthétique et performance.
              </p>
              <p className="text-zinc-500 leading-relaxed text-sm">
                Polyvalent, je travaille aussi bien sur le développement web (Next.js, PHP, SQL),
                la direction artistique (Figma, Photoshop, Illustrator) que la production
                audiovisuelle (Premiere Pro, After Effects). Chaque projet est pour moi
                l&apos;occasion de combiner ces disciplines pour un résultat cohérent.
              </p>
            </div>

            {/* Tool groups */}
            <div className="p-6 rounded-2xl bg-white/3 border border-white/8 space-y-5">
              <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Compétences</h4>
              {toolGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-xs text-zinc-600 mb-2">{group.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 rounded-md text-xs bg-white/4 border border-white/8 text-zinc-400"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '19+', label: 'Projets réalisés' },
                { value: '2024–2026', label: 'Formation MMI' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center p-4 rounded-xl bg-white/3 border border-white/8">
                  <p className="text-xl font-bold text-white">{value}</p>
                  <p className="text-xs text-zinc-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
