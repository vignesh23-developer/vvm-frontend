'use client'
import React from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import SwiperWrapper from '../../../ui/CustomComponent/Slider/SwipperSlider'
import { useTranslations } from 'next-intl'
import { Sparkles, MapPin, Home, Clock, Play, ArrowRight, X } from 'lucide-react'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { useRouter } from 'next/navigation'

export default function PropertyVideos() {
  const t = useTranslations()
  const router = useRouter()
  const [selectedVideo, setSelectedVideo] = React.useState<any>(null)

  const videos = [
    {
      id: 1,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Luxury Modern Estate',
      category: 'Premium Property',
      gradient: 'from-yellow-600 to-yellow-500',
      location: 'Coimbatore',
      type: 'Villa',
      bedrooms: '4BHK',
      duration: '4 min virtual tour',
    },
    {
      id: 2,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Urban Living Space',
      category: 'City Property',
      gradient: 'from-yellow-600 to-yellow-500',
      location: 'Chennai',
      type: 'Apartment',
      bedrooms: '3BHK',
      duration: '3 min walkthrough',
    },
    {
      id: 3,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Waterfront Paradise',
      category: 'Beachfront',
      gradient: 'from-yellow-600 to-yellow-500',
      location: 'Pondicherry',
      type: 'Villa',
      bedrooms: '5BHK',
      duration: '5 min virtual tour',
    },
    {
      id: 4,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Garden Sanctuary',
      category: 'Residential',
      gradient: 'from-yellow-600 to-yellow-500',
      location: 'Madurai',
      type: 'Individual House',
      bedrooms: '3BHK',
      duration: '3 min walkthrough',
    },
    {
      id: 5,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Downtown Penthouse',
      category: 'Luxury',
      gradient: 'from-yellow-600 to-yellow-500',
      location: 'Trichy',
      type: 'Apartment',
      bedrooms: '4BHK',
      duration: '4 min virtual tour',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Premium Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/90 via-white/95 to-orange-50/90 z-0" />

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
          className="text-center mb-20"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200/50 backdrop-blur-sm shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700 tracking-wide uppercase">Explore Properties</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight"
          >
            <span className="bg-[#2a1407] bg-clip-text text-transparent">
              {t('ExploreVideo.title') || 'Virtual Property Tours'}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            {t('ExploreVideo.description') || 'Discover stunning properties through immersive video tours'}
          </motion.p>
        </motion.div>

        {/* Videos Carousel with Enhanced Styling */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mt-20"
        >
          <SwiperWrapper
            data={videos}
            slidesPerView={1}
            showNavigation={true}
            showPagination={true}
            autoplay={true}
            spaceBetween={28}
            breakpoints={{
              640: { slidesPerView: 1.5, spaceBetween: 20 },
              1024: { slidesPerView: 2.5, spaceBetween: 28 },
              1280: { slidesPerView: 3, spaceBetween: 32 },
            }}
            renderItem={item => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -15, transition: { duration: 0.3 } }}
                className="group h-full"
              >
                {/* Premium Card Container */}
                <div className="relative h-full rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-yellow-100/60 hover:border-yellow-200">
                  {/* Animated Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl"></div>

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`inline-block px-4 py-2 bg-gradient-to-r ${item.gradient} text-white rounded-full text-xs font-bold shadow-lg`}
                    >
                      {item.category}
                    </motion.div>
                  </div>

                  {/* Video Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                    {/* Loading Shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse z-10"></div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      className="w-full h-full relative"
                    >
                      <iframe
                        src={item.url}
                        title={item.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </motion.div>

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Bottom Content Section */}
                  <div className="relative p-6 bg-gradient-to-b from-white to-yellow-50/30">
                    <motion.h3
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xl font-bold text-[#2a1407] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-amber-600 transition-all duration-300"
                    >
                      {item.title}
                    </motion.h3>

                    {/* Location, Type, Duration */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-yellow-600" />
                        <span>{item.location} • {item.type} • {item.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} className="text-yellow-600" />
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    {/* View Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 px-4 bg-[#2a1407] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:from-yellow-700 group-hover:to-amber-700 flex items-center justify-center gap-2"
                      onClick={() => setSelectedVideo(item)}
                    >
                      <Play size={18} />
                      <span>View Full Tour</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          />
        </motion.div>

        {/* View All Videos Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 flex justify-center"
        >
          <Button
            type="button"
            onClick={() => router.push('/property-videos')}
            className="bg-[#2a1407] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a1407] transition shadow-lg"
          >
            View All Property Videos →
          </Button>
        </motion.div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(40px, -60px) scale(1.15);
          }
          66% {
            transform: translate(-30px, 30px) scale(0.95);
          }
        }

        .animate-blob {
          animation: blob 8s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .animate-pulse {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
            onClick={() => setSelectedVideo(null)}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition backdrop-blur-sm"
              >
                <X size={24} />
              </button>

              {/* Video Player */}
              <iframe
                src={`${selectedVideo.url}?autoplay=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
