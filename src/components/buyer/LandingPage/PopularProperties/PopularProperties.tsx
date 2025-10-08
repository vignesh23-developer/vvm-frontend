'use client'

import { MapPin, BedSingle, Ruler, IndianRupee } from 'lucide-react'
import SwiperWrapper from '../../../ui/CustomComponent/Slider/SwipperSlider'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion } from 'framer-motion'

// ✅ Define TypeScript type for property items
interface PropertyItem {
  id: number
  title: string
  rooms: number
  area: string
  price: string
  image: string
}

export default function PopularProperties() {
  const t = useTranslations('PopularProperties')

  const items: PropertyItem[] = [
    {
      id: 1,
      title: 'Avenue 1, Ashok Nagar',
      rooms: 4,
      area: '3,500 sq ft',
      price: '₹50,000',
      image: '/pp1.png',
    },
    {
      id: 2,
      title: 'Avenue 2, Vadapalani',
      rooms: 3,
      area: '1,500 sq ft',
      price: '₹50,000',
      image: '/pp2.png',
    },
    {
      id: 3,
      title: 'Avenue 3, Anna Nagar',
      rooms: 3,
      area: '1,500 sq ft',
      price: '₹50,000',
      image: '/pp3.png',
    },
    {
      id: 4,
      title: 'Avenue 4, Anna Nagar',
      rooms: 3,
      area: '1,500 sq ft',
      price: '₹50,000',
      image: '/pp3.png',
    },
    {
      id: 5,
      title: 'Avenue 5, Anna Nagar',
      rooms: 3,
      area: '1,500 sq ft',
      price: '₹50,000',
      image: '/pp3.png',
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="sm:py-10 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900"
        >
          {t('title')}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-3 text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto"
        >
          {t('description')}
        </motion.p>

        {/* Swiper Section */}
        <div className="mt-10 sm:mt-14">
          <SwiperWrapper
            data={items}
            slidesPerView={1}
            showNavigation
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            renderItem={(item: PropertyItem) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="max-w-90 mx-auto rounded-2xl overflow-hidden shadow-md hover:shadow-xl bg-white flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full h-56 sm:h-64 overflow-hidden">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </div>

                {/* Card Content */}
                <div className="p-3 sm:p-5 bg-[#D9D9D9] flex flex-col flex-grow">
                  <h3 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800 mb-2">
                    <MapPin size={16} className="text-gray-600 shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </h3>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <BedSingle size={14} className="text-gray-500" />
                      {item.rooms} Rooms
                    </span>
                    <span className="flex items-center gap-1">
                      <Ruler size={14} className="text-gray-500" />
                      {item.area}
                    </span>
                  </div>

                  {/* Price & Button */}
                  <div className="flex justify-between items-center mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition text-xs sm:text-sm"
                    >
                      {t('see_more')}
                    </motion.button>

                    <p className="flex items-center gap-1 font-bold text-sm sm:text-base text-gray-800">
                      <IndianRupee size={16} className="text-gray-700" />
                      {item.price.replace('₹', '')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          />
        </div>
      </div>
    </motion.section>
  )
}
