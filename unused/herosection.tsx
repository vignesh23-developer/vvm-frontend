'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Formik } from 'formik'
import * as Yup from 'yup'
import {
  MapPin,
  Home,
  ChevronDown,
  IndianRupee,
  Search,
  CheckCircle2,
  Shield,
  Users,
  Award,
  Building2,
  Store,
  LandPlot,
  TreePine,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Gift,
  Sparkles,
  Star,
  Target,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'
import { usePropertyCategories } from '@/app/admin/dashboard/(master)/property-category/(hooks)/usePropertyCategories'
import LucideIconRenderer from '@/components/ui/CustomComponent/LucideIconRenderer/LucideIconRenderer'
import Image from 'next/image'

export default function HeroSection() {
  const t = useTranslations()
  const router = useRouter()
  const [isHeroLoading, setIsHeroLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('sale')
  const [showBudget, setShowBudget] = useState(false)
  const [showType, setShowType] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const { isPageLoading } = useGlobalContext()

  // Static welcome text
  const staticWelcome = 'Welcome'

  // Rotating taglines (these change one by one)
  const rotatingTaglines = [
    'Back, Choose Premium House',
    "to Tamil Nadu's Trusted Real Estate Digital Platform",
    ', Find Verified Properties, Agents & Rentals in One Click',
    ', Your Property Journey Starts Here — Safe, Simple, Smart',
  ]
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0)

  // Rotate taglines every 5 seconds
  useEffect(() => {
    const taglineInterval = setInterval(() => {
      setCurrentTaglineIndex(prev => (prev + 1) % rotatingTaglines.length)
    }, 5000)
    return () => clearInterval(taglineInterval)
  }, [])

  // Hero Banner Slides - Shows Offers, Benefits, Features, Promises, Logo and Tagline
  // Note: Images will be provided by user - using placeholder paths for now
  const heroSlides = [
    {
      id: 1,
      type: 'offers',
      title: 'Exclusive Offers',
      description: 'Special discounts and deals on premium properties',
      image: '/hero-slides/offers.jpg', // User will provide this image
      icon: Gift,
    },
    {
      id: 2,
      type: 'benefits',
      title: 'Why Choose Us',
      description: '100% verified listings • Local expert agents • Zero brokerage options',
      image: '/hero-slides/benefits.jpg', // User will provide this image
      icon: Star,
    },
    {
      id: 3,
      type: 'features',
      title: 'Our Features',
      description: 'Advanced search, virtual tours, instant notifications, and more',
      image: '/hero-slides/features.jpg', // User will provide this image
      icon: Sparkles,
    },
    {
      id: 4,
      type: 'promises',
      title: 'Our Promise',
      description: 'Safe, Simple, Smart - Your trusted real estate partner',
      image: '/hero-slides/promises.jpg', // User will provide this image
      icon: Target,
    },
    {
      id: 5,
      type: 'logo',
      title: 'Vaazhga Valamudan',
      description: "Tamil Nadu's Trusted Real Estate Digital Platform",
      image: '/hero-slides/logo.jpg', // User will provide this image
      icon: Award,
    },
  ]

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(slideInterval)
  }, [])

  // Taglines/Value propositions
  const taglines = [
    "Tamil Nadu's Trusted Real Estate Digital Platform",
    'Find Verified Properties, Agents & Rentals in One Click',
    'Your Property Journey Starts Here — Safe, Simple, Smart',
  ]

  // Trust elements
  const trustElements = [
    { icon: CheckCircle2, text: 'Over 10,000 verified listings' },
    { icon: Users, text: 'Verified agents across Tamil Nadu' },
    { icon: Shield, text: 'Secure & transparent platform' },
    { icon: Award, text: 'Award-winning service' },
  ]

  // Quick links / Property categories
  const quickLinks = [
    { icon: Building2, label: 'Apartments', href: '/properties-list?type=apartment' },
    { icon: Home, label: 'Individual Houses', href: '/properties-list?type=house' },
    { icon: Store, label: 'Commercial Spaces', href: '/properties-list?type=commercial' },
    { icon: LandPlot, label: 'Plots', href: '/properties-list?type=plot' },
    { icon: TreePine, label: 'Agri Land', href: '/properties-list?type=agricultural' },
    { icon: TreePine, label: 'Farm Land', href: '/properties-list?type=farm' },
  ]
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
      <main className="relative w-full overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
        {/* Hero Banner Carousel - Shows Offers, Benefits, Features, Promises, Logo */}
        <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
          {/* Background Images */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-[#2a1407]/50 to-black/60" />
          </div>

          {/* Banner Slides Carousel */}
          <div className="relative z-10 h-full flex items-center justify-center px-4">
            <div className="max-w-7xl mx-auto w-full">
              <AnimatePresence mode="wait">
                {heroSlides.map((slide, index) => {
                  if (index !== currentSlideIndex) return null
                  const Icon = slide.icon
                  return (
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={!isPageLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="text-center text-white relative"
                    >
                      {/* Slide Background Image (if provided) - will be used when images are uploaded */}
                      {slide.image && (
                        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url('${slide.image}')` }}
                          />
                        </div>
                      )}
                      <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30 flex items-center justify-center">
                          <Icon size={40} className="text-yellow-300" />
                        </div>
                      </div>
                      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{slide.title}</h2>
                      <p className="text-lg sm:text-xl text-yellow-100 max-w-2xl mx-auto">{slide.description}</p>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {/* Carousel Navigation Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all ${idx === currentSlideIndex ? 'w-8 bg-yellow-400' : 'w-2 bg-white/50'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Carousel Navigation Arrows */}
              <button
                onClick={() => setCurrentSlideIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition flex items-center justify-center"
                aria-label="Previous slide"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition flex items-center justify-center"
                aria-label="Next slide"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="relative -mt-20 z-20 px-4 pb-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="w-full bg-white rounded-3xl shadow-xl border border-yellow-200/50 px-4 py-6 sm:px-8 sm:py-10"
              variants={containerVariants}
              initial="hidden"
              animate={!isPageLoading ? "visible" : "hidden"}
            >
              {/* Welcome Text - Static "Welcome" with Rotating Taglines */}
              <motion.div variants={itemVariants} className="text-center mb-6">
                <h1 className="text-3xl sm:text-4xl  font-bold text-[#2a1407] mb-2">
                  <span className="text-yellow-600">{staticWelcome}</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentTaglineIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="ml-2"
                    >
                      {rotatingTaglines[currentTaglineIndex]}
                    </motion.span>
                  </AnimatePresence>
                </h1>

                {/* SEO H1 */}
                <h1 className="sr-only">Find Properties for Sale in Tamil Nadu</h1>

                {/* Tagline */}
                <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-700 mb-2">
                  {taglines[0]}
                </motion.p>

                {/* SEO H2 */}
                <h2 className="sr-only">Buy, Rent & Lease Verified Homes</h2>

                {/* Sub-headline */}
                <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-600 mb-6">
                  100% verified listings • Local expert agents • Zero brokerage options
                </motion.p>
              </motion.div>

              {/* Tabs Section */}
              <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                {/* Mobile Tabs */}
                <div className="grid grid-cols-3 gap-3 mb-6 sm:hidden">
                  {tabKeys.map(tab => (
                    <motion.button
                      key={tab}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentTab(tab)}
                      className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition ${currentTab === tab
                        ? 'bg-yellow-400 text-[#2a1407] shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                    >
                      {t(`Hero.HeroMenu.${tab}`)}
                    </motion.button>
                  ))}
                </div>

                {/* Desktop Tabs */}
                <div className="hidden sm:flex flex-wrap justify-center gap-4 mb-6">
                  {tabKeys.map(tab => (
                    <motion.div key={tab} variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="button"
                        variant="tertiary"
                        size="small"
                        className={`px-6 py-2.5 rounded-lg font-semibold transition ${currentTab === tab
                          ? 'bg-yellow-400 text-[#2a1407] shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
                        className={`p-3 rounded-lg transition 
    ${touched.location && errors.location && 'border-red-500 bg-red-50'}
  `}
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
                            value={values.location}
                            onChange={e => setFieldValue('location', e.target.value)}
                            onBlur={handleBlur}
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

                      {/* Budget Range Input */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        onClick={e => {
                          e.stopPropagation()
                          setShowBudget(!showBudget)
                          setShowType(false)
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
                                    background: `linear-gradient(to right, #2a1407 0%, #2a1407 ${((budgetRange[0] - budgetMin) / (budgetMax - budgetMin)) * 100
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
                        className={`p-3 rounded-lg transition 
    ${touched.location && errors.location && 'border-red-500 bg-red-50'}
  `}
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
                            value={values.location}
                            onChange={e => setFieldValue('location', e.target.value)}
                            onBlur={handleBlur}
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
                      </motion.div>

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

                      {/* Budget Range Input */}
                      <div
                        className="flex items-center space-x-2 flex-1 min-w-[140px] relative cursor-pointer"
                        onClick={e => {
                          e.stopPropagation()
                          setShowBudget(!showBudget)
                          setShowType(false)
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
                                    background: `linear-gradient(to right, #2a1407 0%, #2a1407 ${((budgetRange[0] - budgetMin) / (budgetMax - budgetMin)) * 100
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

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mt-6 mb-6">
                <Button
                  type="button"
                  onClick={() => router.push('/post-property')}
                  className="bg-yellow-400 text-[#2a1407] px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-300 transition shadow-lg"
                >
                  Post Your Property
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push('/become-agent')}
                  className="bg-[#2a1407] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#2a1407] transition shadow-lg"
                >
                  Become an Agent
                </Button>
              </motion.div>

              {/* Trust Elements */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {trustElements.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex flex-col items-center gap-2 text-center p-3 rounded-xl bg-yellow-50/50 border border-yellow-200"
                    >
                      <Icon size={24} className="text-yellow-600 mb-1" />
                      <span className="text-xs sm:text-sm text-gray-700 font-medium">{item.text}</span>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick Links / Property Categories - Below Hero */}
        <section className="relative z-10 -mt-8 mb-8 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="bg-white rounded-2xl shadow-xl border border-yellow-200/50 p-4 sm:p-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <motion.h3 variants={itemVariants} className="text-center text-sm font-semibold text-gray-700 mb-4">Quick Explore</motion.h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
                {quickLinks.map((link, idx) => {
                  const Icon = link.icon
                  return (
                    <motion.a
                      key={idx}
                      href={link.href}
                      variants={itemVariants}
                      whileHover={{ scale: 1.1, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 hover:border-yellow-400 transition cursor-pointer group"
                    >
                      <Icon size={24} className="text-yellow-600 group-hover:text-yellow-700" />
                      <span className="text-xs font-medium text-gray-700 text-center">{link.label}</span>
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    )
  }
  return (
    <main className="relative w-full overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
      {/* Hero Banner Carousel - Shows Offers, Benefits, Features, Promises, Logo */}
      <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
        {/* Background Images */}
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
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-[#2a1407]/50 to-black/60" />
        </div>

        {/* Banner Slides Carousel */}
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-7xl mx-auto w-full">
            <AnimatePresence>
              {heroSlides.map((slide, index) => {
                if (index !== currentSlideIndex) return null
                const Icon = slide.icon
                return (
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={!isPageLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="text-center text-white relative"
                  >
                    {/* Slide Background Image (if provided) - will be used when images are uploaded */}
                    {slide.image && (
                      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${slide.image}')` }} />
                      </div>
                    )}
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 rounded-full bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30 flex items-center justify-center">
                        <Icon size={40} className="text-yellow-300" />
                      </div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">{slide.title}</h2>
                    <p className="text-lg sm:text-xl text-yellow-100 max-w-2xl mx-auto">{slide.description}</p>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Carousel Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all ${idx === currentSlideIndex ? 'w-8 bg-yellow-400' : 'w-2 bg-white/50'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Carousel Navigation Arrows */}
            <button
              onClick={() => setCurrentSlideIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition flex items-center justify-center"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setCurrentSlideIndex(prev => (prev + 1) % heroSlides.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 transition flex items-center justify-center"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative -mt-20 z-20 px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="w-full bg-white rounded-3xl shadow-xl border border-yellow-200/50 px-4 py-6 sm:px-8 sm:py-10"
            variants={containerVariants}
            initial="hidden"
            animate={!isPageLoading ? 'visible' : 'hidden'}
          >
            {/* Welcome Text - Static "Welcome" with Rotating Taglines */}
            <motion.div variants={itemVariants} className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl  font-bold text-[#2a1407] mb-2">
                <span className="text-yellow-600">{staticWelcome}</span>
                <AnimatePresence>
                  <motion.span
                    key={currentTaglineIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5 }}
                    className="ml-2"
                  >
                    {rotatingTaglines[currentTaglineIndex]}
                  </motion.span>
                </AnimatePresence>
              </h1>

              {/* SEO H1 */}
              <h1 className="sr-only">Find Properties for Sale in Tamil Nadu</h1>

              {/* Tagline */}
              <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-700 mb-2">
                {taglines[0]}
              </motion.p>

              {/* SEO H2 */}
              <h2 className="sr-only">Buy, Rent & Lease Verified Homes</h2>

              {/* Sub-headline */}
              <motion.p variants={itemVariants} className="text-sm sm:text-base text-gray-600 mb-6">
                100% verified listings • Local expert agents • Zero brokerage options
              </motion.p>
            </motion.div>

            {/* Tabs Section */}
            <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
              {/* Mobile Tabs */}
              <div className="grid grid-cols-3 gap-3 mb-6 sm:hidden">
                {tabKeys.map(tab => (
                  <motion.button
                    key={tab}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentTab(tab)}
                    className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition ${currentTab === tab
                        ? 'bg-yellow-400 text-[#2a1407] shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                  >
                    {t(`Hero.HeroMenu.${tab}`)}
                  </motion.button>
                ))}
              </div>

              {/* Desktop Tabs */}
              <div className="hidden sm:flex flex-wrap justify-center gap-4 mb-6">
                {tabKeys.map(tab => (
                  <motion.div key={tab} variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      variant="tertiary"
                      size="small"
                      className={`px-6 py-2.5 rounded-lg font-semibold transition ${currentTab === tab
                          ? 'bg-yellow-400 text-[#2a1407] shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
                      className={`p-3 rounded-lg transition 
    ${touched.location && errors.location && 'border-red-500 bg-red-50'}
  `}
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
                          value={values.location}
                          onChange={e => setFieldValue('location', e.target.value)}
                          onBlur={handleBlur}
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

                    {/* Budget Range Input */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      onClick={e => {
                        e.stopPropagation()
                        setShowBudget(!showBudget)
                        setShowType(false)
                      }}
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <IndianRupee className="w-5 h-5" />
                        <span className="font-medium">{formatBudgetDisplay(budgetRange[0], budgetRange[1])}</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />

                      {/* Range Input Dropdown */}
                      {showBudget && (
                        <div
                          className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-md z-20 p-4"
                          onClick={e => e.stopPropagation()}
                        >
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
                                  background: `linear-gradient(to right, #2a1407 0%, #2a1407 ${((budgetRange[0] - budgetMin) / (budgetMax - budgetMin)) * 100
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
                                className="flex-1 px-3 py-1.5 text-xs bg-[#2a1407] text-white rounded-md hover:bg-[#3b1804] transition"
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
                      className={`p-3 rounded-lg transition 
    ${touched.location && errors.location && 'border-red-500 bg-red-50'}
  `}
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
                          value={values.location}
                          onChange={e => setFieldValue('location', e.target.value)}
                          onBlur={handleBlur}
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
                    </motion.div>

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

                    {/* Budget Range Input */}
                    <div
                      className="flex items-center space-x-2 flex-1 min-w-[140px] relative cursor-pointer"
                      onClick={e => {
                        e.stopPropagation()
                        setShowBudget(!showBudget)
                        setShowType(false)
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
                                  background: `linear-gradient(to right, #2a1407 0%, #2a1407 ${((budgetRange[0] - budgetMin) / (budgetMax - budgetMin)) * 100
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
                                className="flex-1 px-3 py-1.5 text-xs bg-[#2a1407] text-white rounded-md hover:bg-[#3b1804] transition"
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

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mt-6 mb-6">
              <Button
                type="button"
                onClick={() => router.push('/post-property')}
                className="bg-yellow-400 text-[#2a1407] px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-300 transition shadow-lg"
              >
                Post Your Property
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/become-agent')}
                className="bg-[#2a1407] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#3b1804] transition shadow-lg"
              >
                Become an Agent
              </Button>
            </motion.div>

            {/* Trust Elements */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {trustElements.map((item, idx) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center gap-2 text-center p-3 rounded-xl bg-yellow-50/50 border border-yellow-200"
                  >
                    <Icon size={24} className="text-yellow-600 mb-1" />
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">{item.text}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links / Property Categories - Below Hero */}
      <section className="relative z-10 -mt-8 mb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-yellow-200/50 p-4 sm:p-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <motion.h3 variants={itemVariants} className="text-center text-sm font-semibold text-gray-700 mb-4">
              Quick Explore
            </motion.h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
              {quickLinks.map((link, idx) => {
                const Icon = link.icon
                return (
                  <motion.a
                    key={idx}
                    href={link.href}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 hover:border-yellow-400 transition cursor-pointer group"
                  >
                    <Icon size={24} className="text-yellow-600 group-hover:text-yellow-700" />
                    <span className="text-xs font-medium text-gray-700 text-center">{link.label}</span>
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
