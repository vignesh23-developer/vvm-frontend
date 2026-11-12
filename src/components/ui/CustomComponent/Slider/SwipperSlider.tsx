
'use client'

import { ReactNode, useRef, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type SwiperWrapperProps<T> = {
  data: T[]
  slidesPerView?: number | 'auto'
  autoplay?: boolean
  showPagination?: boolean
  showNavigation?: boolean
  breakpoints?: Record<string, any>
  className?: string
  spaceBetween?: number
  slidesPerGroup?: number
  paginationGroupSize?: number
  renderItem: (item: T, index: number) => ReactNode
}

export default function SwiperWrapper<T>({
  data,
  slidesPerView = 1,
  autoplay = false,
  showPagination = false,
  showNavigation = false,
  breakpoints = {
    320: { slidesPerView: 1, spaceBetween: 12 },
    640: { slidesPerView: 1.5, spaceBetween: 16 },
    768: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 24 },
    1280: { slidesPerView: 4, spaceBetween: 28 },
  },
  className = '',
  spaceBetween = 16,
  slidesPerGroup = 1,
  paginationGroupSize = 1,
  renderItem,
}: SwiperWrapperProps<T>) {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Enable loop only when enough slides are available
  const loopEnabled = false

  // Number of pagination dots
  const totalDots = Math.ceil(data.length / paginationGroupSize)

  // Update active pagination dot
  const handleSlideChange = (swiper: SwiperInstance) => {
    setActiveIndex(
      Math.floor(swiper.realIndex / paginationGroupSize)
    )
  }

  // Navigate to selected group
  const goToSlide = (index: number) => {
    const targetIndex = index * paginationGroupSize
    swiperRef.current?.slideTo(targetIndex)
  }

  const goNext = () => swiperRef.current?.slideNext()
  const goPrev = () => swiperRef.current?.slidePrev()

  // Reset slider when API data changes
  useEffect(() => {
    const swiper = swiperRef.current

    if (swiper && !swiper.destroyed) {
      swiper.update()
      setActiveIndex(0)
    }
  }, [data.length])

  return (
    <div className={`relative w-full ${className}`}>
      <Swiper
        modules={[Autoplay]}
        onSwiper={swiper => {
          swiperRef.current = swiper
        }}
        onSlideChange={handleSlideChange}
        slidesPerView={slidesPerView}
        slidesPerGroup={slidesPerGroup}
        loop={loopEnabled}
        loopAddBlankSlides={true}
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
              delay: 3000,
              disableOnInteraction: false,
            }
            : false
        }
        breakpoints={breakpoints}
        className="pb-12"
      >
        {data.map((item, idx) => (
          <SwiperSlide
            key={(item as any)?.id ?? idx}
            className="h-auto"
          >
            <div className="w-full h-full">
              {renderItem(item, idx)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation */}
      {showNavigation && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous slide"
            className="absolute top-1/2 left-1 sm:left-2 md:left-4 lg:-left-8 z-10 -translate-y-1/2 bg-yellow-400 text-gray-800 p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:bg-[#2a1407] text-white/80 hover:text-yellow-400 transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next slide"
            className="absolute top-1/2 right-1 sm:right-2 md:right-4 lg:-right-8 z-10 -translate-y-1/2 bg-yellow-400 text-gray-800 p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:bg-[#2a1407] text-white/80 hover:text-yellow-400 transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>
        </>
      )}

      {/* Custom Pagination */}
      {showPagination && totalDots > 1 && (
        <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
          {Array.from({ length: totalDots }).map((_, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to group ${idx + 1}`}
              aria-current={activeIndex === idx ? 'true' : undefined}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${activeIndex === idx
                ? 'bg-yellow-500 scale-110 shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                : 'bg-yellow-200 hover:bg-yellow-300'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
