'use client'

import Image from 'next/image'

interface Slide {
  id: number
  image: string
  logo: string
  title: string
}

export default function PropertySlider() {
  const Property: Slide[] = [
    {
      id: 1,
      image: '/image-17.png',
      logo: 'LOGO HERE',
      title: 'Imagine. Inspire. Live.',
    },
    {
      id: 2,
      image: '/image-18.png',
      logo: 'LOGO HERE',
      title: 'Search. Discover. Move In',
    },
  ]

  return (
    <div className="flex gap-6 px-6 py-12 max-w-7xl mx-auto">
      {Property.map(({ id, image, title }) => (
        <div
          key={id}
          className="relative w-[600px] h-[400px] rounded-3xl overflow-hidden flex-shrink-0"
        >
          {/* Background Image */}
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        </div>
      ))}
    </div>
  )
}
