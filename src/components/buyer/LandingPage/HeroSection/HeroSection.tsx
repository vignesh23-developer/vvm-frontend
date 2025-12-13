'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { MapPin, Home, ChevronDown, IndianRupee, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, Variants } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { usePropertyCategories } from '@/app/admin/dashboard/(master)/property-category/(hooks)/usePropertyCategories'
import LucideIconRenderer from '@/components/ui/CustomComponent/LucideIconRenderer/LucideIconRenderer'
import { useExploreProperties } from '../ExploreProperties/hooks/useExploreProperties'

export default function HeroSection() {
  const t = useTranslations()
  const router = useRouter()
  const [isHeroLoading, setIsHeroLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('sale')
  const [showBudget, setShowBudget] = useState(false)
  const [showType, setShowType] = useState(false)
  const [locationQuery, setLocationQuery] = useState('')
  const [debouncedLocationQuery, setDebouncedLocationQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
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
  const { items } = useExploreProperties({ limit: 1, page: 60 })
  const tabKeys: string[] = ['sale', 'rent', 'lease']

  interface PropertyItem {
    district: string
    [key: string]: unknown
  }

  interface UniqueDistrict extends String {
    [Symbol.toStringTag]: 'String'
  }

  const availableDistricts: string[] = useMemo(() => {
    if (!Array.isArray(items)) return []
    const names = items.map((item: PropertyItem) => (item?.district || '').toString().trim()).filter(Boolean)

    return Array.from(new Set(names))
  }, [items])

  const locationSuggestions = useMemo(() => {
    if (!availableDistricts.length) return []
    if (!debouncedLocationQuery) return availableDistricts.slice(0, 8)
    const lowered = debouncedLocationQuery.toLowerCase()
    return availableDistricts.filter(name => name.toLowerCase().includes(lowered)).slice(0, 8)
  }, [availableDistricts, debouncedLocationQuery])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedLocationQuery(locationQuery.trim())
    }, 250)

    return () => clearTimeout(handler)
  }, [locationQuery])

  const handleSuggestionSelect = (name: string, setFieldValue: (field: string, value: unknown) => void) => {
    setLocationQuery(name)
    setFieldValue('location', name)
    setShowSuggestions(false)
  }

  // Background carousel images (external URLs)
  const heroImages = [
    // Your existing 3 working images
    'https://www.roofandfloor.com/project/7124/gallery/Coco_Enclave_1.jpg',
    'https://drahomes.in/images/dra-polaris.jpg',
    'https://images.homify.com/v1511876426/p/photo/image/2339212/vijay-_15-_mycut.jpg',

    // 100% WORKING, HOTLINK-SAFE IMAGES
    'https://images.unsplash.com/photo-1598928506311-ad9a6f66a6c1?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599423300746-b62533397364?q=80&w=1920&auto=format&fit=crop',
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

  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 100000000])
  const budgetMin = 0
  const budgetMax = 100000000

  const formatBudgetDisplay = (min: number, max: number) => {
    if (min === budgetMin && max === budgetMax) return t('Hero.HeroMenu.budget')
    if (min === budgetMin) return `Up to ₹${(max / 100000).toFixed(0)} Lakhs`
    if (max === budgetMax) return `Above ₹${(min / 100000).toFixed(0)} Lakhs`
    return `₹${(min / 100000).toFixed(0)} - ₹${(max / 100000).toFixed(0)} Lakhs`
  }

  const handleSearch = (values: SearchParams) => {
    // const typeName = categories?.find(c => String(c.id) === String(values.type))?.name ?? ''
    // const typeName = categories?.find(c => String(c.id) === String(values.type))?.name ?? ''
    const queryParams = new URLSearchParams({
      location: encodeURIComponent(values.location || ''),
      listingType: encodeURIComponent(currentTab.toUpperCase() || ''),
      type: encodeURIComponent(values.type ? String(values.type) : ''),
      budget: encodeURIComponent(values.budget || ''),
    })
    router.push(`/properties-list?${queryParams.toString()}`)
  }

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
      <div className="absolute inset-0 group">
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

        {/* Carousel Arrows */}
        <button
          onClick={() => setActiveBgIndex(prev => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40  hover:bg-white/90 text-white/90 hover:text-white hover:bg-black/60 hover:text-white transition-all backdrop-blur-sm shadow-lg border border-white/20"
          aria-label="Previous Slide"
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 rotate-90" />
        </button>
        <button
          onClick={() => setActiveBgIndex(prev => (prev + 1) % heroImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 text-white/90 hover:bg-black/60 hover:text-white transition-all backdrop-blur-sm shadow-lg border border-white/20"
          aria-label="Next Slide"
        >
          <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 -rotate-90" />
        </button>

        {/* Carousel Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveBgIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${activeBgIndex === idx ? 'w-8 bg-yellow-400' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center px-4 py-8 min-h-[80vh] sm:min-h-screen">
        <motion.div
          className="w-full max-w-4xl mx-auto rounded-3xl bg-[#2a1407]/80 text-white px-4 py-6 sm:px-8 sm:py-10 text-center border border-yellow-300/40 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
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
                    currentTab === tab ? 'bg-yellow-400 text-[#2a1407]' : 'bg-white/10 hover:bg-white/20'
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
                    className={`pb-1 transition ${
                      currentTab === tab ? 'text-yellow-300 border-b-2 border-yellow-300' : 'text-white/80 hover:text-yellow-200'
                    }`}
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
              location: Yup.string().trim().min(3, 'Please enter at least 3 characters').required('Please enter a location'),
            })}
            onSubmit={values => handleSearch(values)}
          >
            {({ values, setFieldValue, handleSubmit, handleBlur, errors, touched, isSubmitting }) => (
              <motion.div variants={itemVariants} className="bg-white text-black rounded-2xl px-3 py-4 sm:px-2 sm:py-2 shadow-lg relative">
                {/* -------------- Mobile UI -------------- */}
                <div className="flex flex-col gap-3 sm:hidden">
                  {/* Location */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-3 rounded-lg transition ${
                      touched.location && errors.location ? 'border border-red-500 bg-red-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <MapPin
                        className={`w-5 h-5 
        ${touched.location && errors.location ? 'text-red-600' : 'text-gray-600'}
      `}
                      />

                      <input
                        name="location"
                        type="text"
                        value={locationQuery}
                        onChange={e => {
                          setLocationQuery(e.target.value)
                          setFieldValue('location', e.target.value)
                          setShowSuggestions(true)
                          setShowBudget(false)
                          setShowType(false)
                        }}
                        onBlur={event => {
                          handleBlur(event)
                          setTimeout(() => setShowSuggestions(false), 150)
                        }}
                        onFocus={() => {
                          setShowSuggestions(true)
                          setShowBudget(false)
                          setShowType(false)
                        }}
                        placeholder="Enter location"
                        aria-invalid={Boolean(touched.location && errors.location)}
                        aria-describedby={touched.location && errors.location ? 'location-error-mobile' : undefined}
                        className={`w-full bg-transparent outline-none font-medium placeholder-gray-400
        ${touched.location && errors.location ? 'text-red-700' : 'text-black'}
      `}
                      />
                    </div>

                    {/* Error Message */}
                    {touched.location && errors.location && (
                      <p id="location-error-mobile" className="text-red-600 text-xs mt-2 ml-7 leading-tight">
                        {errors.location}
                      </p>
                    )}

                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
                        {locationSuggestions.map(name => (
                          <button
                            type="button"
                            key={name}
                            onMouseDown={event => {
                              event.preventDefault()
                              handleSuggestionSelect(name, setFieldValue)
                            }}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Property Type Select */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    onClick={() => {
                      setShowType(!showType)
                      setShowBudget(false)
                      setShowSuggestions(false)
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

                  {/* Budget Range Input */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    onClick={e => {
                      e.stopPropagation()
                      setShowBudget(!showBudget)
                      setShowType(false)
                      setShowSuggestions(false)
                    }}
                  >
                    <div className="flex items-center space-x-2 flex-1">
                      <IndianRupee className="w-5 h-5" />
                      <span className="font-medium">{formatBudgetDisplay(budgetRange[0], budgetRange[1])}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />

                    {/* Range Input Dropdown */}
                    {showBudget && (
                      <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-md z-20 p-4" onClick={e => e.stopPropagation()}>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span>₹{(budgetRange[0] / 100000).toFixed(0)} Lakhs</span>
                            <span>₹{(budgetRange[1] / 100000).toFixed(0)} Lakhs</span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min={budgetMin}
                              max={budgetMax}
                              value={budgetRange[0]}
                              onChange={e => {
                                const newMin = Number(e.target.value)
                                if (newMin < budgetRange[1]) {
                                  setBudgetRange([newMin, budgetRange[1]])
                                  setFieldValue('budget', `${newMin}-${budgetRange[1]}`)
                                }
                              }}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2a1407]"
                              style={{
                                background: `linear-gradient(to right, #2a1407 0%, #2a1407 ${
                                  ((budgetRange[0] - budgetMin) / (budgetMax - budgetMin)) * 100
                                }%, #e5e7eb ${((budgetRange[0] - budgetMin) / (budgetMax - budgetMin)) * 100}%, #e5e7eb 100%)`,
                              }}
                            />
                            <input
                              type="range"
                              min={budgetMin}
                              max={budgetMax}
                              value={budgetRange[1]}
                              onChange={e => {
                                const newMax = Number(e.target.value)
                                if (newMax > budgetRange[0]) {
                                  setBudgetRange([budgetRange[0], newMax])
                                  setFieldValue('budget', `${budgetRange[0]}-${newMax}`)
                                }
                              }}
                              className="absolute top-0 w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-[#2a1407]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setBudgetRange([budgetMin, budgetMax])
                                setFieldValue('budget', '')
                                setShowBudget(false)
                              }}
                              className="flex-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowBudget(false)}
                              className="flex-1 px-3 py-1.5 text-xs bg-[#2a1407] text-white rounded-md hover:bg-[#2a1407] transition"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
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
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-3 rounded-lg transition ${
                      touched.location && errors.location ? 'border border-red-500 bg-red-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <MapPin
                        className={`w-5 h-5 
        ${touched.location && errors.location ? 'text-red-600' : 'text-gray-600'}
      `}
                      />

                      <input
                        name="location"
                        type="text"
                        value={locationQuery}
                        onChange={e => {
                          setLocationQuery(e.target.value)
                          setFieldValue('location', e.target.value)
                          setShowSuggestions(true)
                          setShowBudget(false)
                          setShowType(false)
                        }}
                        onBlur={event => {
                          handleBlur(event)
                          setTimeout(() => setShowSuggestions(false), 150)
                        }}
                        onFocus={() => {
                          setShowSuggestions(true)
                          setShowBudget(false)
                          setShowType(false)
                        }}
                        placeholder="Enter location"
                        aria-invalid={Boolean(touched.location && errors.location)}
                        aria-describedby={touched.location && errors.location ? 'location-error-mobile' : undefined}
                        className={`w-full bg-transparent outline-none font-medium placeholder-gray-400
        ${touched.location && errors.location ? 'text-red-700' : 'text-black'}
      `}
                      />
                    </div>

                    {/* Error Message */}
                    {touched.location && errors.location && (
                      <p id="location-error-mobile" className="text-red-600 text-xs mt-2 leading-tight">
                        {errors.location}
                      </p>
                    )}

                    {showSuggestions && locationSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl">
                        {locationSuggestions.map(name => (
                          <button
                            type="button"
                            key={name}
                            onMouseDown={event => {
                              event.preventDefault()
                              handleSuggestionSelect(name, setFieldValue)
                            }}
                            className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>

                  {/* Property Type */}
                  <div
                    className="flex items-center space-x-2 flex-1 min-w-[140px] relative cursor-pointer"
                    onClick={() => {
                      setShowType(!showType)
                      setShowBudget(false)
                      setShowSuggestions(false)
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

                  {/* Budget Range Input */}
                  <div
                    className="flex items-center space-x-2 flex-1 min-w-[140px] relative cursor-pointer"
                    onClick={e => {
                      e.stopPropagation()
                      setShowBudget(!showBudget)
                      setShowType(false)
                      setShowSuggestions(false)
                    }}
                  >
                    <IndianRupee className="w-5 h-5" />
                    <span className="font-medium">{formatBudgetDisplay(budgetRange[0], budgetRange[1])}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />

                    {showBudget && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-md z-20 p-4" onClick={e => e.stopPropagation()}>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span>₹{(budgetRange[0] / 100000).toFixed(0)} Lakhs</span>
                            <span>₹{(budgetRange[1] / 100000).toFixed(0)} Lakhs</span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min={budgetMin}
                              max={budgetMax}
                              value={budgetRange[0]}
                              onChange={e => {
                                const newMin = Number(e.target.value)
                                if (newMin < budgetRange[1]) {
                                  setBudgetRange([newMin, budgetRange[1]])
                                  setFieldValue('budget', `${newMin}-${budgetRange[1]}`)
                                }
                              }}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2a1407]"
                              style={{
                                background: `linear-gradient(to right, #2a1407 0%, #2a1407 ${
                                  ((budgetRange[0] - budgetMin) / (budgetMax - budgetMin)) * 100
                                }%, #e5e7eb ${((budgetRange[0] - budgetMin) / (budgetMax - budgetMin)) * 100}%, #e5e7eb 100%)`,
                              }}
                            />
                            <input
                              type="range"
                              min={budgetMin}
                              max={budgetMax}
                              value={budgetRange[1]}
                              onChange={e => {
                                const newMax = Number(e.target.value)
                                if (newMax > budgetRange[0]) {
                                  setBudgetRange([budgetRange[0], newMax])
                                  setFieldValue('budget', `${budgetRange[0]}-${newMax}`)
                                }
                              }}
                              className="absolute top-0 w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-[#2a1407]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setBudgetRange([budgetMin, budgetMax])
                                setFieldValue('budget', '')
                                setShowBudget(false)
                              }}
                              className="flex-1 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowBudget(false)}
                              className="flex-1 px-3 py-1.5 text-xs bg-[#2a1407] text-white rounded-md hover:bg-[#2a1407] transition"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
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
