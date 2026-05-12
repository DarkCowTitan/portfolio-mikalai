'use client'

import { motion } from 'framer-motion'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'

const skills = [
  { name: 'Next.js', icon: '⬡' },
  { name: 'React', icon: '⚛' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Tailwind CSS', icon: '◈' },
  { name: 'Figma', icon: '✦' },
  { name: 'Supabase', icon: '⚡' },
  { name: 'Illustrator', icon: 'Ai' },
  { name: 'Photoshop', icon: 'Ps' },
  { name: 'After Effects', icon: 'Ae' },
  { name: 'Premiere Pro', icon: 'Pr' },
  { name: 'Python', icon: '{ }' },
  { name: 'PHP', icon: '</>' },
  { name: 'MySQL', icon: '⊞' },
  { name: 'Blender', icon: '◉' },
  { name: 'InDesign', icon: 'Id' },
  { name: 'Canva', icon: 'C' },
  { name: 'Git', icon: '⑂' },
  { name: 'Docker', icon: '▣' },
]

const Track = ({
  items,
  direction = 1,
  speed = 30,
}: {
  items: typeof skills
  direction?: number
  speed?: number
}) => {
  const doubled = [...items, ...items]
  const duration = items.length * speed

  return (
    <div className="relative flex overflow-hidden">
      {/* Progressive blur — left edge */}
      <ProgressiveBlur
        direction="right"
        blurLayers={6}
        blurIntensity={0.4}
        className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10"
      />
      {/* Progressive blur — right edge */}
      <ProgressiveBlur
        direction="left"
        blurLayers={6}
        blurIntensity={0.4}
        className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10"
      />

      <motion.div
        className="flex gap-3 shrink-0"
        animate={{ x: direction > 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((skill, i) => (
          <span
            key={`${skill.name}-${i}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-mono whitespace-nowrap border border-white/8 bg-white/3 text-zinc-400 hover:text-white hover:border-white/15 transition-colors"
          >
            <span className="text-xs text-zinc-600">{skill.icon}</span>
            {skill.name}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function SkillsMarquee() {
  const half = Math.ceil(skills.length / 2)
  const row1 = skills.slice(0, half)
  const row2 = skills.slice(half)

  return (
    <section className="py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <span className="section-label">Outils &amp; Technologies</span>
        <p className="text-zinc-500 text-sm mt-2">Les outils que j&apos;utilise au quotidien</p>
      </motion.div>

      <div className="space-y-3">
        <Track items={row1} direction={1} speed={3.5} />
        <Track items={row2} direction={-1} speed={4} />
      </div>
    </section>
  )
}
