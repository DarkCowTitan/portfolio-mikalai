'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/8 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label mb-6 inline-flex">Contact</span>

          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6 leading-tight">
            Travaillons ensemble
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed">
            Je suis ouvert aux opportunités de stage, aux projets collaboratifs et aux missions freelance.
            N&apos;hésitez pas à me contacter !
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-primary text-base px-8 py-4 gap-2">
              <Mail size={18} />
              Me contacter
            </Link>
            <Link href="/projects" className="btn-secondary text-base px-8 py-4 gap-2">
              Voir mes projets
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
