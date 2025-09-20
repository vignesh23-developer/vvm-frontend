'use client'

import Image from 'next/image'
import SwiperWrapper from '../Slider/SwipperSlider'

interface Slide {
  id: number
  image: string
  title: string
}

export default function PropertySlider() {
  const Property: Slide[] = [
    {
      id: 1,
      image: '/image-17.png',
      title: 'Imagine. Inspire. Live.',
    },
    {
      id: 2,
      image: '/image-18.png',
      title: 'Search. Discover. Move In',
    },
    {
      id: 3,
      image: '/image-18.png',
      title: 'Search. Discover. Move In',
    },
    {
      id: 4,
      image: '/image-18.png',
      title: 'Search. Discover. Move In',
    },
  ]

  return (
    <section className="py-10 bg-gray-50">
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
            <div
              key={item.id}
              className="relative w-full aspect-[4/3] sm:aspect-[16/9] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden"
            >
              {/* Background Image */}
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        />
      </div>
    </section>
  )
}
