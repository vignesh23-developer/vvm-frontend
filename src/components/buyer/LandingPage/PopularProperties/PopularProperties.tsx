'use client'

import { MapPin, ChartBarStacked, Ruler, IndianRupee } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SwiperWrapper from '../../../ui/CustomComponent/Slider/SwipperSlider'
import { PopularPropertyDto } from './dto/popularPropertiesDto'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { usePopularProperties } from './hooks/usePopularProperties'
import { formatPrice } from '@/utils/converter/formatPrice'
import PopularPropertyCardSkeleton from './PopularPropertyCardSkeleton'

// Define TypeScript type for property items

export default function PopularProperties() {
  const t = useTranslations()
  const router = useRouter()
  const { items, isLoading, handleSeeMore } = usePopularProperties({ limit: 9 })

  console.log(items, 'PopularProperties render - items:')
  // filter only published items (guard for possible typo: is_pulished vs is_published)
  const publishedItems = (items || []).filter(i => {
    // Accept both `is_published` and common misspelling `is_pulished` if present
    if (i == null) return false
    if (typeof (i as any).is_published === 'boolean') return (i as any).is_published === true
    if (typeof (i as any).is_pulished === 'boolean') return (i as any).is_pulished === true
    // fallback: treat truthy values as published
    return Boolean((i as any).is_published || (i as any).is_pulished)
  })

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
          {t('PopularProperties.title')}
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-3 text-gray-600 text-sm sm:text-lg max-w-2xl mx-auto"
        >
          {t('PopularProperties.description')}
        </motion.p>

        {/* Swiper Section */}
        <div className="mt-10 sm:mt-14">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <PopularPropertyCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <SwiperWrapper
              data={publishedItems}
              slidesPerView={1}
              showNavigation
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
              }}
              renderItem={(item: PopularPropertyDto) => (
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
                    <motion.div whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }} className="w-full h-full">
                      {item?.media && item.media.length > 0 && (
                        // render only the current item's first media
                        <Image
                          key={item.id}
                          src={item.media[0].url ? item.media[0].url : '/villa.png'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </motion.div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 sm:p-5 bg-[#D9D9D9] flex flex-col flex-grow">
                    <h3 className="flex items-center gap-2 text-sm sm:text-base font-semibold text-gray-800 mb-2">
                      <MapPin size={16} className="text-gray-600 shrink-0" />
                      <span className="truncate">{item.address_line}</span>
                    </h3>

                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <ChartBarStacked size={14} className="text-gray-500" />
                        {item?.listing_type ? item.listing_type : 'N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ruler size={14} className="text-gray-500" />
                        {item?.property_size ? item.property_size + ' ' + item.property_size_unit : 'N/A'}
                      </span>
                    </div>

                    {/* Price & Button */}
                    <div className="flex justify-between items-center mt-auto">
                      <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          type="button"
                          variant="tertiary"
                          size="small"
                          className="px-3 py-1.5 bg-black text-white rounded-md"
                          hover="hover:bg-gray-800 transition text-xs sm:text-sm"
                          onClick={() => {
                            handleSeeMore(item.id)
                          }}
                        >
                          {t('PopularProperties.see_more')}
                        </Button>
                      </motion.div>

                      <p className="flex items-center gap-1 font-bold text-sm sm:text-base text-gray-800">
                        <IndianRupee size={16} className="text-gray-700" />
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            />
          )}
        </div>
      </div>
    </motion.section>
  )
}
