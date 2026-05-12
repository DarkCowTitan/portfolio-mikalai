'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle, Github, Linkedin } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Erreur lors de l\'envoi')
      }

      setStatus('success')
      setForm({ nom: '', email: '', sujet: '', message: '' })
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err.message ?? 'Une erreur est survenue.')
    }
  }

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="section-label mb-4 inline-flex">Contact</span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            Travaillons ensemble
          </h1>
          <p className="text-slate-400 text-lg max-w-xl">
            Une idée de projet, une question ou juste envie de dire bonjour ?
            Je suis toujours ouvert à la discussion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-16 px-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
              >
                <CheckCircle size={48} className="text-emerald-400 mb-4" />
                <h2 className="font-display font-bold text-2xl text-white mb-2">Message envoyé !</h2>
                <p className="text-slate-400 mb-6">Je vous répondrai dans les meilleurs délais.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-secondary text-sm py-2 px-5"
                >
                  Envoyer un autre message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nom <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={form.nom}
                      onChange={set('nom')}
                      placeholder="Votre nom"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email <span className="text-violet-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={set('email')}
                      placeholder="votre@email.com"
                      className="input-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Sujet</label>
                  <input
                    type="text"
                    value={form.sujet}
                    onChange={set('sujet')}
                    placeholder="Sujet de votre message"
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message <span className="text-violet-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={set('message')}
                    placeholder="Votre message..."
                    className="input-base resize-none"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-2 space-y-4"
          >
            {/* Direct contact */}
            <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
              <h3 className="font-semibold text-white mb-4">Contact direct</h3>
              <div className="space-y-3">
                <a
                  href="mailto:yeuseyenka.mikalai@gmail.com"
                  className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <Mail size={16} className="text-zinc-400" />
                  yeuseyenka.mikalai@gmail.com
                </a>
              </div>
            </div>

            {/* Socials */}
            <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
              <h3 className="font-semibold text-white mb-4">Réseaux</h3>
              <div className="space-y-3">
                <a
                  href="https://github.com/DarkCowTitan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <Github size={16} />
                  GitHub — DarkCowTitan
                </a>
                <a
                  href="https://www.linkedin.com/in/mikalai-yeuseyenka/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  <Linkedin size={16} />
                  LinkedIn — Mikalai Yeuseyenka
                </a>
              </div>
            </div>

            {/* Response time */}
            <div className="p-5 rounded-2xl bg-violet-500/5 border border-violet-500/20">
              <div className="flex items-start gap-3">
                <MessageSquare size={18} className="text-violet-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">Temps de réponse</p>
                  <p className="text-xs text-slate-400">
                    Je réponds généralement sous 24–48h en semaine.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
