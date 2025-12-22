'use client'

import { motion, Variants } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  if (size <= 0) return [arr]
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

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
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-2xl border-2 border-yellow-200 shadow-sm p-6 min-h-[320px] flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="space-y-2 flex-1">
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-11/12 bg-gray-200 rounded" />
                <div className="h-3 w-9/12 bg-gray-200 rounded" />
              </div>
              <div className="flex gap-1 mt-4">
                {[1, 2, 3, 4, 5].map(s => (
                  <div key={s} className="w-4 h-4 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

interface TestimonialsProps {
  testimonialsData: any
  error?: any
  isLoading?: boolean
  mutate?: () => void
}

export default function Testimonials({ testimonialsData, error, isLoading: testimonialLoading, mutate }: TestimonialsProps) {
  const t = useTranslations()
  const locale = useLocale()
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
      rating: 4,
      src: '/images/t3.png',
    },
    {
      id: 3,
      name: 'Divya R.',
      designation: 'Rental Customer',
      quote:
        'Their professionalism and eye for detail impressed us throughout the entire process. The team made finding a rental property in Chennai a breeze! Verified listings gave us peace of mind.',
      rating: 5,
      src: '/images/t2.png',
    },
    {
      id: 4,
      name: 'Rajesh M.',
      designation: 'Property Developer',
      quote:
        'Exceptional service and deep market knowledge. They helped us find the perfect investment properties with great returns. The platform connects us with genuine buyers.',
      rating: 3,
      src: '/images/t5.png',
    },
    {
      id: 5,
      name: 'Lakshmi K.',
      designation: 'Home Seller',
      quote:
        'The platform made selling my property in Madurai so easy. Professional, efficient, and always available to answer questions. Highly recommended for all property transactions!',
      rating: 5,
      src: '/images/t4.png',
    },
    {
      id: 6,
      name: 'Arun V.',
      designation: 'Commercial Space Buyer',
      quote:
        'Found the perfect commercial space in Trichy through this platform. The verification process and agent support made the entire transaction smooth and transparent.',
      rating: 4,
      src: '/images/t6.png',
    },
  ]

  // 4-card carousel slides
  const slides = chunkArray(feedback, 4)
  const [activeSlide, setActiveSlide] = useState(0)

  const goPrev = () => setActiveSlide(prev => (prev - 1 + slides.length) % slides.length)
  const goNext = () => setActiveSlide(prev => (prev + 1) % slides.length)

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
            className={`${
              locale === 'ta' ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
            } font-extrabold text-gray-900 mb-3 tracking-tight leading-tight`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="bg-[#3b1804] bg-clip-text text-transparent">{t('Testimonials.title')}</span>
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
            {t('Testimonials.description')}
          </motion.p>
        </motion.div>

        {/* Testimonials Carousel (4 cards per slide) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-10"
        >
          <div className="relative">
            {/* Slide */}
            <div className="overflow-hidden rounded-3xl">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
              >
                {(slides[activeSlide] ?? []).map(item => (
                  <div
                    key={item.id}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl border-2 border-yellow-200 shadow-sm p-6 hover:shadow-md transition-shadow min-h-[320px] h-full flex flex-col"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-full border border-yellow-200 overflow-hidden bg-yellow-50 flex items-center justify-center flex-shrink-0">
                        {item.src ? (
                          <Image src={item.src} alt={item.name} fill className="object-cover" sizes="48px" />
                        ) : (
                          <span className="text-sm font-bold text-[#2a1407]">
                            {String(item.name ?? '?')
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#2a1407] truncate">{item.name}</p>
                        <p className="text-xs text-gray-600 truncate">{item.designation}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-700 leading-relaxed line-clamp-5 flex-1">{item.quote}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} size={16} className={idx < (item.rating ?? 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-yellow-700">{(item.rating ?? 0).toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Controls */}
            {slides.length > 1 && (
              <div className="mt-6 flex items-center gap-4">
                <div className="flex gap-2 flex-1">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === activeSlide ? 'w-8 bg-gradient-to-r from-yellow-500 to-yellow-600' : 'w-2 bg-gray-300 hover:bg-yellow-400'
                      }`}
                      aria-label={`Go to testimonial slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={goPrev}
                    className="group/button flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 shadow-lg hover:shadow-xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-300"
                    aria-label="Previous testimonials"
                  >
                    <ChevronLeft className="h-6 w-6 text-yellow-700 transition-transform duration-300 group-hover/button:-translate-x-1" />
                  </button>
                  <button
                    onClick={goNext}
                    className="group/button flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300"
                    aria-label="Next testimonials"
                  >
                    <ChevronRight className="h-6 w-6 text-white transition-transform duration-300 group-hover/button:translate-x-1" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
