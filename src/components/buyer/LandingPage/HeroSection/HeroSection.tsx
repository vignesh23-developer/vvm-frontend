'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { MapPin, Home, ChevronDown, IndianRupee, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { usePropertyCategories } from '@/app/admin/dashboard/(master)/property-category/(hooks)/usePropertyCategories'
import LucideIconRenderer from '@/components/ui/CustomComponent/LucideIconRenderer/LucideIconRenderer'

export default function HeroSection() {
  const t = useTranslations()
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('sale')
  const [showBudget, setShowBudget] = useState(false)
  const [showType, setShowType] = useState(false)
  // Lightweight category shape used in this component
  interface Category {
    id: string | number
    name: string
    icon?: string
  }
  interface SearchParams {
    location?: string
    listingType?: string
    type?: string | number
    budget?: string
  }

  const [selectedType, setSelectedType] = useState<Category | null>(null)
  const { categories, error, isLoading, mutateCategories } = usePropertyCategories()
  const tabKeys: string[] = ['sale', 'rent', 'lease']

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
  const handleSearch = (values: SearchParams) => {
    // const typeName = categories?.find(c => String(c.id) === String(values.type))?.name ?? ''
    const queryParams = new URLSearchParams({
      location: encodeURIComponent(values.location || ''),
      type: encodeURIComponent(values.type ? String(values.type) : ''),
      listingType: currentTab.toUpperCase(),
      budget: encodeURIComponent(values.budget || ''),
    })
    router.push(`/properties-list?${queryParams.toString()}`)
  }
  return (
    <main className="relative min-h-[80vh] sm:min-h-screen w-full bg-cover bg-center" style={{ backgroundImage: "url('/hero.png')" }}>
      <div className="absolute inset-0 flex items-center justify-center px-4 py-8">
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
              {tabKeys.map(tab => (
                <motion.button
                  key={tab}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentTab(tab)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    currentTab === tab ? 'bg-yellow-400 text-black' : 'bg-white/20 hover:bg-white/30'
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
                    className={`pb-1 ${currentTab === tab ? 'text-yellow-400 border-b-2 border-yellow-400' : 'hover:text-yellow-400 transition'}`}
                    onClick={() => setCurrentTab(tab)}
                  >
                    {t(`Hero.HeroMenu.${tab}`)}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Search Bar (Formik) */}
          <Formik
            initialValues={{ location: '', type: '', budget: '' }}
            validationSchema={Yup.object({
              location: Yup.string().trim().required('Location is required'),
            })}
            onSubmit={values => handleSearch(values)}
          >
            {({ values, setFieldValue, handleSubmit, errors, touched, handleBlur }) => (
              <motion.div variants={itemVariants} className="bg-white text-black rounded-2xl px-3 py-4 sm:px-2 sm:py-2 shadow-lg relative">
                {/* -------------- Mobile UI -------------- */}
                <div className="flex flex-col gap-3 sm:hidden">
                  {/* Location */}
                  <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <MapPin className="w-5 h-5 text-gray-600" />

                      <input
                        name="location"
                        type="text"
                        value={values.location}
                        onChange={e => setFieldValue('location', e.target.value)}
                        onBlur={handleBlur}
                        placeholder="Enter location"
                        className="bg-transparent outline-none font-medium text-black placeholder-gray-400 w-full"
                      />
                      {touched.location && errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
                    </div>
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
                      {categories && values.type && (
                        <LucideIconRenderer
                          iconName={categories.find(c => String(c.id) === String(values.type))?.icon as any}
                          className="w-5 h-5 text-gray-700"
                        />
                      )}

                      <span className="font-medium">
                        {categories && values.type ? categories.find(c => String(c.id) === String(values.type))?.name : t('Hero.HeroMenu.flat')}
                      </span>
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
                              setFieldValue('type', item.id)
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
                      <span className="font-medium">{values.budget || t('Hero.HeroMenu.budget')}</span>
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
                              setFieldValue('budget', budget)
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
                    disabled={!values.location || (!!touched.location && !!errors.location)}
                    onClick={() => handleSubmit()}
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
                      name="location"
                      type="text"
                      placeholder="Enter location"
                      value={values.location}
                      onChange={e => setFieldValue('location', e.target.value)}
                      onBlur={handleBlur}
                      className="bg-transparent outline-none font-medium w-full placeholder:text-gray-400"
                    />
                    {touched.location && errors.location && <div className="text-red-500 text-sm mt-1">{errors.location}</div>}
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
                      {categories && values.type && (
                        <LucideIconRenderer iconName={categories.find(c => String(c.id) === String(values.type))?.icon as any} />
                      )}
                      {categories && values.type ? categories.find(c => String(c.id) === String(values.type))?.name : t('Hero.HeroMenu.flat')}
                    </span>

                    <ChevronDown className="w-4 h-4 text-gray-500" />

                    {showType && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-md z-20 p-2">
                        {categories?.map(item => (
                          <div
                            key={item.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                            onClick={() => {
                              setFieldValue('type', item.id)
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
                    <span className="font-medium">{values.budget || t('Hero.HeroMenu.budget')}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />

                    {showBudget && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-md z-20 p-2">
                        {budgetOptions.map(budget => (
                          <div
                            key={budget}
                            className="p-2 hover:bg-gray-100 cursor-pointer rounded-md text-sm"
                            onClick={() => {
                              setFieldValue('budget', budget)
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
                      onClick={() => handleSubmit()}
                      icon={<Search className="w-5 h-5" />}
                      className="flex items-center gap-2 bg-black text-white px-7 py-3 rounded-xl hover:bg-gray-800 transition"
                      disabled={!values.location || (!!touched.location && !!errors.location)}
                    >
                      {t('Hero.HeroMenu.search')}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </Formik>
        </motion.div>
      </div>
    </main>
  )
}
