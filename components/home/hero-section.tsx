'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowDown, Sparkles } from 'lucide-react'

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="blob-delay absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-400/8 blur-3xl" />
        <div className="blob absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-violet-400/6 blur-3xl animation-delay-4000" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-40 pointer-events-none"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(34,211,238,0.05))',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          <Sparkles size={14} className="text-violet-400 animate-pulse" />
          <span className="text-sm text-violet-300 font-medium">Portfolio MMI — BUT 2024/2025</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.05] tracking-tight mb-6"
        >
          Mikalai{' '}
          <span className="text-gradient-violet">Yeuseyenka</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Étudiant en{' '}
          <span className="text-white font-medium">Métiers du Multimédia et de l&apos;Internet</span>.
          Je développe, crée et communique — du code au pixel, de l&apos;idée à l&apos;expérience.
        </motion.p>

        {/* Pole tags */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {[
            { label: 'Développement', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
            { label: 'Création', color: '#EC4899', bg: 'rgba(236,72,153,0.1)' },
            { label: 'Communication', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
          ].map((pole, i) => (
            <motion.span
              key={pole.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="px-4 py-1.5 rounded-full text-sm font-medium border"
              style={{
                color: pole.color,
                background: pole.bg,
                borderColor: `${pole.color}40`,
              }}
            >
              {pole.label}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/projects" className="btn-primary text-base px-8 py-3.5 gap-2">
            Voir mes projets
            <ArrowDown size={16} className="rotate-[-45deg]" />
          </Link>
          <Link href="/about" className="btn-secondary text-base px-8 py-3.5">
            En savoir plus
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Side decorations */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3"
      >
        {['25+', 'Projets'].map((item, i) => (
          <span key={i} className={`text-xs ${i === 0 ? 'text-violet-400 font-bold text-lg' : 'text-slate-500'}`}>
            {item}
          </span>
        ))}
      </motion.div>
    </section>
  )
}
