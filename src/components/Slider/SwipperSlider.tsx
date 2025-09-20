'use client'

import { ReactNode, useRef, useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
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
  renderItem,
}: SwiperWrapperProps<T>) {
  const swiperRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Update active index on slide change
  const handleSlideChange = () => {
    if (swiperRef.current) {
      setActiveIndex(swiperRef.current.realIndex)
    }
  }

  // Go to next/prev slide
  const goNext = () => swiperRef.current?.slideNext()
  const goPrev = () => swiperRef.current?.slidePrev()
  const goToSlide = (index: number) => swiperRef.current?.slideToLoop(index)

  return (
    <div className={`relative w-full ${className}`}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        onSwiper={swiper => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        slidesPerView={slidesPerView}
        loop
        spaceBetween={spaceBetween}
        autoplay={
          autoplay ? { delay: 3000, disableOnInteraction: false } : false
        }
        breakpoints={breakpoints}
        className="pb-12"
      >
        {data.map((item, idx) => (
          <SwiperSlide key={idx} className="flex justify-center">
            {renderItem(item, idx)}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation */}
      {showNavigation && (
        <>
          <button
            onClick={goPrev}
            className="absolute top-1/2 left-1 sm:left-2 md:left-4 lg:-left-8 z-10 -translate-y-1/2
                      text-gray-800 p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>

          <button
            onClick={goNext}
            className="absolute top-1/2 right-1 sm:right-2 md:right-4 lg:-right-8 z-10 -translate-y-1/2
                       bg-white text-gray-800 p-2 sm:p-3 md:p-4 rounded-full shadow-lg hover:bg-gray-100 transition"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
          </button>
        </>
      )}

      {/* Custom pagination */}
      {showPagination && (
        <div className="flex justify-center mt-4 sm:mt-6 space-x-2">
          {data.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300
                ${
                  activeIndex === idx
                    ? 'bg-gray-800 scale-110'
                    : 'bg-gray-300 hover:bg-gray-500'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
