import HeroSection from '@/components/home/hero-section'
import ProjectsPreview from '@/components/home/projects-preview'
import PolesSection from '@/components/home/poles-section'
import CTASection from '@/components/home/cta-section'
import SkillsMarquee from '@/components/home/skills-marquee'
import AboutSection from '@/components/home/about-section'
import { getProjets, getPoles } from '@/lib/supabase'

export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const [featuredProjects, poles] = await Promise.all([
    getProjets({ enAvant: true, limit: 6 }).catch(() => []),
    getPoles().catch(() => []),
  ])

  // Fallback: if no featured projects, get latest ones
  const projects = featuredProjects.length > 0
    ? featuredProjects
    : await getProjets({ limit: 6 }).catch(() => [])

  return (
    <>
      <HeroSection />
      <SkillsMarquee />
      <PolesSection poles={poles} />
      <ProjectsPreview projects={projects} />
      <AboutSection />
      <CTASection />
    </>
  )
}
