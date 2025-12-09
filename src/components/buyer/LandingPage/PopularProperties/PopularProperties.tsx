'use client'

import { MapPin, BedSingle, Ruler, IndianRupee, Sparkles, ChevronLeft, ChevronRight, ChartBarStacked, Captions } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PopularPropertyDto } from './dto/popularPropertiesDto'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { usePopularProperties } from './hooks/usePopularProperties'
import { useState, useMemo, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/converter/formatPrice'

// Skeleton Loader for Popular Properties
const PopularPropertiesSkeleton = () => {
  return (
    <section className="relative py-10 sm:py-12 lg:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/90 via-white/95 to-blue-50/90 z-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Skeleton */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10 animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded-full mx-auto mb-2" />
          <div className="h-12 w-96 bg-gray-300 rounded-lg mx-auto mb-2" />
          <div className="h-6 w-80 bg-gray-200 rounded-lg mx-auto" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {[1, 2, 3, 4, 5, 6].map(item => (
            <div key={item} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg animate-pulse">
              <div className="w-full h-64 sm:h-72 lg:h-80 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 rounded" />
                  <div className="h-6 w-20 bg-gray-200 rounded" />
                </div>
                <div className="h-8 w-full bg-gray-200 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function PopularProperties() {
  const t = useTranslations()
  const router = useRouter()
  const { items, handleSeeMore, isLoading } = usePopularProperties({ limit: 9 })
  const [hovered, setHovered] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // 3 cards per row × 2 rows = 6 cards per page

  // Filter published properties from API data
  const publishedItems = (items || []).filter(i => {
    if (i == null) return false
    if (typeof (i as any).is_published === 'boolean') return (i as any).is_published === true
    if (typeof (i as any).is_pulished === 'boolean') return (i as any).is_pulished === true
    return Boolean((i as any).is_published || (i as any).is_pulished)
  })

  // Handle See More - Use API handler
  const handleSeeMoreClick = (propertyId: number) => {
    if (propertyId) {
      handleSeeMore(propertyId)
    }
  }

  // Pagination calculations
  const totalPages = Math.ceil(publishedItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageItems = useMemo(() => {
    return publishedItems.slice(startIndex, endIndex)
  }, [publishedItems, startIndex, endIndex])

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  // Reset hover state when page changes
  useEffect(() => {
    setHovered(null)
  }, [currentPage])

  // Premium Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  if (isLoading) {
    return <PopularPropertiesSkeleton />
  }

  return (
    <motion.section
      className="relative py-10 sm:py-12 lg:py-16 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Premium Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/90 via-white/95 to-blue-50/90 z-0" />

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

      {/* Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] z-[1] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Section Header */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-6 sm:mb-8 lg:mb-10"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-2 rounded-full bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200/50 backdrop-blur-sm shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-700 tracking-wide uppercase">Popular Now</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-2 tracking-tight"
          >
            <span className="text-[#3b1804]">{t('PopularProperties.title') || 'Popular properties curated for you'}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            {t('PopularProperties.description')}
          </motion.p>
        </motion.div>

        {/* Premium Cards Section with Focus Effect */}
        {currentPageItems.length > 0 ? (
          <motion.div
            key={`page-${currentPage}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          >
            {currentPageItems.map((item: PopularPropertyDto, index: number) => (
              <motion.div
                key={`${item.id}-page-${currentPage}`}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'group relative flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out',
                  hovered === index && 'scale-[1.02] z-10',
                )}
                style={{
                  minHeight: '16rem',
                  boxShadow:
                    hovered === index
                      ? '0 20px 50px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(251, 191, 36, 0.1)'
                      : '0 8px 25px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04)',
                }}
              >
                {/* Premium Border Glow */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 pointer-events-none z-20',
                    hovered === index ? 'border-yellow-400/60 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'border-transparent',
                  )}
                />

                {/* Image Container - Full height initially */}
                <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden rounded-xl sm:rounded-2xl">
                  <motion.div
                    animate={{ scale: hovered === index ? 1.1 : 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="w-full h-full"
                  >
                    {(() => {
                      const primaryMedia = item?.media?.find(m => m.is_primary === true) || null

                      if (!primaryMedia) {
                        return <Image src="/villa.png" alt="Property" fill className="object-cover" />
                      }

                      // If primary is an image
                      if (primaryMedia.media_type === 'IMAGE') {
                        return (
                          <Image
                            src={primaryMedia.url || '/villa.png'}
                            alt={item.title || 'Property'}
                            fill
                            className="object-cover"
                            priority={index < 3}
                          />
                        )
                      }

                      // If primary is a video
                      if (primaryMedia.media_type === 'VIDEO') {
                        return <video src={primaryMedia.url} className="object-cover w-full h-full" autoPlay muted loop />
                      }
                    })()}
                  </motion.div>

                  {/* Shimmer Effect */}
                  <div
                    className={cn(
                      'absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out',
                      hovered === index ? 'translate-x-full' : '-translate-x-full',
                    )}
                    style={{ width: '200%' }}
                  />
                </div>

                {/* Expandable Card Content - Slides up on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-white p-3 sm:p-4 flex flex-col rounded-b-xl sm:rounded-b-2xl shadow-lg"
                  initial={false}
                  animate={{
                    y: hovered === index ? 0 : '100%',
                    opacity: hovered === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Title Section */}
                  <div className="mb-2">
                    <h3 className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                      <Captions size={14} className="text-yellow-600" />
                      <span className="text-xs font-semibold text-gray-800">{item?.title ? item.title : ''}</span>
                    </h3>
                  </div>

                  {/* Address Section */}
                  <div className="mb-2">
                    <h3 className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                      <MapPin size={14} className="text-yellow-600 shrink-0 mt-0.5" />
                      <span className="flex-1">{item.address_line || 'Address not available'}</span>
                    </h3>
                  </div>

                  {/* Property Features */}
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-yellow-100">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50/50">
                      <ChartBarStacked size={14} className="text-yellow-600" />
                      <span className="text-xs font-semibold text-gray-800">{item?.listing_type ? item.listing_type : 0}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50/50">
                      <Ruler size={14} className="text-yellow-600" />
                      <span className="text-xs font-semibold text-gray-800">
                        {item?.property_size ? `${item.property_size} ${item.property_size_unit || ''}`.trim() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Price & Button Section */}
                  <div className="flex justify-between items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="small"
                      className="px-3 py-1.5 bg-[#2a1407] text-white rounded-lg font-semibold text-xs shadow-md hover:shadow-lg hover:bg-[#3b1804] transition-all duration-300"
                      onClick={() => handleSeeMoreClick(item.id)}
                    >
                      {t('PopularProperties.see_more')}
                    </Button>

                    <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200/50">
                      <IndianRupee size={14} className="text-yellow-700 font-bold" />
                      <p className="font-bold text-xs sm:text-sm text-gray-900">{formatPrice(item.price) || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Top Border Accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
                </motion.div>

                {/* Corner Accent */}
                <div
                  className={cn(
                    'absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full transition-opacity duration-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
                    hovered === index ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties available</p>
          </div>
        )}

        {/* Pagination - Only show if more than one page */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-8 sm:mt-10"
          >
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300',
                currentPage === 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-yellow-200 text-yellow-700 bg-white hover:bg-yellow-50 hover:border-yellow-300 hover:scale-105 shadow-sm',
              )}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={cn(
                    'min-w-[2.5rem] h-10 px-3 rounded-lg font-semibold text-sm transition-all duration-300',
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 scale-105'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 hover:scale-105',
                  )}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300',
                currentPage === totalPages
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                  : 'border-yellow-200 text-yellow-700 bg-white hover:bg-yellow-50 hover:border-yellow-300 hover:scale-105 shadow-sm',
              )}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
