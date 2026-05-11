import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { FolderOpen, MessageSquare, Eye, Plus, ArrowRight } from 'lucide-react'

async function getStats() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [{ count: projectCount }, { count: msgCount }, { data: recentProjects }, { data: recentMessages }] = await Promise.all([
    supabase.from('projets').select('*', { count: 'exact', head: true }),
    supabase.from('messages_contact').select('*', { count: 'exact', head: true }).eq('lu', false),
    supabase.from('projets').select('id, titre, est_publie, annee, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('messages_contact').select('*').order('created_at', { ascending: false }).limit(3),
  ])

  return { projectCount, msgCount, recentProjects, recentMessages }
}

export default async function AdminDashboardPage() {
  const { projectCount, msgCount, recentProjects, recentMessages } = await getStats()

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display font-bold text-3xl text-white mb-1">Dashboard</h1>
        <p className="text-slate-400 text-sm">Bienvenue dans l&apos;administration de votre portfolio.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: 'Projets total', value: projectCount ?? 0, icon: FolderOpen, color: 'violet', href: '/admin/projects' },
          { label: 'Messages non lus', value: msgCount ?? 0, icon: MessageSquare, color: 'cyan', href: '/admin/messages' },
          { label: 'Site public', value: 'En ligne', icon: Eye, color: 'emerald', href: '/', external: true },
        ].map(({ label, value, icon: Icon, color, href, external }) => (
          <Link
            key={label}
            href={href}
            target={external ? '_blank' : undefined}
            className="group p-5 rounded-2xl bg-bg-card border border-bg-border hover:border-violet-500/30 transition-all"
          >
            <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center mb-4`}>
              <Icon size={18} className={`text-${color}-400`} />
            </div>
            <div className="font-display font-bold text-2xl text-white">{value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="font-semibold text-white text-lg mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/projects/new" className="btn-primary gap-2">
            <Plus size={16} />
            Nouveau projet
          </Link>
          <Link href="/admin/projects" className="btn-secondary gap-2">
            Gérer les projets
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Recent projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Projets récents</h2>
            <Link href="/admin/projects" className="text-xs text-violet-400 hover:text-violet-300">
              Tout voir →
            </Link>
          </div>
          <div className="space-y-3">
            {recentProjects?.map((p: any) => (
              <Link
                key={p.id}
                href={`/admin/projects/${p.id}`}
                className="flex items-center justify-between py-2 border-b border-bg-border last:border-0 hover:text-violet-400 transition-colors group"
              >
                <div>
                  <p className="text-sm text-white group-hover:text-violet-400 transition-colors">{p.titre}</p>
                  {p.annee && <p className="text-xs text-slate-500">{p.annee}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  p.est_publie
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-slate-400 bg-bg-secondary border-bg-border'
                }`}>
                  {p.est_publie ? 'Publié' : 'Brouillon'}
                </span>
              </Link>
            )) ?? <p className="text-sm text-slate-500">Aucun projet</p>}
          </div>
        </div>

        {/* Recent messages */}
        <div className="p-5 rounded-2xl bg-bg-card border border-bg-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Messages récents</h2>
            <Link href="/admin/messages" className="text-xs text-violet-400 hover:text-violet-300">
              Tout voir →
            </Link>
          </div>
          <div className="space-y-3">
            {recentMessages && recentMessages.length > 0 ? recentMessages.map((m: any) => (
              <div key={m.id} className="py-2 border-b border-bg-border last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white">{m.nom}</p>
                  {!m.lu && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      Nouveau
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{m.message}</p>
                <p className="text-xs text-slate-600 mt-1">{new Date(m.created_at).toLocaleDateString('fr-FR')}</p>
              </div>
            )) : <p className="text-sm text-slate-500">Aucun message</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
