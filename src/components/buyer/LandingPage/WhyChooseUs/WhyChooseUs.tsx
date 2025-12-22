'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { Shield, Users, CheckCircle2, Zap, Award, Sparkles, BadgeCheck } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function WhyChooseUs() {
  const t = useTranslations()
  const locale = useLocale()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const features = [
    {
      icon: Shield,
      title: 'Verified Properties',
      description: 'All listings are verified for authenticity and accuracy',
    },
    {
      icon: Users,
      title: 'Verified Agents',
      description: 'Work with trusted and verified real estate professionals',
    },
    {
      icon: CheckCircle2,
      title: 'Zero Brokerage Options',
      description: 'Save money with direct owner listings and zero brokerage',
    },
    {
      icon: Zap,
      title: 'Fast Support',
      description: 'Get quick responses & support when you need it',
    },
    {
      icon: Award,
      title: "Tamil Nadu's Trusted Platform",
      description: 'The most trusted real estate platform in Tamil Nadu',
    },
    {
      icon: BadgeCheck,
      title: 'Verified Service Providers',
      description: 'Only trusted and verified real estate services',
    },
  ]

  return (
    <motion.section
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Premium Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/90 via-white/95 to-blue-50/90 z-0" />

      {/* Animated Gold Opacity Background Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-yellow-100/25 via-yellow-50/12 to-transparent pointer-events-none z-[1]"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.12) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.12) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Premium Decorative Curved Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-yellow-200/10 via-yellow-100/4 to-transparent rounded-b-[80px] sm:rounded-b-[120px] pointer-events-none z-[1]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-yellow-200/8 via-transparent to-transparent rounded-tl-[150px] pointer-events-none z-[1]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200/50 backdrop-blur-sm shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700 tracking-wide uppercase">Why Choose Us</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className={`${
              locale === 'ta' ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
            } font-extrabold text-gray-900 mb-3 tracking-tight leading-tight`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="bg-[#2a1407] bg-clip-text text-transparent">{t('WhyChooseUs.title')}?</span>
          </motion.h2>

          <motion.p
            className={`${
              locale === 'ta' ? 'text-sm sm:text-base md:text-lg leading-snug' : 'text-base sm:text-lg md:text-xl leading-relaxed'
            } text-gray-600 max-w-2xl mx-auto font-light`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t('WhyChooseUs.description')}
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={idx}
                className="relative group block h-full w-full"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-yellow-200/40 block rounded-3xl -z-10"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="relative h-full min-h-[250px] perspective-1000 p-2 z-20"
                  style={{ perspective: '1000px' }}
                >
                  <div
                    className="relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] transform-gpu"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front Face */}
                    <div
                      className="absolute inset-0 w-full h-full bg-white rounded-2xl p-4 sm:p-8 border border-yellow-200/50 shadow-sm flex flex-col items-center justify-center text-center backface-hidden"
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 flex items-center justify-center mb-4">
                        <Icon size={28} className="text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>

                    {/* Back Face */}
                    <div
                      className="absolute inset-0 w-full h-full bg-[#2a1407] rounded-2xl p-4 sm:p-8 border border-[#2a1407] shadow-xl flex flex-col items-center justify-center text-center backface-hidden rotate-y-180"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                        <Icon size={28} className="text-yellow-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-200 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
