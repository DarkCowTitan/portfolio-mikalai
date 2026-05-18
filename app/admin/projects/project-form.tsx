'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Save, Trash2, AlertCircle, CheckCircle, ArrowLeft, Plus, X } from 'lucide-react'
import Link from 'next/link'
import FileUploadZone from '@/components/admin/file-upload-zone'

interface GalleryImageItem {
  id?: number
  url: string
  alt: string
  caption: string
  isNew?: boolean
  toDelete?: boolean
}

interface ProjectFormProps {
  projet?: any
  tags: any[]
  logiciels: any[]
  typesProjet: any[]
  poles?: any[]
  selectedTags?: number[]
  selectedLogiciels?: number[]
}

export default function ProjectForm({
  projet,
  tags,
  logiciels,
  typesProjet,
  selectedTags: initialTags = [],
  selectedLogiciels: initialLogiciels = [],
}: ProjectFormProps) {
  const router = useRouter()
  const isEditing = !!projet

  const [form, setForm] = useState({
    titre: projet?.titre ?? '',
    description: projet?.description ?? '',
    description_longue: projet?.description_longue ?? '',
    image_principale: projet?.image_principale ?? '',
    annee: projet?.annee ?? new Date().getFullYear(),
    lien_demo: projet?.lien_demo ?? '',
    lien_github: projet?.lien_github ?? '',
    lien_behance: projet?.lien_behance ?? '',
    video_url: projet?.video_url ?? '',
    est_publie: projet?.est_publie ?? false,
    est_mis_en_avant: projet?.est_mis_en_avant ?? false,
    ordre_affichage: projet?.ordre_affichage ?? 99,
    type_projet_id: projet?.type_projet_id ?? '',
  })

  const [selTags, setSelTags] = useState<number[]>(initialTags)
  const [selLogiciels, setSelLogiciels] = useState<number[]>(initialLogiciels)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  // Gallery images
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>(
    (projet?.images ?? []).map((img: any) => ({
      id: img.id,
      url: img.url ?? '',
      alt: img.alt ?? '',
      caption: img.caption ?? '',
    }))
  )

  const addGalleryImage = () => {
    setGalleryImages(prev => [...prev, { url: '', alt: '', caption: '', isNew: true }])
  }

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
  }

  const updateGalleryImage = (index: number, field: keyof GalleryImageItem, value: string) => {
    setGalleryImages(prev => prev.map((img, i) => i === index ? { ...img, [field]: value } : img))
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const toggleItem = (arr: number[], setArr: (v: number[]) => void, id: number) => {
    setArr(arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const payload = {
        ...form,
        annee: form.annee ? Number(form.annee) : null,
        ordre_affichage: Number(form.ordre_affichage),
        type_projet_id: form.type_projet_id ? Number(form.type_projet_id) : null,
        image_principale: form.image_principale || null,
        lien_demo: form.lien_demo || null,
        lien_github: form.lien_github || null,
        lien_behance: form.lien_behance || null,
        video_url: form.video_url || null,
        description: form.description || null,
        description_longue: form.description_longue || null,
      }

      let projectId = projet?.id

      if (isEditing) {
        const { error } = await supabase.from('projets').update(payload).eq('id', projet.id)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('projets').insert(payload).select('id').single()
        if (error) throw error
        projectId = data.id
      }

      // Update tags
      if (projectId) {
        await supabase.from('projet_tags').delete().eq('projet_id', projectId)
        if (selTags.length > 0) {
          await supabase.from('projet_tags').insert(selTags.map(tag_id => ({ projet_id: projectId, tag_id })))
        }

        // Update logiciels
        await supabase.from('projet_logiciels').delete().eq('projet_id', projectId)
        if (selLogiciels.length > 0) {
          await supabase.from('projet_logiciels').insert(selLogiciels.map(logiciel_id => ({ projet_id: projectId, logiciel_id })))
        }

        // Update gallery images: replace all
        await supabase.from('projet_images').delete().eq('projet_id', projectId)
        const validImages = galleryImages.filter(img => img.url.trim())
        if (validImages.length > 0) {
          await supabase.from('projet_images').insert(
            validImages.map((img, idx) => ({
              projet_id: projectId,
              url: img.url.trim(),
              alt: img.alt.trim() || null,
              caption: img.caption.trim() || null,
              ordre: idx,
            }))
          )
        }
      }

      setStatus('success')
      setTimeout(() => router.push('/admin/projects'), 1200)
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err.message ?? 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async () => {
    if (!isEditing || !confirm(`Supprimer "${projet.titre}" ? Cette action est irréversible.`)) return

    try {
      await supabase.from('projet_tags').delete().eq('projet_id', projet.id)
      await supabase.from('projet_logiciels').delete().eq('projet_id', projet.id)
      await supabase.from('projet_apprentissages').delete().eq('projet_id', projet.id)
      await supabase.from('projet_images').delete().eq('projet_id', projet.id)
      await supabase.from('projets').delete().eq('id', projet.id)
      router.push('/admin/projects')
    } catch (err: any) {
      alert('Erreur lors de la suppression : ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
        <h2 className="font-semibold text-white mb-2">Informations générales</h2>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Titre *</label>
          <input type="text" required value={form.titre} onChange={set('titre')} className="input-base" placeholder="Titre du projet" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description courte</label>
          <input type="text" value={form.description} onChange={set('description')} className="input-base" placeholder="Résumé en une ligne" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description longue</label>
          <textarea rows={5} value={form.description_longue} onChange={set('description_longue')} className="input-base resize-none" placeholder="Description détaillée..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Année</label>
            <input type="number" value={form.annee} onChange={set('annee')} min="2020" max="2030" className="input-base" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Type de projet</label>
            <select value={form.type_projet_id} onChange={set('type_projet_id')} className="input-base">
              <option value="">Sélectionner...</option>
              {typesProjet.map((t: any) => (
                <option key={t.id} value={t.id}>{t.nom}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Image principale (nom de fichier ou URL)</label>
          <input type="text" value={form.image_principale} onChange={set('image_principale')} className="input-base" placeholder="ex: projet-hero.jpg" />
        </div>
      </div>

      {/* Links */}
      <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
        <h2 className="font-semibold text-white mb-2">Liens</h2>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Lien démo</label>
          <input type="url" value={form.lien_demo} onChange={set('lien_demo')} className="input-base" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">GitHub</label>
          <input type="url" value={form.lien_github} onChange={set('lien_github')} className="input-base" placeholder="https://github.com/..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Behance</label>
          <input type="url" value={form.lien_behance} onChange={set('lien_behance')} className="input-base" placeholder="https://behance.net/..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Vidéo (URL YouTube ou lien direct)</label>
          <input type="url" value={form.video_url} onChange={set('video_url')} className="input-base" placeholder="https://youtube.com/watch?v=... ou https://..." />
        </div>
      </div>

      {/* Gallery images */}
      <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Images de la galerie</h2>
          <button
            type="button"
            onClick={addGalleryImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary text-slate-400 border border-bg-border text-xs hover:border-slate-500 transition-colors"
          >
            <Plus size={13} />
            URL manuelle
          </button>
        </div>

        {/* Drag-and-drop upload zone */}
        <FileUploadZone
          label="Glissez des images ou vidéos ici pour les uploader"
          onUploaded={(url) => {
            setGalleryImages(prev => [...prev, { url, alt: '', caption: '', isNew: true }])
          }}
        />

        {/* Existing / manual items */}
        {galleryImages.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Fichiers dans la galerie ({galleryImages.length})</p>
            {galleryImages.map((img, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-bg-secondary border border-bg-border space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(idx)}
                    className="p-1 rounded-md text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">URL *</label>
                  <input
                    type="text"
                    value={img.url}
                    onChange={e => updateGalleryImage(idx, 'url', e.target.value)}
                    className="input-base text-sm"
                    placeholder="nom-fichier.jpg ou https://..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Texte alt</label>
                    <input
                      type="text"
                      value={img.alt}
                      onChange={e => updateGalleryImage(idx, 'alt', e.target.value)}
                      className="input-base text-sm"
                      placeholder="Description pour l'accessibilité"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Légende</label>
                    <input
                      type="text"
                      value={img.caption}
                      onChange={e => updateGalleryImage(idx, 'caption', e.target.value)}
                      className="input-base text-sm"
                      placeholder="Texte sous l'image"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="p-6 rounded-2xl bg-bg-card border border-bg-border">
        <h2 className="font-semibold text-white mb-4">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: any) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleItem(selTags, setSelTags, tag.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selTags.includes(tag.id)
                  ? 'bg-violet-600/15 text-violet-400 border-violet-500/30'
                  : 'text-slate-400 border-bg-border hover:border-slate-500'
              }`}
            >
              {tag.nom}
            </button>
          ))}
        </div>
      </div>

      {/* Logiciels */}
      <div className="p-6 rounded-2xl bg-bg-card border border-bg-border">
        <h2 className="font-semibold text-white mb-4">Logiciels / Outils</h2>
        <div className="flex flex-wrap gap-2">
          {logiciels.map((logiciel: any) => (
            <button
              key={logiciel.id}
              type="button"
              onClick={() => toggleItem(selLogiciels, setSelLogiciels, logiciel.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selLogiciels.includes(logiciel.id)
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25'
                  : 'text-slate-400 border-bg-border hover:border-slate-500'
              }`}
            >
              {logiciel.nom}
            </button>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="p-6 rounded-2xl bg-bg-card border border-bg-border space-y-4">
        <h2 className="font-semibold text-white mb-2">Paramètres</h2>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm text-white font-medium">Publié</p>
            <p className="text-xs text-slate-500">Visible sur le portfolio public</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.est_publie} onChange={set('est_publie')} className="sr-only peer" />
            <div className="w-10 h-6 bg-bg-secondary border border-bg-border rounded-full peer peer-checked:bg-violet-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 border" />
          </label>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-bg-border">
          <div>
            <p className="text-sm text-white font-medium">Mis en avant</p>
            <p className="text-xs text-slate-500">Affiché sur la page d&apos;accueil</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={form.est_mis_en_avant} onChange={set('est_mis_en_avant')} className="sr-only peer" />
            <div className="w-10 h-6 bg-bg-secondary border border-bg-border rounded-full peer peer-checked:bg-violet-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 border" />
          </label>
        </div>

        <div className="pt-2 border-t border-bg-border">
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Ordre d&apos;affichage</label>
          <input type="number" value={form.ordre_affichage} onChange={set('ordre_affichage')} min="1" className="input-base w-32" />
        </div>
      </div>

      {/* Status messages */}
      {status === 'success' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          <CheckCircle size={16} />
          Projet sauvegardé ! Redirection...
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin/projects" className="btn-secondary gap-2">
          <ArrowLeft size={15} />
          Annuler
        </Link>
        <div className="flex gap-3">
          {isEditing && (
            <button type="button" onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition-all">
              <Trash2 size={15} />
              Supprimer
            </button>
          )}
          <button type="submit" disabled={status === 'loading'} className="btn-primary gap-2 disabled:opacity-50">
            {status === 'loading' ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {isEditing ? 'Sauvegarder' : 'Créer'}
          </button>
        </div>
      </div>
    </form>
  )
}
