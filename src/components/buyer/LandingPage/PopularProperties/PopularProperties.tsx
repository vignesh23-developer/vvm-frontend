'use client'

import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { MapPin, BedSingle, Ruler, IndianRupee, Sparkles, ChevronLeft, ChevronRight, ChartBarStacked, Captions } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PopularPropertyDto } from './dto/popularPropertiesDto'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { usePopularProperties } from './hooks/usePopularProperties'
import { useState, useMemo, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/converter/formatPrice'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'

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

interface PopularPropertiesProps {
  propertiesData?: PopularPropertyDto[]
  propertiesTotal?: number
  error: any
  isLoading: boolean
  mutate: () => void
  district?: string
  packageType?: string
}

export default function PopularProperties({
  propertiesData,
  propertiesTotal,
  error: PropertiesError,
  isLoading: PropertiesLoading,
  mutate: PropertiesMutate,
  district,
  packageType,
}: PopularPropertiesProps) {
  const t = useTranslations()
  const locale = useLocale()
  const { token } = useAuth()
  const router = useRouter()
  const [hovered, setHovered] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6 // 3 cards per row × 2 rows = 6 cards per page

  // const { items, total } = usePopularProperties({
  //   page: 1,
  //   limit: 12, // Fetch a larger number to allow pagination client-side
  // })

  // console.log('Popular Properties Items:', items)

  // Filter published properties from API data
  const publishedItems = (propertiesData || []).filter(i => {
    if (i == null) return false
    if (typeof (i as any).is_published === 'boolean') return (i as any).is_published === true
    if (typeof (i as any).is_pulished === 'boolean') return (i as any).is_pulished === true
    return Boolean((i as any).is_published || (i as any).is_pulished)
  })

  // Handle See More - require auth, redirect to login with `next` param if unauthenticated
  const handleSeeMoreClick = (propertyId: number) => {
    if (!propertyId) return

    const detailsPath = `/propertyDetails/${propertyId}`

    if (!token) {
      router.push(`/login?next=${encodeURIComponent(detailsPath)}`)
      return
    } else {
      router.push(detailsPath)
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

  if (PropertiesLoading) {
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
      <div className="absolute inset-0 opacity-[0.015] z-[1] pointer-events-none bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />

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
            <span className="text-xs font-semibold text-yellow-700 tracking-wide uppercase">{t('PopularProperties.badge') || 'Popular Now'}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn(
              'font-extrabold text-gray-900 mb-2 tracking-tight leading-tight',
              locale === 'ta' ? 'text-xl sm:text-2xl md:text-3xl lg:text-4xl' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
            )}
          >
            <span className="text-[#2a1407]">{t('PopularProperties.title') || 'Popular properties curated for you'}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={cn(
              'text-gray-600 max-w-2xl mx-auto font-light',
              locale === 'ta' ? 'text-sm sm:text-base md:text-lg leading-snug' : 'text-base sm:text-lg md:text-xl leading-relaxed',
            )}
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
                className="h-full"
              >
                <PropertyCard
                  {...(item as any)}
                  id={String(item.id)}
                  title={item.title || ''}
                  description={(item as any).description ?? ''}
                  price={String((item as any).price ?? '')}
                  district={(item as any).district ?? ''}
                  city={(item as any).city ?? ''}
                  state={(item as any).state ?? ''}
                  address_line={(item as any).address_line ?? ''}
                  postal_code={(item as any).postal_code ?? ''}
                  approval_status={(item as any).approval_status ?? ''}
                  favorite_count={Number((item as any).favorite_count ?? 0)}
                  status={String((item as any).status ?? '')}
                  listing_type={(item as any).listing_type ?? ''}
                  media={(item as any).media ?? []}
                  project_status={(item as any).project_status ?? (item as any).projectStatus}
                  layout_price_min={(item as any).layout_price_min}
                  layout_price_max={(item as any).layout_price_max}
                  layout_total_sqft={(item as any).layout_total_sqft}
                  property_size={(item as any).property_size}
                  property_size_unit={(item as any).property_size_unit}
                  onPrimaryAction={() => handleSeeMoreClick(item.id)}
                  // Landing cards: no favorite/share UI here
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
