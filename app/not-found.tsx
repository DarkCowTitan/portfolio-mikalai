'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="font-display font-bold text-[8rem] text-violet-600/20 leading-none mb-4 select-none">
          404
        </div>
        <h1 className="font-display font-bold text-3xl text-white mb-3">Page introuvable</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-primary gap-2">
            <Home size={16} />
            Accueil
          </Link>
          <Link href="/projects" className="btn-secondary gap-2">
            <ArrowLeft size={16} />
            Projets
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
