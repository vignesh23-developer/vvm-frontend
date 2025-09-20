import { Star } from 'lucide-react'
import SwiperWrapper from '../Slider/SwipperSlider'
import { useTranslations } from 'next-intl'

export default function Testimonials() {
  const t = useTranslations('Testimonials')
  const feedback = [
    {
      id: 1,
      client: 'Client number 1',
      text: 'One of the standout qualities of Ziken Labs is their commitment to understanding the subject matter before diving into content writing. This dedication to research and knowledge-building sets them apart in the content writing industry.',
      rating: 2,
    },
    {
      id: 2,
      client: 'Client number 2',
      text: 'This dedication to research and knowledge-building sets them apart from the competition.',
      rating: 4,
    },
    {
      id: 3,
      client: 'Client number 3',
      text: 'Their professionalism and eye for detail impressed us throughout the project.',
      rating: 5,
    },
    {
      id: 4,
      client: 'Client number 4',
      text: 'Their professionalism and eye for detail impressed us throughout the project.',
      rating: 5,
    },
    {
      id: 5,
      client: 'Client number 5',
      text: 'Their professionalism and eye for detail impressed us throughout the project.',
      rating: 5,
    },
  ]

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900">
          {t('title')}
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mt-2 mb-10 sm:mb-12">
          {t('description')}
        </p>

        {/* Swiper Carousel */}
        <SwiperWrapper
          data={feedback}
          slidesPerView={1}
          showNavigation={true}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 20 },
          }}
          renderItem={item => (
            <div
              key={item.id}
              className="bg-[#D9D9D9] p-4 sm:p-6 rounded-xl sm:rounded-2xl relative text-left shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
            >
              {/* Decorative quote mark */}
              <span className="absolute top-0 left-3 text-4xl sm:text-5xl text-black-300 font-serif -translate-y-3 sm:-translate-y-4">
                “
              </span>

              <div className="mt-6">
                <p className="font-semibold text-sm sm:text-base md:text-lg">
                  {item.client}
                </p>
                <p className="text-gray-700 mt-2 text-sm sm:text-base leading-relaxed line-clamp-5">
                  {item.text}
                </p>

                {/* Rating Stars */}
                <div className="flex mt-4 space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < item.rating
                          ? 'fill-black text-black'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </section>
  )
}
