'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import PopularProperties from '../PopularProperties/PopularProperties'

export default function Slider() {
  const properties = [
    {
      id: 1,
      title: 'Avenue 1, Ashok Nagar',
      rooms: 4,
      area: '3,500 sq ft',
      price: '₹50,000',
      image: '/pp1.png',
    },
    {
      id: 2,
      title: 'Avenue 2, Vadapalani',
      rooms: 3,
      area: '1,500 sq ft',
      price: '₹50,000',
      image: '/pp2.png',
    },
    {
      id: 3,
      title: 'Avenue 3, Anna Nagar',
      rooms: 3,
      area: '1,500 sq ft',
      price: '₹50,000',
      image: '/pp3.png',
    },
  ]

  return (
    <section className="py-12 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8">
        Our Popular Properties
      </h2>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        // slidesPerView={1}
        // navigation
        pagination={{ clickable: true, el: '.custom-pagination' }}
        // autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="max-w-6xl mx-auto"
      >
        <SwiperSlide>
          <PopularProperties />
        </SwiperSlide>

        {/* Custom pagination container */}
        <div className="custom-pagination mt-6 flex justify-center gap-2"></div>
      </Swiper>
    </section>
  )
}
