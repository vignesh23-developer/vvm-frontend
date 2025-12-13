'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SwiperWrapper from '../../../ui/CustomComponent/Slider/SwipperSlider'
import { useAdsSlider } from './hooks/useAdsSlider'

interface Slide {
  id: number
  image: string
  title: string
}

// Skeleton Loader for ADs Slider (unchanged)
const AdsSliderSkeleton = () => {
  return (
    <div className="py-10 bg-gradient-to-b from-yellow-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(item => (
            <div
              key={item}
              className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-yellow-100 via-yellow-50 to-white animate-pulse"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/80 via-yellow-50/60 to-white/80" />
              <div className="absolute bottom-6 left-6 space-y-2">
                <div className="h-8 w-48 bg-yellow-200/70 rounded-lg" />
                <div className="h-6 w-32 bg-yellow-100/80 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AdsSlider() {
  const [isLoading, setIsLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const { items: Ads, isLoading: adsLoading } = useAdsSlider({ status: 'AVAILABLE' })

  console.log('Ads in AdsSlider:', Ads)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleImageLoad = () => {
    setImagesLoaded(prev => {
      const newCount = prev + 1
      if (newCount >= Ads.length) {
        setIsLoading(false)
      }
      return newCount
    })
  }

  // Animation Variants
  const slideVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  if (isLoading) {
    return <AdsSliderSkeleton />
  }

  return (
    <motion.section
      className="py-12 bg-gradient-to-b from-yellow-50 via-white to-yellow-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SwiperWrapper
          data={Ads}
          showPagination
          autoplay
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          renderItem={(item: any) => (
            <motion.div
              key={item.id}
              className="relative w-full overflow-hidden rounded-2xl shadow-lg group aspect-[4/3] md:aspect-[3/4] lg:aspect-[4/5]"
              variants={slideVariants}
            >
              <Link href={`/adsDetails/${item.id}`}>
                {/* Background Image Wrapper */}
                <div className="relative w-full h-full group overflow-hidden rounded-lg">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0].url}
                      alt={item.title}
                      fill
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority
                      onLoad={handleImageLoad}
                    />
                  ) : (
                    <Image
                      src="/ads-1.jpg"
                      alt="Imagine. Inspire. Live."
                      fill
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority
                      onLoad={handleImageLoad}
                    />
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md leading-tight">{item.title}</h3>
                    <div className="h-1 w-12 bg-yellow-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        />
      </div>
    </motion.section>
  )
}
