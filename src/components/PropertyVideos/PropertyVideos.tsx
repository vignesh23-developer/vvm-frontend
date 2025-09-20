import SwiperWrapper from '../Slider/SwipperSlider'
import { useTranslations } from 'next-intl'

// components/PropertyVideos.tsx
export default function PropertyVideos() {
  const t = useTranslations('ExploreVideo')
  const videos = [
    {
      id: 1,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 1',
    },
    {
      id: 2,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 2',
    },
    {
      id: 3,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 3',
    },
    {
      id: 4,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 3',
    },
    {
      id: 5,
      url: 'https://www.youtube.com/embed/ZCu_Uh8vO5k?si=SZouocr_ZB647Bw6',
      title: 'Property Tour 3',
    },
  ]

  return (
    <section className="py-5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
          {t('title')}
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
          {t('description')}
        </p>

        {/* ✅ Swiper here */}
        <div className="mt-14">
          <SwiperWrapper
            data={videos}
            slidesPerView={1}
            showNavigation={true}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
            renderItem={item => (
              <div
                key={item.id}
                className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
              >
                {/* Responsive iframe wrapper */}
                <div className="aspect-video w-full">
                  <iframe
                    src={item.url}
                    title={item.title}
                    className="w-full h-full rounded-2xl"
                    frameBorder={0}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </section>
  )
}
