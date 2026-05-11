import { createClient } from '@supabase/supabase-js'
import { Mail, CheckCircle } from 'lucide-react'

async function getMessages() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase
    .from('messages_contact')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export default async function AdminMessagesPage() {
  const messages = await getMessages()
  const unread = messages.filter(m => !m.lu).length

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">
          {messages.length} message{messages.length !== 1 ? 's' : ''} au total
          {unread > 0 && <span className="text-violet-400 ml-1">— {unread} non lu{unread !== 1 ? 's' : ''}</span>}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <Mail size={32} className="mx-auto mb-3 opacity-30" />
          <p>Aucun message reçu</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`p-5 rounded-2xl border transition-colors ${
                msg.lu
                  ? 'bg-bg-card border-bg-border'
                  : 'bg-violet-500/5 border-violet-500/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{msg.nom}</p>
                    {!msg.lu && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/25">
                        Nouveau
                      </span>
                    )}
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-sm text-violet-400 hover:underline">
                    {msg.email}
                  </a>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-500">
                    {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  {msg.lu && <CheckCircle size={14} className="text-slate-600 ml-auto mt-1" />}
                </div>
              </div>

              {msg.sujet && (
                <p className="text-sm font-medium text-slate-300 mb-2">
                  Sujet : {msg.sujet}
                </p>
              )}

              <p className="text-sm text-slate-400 whitespace-pre-wrap">{msg.message}</p>

              <div className="mt-3 pt-3 border-t border-bg-border">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${msg.sujet ?? 'Votre message'}`}
                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Répondre par email →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
