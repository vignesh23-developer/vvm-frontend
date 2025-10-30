'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import SwiperWrapper from '../../../ui/CustomComponent/Slider/SwipperSlider'

interface Slide {
  id: number
  image: string
  title: string
}

export default function PropertySlider() {
  const Property: Slide[] = [
    { id: 1, image: '/image-17.png', title: 'Imagine. Inspire. Live.' },
    { id: 2, image: '/image-18.png', title: 'Search. Discover. Move In' },
    { id: 3, image: '/image-18.png', title: 'Search. Discover. Move In' },
    { id: 4, image: '/image-18.png', title: 'Search. Discover. Move In' },
  ]

  // Animation Variants
  const slideVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <SwiperWrapper
          data={Property}
          showPagination
          autoplay
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 16 },
            1024: { slidesPerView: 2, spaceBetween: 20 },
          }}
          renderItem={item => (
            <motion.div
              key={item.id}
              className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden"
              variants={slideVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />

              {/* Overlay Text Animation */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="absolute bottom-6 left-6 text-white text-2xl sm:text-3xl font-semibold drop-shadow-lg"
              >
                {item.title}
              </motion.div>
            </motion.div>
          )}
        />
      </div>
    </section>
  )
}
