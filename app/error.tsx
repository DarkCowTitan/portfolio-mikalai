'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-rose-400 text-2xl">⚠</span>
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">Une erreur est survenue</h2>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          Quelque chose s&apos;est mal passé. Veuillez réessayer.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={reset} className="btn-primary gap-2">
            <RefreshCw size={16} />
            Réessayer
          </button>
          <Link href="/" className="btn-secondary gap-2">
            <Home size={16} />
            Accueil
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
