'use client'

import { motion } from 'framer-motion'
import SwiperWrapper from '../../../ui/CustomComponent/Slider/SwipperSlider'
import { useTranslations } from 'next-intl'

export default function PropertyVideos() {
  const t = useTranslations()

  const videos = [
    {
      id: 1,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 1',
    },
    {
      id: 2,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 2',
    },
    {
      id: 3,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 3',
    },
    {
      id: 4,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 4',
    },
    {
      id: 5,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 5',
    },
  ]

  return (
    <section className="py-10 bg-gradient-to-b from-white via-gray-50 to-gray-100 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-gray-900"
        >
          {t('ExploreVideo.title')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto"
        >
          {t('ExploreVideo.description')}
        </motion.p>

        {/* Swiper Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <SwiperWrapper
            data={videos}
            slidesPerView={1}
            showNavigation={true}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            renderItem={item => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl bg-white transition-all duration-300"
              >
                {/* Video Wrapper with subtle animation */}
                <div className="aspect-video w-full relative overflow-hidden">
                  <iframe
                    src={item.url}
                    title={item.title}
                    className="w-full h-full rounded-2xl transition-transform duration-500 group-hover:scale-110"
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </motion.div>
            )}
          />
        </motion.div>
      </div>
    </section>
  )
}
