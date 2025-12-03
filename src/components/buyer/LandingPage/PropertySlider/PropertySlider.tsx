'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SwiperWrapper from '../../../ui/CustomComponent/Slider/SwipperSlider'

interface Slide {
  id: number
  image: string
  title: string
}

// Skeleton Loader for Property Slider
const PropertySliderSkeleton = () => {
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

export default function PropertySlider() {
  const [isLoading, setIsLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(0)

  const Property: Slide[] = [
    { id: 1, image: '/image-17.png', title: 'Imagine. Inspire. Live.' },
    { id: 2, image: '/image-18.png', title: 'Search. Discover. Move In' },
    { id: 3, image: '/image-18.png', title: 'Search. Discover. Move In' },
    { id: 4, image: '/image-18.png', title: 'Search. Discover. Move In' },
  ]

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleImageLoad = () => {
    setImagesLoaded((prev) => {
      const newCount = prev + 1
      if (newCount >= Property.length) {
        setIsLoading(false)
      }
      return newCount
    })
  }

  // Animation Variants
  const slideVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  if (isLoading) {
    return <PropertySliderSkeleton />
  }

  return (
    <motion.section
      className="py-10 bg-gradient-to-b from-yellow-50 via-white to-yellow-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
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
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority
                onLoad={handleImageLoad}
              />

              {/* Subtle chocolate & gold gradient overlay for mood */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-[#2a1407]/20 to-transparent" />
            </motion.div>
          )}
        />
      </div>
    </motion.section>
  )
}
