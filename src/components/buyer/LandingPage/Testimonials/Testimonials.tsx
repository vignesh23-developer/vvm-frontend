'use client'

import { motion, Variants } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { AnimatedTestimonials } from '../../../ui/animated-testimonial'

// Skeleton Loader for Testimonials
const TestimonialsSkeleton = () => {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/90 via-white/95 to-blue-50/90 z-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Skeleton */}
        <div className="text-center mb-2 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto mb-3" />
          <div className="h-12 w-96 bg-gray-300 rounded-lg mx-auto mb-3" />
          <div className="h-6 w-80 bg-gray-200 rounded-lg mx-auto" />
        </div>

        {/* Testimonials Skeleton */}
        <div className="flex justify-center items-center h-96 animate-pulse">
          <div className="w-full max-w-4xl bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-5/6 bg-gray-200 rounded" />
              <div className="h-4 w-4/6 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-1 mt-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Testimonials() {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // Transform feedback data to match AnimatedTestimonials format - Tamil Nadu references
  const feedback = [
    {
      id: 1,
      name: 'Priya S.',
      designation: 'First-time Home Buyer',
      quote:
        'One of the standout qualities of this platform is their commitment to understanding client needs. This dedication to service and attention to detail sets them apart in the real estate industry. Found my dream home in Coimbatore!',
      rating: 5,
      src: '/images/t1.png',
    },
    {
      id: 2,
      name: 'Senthil Kumar',
      designation: 'Land Investor',
      quote:
        'This dedication to research and knowledge-building sets them apart from the competition. I found exactly what I was looking for with their help. Great investment opportunities in Tamil Nadu!',
      rating: 5,
      src: '/images/t2.png',
    },
    {
      id: 3,
      name: 'Divya R.',
      designation: 'Rental Customer',
      quote:
        'Their professionalism and eye for detail impressed us throughout the entire process. The team made finding a rental property in Chennai a breeze! Verified listings gave us peace of mind.',
      rating: 5,
      src: '/images/t3.png',
    },
    {
      id: 4,
      name: 'Rajesh M.',
      designation: 'Property Developer',
      quote:
        'Exceptional service and deep market knowledge. They helped us find the perfect investment properties with great returns. The platform connects us with genuine buyers.',
      rating: 5,
      src: '/images/t4.png',
    },
    {
      id: 5,
      name: 'Lakshmi K.',
      designation: 'Home Seller',
      quote:
        'The platform made selling my property in Madurai so easy. Professional, efficient, and always available to answer questions. Highly recommended for all property transactions!',
      rating: 5,
      src: '/images/t5.png',
    },
    {
      id: 6,
      name: 'Arun V.',
      designation: 'Commercial Space Buyer',
      quote:
        'Found the perfect commercial space in Trichy through this platform. The verification process and agent support made the entire transaction smooth and transparent.',
      rating: 5,
      src: '/images/t6.png',
    },
  ]

  // Animation variants for reusable motion effects
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  if (isLoading) {
    return <TestimonialsSkeleton />
  }

  return (
    <motion.section
      className="relative py-12 sm:py-16 lg:py-20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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
          className="text-center mb-2 "
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
            <span className="text-xs font-semibold text-yellow-700 tracking-wide uppercase">Client Stories</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 tracking-tight"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="bg-[#3b1804] bg-clip-text text-transparent">{t('Testimonials.title')}</span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {t('Testimonials.description')}
          </motion.p>
        </motion.div>

        {/* Animated Testimonials Component */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <AnimatedTestimonials testimonials={feedback} autoplay={true} />
        </motion.div>
      </div>
    </motion.section>
  )
}
