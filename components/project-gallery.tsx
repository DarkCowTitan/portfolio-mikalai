'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'

interface GalleryImage {
  id: number
  url: string
  alt?: string | null
  caption?: string | null
}

function resolveUrl(url: string): string {
  return url.startsWith('http')
    ? url
    : `https://yeuseyenka-mikalai.com/fichiers_projets/${url}`
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: GalleryImage[]
  initialIndex: number
  onClose: () => void
}

function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)

  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  const img = images[index]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); prev() }}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[90vw] h-[80vh]">
          <Image
            src={resolveUrl(img.url)}
            alt={img.alt ?? ''}
            fill
            className="object-contain rounded-xl"
            sizes="90vw"
            unoptimized
          />
        </div>
        {img.caption && (
          <p className="mt-3 text-sm text-slate-400 text-center max-w-lg px-4">{img.caption}</p>
        )}
        {images.length > 1 && (
          <p className="mt-2 text-xs text-slate-600">{index + 1} / {images.length}</p>
        )}
      </motion.div>

      {/* Next */}
      {images.length > 1 && (
        <button
          className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          onClick={(e) => { e.stopPropagation(); next() }}
        >
          <ChevronRight size={24} />
        </button>
      )}
    </motion.div>
  )
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

interface ProjectGalleryProps {
  images: GalleryImage[]
  projectTitle: string
}

const AUTO_DELAY = 5000

export default function ProjectGallery({ images, projectTitle }: ProjectGalleryProps) {
  const [current, setCurrent] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((idx: number) => {
    setCurrent(idx)
    setProgress(0)
  }, [])

  const prev = useCallback(() => goTo((current - 1 + images.length) % images.length), [current, images.length, goTo])
  const next = useCallback(() => goTo((current + 1) % images.length), [current, images.length, goTo])

  // Auto-advance
  useEffect(() => {
    if (paused || images.length <= 1) return

    setProgress(0)
    const startTime = Date.now()

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      setProgress(Math.min((elapsed / AUTO_DELAY) * 100, 100))
    }, 30)

    intervalRef.current = setInterval(() => {
      setCurrent(i => (i + 1) % images.length)
      setProgress(0)
    }, AUTO_DELAY)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [current, paused, images.length])

  // Scroll active thumbnail into view
  useEffect(() => {
    const container = thumbsRef.current
    if (!container) return
    const thumb = container.children[current] as HTMLElement
    if (!thumb) return
    thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [current])

  if (images.length === 0) return null

  const mainImg = images[current]

  return (
    <>
      <div
        className="mt-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <h2 className="text-lg font-semibold text-white mb-4">Galerie</h2>

        {/* Main image */}
        <div className="relative group">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-bg-secondary border border-bg-border cursor-zoom-in">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                <Image
                  src={resolveUrl(mainImg.url)}
                  alt={mainImg.alt ?? projectTitle}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>

            {/* Zoom overlay */}
            <button
              className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"
              onClick={() => setLightboxIndex(current)}
              aria-label="Agrandir"
            >
              <div className="p-3 rounded-full bg-black/40 backdrop-blur-sm">
                <ZoomIn size={20} className="text-white" />
              </div>
            </button>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={prev}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={next}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Caption */}
          {mainImg.caption && (
            <p className="mt-2 text-sm text-slate-500 italic text-center">{mainImg.caption}</p>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div
            ref={thumbsRef}
            className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {images.map((img, idx) => {
              const isActive = idx === current
              return (
                <button
                  key={img.id}
                  onClick={() => goTo(idx)}
                  className="relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200"
                  style={{
                    borderColor: isActive ? '#7c3aed' : 'rgba(255,255,255,0.08)',
                    opacity: isActive ? 1 : 0.55,
                  }}
                  aria-label={`Image ${idx + 1}`}
                >
                  <Image
                    src={resolveUrl(img.url)}
                    alt={img.alt ?? ''}
                    fill
                    className="object-cover"
                  />
                  {/* Progress bar */}
                  {isActive && images.length > 1 && (
                    <div className="absolute bottom-0 left-0 h-[3px] bg-violet-500 rounded-full" style={{ width: `${progress}%`, transition: 'none' }} />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
