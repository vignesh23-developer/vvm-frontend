'use client'
import React from 'react'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import SwiperWrapper from '../../../ui/CustomComponent/Slider/SwipperSlider'
import { useLocale, useTranslations } from 'next-intl'
import { Sparkles, MapPin, Clock, Play, X, Youtube, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type VideoItem = {
  id: number
  url: string
  title: string
  gradient: string
  category?: string
  location?: string
  type?: string
  bedrooms?: string
  duration?: string
}

export default function PropertyVideos() {
  const t = useTranslations()
  const locale = useLocale()
  const [selectedVideo, setSelectedVideo] = React.useState<VideoItem | null>(null)

  const getYouTubeId = (url: string): string | null => {
    if (!url) return null

    try {
      const u = new URL(url)
      const host = u.hostname.replace(/^www\./, '')

      // youtu.be/<id>
      if (host === 'youtu.be') {
        const id = u.pathname.split('/').filter(Boolean)[0]
        return id || null
      }

      // youtube.com/watch?v=<id>
      const v = u.searchParams.get('v')
      if (v) return v

      // youtube.com/shorts/<id>
      const shortsMatch = u.pathname.match(/^\/shorts\/([^/?#]+)/)
      if (shortsMatch?.[1]) return shortsMatch[1]

      // youtube.com/embed/<id>
      const embedMatch = u.pathname.match(/^\/embed\/([^/?#]+)/)
      if (embedMatch?.[1]) return embedMatch[1]

      return null
    } catch {
      const watchMatch = url.match(/[?&]v=([^?&/]+)/)
      if (watchMatch?.[1]) return watchMatch[1]

      const shortsMatch = url.match(/\/shorts\/([^?&/]+)/)
      if (shortsMatch?.[1]) return shortsMatch[1]

      const embedMatch = url.match(/\/embed\/([^?&/]+)/)
      if (embedMatch?.[1]) return embedMatch[1]

      const youtuBeMatch = url.match(/youtu\.be\/([^?&/]+)/)
      if (youtuBeMatch?.[1]) return youtuBeMatch[1]

      return null
    }
  }

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const id = getYouTubeId(url)
    return id ? `https://www.youtube.com/embed/${id}` : null
  }

  const videos: VideoItem[] = [
    {
      id: 1,
      url: 'https://youtube.com/shorts/aJS4OkN5eDY?feature=shared',
      title: t('ExploreVideo.videos.1') || 'The Countdown Begins | Coming Soon',
      // category: 'Premium Property',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Coimbatore',
      // type: 'Villa',
      // bedrooms: '4BHK',
      // duration: '4 min virtual tour',
    },
    {
      id: 2,
      url: 'https://youtube.com/shorts/a5SBClLl2w0?feature=shared',
      title: t('ExploreVideo.videos.2') || 'Vaazhga Valamudan Digital Realty Solutions',
      // category: 'City Property',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Chennai',
      // type: 'Apartment',
      // bedrooms: '3BHK',
      // duration: '3 min walkthrough',
    },
    {
      id: 3,
      url: 'https://youtube.com/shorts/CHu0SAazTz4?feature=shared',
      title: t('ExploreVideo.videos.3') || 'All-in-One Real Estate Platform | Vaazhga Valamudan',
      // category: 'Beachfront',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Pondicherry',
      // type: 'Villa',
      //  bedrooms: '5BHK',
      // duration: '5 min virtual tour',
    },
    {
      id: 4,
      url: 'https://youtube.com/shorts/FvZEDRR7Cdk?feature=shared',
      title: t('ExploreVideo.videos.4') || 'Start your journey with exclusive launch benefits!',
      // category: 'Residential',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Madurai',
      // type: 'Individual House',
      // bedrooms: '3BHK',
      // duration: '3 min walkthrough',
    },
    {
      id: 5,
      url: 'https://youtube.com/shorts/NfOMHMHyB-A?feature=shared',
      title: t('ExploreVideo.videos.5') || 'Vaazhga Valamudan Digital Realty Solution',
      // category: 'Luxury',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Trichy',
      // type: 'Apartment',
      // bedrooms: '4BHK',
      // duration: '4 min virtual tour',
    },
    {
      id: 6,
      url: 'https://youtube.com/shorts/Ow-OPNSvsHY?feature=share',
      title: t('ExploreVideo.videos.6') || 'How to Grow Your Real Estate Service Business in 2026 | Vaazhga Valamudan Property Hub',
      // category: 'Luxury',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Trichy',
      // type: 'Apartment',
      // bedrooms: '4BHK',
      // duration: '4 min virtual tour',
    },
    {
      id: 7,
      url: 'https://www.youtube.com/shorts/hJHNF6Pc_iU?feature=shared',
      title: t('ExploreVideo.videos.7') || 'Get a "Verified" Business Badge for Real Estate Services | Vaazhga Valamudan',
      // category: 'Luxury',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Trichy',
      // type: 'Apartment',
      // bedrooms: '4BHK',
      // duration: '4 min virtual tour',
    },
    {
      id: 8,
      url: 'https://www.youtube.com/shorts/Er2B64ulvBE?feature=shared',
      title: t('ExploreVideo.videos.8') || 'Start Getting Real Estate Leads',
      // category: 'Luxury',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Trichy',
      // type: 'Apartment',
      // bedrooms: '4BHK',
      // duration: '4 min virtual tour',
    },
    {
      id: 9,
      url: 'https://www.youtube.com/shorts/zx6j0YeE_Zc?feature=shared',
      title: t('ExploreVideo.videos.9') || 'Get More Local Service Leads | How to Register Your Business Today!',
      // category: 'Luxury',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Trichy',
      // type: 'Apartment',
      // bedrooms: '4BHK',
      // duration: '4 min virtual tour',
    },
    {
      id: 10,
      url: 'https://www.youtube.com/shorts/NWy8Jyrz-Uo?feature=shared',
      title: t('ExploreVideo.videos.10') || 'HAPPY NEW YEAR 2026 from Vaazhga Valamudan Realty Solutions Team',
      // category: 'Luxury',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Trichy',
      // type: 'Apartment',
      // bedrooms: '4BHK',
      // duration: '4 min virtual tour',
    },
    {
      id: 11,
      url: 'https://www.youtube.com/shorts/tAOAnRLUrng?feature=shared',
      title: t('ExploreVideo.videos.11') || 'Sell Your Property Fast with Tamil Nadu’s Most Trusted Digital Marketplace!',
      // category: 'Luxury',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Trichy',
      // type: 'Apartment',
      // bedrooms: '4BHK',
      // duration: '4 min virtual tour',
    },
    {
      id: 12,
      url: 'https://www.youtube.com/shorts/-2h0WBEqIYQ?feature=shared',
      title: t('ExploreVideo.videos.12') || 'Stop Being Scammed! 🚫 Buy Only Aadhaar-Verified Properties here!',
      // category: 'Luxury',
      gradient: 'from-yellow-600 to-yellow-500',
      // location: 'Trichy',
      // type: 'Apartment',
      // bedrooms: '4BHK',
      // duration: '4 min virtual tour',
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
            <span className="text-xs font-semibold text-yellow-700 tracking-wide uppercase">{t('ExploreVideo.badge') || 'Explore Properties'}</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className={cn(
              'font-extrabold text-gray-900 mb-2 tracking-tight leading-tight',
              locale === 'ta' ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
            )}
          >
            <span className="bg-[#2a1407] bg-clip-text text-transparent">{t('ExploreVideo.title') || 'Virtual Property Tours'}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={cn(
              'text-gray-600 max-w-2xl mx-auto font-light',
              locale === 'ta' ? 'text-sm sm:text-base md:text-lg leading-snug' : 'text-base sm:text-lg md:text-xl leading-relaxed',
            )}
          >
            {t('ExploreVideo.description') || 'Discover stunning properties through immersive video tours'}
          </motion.p>
        </motion.div>

        {/* Videos Carousel with Enhanced Styling */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants} className="mt-20">
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
            renderItem={(item: VideoItem) => (
              <motion.div key={item.id} variants={itemVariants} whileHover={{ y: -15, transition: { duration: 0.3 } }} className="group h-full">
                {/* Premium Card Container */}
                <div className="relative h-full rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-yellow-100/60 hover:border-yellow-200">
                  {/* Animated Gradient Border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-2xl"></div>

                  {/* Top Badge */}
                  {item.category ? (
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
                  ) : null}

                  {/* Video Container */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
                    {/* Loading Shimmer (behind the iframe) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse z-0"></div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      className="w-full h-full relative z-10 cursor-pointer"
                      onClick={() => setSelectedVideo(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setSelectedVideo(item)}
                    >
                      {
                        // Show YouTube thumbnail and a play overlay; only create iframe when user opens modal
                      }
                      {(() => {
                        const id = getYouTubeId(item.url)
                        const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined
                        return (
                          <div className="w-full h-full bg-black/40 flex items-center justify-center">
                            {thumb ? (
                              <img src={thumb} alt={item.title} className="object-cover w-full h-full" loading="lazy" />
                            ) : (
                              <div className="w-full h-full bg-gray-800" />
                            )}

                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center">
                                <Play className="text-white" size={28} />
                              </div>
                            </div>
                          </div>
                        )
                      })()}
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
                      className="text-xl font-bold text-[#2a1407] mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-amber-600 transition-all duration-300 h-[4.5rem] flex items-center line-clamp-2"
                    >
                      {item.title}
                    </motion.h3>

                    {/* Location, Type, Duration */}
                    {(() => {
                      const metaParts = [item.location, item.type, item.bedrooms].filter(Boolean)
                      const showMeta = metaParts.length > 0
                      const showDuration = Boolean(item.duration)

                      if (!showMeta && !showDuration) return null

                      return (
                        <div className="space-y-2 mb-4">
                          {showMeta ? (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin size={14} className="text-yellow-600" />
                              <span>{metaParts.join(' • ')}</span>
                            </div>
                          ) : null}

                          {showDuration ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock size={14} className="text-yellow-600" />
                              <span>{item.duration}</span>
                            </div>
                          ) : null}
                        </div>
                      )
                    })()}

                    {/* View Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 px-4 bg-[#2a1407] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => setSelectedVideo(item)}
                    >
                      <Play size={18} />
                      <span>{t('ExploreVideo.view_full_tour') || 'View Full Tour'}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          />
        </motion.div>

        {/* YouTube Subscription Call-to-Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center gap-6 mt-16 pb-12"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <Link
              href="https://www.youtube.com/@VaazhgaValamudan-TN"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-3 px-8 py-4 bg-white hover:bg-stone-50 text-stone-900 rounded-full font-bold shadow-xl transition-all hover:shadow-2xl hover:scale-105 active:scale-95 ring-1 ring-black/5"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 text-white shadow-lg">
                <Youtube className="w-5 h-5" fill="currentColor" />
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-xs text-stone-500 font-medium uppercase tracking-wider mb-1">Stay Updated</span>
                <span className="text-base">Subscribe on YouTube</span>
              </div>
              <ArrowRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <p className="text-stone-400 text-sm font-medium">Watch property tours, market trends & expert advice</p>
        </motion.div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
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
          0%,
          100% {
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
              onClick={e => e.stopPropagation()}
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
                src={(() => {
                  const url = String(selectedVideo?.url || '')
                  const embedBase = getYouTubeEmbedUrl(url)
                  const base = embedBase ?? url
                  if (!base) return ''
                  return `${base}${base.includes('?') ? '&' : '?'}autoplay=1&rel=0&enablejsapi=1&modestbranding=1`
                })()}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; autoplay"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
