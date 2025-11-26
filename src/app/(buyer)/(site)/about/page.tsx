'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'
import { Users, MapPin, ShieldCheck, CalendarDays } from 'lucide-react'
import MarkdownRenderer from '@/components/ui/MarkdownTextFormat/MarkdownRenderer'
import Button from '@/components/ui/CustomComponent/Button/Button'

const About = () => {
  const t = useTranslations()

  const aboutImage = [
    { src: '/about1.png', alt: 'Living room', width: 500, height: 500 },
    { src: '/about2.png', alt: 'Modern interior', width: 500, height: 500 },
    { src: '/about3.png', alt: 'Cozy home', width: 500, height: 500 },
    { src: '/about4.png', alt: 'Luxury home', width: 500, height: 500 },
  ]

  const highlightPillars = [
    {
      title: 'Bespoke Advisory',
      description: 'Concierge-style curation of properties that match culture, budget, and aspirations.',
      icon: Users,
    },
    {
      title: 'Community First',
      description: 'Neighborhood insights, local partners, and support even after move-in day.',
      icon: MapPin,
    },
    {
      title: 'Trusted Network',
      description: 'RERA-verified developers and transparent paperwork at every milestone.',
      icon: ShieldCheck,
    },
  ]

  const stats = [
    { label: 'Families Guided', value: '2.8K+' },
    { label: 'Advisors On-ground', value: '35+' },
    { label: 'Avg. Close Time', value: '21 days' },
  ]

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#fdf5eb] via-white to-[#fef9f0] py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-[#f3d5b5]/60 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-[#d8c0ae]/40 blur-3xl" />
      </div>
      <motion.div
        className="mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr]"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* Left side - Image Grid */}
        <motion.div className="relative grid grid-cols-2 grid-rows-2 gap-4" variants={itemVariants}>
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[#f7e8d9] via-transparent to-transparent blur-2xl" aria-hidden />
          {aboutImage.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
              className="relative overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_25px_60px_rgba(42,32,21,0.08)]"
            >
              <Image src={value.src} alt={value.alt} width={value.width} height={value.height} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" aria-hidden />
            </motion.div>
          ))}

          {/* Logo medallion */}
          <motion.div
            className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#3e2a1c] shadow-[0_20px_45px_rgba(46,28,12,0.35)]"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            animate={{
              boxShadow: ['0 0 18px rgba(46,28,12,0.15)', '0 0 28px rgba(46,28,12,0.28)', '0 0 18px rgba(46,28,12,0.15)'],
            }}
          >
            <Image src="/logo-about.png" alt="Vaazhga Valamudan" width={300} height={300} className="object-contain w-full" />
          </motion.div>
        </motion.div>

        {/* Right side - Content with Markdown */}
        <motion.div
          variants={itemVariants}
          className="space-y-8 rounded-[36px] border border-white/70 bg-white/80 px-10 py-12 text-center shadow-[0_20px_80px_rgba(43,27,18,0.12)] backdrop-blur lg:text-left"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center justify-center rounded-full border border-[#b8864b]/40 bg-white/70 px-5 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-[#7a4a1d]"
          >
            {t('About.header')}
          </motion.span>

          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-extrabold leading-tight text-[#2b1b12]">
            {t('About.title')}
          </motion.h2>

          <motion.div variants={itemVariants} className="text-base leading-relaxed text-[#4b3727]">
            <MarkdownRenderer content={t('About.description')} className="space-y-4" />
          </motion.div>

          {/* <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
            {highlightPillars.map((pillar, index) => {
              const Icon = pillar.icon
              return (
                <motion.div
                  key={pillar.title}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="group flex h-full flex-col gap-2 rounded-2xl border border-[#cfae78]/40 bg-white/80 p-5 text-left shadow-sm transition"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4e1c2] text-[#7a4a1d]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-[#2b1b12]">{pillar.title}</h3>
                  <p className="text-sm leading-relaxed text-[#5c4533]">{pillar.description}</p>
                </motion.div>
              )
            })}
          </motion.div> */}

          {/* <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
            {stats.map(stat => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="rounded-2xl border border-white/60 bg-[#2b1b12] px-5 py-6 text-center text-white shadow-lg shadow-[#2b1b12]/30"
              >
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div> */}

          <motion.div variants={itemVariants} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="button"
                className="flex items-center gap-2 rounded-2xl bg-[#2b1b12] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-[#2b1b12]/30"
              >
                {t('About.explore_more')}
              </Button>
            </motion.div>
            {/* <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="button"
                className="flex items-center gap-2 rounded-2xl border border-[#2b1b12] px-7 py-3 text-base font-semibold text-[#2b1b12] shadow-sm"
              >
                <CalendarDays className="h-5 w-5" />
                {t('About.schedule_consultation', { defaultValue: 'Schedule a consultation' })}
              </Button>
            </motion.div> */}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default About
