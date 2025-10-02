'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'

const About = () => {
  const t = useTranslations('About')
  const aboutImage = [
    {
      src: '/about1.png',
      alt: 'Living room',
      width: 500,
      height: 500,
    },
    {
      src: '/about2.png',
      alt: 'Modern interior',
      width: 500,
      height: 500,
    },
    {
      src: '/about3.png',
      alt: 'Cozy home',
      width: 500,
      height: 500,
    },
    {
      src: '/about4.png',
      alt: 'Luxury home',
      width: 500,
      height: 500,
    },
  ]
  return (
    <section className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10">
        {/* Left side - Image Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 relative">
          {aboutImage.map((value, index) => (
            <div key={index} className="rounded-2xl overflow-hidden">
              <Image
                src={value.src}
                alt={value.alt}
                width={value.width}
                height={value.height}
                className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
              />
            </div>
          ))}

          {/* White circle overlay */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-md"></div>
        </div>

        {/* Right side - Content */}
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            {t('header')}
          </h3>
          <p className="text-gray-600 leading-relaxed text-justify mb-8">
            {t('description')}
          </p>
          <button className="bg-[#2B1B12] text-white px-6 py-3 rounded-lg shadow-md cursor-pointer hover:bg-[#3A2A20] transition">
            {t('explore_more')}
          </button>
        </div>
      </div>
    </section>
  )
}

export default About
