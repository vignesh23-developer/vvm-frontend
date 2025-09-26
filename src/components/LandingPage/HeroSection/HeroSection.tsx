'use client'

import { MapPin, Home, ChevronDown, IndianRupee, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function HeroSection() {
  const t = useTranslations()

  const tabKeys: string[] = [
    'buy',
    'rent',
    'new_projects',
    'pg',
    'plots',
    'commercial',
  ]

  return (
    <main
      className="relative min-h-[80vh] sm:min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/hero_section.png')" }}
    >
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl mx-auto rounded-3xl bg-black/60 text-white px-4 py-6 sm:px-8 sm:py-10 text-center">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 leading-snug">
            {t('Hero.title')}
          </h1>

          {/* Tabs Section */}
          <div className="mb-6 sm:mb-10">
            {/* Mobile Tabs Grid */}
            <div className="grid grid-cols-2 gap-2 mb-6 sm:hidden">
              {tabKeys.map((tab, idx) => (
                <button
                  key={tab}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    idx === 0
                      ? 'bg-yellow-400 text-black'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {t(`Hero.HeroMenu.${tab}`)}
                </button>
              ))}
            </div>

            {/* Desktop Tabs Row */}
            <div className="hidden sm:flex flex-wrap justify-center gap-3 sm:gap-5 lg:gap-6 mb-6 sm:mb-10 text-sm sm:text-lg font-medium">
              {tabKeys.map((tab, idx) => (
                <button
                  key={tab}
                  className={`${
                    idx === 0
                      ? 'text-yellow-400 border-b-2 border-yellow-400 pb-1'
                      : 'hover:text-yellow-400 transition'
                  }`}
                >
                  {t(`Hero.HeroMenu.${tab}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white text-black rounded-2xl px-3 py-4 sm:px-5 sm:py-5 shadow-lg">
            {/* Mobile stacked */}
            <div className="flex flex-col gap-3 sm:hidden">
              {/* Location */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Chennai</span>
                </div>
                <span className="text-gray-500 text-sm">Add more...</span>
              </div>

              {/* Property Type */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">Flat +1</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>

              {/* Budget */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-5 h-5" />
                  <span className="font-medium">Budget</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>

              {/* Search button */}
              <button className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium">
                <Search className="w-5 h-5" />
                <span>Search Properties</span>
              </button>
            </div>

            {/* Desktop inline */}
            <div className="hidden sm:flex sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Location */}
              <div className="flex items-center space-x-2 flex-1 min-w-[140px] justify-center sm:justify-start">
                <MapPin className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">
                  Chennai
                </span>
                <span className="text-gray-500 hidden sm:inline text-sm">
                  Add more...
                </span>
              </div>

              {/* Property Type */}
              <div className="flex items-center space-x-2 flex-1 min-w-[140px] justify-center sm:justify-start">
                <Home className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">
                  Flat +1
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>

              {/* Budget */}
              <div className="flex items-center space-x-2 flex-1 min-w-[140px] justify-center sm:justify-start">
                <IndianRupee className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">Budget</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>

              {/* Search button */}
              <button className="flex items-center justify-center gap-2 bg-black text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl hover:bg-gray-800 transition w-full sm:w-auto text-sm sm:text-base">
                <Search className="w-5 h-5" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
