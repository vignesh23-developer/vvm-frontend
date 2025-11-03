'use client'

import { useRouter } from 'next/navigation'
import { MapPin, Home, ChevronDown, IndianRupee, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'

export default function HeroSection() {
  const t = useTranslations()
  const router = useRouter()

  const tabKeys: string[] = [
    'buy',
    'rent',
    'lease',
    // 'commercial',
  ]

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

  return (
    <main className="relative min-h-[80vh] sm:min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('/hero.png')" }}>
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
        {/* Motion Container */}
        <motion.div
          className="w-full max-w-4xl mx-auto rounded-3xl bg-black/50 text-white px-4 py-6 sm:px-8 sm:py-10 text-center"
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
              {tabKeys.map((tab, idx) => (
                <motion.button
                  key={tab}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    idx === 0 ? 'bg-yellow-400 text-black' : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {t(`Hero.HeroMenu.${tab}`)}
                </motion.button>
              ))}
            </div>

            {/* Desktop Tabs */}
            <div className="hidden sm:flex flex-wrap justify-evenly gap-3 sm:gap-5 lg:gap-6 mb-6 sm:mb-10 text-sm sm:text-lg font-medium">
              {tabKeys.map((tab, idx) => (
                <motion.div
                  key={tab}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, color: '#facc15' }} // yellow-400
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="tertiary"
                    size="small"
                    className={`${idx === 0 ? 'text-yellow-400 border-b-2 border-yellow-400 pb-1' : 'hover:text-yellow-400 transition'}`}
                    onClick={() => {
                      router.push('/properties_list/explore_by_category')
                    }}
                  >
                    {t(`Hero.HeroMenu.${tab}`)}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            variants={itemVariants}
            className="bg-white text-black rounded-2xl px-3 py-4 sm:px-2 sm:py-2 shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Mobile stacked */}
            <div className="flex flex-col gap-3 sm:hidden">
              {/* Location */}
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Chennai</span>
                </div>
                <span className="text-gray-500 text-sm">{t('Hero.HeroMenu.add_more')}</span>
              </motion.div>

              {/* Property Type */}
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Home className="w-5 h-5" />
                  <span className="font-medium">{t('Hero.HeroMenu.flat')} +1</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.div>

              {/* Budget */}
              <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-5 h-5" />
                  <span className="font-medium">{t('Hero.HeroMenu.budget')}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </motion.div>

              {/* Search button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-medium"
              >
                <Search className="w-5 h-5" />
                <span>{t('Hero.HeroMenu.search')}</span>
              </motion.button>
            </div>

            {/* Desktop inline */}
            <div className="hidden sm:flex sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 flex-1 min-w-[140px] justify-center sm:justify-start">
                <MapPin className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">Chennai</span>
                <span className="text-gray-500 hidden sm:inline text-sm">{t('Hero.HeroMenu.add_more')}</span>
              </div>

              <div className="flex items-center space-x-2 flex-1 min-w-[140px] justify-center sm:justify-start">
                <Home className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">{t('Hero.HeroMenu.flat')} +1</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>

              <div className="flex items-center space-x-2 flex-1 min-w-[140px] justify-center sm:justify-start">
                <IndianRupee className="w-5 h-5" />
                <span className="font-medium text-sm sm:text-base">{t('Hero.HeroMenu.budget')}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="primary"
                  size="large"
                  onClick={() => router.push('/properties_list/explore_by_category')}
                  icon={<Search className="w-5 h-5" />}
                  className="flex items-center justify-center gap-2 bg-black text-white px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl hover:bg-gray-800 transition w-full sm:w-auto text-sm sm:text-base"
                >
                  <span>{t('Hero.HeroMenu.search')}</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
