'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Download, ArrowRight, Code2, Palette, Megaphone, GraduationCap, MapPin, Mail } from 'lucide-react'

const skills = {
  dev: ['Next.js', 'React', 'TypeScript', 'PHP', 'MySQL', 'Supabase', 'Tailwind CSS', 'Git'],
  crea: ['Figma', 'Adobe Photoshop', 'Adobe Illustrator', 'After Effects', 'Blender', 'Lightroom'],
  com: ['SEO', 'Community Management', 'WordPress', 'Adobe Premiere', 'Canva', 'Analytics'],
}

const timeline = [
  { year: '2024–2025', title: 'BUT MMI — 2ème année', place: 'IUT Montpellier-Sète', type: 'edu' },
  { year: '2023–2024', title: 'BUT MMI — 1ère année', place: 'IUT Montpellier-Sète', type: 'edu' },
  { year: '2023', title: 'Baccalauréat STI2D', place: 'Lycée', type: 'edu' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label mb-4 inline-flex">À propos</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white">
            Qui suis-je ?
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: bio */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-5 text-slate-300 leading-relaxed"
            >
              <p className="text-xl text-slate-200 font-medium">
                Je m&apos;appelle Mikalai Yeuseyenka, étudiant en deuxième année de BUT MMI (Métiers du Multimédia et de l&apos;Internet) à l&apos;IUT Montpellier-Sète.
              </p>
              <p>
                Passionné par les interfaces numériques depuis toujours, je me retrouve à l&apos;intersection du développement web, du design graphique et de la communication digitale — trois domaines que la formation MMI articule avec cohérence.
              </p>
              <p>
                Mon approche est centrée sur l&apos;expérience utilisateur : je cherche à créer des produits non seulement fonctionnels, mais aussi beaux et agréables à utiliser. Le code doit servir le design, le design doit servir l&apos;humain.
              </p>
              <p>
                En dehors des cours, je travaille sur des projets personnels, j&apos;explore les nouvelles technologies web et je m&apos;intéresse à l&apos;open source.
              </p>
            </motion.div>

            {/* Quick info */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: MapPin, text: 'Montpellier, France' },
                { icon: GraduationCap, text: 'BUT MMI' },
                { icon: Mail, text: 'bydark.cow@gmail.com' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-slate-400">
                  <Icon size={14} className="text-violet-400" />
                  {text}
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/contact" className="btn-primary gap-2">
                <Mail size={16} />
                Me contacter
              </Link>
              <Link href="/projects" className="btn-secondary gap-2">
                Voir mes projets
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-8"
            >
              <h2 className="font-display font-bold text-xl text-white mb-6">Parcours</h2>
              <div className="relative pl-4 border-l border-bg-border space-y-6">
                {timeline.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -left-[21px] w-3 h-3 rounded-full bg-violet-600 border-2 border-bg mt-1" />
                    <div className="text-xs text-violet-400 font-mono mb-1">{item.year}</div>
                    <div className="font-semibold text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.place}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: skills */}
          <div className="lg:col-span-2 space-y-5">
            {[
              { key: 'dev', label: 'Développement', icon: Code2, color: '#3B82F6', skills: skills.dev },
              { key: 'crea', label: 'Création', icon: Palette, color: '#EC4899', skills: skills.crea },
              { key: 'com', label: 'Communication', icon: Megaphone, color: '#10B981', skills: skills.com },
            ].map(({ key, label, icon: Icon, color, skills: s }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="p-5 rounded-2xl bg-bg-card border border-bg-border"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                  >
                    <Icon size={16} style={{ color }} />
                  </div>
                  <h3 className="font-semibold text-white text-sm">{label}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium border"
                      style={{ color, background: `${color}10`, borderColor: `${color}25` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
