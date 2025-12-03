'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import ExploreCard from './ExploreCard'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { useRouter } from 'next/navigation'
import { useExploreProperties } from './hooks/useExploreProperties'
import { ExplorePropertyDto } from './dto/explorePropertiesDto'
import ExplorePropertiesSkeleton from './ExplorePropertiesSkeleton'

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80, damping: 12 },
  },
  hover: { scale: 1.05, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' },
}

export default function ExploreProperties() {
  const t = useTranslations()
  const router = useRouter()
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const { items, total, isLoading, error, handleSeeMore } = useExploreProperties({ limit, page })

  const safeItems = Array.isArray(items) ? items : []
  const filteredItems = safeItems?.filter((item: ExplorePropertyDto) => item.district)

  // Safely get description; fall back to default text if the key is missing
  let exploreDescription =
    'Discover hand-picked districts with the best mix of homes, plots and investments in our chocolate & gold experience.'
  try {
    const translated = t('ExploreProperties.description')
    if (translated && translated !== 'ExploreProperties.description') {
      exploreDescription = translated
    }
  } catch {
    // ignore missing translation error and use default text
  }
  // const properties = [
  //   {
  //     city: 'Coimbatore',
  //     priceRange: '₹ 2.24 L – 4.65 Cr',
  //     count: 288,
  //     rating: 5,
  //     tags: ['Land', 'Plots', 'House', 'Commercial', 'Projects'],
  //     image: '/Ellipse.png',
  //   },
  //   {
  //     city: 'Chennai',
  //     priceRange: '₹ 4.1 L – 5.2 Cr',
  //     count: 310,
  //     rating: 4,
  //     tags: ['Flats', 'Villa', 'Commercial'],
  //     image: '/Ellipse.png',
  //   },
  //   {
  //     city: 'Bangalore',
  //     priceRange: '₹ 3.5 L – 6.8 Cr',
  //     count: 410,
  //     rating: 5,
  //     tags: ['Plots', 'Villa', 'House'],
  //     image: '/Ellipse.png',
  //   },
  //   {
  //     city: 'Hyderabad',
  //     priceRange: '₹ 2.8 L – 5.0 Cr',
  //     count: 250,
  //     rating: 5,
  //     tags: ['Land', 'Projects', 'Commercial'],
  //     image: '/Ellipse.png',
  //   },
  // ]

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gray-50">
      {/* Premium Background Layers (match PopularProperties) */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/90 via-white/95 to-blue-50/90 z-0" />
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
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-br from-yellow-200/10 via-yellow-100/4 to-transparent rounded-b-[80px] sm:rounded-b-[120px] pointer-events-none z-[1]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-yellow-200/8 via-transparent to-transparent rounded-tl-[150px] pointer-events-none z-[1]" />
      <div
        className="absolute inset-0 opacity-[0.015] z-[1] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200/50 backdrop-blur-sm shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700 tracking-wide uppercase">
              Explore by District
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-2 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bg-[#3b1804] bg-clip-text text-transparent">
              {t('ExploreProperties.title') || 'Explore properties by popular districts'}
            </span>
          </motion.h2>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {exploreDescription}
          </motion.p>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <ExplorePropertiesSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {filteredItems?.map((p: ExplorePropertyDto) => (
                <ExploreCard key={p.district} item={p} variants={cardVariants} />
              ))}
            </motion.div>

            {/* More Button */}
            <motion.div
              className="mt-10 flex justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button
                type="button"
                size="small"
                className="px-6 py-2 rounded-full bg-[#2a1407] text-white hover:bg-[#3b1804] font-semibold shadow-md hover:shadow-lg transition-all"
                onClick={() => {
                  router.push('/exploreByDistricts')
                }}
              >
                {t('ExploreProperties.more') || 'View all districts'}
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
