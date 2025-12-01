'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Building2, HatGlasses, Star } from 'lucide-react'
import ExploreCard from './ExploreCard'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useExploreProperties } from './hooks/useExploreProperties'
import { string } from 'zod'
import { ExplorePropertyDto } from './dto/explorePropertiesDto'
import { formatPrice } from '@/utils/converter/formatPrice'
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
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          className="text-3xl lg:text-5xl font-bold text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {t('ExploreProperties.title')}
        </motion.h2>

        {/* Animated Grid */}

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <ExplorePropertiesSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
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
            <motion.div className="mt-10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
              <Button
                type="button"
                size="small"
                hover="hover:underline"
                className="text-gray-800 font-medium"
                onClick={() => {
                  router.push('/exploreByDistricts')
                }}
              >
                {t('ExploreProperties.more')}
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
