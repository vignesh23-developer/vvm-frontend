'use client'

import { motion, Variants } from 'framer-motion'
import { Building2, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

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

  const properties = [
    {
      city: 'Coimbatore',
      priceRange: '₹ 2.24 L – 4.65 Cr',
      count: 288,
      rating: 5,
      tags: ['Land', 'Plots', 'House', 'Commercial', 'Projects'],
      image: '/Ellipse.png',
    },
    {
      city: 'Chennai',
      priceRange: '₹ 4.1 L – 5.2 Cr',
      count: 310,
      rating: 4,
      tags: ['Flats', 'Villa', 'Commercial'],
      image: '/Ellipse.png',
    },
    {
      city: 'Bangalore',
      priceRange: '₹ 3.5 L – 6.8 Cr',
      count: 410,
      rating: 5,
      tags: ['Plots', 'Villa', 'House'],
      image: '/Ellipse.png',
    },
    {
      city: 'Hyderabad',
      priceRange: '₹ 2.8 L – 5.0 Cr',
      count: 250,
      rating: 5,
      tags: ['Land', 'Projects', 'Commercial'],
      image: '/Ellipse.png',
    },
  ]

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
        <motion.div
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {properties.map((p, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white rounded-2xl shadow-md transition overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <h3 className="text-lg text-start font-semibold text-gray-900 mb-2">
                  {p.city}
                </h3>
                <p className="text-sm text-start text-gray-600 mb-3">
                  {p.priceRange}
                </p>

                {/* Property Count */}
                <p className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                  <Building2 size={18} className="text-gray-600" />
                  {p.count} Properties
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <span className="font-bold">{p.rating}.0</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${
                        i < p.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#B0BEC5] rounded-md text-sm text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Section */}
              <div className="h-[120px] bg-[#B0BEC5] shadow-md relative flex flex-col items-start justify-end">
                <div className="absolute -top-6 right-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden shadow-md">
                  <Image
                    src={p.image}
                    alt={p.city}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* More Button */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-800 font-medium hover:underline"
          >
            {t('ExploreProperties.more')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
