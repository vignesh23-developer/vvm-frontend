'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Home, ChevronDown, IndianRupee, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { usePropertyCategories } from '@/app/admin/dashboard/(master)/property-category/(hooks)/usePropertyCategories'
import LucideIconRenderer from '@/components/ui/CustomComponent/LucideIconRenderer/LucideIconRenderer'

export default function HeroSection() {
  const t = useTranslations()
  const router = useRouter()
  const [isHeroLoading, setIsHeroLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('buy')
  const [location, setLocation] = useState('')
  const [showBudget, setShowBudget] = useState(false)
  const [showType, setShowType] = useState(false)

  const [selectedBudget, setSelectedBudget] = useState<string | null>(null)
  // Lightweight category shape used in this component
  interface Category {
    id: string | number
    name: string
    icon?: string
  }

  const [selectedType, setSelectedType] = useState<Category | null>(null)
  const { categories, error, isLoading, mutateCategories } = usePropertyCategories()
  const tabKeys: string[] = ['buy', 'rent', 'lease']

  // Background carousel images (external URLs)
  const heroImages = [
    'https://www.roofandfloor.com/project/7124/gallery/Coco_Enclave_1.jpg',
    'https://drahomes.in/images/dra-polaris.jpg',
    'https://images.homify.com/v1511876426/p/photo/image/2339212/vijay-_15-_mycut.jpg',
  ]
  const [activeBgIndex, setActiveBgIndex] = useState(0)

  // Auto-rotate hero background every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBgIndex(prev => (prev + 1) % heroImages.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const budgetOptions = ['Below 10 Lakhs', '10–20 Lakhs', '20–30 Lakhs', '30–50 Lakhs', '50 Lakhs – 1 Crore', '1–2 Crores', 'Above 2 Crores']

  // Simulate a short loading state for hero (for skeleton)
  useEffect(() => {
    const timer = setTimeout(() => setIsHeroLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (isHeroLoading) {
    return (
      <main className="relative min-h-[80vh] sm:min-h-screen w-full overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex items-center justify-center px-4 py-8 min-h-[80vh] sm:min-h-screen">
          <div className="w-full max-w-4xl mx-auto rounded-3xl bg-white/10 border border-yellow-200/40 backdrop-blur-md px-4 py-8 sm:px-8 sm:py-12 animate-pulse">
            <div className="h-8 sm:h-10 w-2/3 mx-auto bg-yellow-100/70 rounded-full mb-6" />
            <div className="h-12 sm:h-14 w-full bg-white/10 rounded-2xl mb-4" />
            <div className="h-12 sm:h-14 w-full bg-white/10 rounded-2xl" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-[80vh] sm:min-h-screen w-full overflow-hidden">
      {/* Background carousel layer */}
      <div className="absolute inset-0">
        {heroImages.map((src, index) => (
          <motion.div
            key={src}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${src}')`,
            }}
            initial={{ opacity: index === activeBgIndex ? 1 : 0 }}
            animate={{ opacity: index === activeBgIndex ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        ))}
        {/* Chocolate & gold gradient overlay to keep text readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-[#2a1407]/40 to-black/50" />
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 py-8 min-h-[80vh] sm:min-h-screen">
        <motion.div
          className="w-full max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#2a1407]/95 via-[#2a1407]/90 to-[#3b1804]/95 text-white px-4 py-6 sm:px-8 sm:py-10 text-center border border-yellow-300/40 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Heading */}
          <motion.h1 variants={itemVariants} className="font-scans text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-snug">
            {t('Hero.title')}
          </motion.h1>

          {/* Tabs Section */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-10">
            {/* Mobile Tabs */}
            <div className="grid grid-cols-2 gap-4 mb-6 sm:hidden">
              {tabKeys.map(tab => (
                <motion.button
                  key={tab}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentTab(tab)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${currentTab === tab ? 'bg-yellow-400 text-[#2a1407]' : 'bg-white/10 hover:bg-white/20'
                    }`}
                >
                  {t(`Hero.HeroMenu.${tab}`)}
                </motion.button>
              ))}
            </div>

            {/* Desktop Tabs */}
            <div className="hidden sm:flex flex-wrap justify-evenly gap-5 mb-10 text-lg font-medium">
              {tabKeys.map(tab => (
                <motion.div key={tab} variants={itemVariants} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="button"
                    variant="tertiary"
                    size="small"
                    className={`pb-1 transition ${currentTab === tab
                      ? 'text-yellow-300 border-b-2 border-yellow-300'
                      : 'text-white/80 hover:text-yellow-200'
                      }`}
                    onClick={() => setCurrentTab(tab)}
                  >
                    {t(`Hero.HeroMenu.${tab}`)}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div variants={itemVariants} className="bg-white text-black rounded-2xl px-3 py-4 sm:px-2 sm:py-2 shadow-lg relative">
            {/* -------------- Mobile UI -------------- */}
            <div className="flex flex-col gap-3 sm:hidden">
              {/* Location */}
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 flex-1">
                  <MapPin className="w-5 h-5 text-gray-600" />

                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="bg-transparent outline-none font-medium text-black placeholder-gray-400 w-full"
                  />
                </div>

                <span className="text-gray-500 text-sm whitespace-nowrap">{t('Hero.HeroMenu.add_more')}</span>
              </motion.div>

              {/* Property Type Select */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                onClick={() => {
                  setShowType(!showType)
                  setShowBudget(false)
                }}
              >
                <div className="flex items-center gap-2">
                  {selectedType && <LucideIconRenderer iconName={selectedType.icon as any} className="w-5 h-5 text-gray-700" />}

                  <span className="font-medium">{selectedType?.name || t('Hero.HeroMenu.flat')}</span>
                </div>

                <ChevronDown className="w-4 h-4 text-gray-500" />

                {/* Dropdown */}
                {showType && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-md z-20 p-2">
                    {categories?.map(item => (
                      <div
                        key={item.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                        onClick={() => {
                          setSelectedType(item as Category)
                          setShowType(false)
                        }}
                      >
                        <span className="font-medium flex items-center gap-2">
                          <LucideIconRenderer iconName={item.icon as any} /> {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Budget Select */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                onClick={() => {
                  setShowBudget(!showBudget)
                  setShowType(false)
                }}
              >
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-5 h-5" />
                  <span className="font-medium">{selectedBudget || t('Hero.HeroMenu.budget')}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />

                {/* Dropdown */}
                {showBudget && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-md z-20 p-2">
                    {budgetOptions.map(budget => (
                      <div
                        key={budget}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                        onClick={() => {
                          setSelectedBudget(budget)
                          setShowBudget(false)
                        }}
                      >
                        {budget}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium"
                onClick={() => {
                  router.push(`/properties_list/explore_by_category?location=${location}&type=${selectedType?.name}&budget=${selectedBudget}`)
                }}
              >
                <Search className="w-5 h-5" />
                <span>{t('Hero.HeroMenu.search')}</span>
              </motion.button>
            </div>

            {/* -------------- Desktop UI -------------- */}
            <div className="hidden sm:flex items-center gap-4 relative">
              {/* Location */}
              <div className="flex items-center gap-2 flex-1 min-w-[140px] rounded-lg px-3 py-2">
                <MapPin className="w-5 h-5 text-gray-600" />

                <input
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="bg-transparent outline-none font-medium w-full placeholder:text-gray-400"
                />

                {/* <span className="text-gray-500 text-sm whitespace-nowrap">{t('Hero.HeroMenu.add_more')}</span> */}
              </div>

              {/* Property Type */}
              <div
                className="flex items-center space-x-2 flex-1 min-w-[140px] relative cursor-pointer"
                onClick={() => {
                  setShowType(!showType)
                  setShowBudget(false)
                }}
              >
                <span className="font-medium flex items-center gap-2">
                  {selectedType && <LucideIconRenderer iconName={selectedType.icon as any} />}
                  {selectedType?.name ?? t('Hero.HeroMenu.flat')}
                </span>

                <ChevronDown className="w-4 h-4 text-gray-500" />

                {showType && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-md z-20 p-2">
                    {categories?.map(item => (
                      <div
                        key={item.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                        onClick={() => {
                          setSelectedType(item as Category)
                          setShowType(false)
                        }}
                      >
                        <span className="font-medium flex items-center gap-2">
                          <LucideIconRenderer iconName={item.icon as any} /> {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Budget */}
              <div
                className="flex items-center space-x-2 flex-1 min-w-[140px] relative cursor-pointer"
                onClick={() => {
                  setShowBudget(!showBudget)
                  setShowType(false)
                }}
              >
                <IndianRupee className="w-5 h-5" />
                <span className="font-medium">{selectedBudget || t('Hero.HeroMenu.budget')}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />

                {showBudget && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-md z-20 p-2">
                    {budgetOptions.map(budget => (
                      <div
                        key={budget}
                        className="p-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                        onClick={() => {
                          setSelectedBudget(budget)
                          setShowBudget(false)
                        }}
                      >
                        {budget}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="primary"
                  size="large"
                  onClick={() =>
                    router.push(`/properties_list/explore_by_category?location=${location}&type=${selectedType?.name}&budget=${selectedBudget}`)
                  }
                  icon={<Search className="w-5 h-5" />}
                  className="flex items-center gap-2 bg-black text-white px-7 py-3 rounded-xl hover:bg-gray-800 transition"
                >
                  {t('Hero.HeroMenu.search')}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
