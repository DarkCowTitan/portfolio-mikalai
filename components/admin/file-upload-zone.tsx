'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Upload, X, Loader2, CheckCircle, Film, ImageIcon, Pencil } from 'lucide-react'

interface UploadedFile {
  file: File
  preview: string | null
  name: string        // editable filename (without extension)
  ext: string
  type: 'image' | 'video'
  status: 'pending' | 'uploading' | 'done' | 'error'
  publicUrl?: string
  error?: string
  progress?: number
}

interface FileUploadZoneProps {
  onUploaded: (url: string) => void  // called with each public URL when upload finishes
  accept?: string
  label?: string
}

const BUCKET = 'project-files'

function isImage(file: File) {
  return file.type.startsWith('image/')
}

function isVideo(file: File) {
  return file.type.startsWith('video/')
}

function splitFilename(filename: string): { name: string; ext: string } {
  const lastDot = filename.lastIndexOf('.')
  if (lastDot === -1) return { name: filename, ext: '' }
  return { name: filename.slice(0, lastDot), ext: filename.slice(lastDot) }
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function FileUploadZone({ onUploaded, label = 'Glissez des images ou vidéos ici' }: FileUploadZoneProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles)
    const valid = arr.filter(f => isImage(f) || isVideo(f))
    if (!valid.length) return

    const items: UploadedFile[] = valid.map(file => {
      const { name, ext } = splitFilename(file.name)
      const preview = isImage(file) ? URL.createObjectURL(file) : null
      return {
        file,
        preview,
        name,
        ext,
        type: isImage(file) ? 'image' : 'video',
        status: 'pending',
      }
    })
    setFiles(prev => [...prev, ...items])
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  const updateName = (index: number, value: string) => {
    setFiles(prev => prev.map((f, i) => i === index ? { ...f, name: value } : f))
  }

  const removeFile = (index: number) => {
    setFiles(prev => {
      const f = prev[index]
      if (f.preview) URL.revokeObjectURL(f.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const uploadFile = async (index: number) => {
    const item = files[index]
    if (item.status === 'uploading' || item.status === 'done') return

    setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'uploading' } : f))

    try {
      const finalName = slugify(item.name) + item.ext
      const path = `${Date.now()}-${finalName}`

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, item.file, { upsert: true })

      if (error) throw error

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      const publicUrl = data.publicUrl

      setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'done', publicUrl } : f))
      onUploaded(publicUrl)
    } catch (err: any) {
      setFiles(prev => prev.map((f, i) => i === index ? { ...f, status: 'error', error: err.message } : f))
    }
  }

  const uploadAll = async () => {
    const pending = files.map((f, i) => ({ f, i })).filter(({ f }) => f.status === 'pending')
    for (const { i } of pending) {
      await uploadFile(i)
    }
  }

  const hasPending = files.some(f => f.status === 'pending')

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
          dragging
            ? 'border-violet-500 bg-violet-500/10'
            : 'border-bg-border hover:border-violet-500/50 hover:bg-violet-500/5'
        }`}
      >
        <Upload size={24} className={dragging ? 'text-violet-400' : 'text-slate-500'} />
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-xs text-slate-600">ou cliquez pour sélectionner</p>
        <p className="text-xs text-slate-600">Images (JPG, PNG, GIF, WebP) · Vidéos (MP4, WebM)</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="sr-only"
          onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                item.status === 'done'
                  ? 'border-emerald-500/20 bg-emerald-500/5'
                  : item.status === 'error'
                    ? 'border-rose-500/20 bg-rose-500/5'
                    : 'border-bg-border bg-bg-secondary'
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bg-card border border-bg-border shrink-0 flex items-center justify-center">
                {item.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.preview} alt="" className="w-full h-full object-cover" />
                ) : item.type === 'video' ? (
                  <Film size={20} className="text-slate-500" />
                ) : (
                  <ImageIcon size={20} className="text-slate-500" />
                )}
              </div>

              {/* Name editor */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Pencil size={11} className="text-slate-600 shrink-0" />
                  <input
                    type="text"
                    value={item.name}
                    onChange={e => updateName(idx, e.target.value)}
                    disabled={item.status === 'uploading' || item.status === 'done'}
                    className="flex-1 bg-transparent text-sm text-white border-b border-slate-700 focus:border-violet-500 outline-none px-0 py-0.5 disabled:opacity-50 min-w-0"
                    placeholder="nom du fichier"
                  />
                  <span className="text-xs text-slate-600 shrink-0">{item.ext}</span>
                </div>

                {item.status === 'error' && (
                  <p className="text-xs text-rose-400 truncate">{item.error}</p>
                )}
                {item.status === 'done' && item.publicUrl && (
                  <p className="text-xs text-emerald-400 truncate">{item.publicUrl}</p>
                )}
                {item.status === 'pending' && (
                  <p className="text-xs text-slate-600">
                    {(item.file.size / 1024 / 1024).toFixed(1)} MB · {item.type}
                  </p>
                )}
              </div>

              {/* Status / actions */}
              <div className="flex items-center gap-2 shrink-0">
                {item.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => uploadFile(idx)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-violet-600/15 text-violet-400 border border-violet-500/30 hover:bg-violet-600/25 transition-colors"
                  >
                    Uploader
                  </button>
                )}
                {item.status === 'uploading' && (
                  <Loader2 size={16} className="text-violet-400 animate-spin" />
                )}
                {item.status === 'done' && (
                  <CheckCircle size={16} className="text-emerald-400" />
                )}
                {item.status === 'error' && (
                  <button
                    type="button"
                    onClick={() => uploadFile(idx)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                  >
                    Réessayer
                  </button>
                )}
                {item.status !== 'uploading' && (
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1 rounded-md text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Upload all */}
          {hasPending && (
            <button
              type="button"
              onClick={uploadAll}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-violet-600/15 text-violet-400 border border-violet-500/30 text-sm hover:bg-violet-600/25 transition-colors"
            >
              <Upload size={14} />
              Uploader tous les fichiers en attente
            </button>
          )}
        </div>
      )}
    </div>
  )
}
