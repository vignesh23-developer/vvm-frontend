// components/ExploreProperties.tsx
import { Building2, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ExploreProperties() {
  const t = useTranslations('ExploreProperties')
  const properties = [
    {
      city: 'Coimbatore',
      priceRange: '₹ 2.24 L – 4.65 Cr',
      count: 288,
      rating: 5,
      tags: ['Land', 'Plots', 'House', 'Commercial', 'Projects'],
      image: '/Ellipse.png', // replace with your image
    },
    {
      city: 'Coimbatore',
      priceRange: '₹ 2.24 L – 4.65 Cr',
      count: 288,
      rating: 5,
      tags: ['Land', 'Plots', 'House', 'Commercial', 'Projects'],
      image: '/Ellipse.png',
    },
    {
      city: 'Coimbatore',
      priceRange: '₹ 2.24 L – 4.65 Cr',
      count: 288,
      rating: 5,
      tags: ['Land', 'Plots', 'House', 'Commercial', 'Projects'],
      image: '/Ellipse.png',
    },
    {
      city: 'Coimbatore',
      priceRange: '₹ 2.24 L – 4.65 Cr',
      count: 288,
      rating: 5,
      tags: ['Land', 'Plots', 'House', 'Commercial', 'Projects'],
      image: '/Ellipse.png',
    },
  ]

  return (
    <section className="py-8  bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900">
          {t('title')}
        </h2>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {properties.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <div className="p-6 flex-1">
                <h3 className="text-lg text-start font-semibold text-gray-900 mb-2">
                  {p.city}
                </h3>
                <p className="text-sm text-start text-gray-600 mb-3">
                  {p.priceRange}
                </p>

                {/* Property Count */}
                <p className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                  <Building2 size={18} className="text-gray-600" />
                  {p.count} Properties
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  <span className="font-bold">{p.rating}.0</span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#B0BEC5] rounded-md text-sm text-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Section */}
              <div className="h-[120px] bg-[#B0BEC5] shadow-md relative flex flex-col items-start justify-end">
                <div className="absolute -top-6 right-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden shadow-md">
                  <img
                    src={p.image}
                    alt={p.city}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* More Button */}
        <div className="mt-10">
          <button className="text-gray-800 font-medium hover:underline">
            {t('more')}
          </button>
        </div>
      </div>
    </section>
  )
}
