'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PagePreloaderProps {
  title: string
}

export default function PagePreloader({ title }: PagePreloaderProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1700)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Noise texture */}
          <div className="noise-preloader absolute inset-0 pointer-events-none" />

          {/* Grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Center glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-0 text-center px-8 max-w-2xl w-full">
            {/* Label reveal */}
            <div className="overflow-hidden mb-6">
              <motion.p
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                className="text-[10px] font-mono tracking-[0.45em] uppercase text-violet-400/60"
              >
                Portfolio · MMI
              </motion.p>
            </div>

            {/* Title reveal — main effect */}
            <div className="overflow-hidden mb-12">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
              >
                {title}
              </motion.h2>
            </div>

            {/* Progress line */}
            <div className="relative w-48 sm:w-72 h-px bg-white/8 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </div>

            {/* Hint text */}
            <div className="overflow-hidden mt-4">
              <motion.p
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 0.4 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[10px] font-mono text-slate-400 tracking-widest"
              >
                Chargement du projet...
              </motion.p>
            </div>
          </div>

          {/* Corner brackets */}
          <div className="absolute top-7 left-7 w-7 h-7 border-t-2 border-l-2 border-violet-500/25" />
          <div className="absolute top-7 right-7 w-7 h-7 border-t-2 border-r-2 border-violet-500/25" />
          <div className="absolute bottom-7 left-7 w-7 h-7 border-b-2 border-l-2 border-violet-500/25" />
          <div className="absolute bottom-7 right-7 w-7 h-7 border-b-2 border-r-2 border-violet-500/25" />

          {/* Decorative line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

