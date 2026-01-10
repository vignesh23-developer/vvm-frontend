'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Search,
  Home,
  Users,
  Briefcase,
  Heart,
  Bell,
  Plus,
  BarChart3,
  FileText,
  Palette,
  Truck,
  Shield,
  CheckCircle,
  Phone,
  CreditCard,
  Building2,
  Map,
  ArrowRight,
  TrendingUp,
  Star,
  Headphones,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import LucideIconRenderer from '@/components/ui/CustomComponent/LucideIconRenderer/LucideIconRenderer'
import { useExploreProperties } from '@/components/buyer/LandingPage/ExploreProperties/hooks/useExploreProperties'

interface HomeStats {
  totalProperties: number
  verifiedProperties: number
  totalAgents: number
  kycVerifiedAgents: number
  totalDistricts: number
  totalAds: number
  totalUsers: number
  totalEnquiries: number
}

interface HeroSectionProps {
  propertyCategories: Array<any>
  error: any
  isLoading: boolean
  mutate: () => void
  stats?: HomeStats 
}

// Slide data structure
interface SlideFeature {
  icon: React.ReactNode
  text: string
  href: string
}

interface SlideData {
  id: number
  type: 'buyer' | 'agent' | 'service'
  badge: string
  badgeIcon: React.ReactNode
  title: string
  titleHighlight: string
  titleAfter?: string
  tamilText: string
  description: string
  features: SlideFeature[]
  primaryCta: {
    text: string
    href: string
    icon?: React.ReactNode
  }
  secondaryCta: {
    text: string
    href: string
  }
  image: string
  imageAlt: string
  imageBadge: string
  imageTitle: string
  imageSubtitle: string
}

export default function HeroSection({
  propertyCategories,
  error: categoriesError,
  isLoading: categoriesLoading,
  mutate,
  stats, 
}: HeroSectionProps) {
  const t = useTranslations()
  const router = useRouter()

  const slides: SlideData[] = useMemo(() => [

    {
      id: 0,
      type: 'buyer',
      badge: 'Welcome to VaazhgaValamudan',
      badgeIcon: <Home className="w-4 h-4" />,
      title: "Tamil Nadu's",
      titleHighlight: 'Trusted',
      titleAfter: 'Property Platform',
      tamilText: 'வாழ்க வளமுடன் - செழிப்புடன் வாழுங்கள்',
      description:
        'Your one-stop destination for buying, selling, and renting properties across all 38 districts of Tamil Nadu. Verified listings, trusted agents, transparent dealings.',
      features: [
        { icon: <CheckCircle className="w-5 h-5" />, text: `${stats?.totalProperties || 50}+ Verified Properties`, href: '/properties' },
        { icon: <CheckCircle className="w-5 h-5" />, text: `${stats?.totalAgents || 10}+ KYC Verified Agents`, href: '/agents' },
        { icon: <CheckCircle className="w-5 h-5" />, text: `${stats?.totalDistricts || 10}+ Districts Covered`, href: '/districts' },
      ],
      primaryCta: { text: 'Explore Properties', href: '/properties', icon: <ArrowRight className="w-5 h-5" /> },
      secondaryCta: { text: 'Create Free Account', href: '/register' },
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      imageAlt: 'Beautiful properties in Tamil Nadu - Find your dream property',
      imageBadge: '🏠 Welcome',
      imageTitle: 'Find Your Perfect Property',
      imageSubtitle: `${stats?.totalProperties || 50}+ Verified Properties Across ${stats?.totalDistricts || 10}+ Districts`,
    },
    // ==========================================
    // BUYER SLIDE 2: Search & Save Features
    // ==========================================
    {
      id: 1,
      type: 'buyer',
      badge: 'For Property Seekers',
      badgeIcon: <Search className="w-4 h-4" />,
      title: 'Find Your',
      titleHighlight: 'Dream Property',
      tamilText: 'உங்கள் கனவு சொத்தை கண்டறியுங்கள்',
      description:
        'Search properties by district, budget, or type. Save your favorites, set search alerts, and connect directly with verified agents.',
      features: [
        { icon: <Map className="w-5 h-5" />, text: 'Browse District-wise Properties', href: '/districts' },
        { icon: <Heart className="w-5 h-5" />, text: 'Save Your Favorite Properties', href: '/favorites' },
        { icon: <Bell className="w-5 h-5" />, text: 'Save Searches & Get Alerts', href: '/saved-searches' },
      ],
      primaryCta: { text: 'Browse Properties', href: '/properties', icon: <ArrowRight className="w-5 h-5" /> },
      secondaryCta: { text: 'View All 38 Districts', href: '/districts' },
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
      imageAlt: 'Property search and discovery in Tamil Nadu',
      imageBadge: '🔍 Buyers',
      imageTitle: 'Smart Property Search',
      imageSubtitle: 'Advanced Filters • Save Favorites • Get Alerts',
    },
    // ==========================================
    // AGENT SLIDE 1: Post Properties
    // ==========================================
    {
      id: 2,
      type: 'agent',
      badge: 'For Property Agents',
      badgeIcon: <Users className="w-4 h-4" />,
      title: 'List Properties',
      titleHighlight: 'for FREE',
      tamilText: 'இலவசமாக சொத்துக்களை பதிவு செய்யுங்கள்',
      description:
        'Post unlimited property listings, manage your leads, track performance with a powerful dashboard, and grow your real estate business.',
      features: [
        { icon: <Plus className="w-5 h-5" />, text: 'Post Properties Absolutely FREE', href: '/post-property' },
        { icon: <Users className="w-5 h-5" />, text: 'Get Quality Leads & Enquiries', href: '/dashboard/enquiries' },
        { icon: <BarChart3 className="w-5 h-5" />, text: 'Powerful Analytics Dashboard', href: '/dashboard' },
      ],
      primaryCta: { text: 'Post Property FREE', href: '/post-property', icon: <Plus className="w-5 h-5" /> },
      secondaryCta: { text: 'View Subscription Plans', href: '/pricing' },
      image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80',
      imageAlt: 'Property agents posting listings on VaazhgaValamudan',
      imageBadge: '👥 Agents',
      imageTitle: 'Post Unlimited Properties',
      imageSubtitle: 'Get Leads • Track Performance • Grow Business',
    },
    // ==========================================
    // AGENT SLIDE 2: Grow Business
    // ==========================================
    {
      id: 3,
      type: 'agent',
      badge: 'Grow Your Business',
      badgeIcon: <TrendingUp className="w-4 h-4" />,
      title: 'Boost Your',
      titleHighlight: 'Property Sales',
      tamilText: 'உங்கள் சொத்து விற்பனையை அதிகரிக்கவும்',
      description:
        'Get premium visibility with featured listings, boost your properties to reach more buyers, and access advanced tools to close deals faster.',
      features: [
        { icon: <Star className="w-5 h-5" />, text: 'Featured & Premium Listings', href: '/pricing' },
        { icon: <Building2 className="w-5 h-5" />, text: 'Build Your Agent Profile', href: '/agent-profile' },
        { icon: <Phone className="w-5 h-5" />, text: 'Direct Buyer Connections', href: '/dashboard/enquiries' },
      ],
      primaryCta: { text: 'Upgrade to Premium', href: '/pricing', icon: <ArrowRight className="w-5 h-5" /> },
      secondaryCta: { text: 'View Dashboard', href: '/dashboard' },
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&q=80',
      imageAlt: 'Real estate agent success and business growth',
      imageBadge: '📈 Growth',
      imageTitle: 'Premium Agent Features',
      imageSubtitle: 'Featured Listings • Priority Support • Analytics',
    },
    // ==========================================
    // SERVICE PROVIDER SLIDE 1: Property Services
    // ==========================================
    {
      id: 4,
      type: 'service',
      badge: 'Property Services',
      badgeIcon: <Briefcase className="w-4 h-4" />,
      title: 'Complete',
      titleHighlight: 'Property Services',
      tamilText: 'முழுமையான சொத்து சேவைகள்',
      description:
        'From legal verification to interior design, we connect you with trusted service providers to make your property journey smooth and hassle-free.',
      features: [
        { icon: <FileText className="w-5 h-5" />, text: 'Legal Document Verification', href: '/services/legal' },
        { icon: <Palette className="w-5 h-5" />, text: 'Professional Interior Design', href: '/services/interior' },
        { icon: <Truck className="w-5 h-5" />, text: 'Trusted Packers & Movers', href: '/services/movers' },
      ],
      primaryCta: { text: 'Explore All Services', href: '/services', icon: <ArrowRight className="w-5 h-5" /> },
      secondaryCta: { text: 'Become a Partner', href: '/partner' },
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
      imageAlt: 'Property related services - Legal, Interior, Moving',
      imageBadge: '📋 Services',
      imageTitle: 'End-to-End Property Services',
      imageSubtitle: 'Legal • Interior • Packers & Movers',
    },
    // ==========================================
    // SERVICE PROVIDER SLIDE 2: Trust & Safety
    // ==========================================
    {
      id: 5,
      type: 'service',
      badge: 'Trust & Safety',
      badgeIcon: <Shield className="w-4 h-4" />,
      title: 'Your Safety is',
      titleHighlight: 'Our Priority',
      tamilText: 'உங்கள் பாதுகாப்பு எங்கள் முன்னுரிமை',
      description:
        'Every property and agent on VaazhgaValamudan is verified. Complete KYC verification, secure wallet system, and transparent transactions.',
      features: [
        { icon: <Shield className="w-5 h-5" />, text: 'Aadhaar-based KYC Verification', href: '/kyc-verification' },
        { icon: <CheckCircle className="w-5 h-5" />, text: '100% Verified Property Listings', href: '/verified-properties' },
        { icon: <CreditCard className="w-5 h-5" />, text: 'Secure Wallet & Transactions', href: '/wallet' },
      ],
      primaryCta: { text: 'Learn About Safety', href: '/trust-safety', icon: <ArrowRight className="w-5 h-5" /> },
      secondaryCta: { text: 'Verify Your Account', href: '/kyc-verification' },
      image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80',
      imageAlt: 'Trust and safety - KYC verification process',
      imageBadge: '🛡️ Trust',
      imageTitle: 'KYC Verified Agents & Properties',
      imageSubtitle: 'Secure Platform • Transparent Dealings',
    },
  ], [stats]) // useMemo dependency on stats

  // ============================================
  // STATE
  // ============================================
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isHeroLoading, setIsHeroLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState('sale')
  const [showBudget, setShowBudget] = useState(false)
  const [showType, setShowType] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 100000000])

  // Constants
  const SLIDE_DURATION = 6000
  const TOTAL_SLIDES = slides.length
  const budgetMin = 0
  const budgetMax = 100000000
  const tabKeys: string[] = ['sale', 'rent', 'lease']

  // ============================================
  // HOOKS & MEMOS
  // ============================================
  const { items } = useExploreProperties({ limit: 1, page: 60 })

  const availableDistricts: string[] = useMemo(() => {
    if (!Array.isArray(items)) return []
    const names = items.map((item: any) => (item?.district || '').toString().trim()).filter(Boolean)
    return Array.from(new Set(names))
  }, [items])

  // ============================================
  // EFFECTS
  // ============================================

  // Auto-slide with progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setProgress(prev => {
          const newProgress = prev + (50 / SLIDE_DURATION) * 100
          if (newProgress >= 100) {
            setCurrentSlide(curr => (curr + 1) % TOTAL_SLIDES)
            return 0
          }
          return newProgress
        })
      }
    }, 50)
    return () => clearInterval(interval)
  }, [isPaused, TOTAL_SLIDES])

  // Loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsHeroLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  // ============================================
  // NAVIGATION FUNCTIONS
  // ============================================
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    setProgress(0)
  }, [])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % TOTAL_SLIDES)
  }, [currentSlide, goToSlide, TOTAL_SLIDES])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + TOTAL_SLIDES) % TOTAL_SLIDES)
  }, [currentSlide, goToSlide, TOTAL_SLIDES])

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  const formatBudgetDisplay = (min: number, max: number) => {
    if (min === budgetMin && max === budgetMax) return t('Hero.HeroMenu.budget')
    if (min === budgetMin) return `Up to ₹${(max / 100000).toFixed(0)}L`
    if (max === budgetMax) return `Above ₹${(min / 100000).toFixed(0)}L`
    return `₹${(min / 100000).toFixed(0)}L - ₹${(max / 100000).toFixed(0)}L`
  }

  const handleSearch = (values: any) => {
    const queryParams = new URLSearchParams({
      location: encodeURIComponent(values.location || ''),
      listingType: encodeURIComponent(currentTab.toUpperCase() || ''),
      type: encodeURIComponent(values.type ? String(values.type) : ''),
      budget: encodeURIComponent(values.budget || ''),
    })
    router.push(`/properties-list?${queryParams.toString()}`)
  }

  // ============================================
  // ANIMATION VARIANTS - ENHANCED & BIGGER
  // ============================================
  
  // Custom easing function (easeOutExpo equivalent)
  const customEase = 'easeOut' as const

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  }

  // BIGGER animations - increased y values and scale
  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease: customEase },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: customEase },
    },
  }

  const featureVariants = {
    hidden: { opacity: 0, x: -40, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.4 + i * 0.15,
        ease: customEase,
      },
    }),
  }

  const ctaVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.85 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, delay: 0.75, ease: customEase },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.15, x: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.9, ease: customEase },
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      x: -20,
      transition: { duration: 0.4 },
    },
  }

  // ============================================
  // LOADING SKELETON
  // ============================================
  if (isHeroLoading) {
    return (
      <section
        className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-br from-[#2a1407] via-[#3d1f0d] to-[#2a1407]"
        aria-label="Loading hero section"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-center px-4 py-12 min-h-[90vh]">
          <div className="w-full max-w-7xl mx-auto animate-pulse">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="h-10 w-56 bg-yellow-400/20 rounded-full" />
                <div className="h-16 w-full bg-white/10 rounded-2xl" />
                <div className="h-8 w-72 bg-yellow-400/20 rounded-lg" />
                <div className="h-24 w-full bg-white/10 rounded-xl" />
                <div className="space-y-4">
                  <div className="h-7 w-80 bg-white/10 rounded-lg" />
                  <div className="h-7 w-72 bg-white/10 rounded-lg" />
                  <div className="h-7 w-64 bg-white/10 rounded-lg" />
                </div>
                <div className="flex gap-4 pt-4">
                  <div className="h-14 w-44 bg-yellow-400/30 rounded-xl" />
                  <div className="h-14 w-40 bg-white/10 rounded-xl" />
                </div>
              </div>
              <div className="h-96 bg-white/10 rounded-3xl" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  const currentSlideData = slides[currentSlide]

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#2a1407] via-[#3d1f0d] to-[#2a1407] min-h-[calc(100vh-80px)]"
      aria-label="VaazhgaValamudan Hero Section - Tamil Nadu Property Platform"
    >
      {/* SEO Hidden Content */}
      <h1 className="sr-only">
        VaazhgaValamudan - Tamil Nadu&apos;s Trusted Property Platform for Buying, Selling, and Renting Properties
      </h1>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[80%] h-[150%] bg-gradient-radial from-yellow-400/10 via-yellow-400/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[80%] h-[150%] bg-gradient-radial from-yellow-400/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 lg:pt-28 lg:pb-10 min-h-[calc(100vh-80px)] flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* ============================================
               LEFT CONTENT - Animated Text
               ============================================ */}
          <article
            className="order-2 lg:order-1"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-4"
              >
                {/* Badge */}
                <motion.div variants={itemVariants}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/15 border border-yellow-400/30 text-yellow-400 text-xs sm:text-sm font-semibold backdrop-blur-sm">
                    {currentSlideData.badgeIcon}
                    <span>{currentSlideData.badge}</span>
                  </span>
                </motion.div>

                {/* Title with Animated Underline */}
                <motion.h2
                  variants={titleVariants}
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight"
                >
                  {currentSlideData.title}{' '}
                  <span className="relative inline-block text-yellow-400">
                    {currentSlideData.titleHighlight}
                    <motion.span
                      className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
                    />
                  </span>
                  {currentSlideData.titleAfter && <span className="block sm:inline"> {currentSlideData.titleAfter}</span>}
                </motion.h2>

                {/* Tamil Text */}
                <motion.p variants={itemVariants} className="text-yellow-400/90 text-base lg:text-lg italic font-medium">
                  {currentSlideData.tamilText}
                </motion.p>

                {/* Description */}
                <motion.p variants={itemVariants} className="text-white/70 text-sm lg:text-base leading-relaxed max-w-lg">
                  {currentSlideData.description}
                </motion.p>

                {/* Feature Links */}
                <nav className="space-y-2 pt-1" aria-label="Quick links">
                  {currentSlideData.features.map((feature, index) => (
                    <motion.div key={index} custom={index} variants={featureVariants} initial="hidden" animate="visible">
                      <Link
                        href={feature.href}
                        className="group inline-flex items-center gap-2 text-white/85 hover:text-yellow-400 transition-all duration-300"
                      >
                        <span className="text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </span>
                        <span className="text-sm lg:text-base font-medium">{feature.text}</span>
                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-yellow-400" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* CTA Buttons */}
                <motion.div variants={ctaVariants} className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href={currentSlideData.primaryCta.href}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2a1407] font-bold text-sm rounded-xl shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:-translate-y-0.5 hover:scale-[1.02] transition-all duration-300"
                  >
                    {currentSlideData.primaryCta.icon}
                    <span>{currentSlideData.primaryCta.text}</span>
                  </Link>
                  <Link
                    href={currentSlideData.secondaryCta.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white font-semibold text-sm rounded-xl border-2 border-white/20 hover:bg-white/15 hover:border-white/40 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
                  >
                    {currentSlideData.secondaryCta.text}
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </article>

          {/* ============================================
               RIGHT IMAGE SLIDER
               ============================================ */}
          <aside
            className="order-1 lg:order-2 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 aspect-[4/3] max-w-lg mx-auto lg:max-w-none">
              {/* Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-black/30 z-20">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.05 }}
                />
              </div>

              {/* Image Slides */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  variants={imageVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0"
                >
                  {/* Using img tag for better compatibility */}
                  <img
                    src={currentSlideData.image}
                    alt={currentSlideData.imageAlt}
                    className="w-full h-full object-cover"
                    loading={currentSlide === 0 ? 'eager' : 'lazy'}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 px-3 py-2 bg-white text-[#2a1407] font-bold rounded-lg shadow-lg text-xs z-10">
                    {currentSlideData.imageBadge}
                  </div>

                  {/* Image Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <span className="inline-block px-2.5 py-1 bg-yellow-400 text-[#2a1407] text-[10px] font-bold rounded uppercase tracking-wide mb-2">
                      {currentSlideData.type === 'buyer'
                        ? 'For Buyers'
                        : currentSlideData.type === 'agent'
                        ? 'For Agents'
                        : 'Services'}
                    </span>
                    <h3 className="text-white text-lg font-bold mb-0.5">{currentSlideData.imageTitle}</h3>
                    <p className="text-white/70 text-xs">{currentSlideData.imageSubtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-yellow-400 text-[#2a1407] shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 hover:bg-yellow-400 text-[#2a1407] shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Slide navigation">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'w-7 bg-yellow-400' : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                  role="tab"
                  aria-selected={currentSlide === index}
                  aria-label={`Go to slide ${index + 1}: ${slides[index].badge}`}
                />
              ))}
            </div>

            {/* Trust Badges with Real Stats */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {[
                { 
                  icon: <Shield className="w-3.5 h-3.5" />, 
                  text: stats?.totalProperties ? `${stats.totalProperties}+ Verified Properties` : 'Verified Properties',
                  show: true
                },
                { 
                  icon: <Users className="w-3.5 h-3.5" />, 
                  text: stats?.totalAgents ? `${stats.totalAgents}+ KYC Agents` : 'KYC Agents',
                  show: true
                },
                { 
                  icon: <Map className="w-3.5 h-3.5" />, 
                  text: stats?.totalDistricts ? `${stats.totalDistricts} Districts` : 'All Districts',
                  show: true
                },
                { 
                  icon: <Headphones className="w-3.5 h-3.5" />, 
                  text: '24/7 Support',
                  show: true
                },
              ].filter(badge => badge.show).map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full text-white/80 text-[11px] font-medium hover:bg-yellow-400/15 hover:border-yellow-400/30 hover:text-yellow-400 transition-all duration-300 cursor-default"
                >
                  <span className="text-yellow-400">{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* ============================================
             SEARCH BAR
             ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
          className="mt-8"
        >
          <Formik
            initialValues={{ location: '', type: '', budget: '' }}
            validationSchema={Yup.object({
              location: Yup.string().required('Select a location'),
            })}
            onSubmit={handleSearch}
          >
            {({ values, setFieldValue, handleSubmit, errors, touched }) => (
              <div className="bg-white rounded-2xl p-2 shadow-2xl shadow-black/30">
                <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                  {/* Tabs */}
                  <div className="flex bg-gray-100 rounded-xl p-1 lg:mr-2">
                    {tabKeys.map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setCurrentTab(tab)}
                        className={`flex-1 lg:flex-none px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          currentTab === tab
                            ? 'bg-[#2a1407] text-white shadow-md'
                            : 'text-gray-600 hover:text-[#2a1407] hover:bg-gray-200'
                        }`}
                      >
                        {t(`Hero.HeroMenu.${tab}`)}
                      </button>
                    ))}
                  </div>

                  {/* Location Dropdown */}
                  <div className="relative flex-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocation(!showLocation)
                        setShowType(false)
                        setShowBudget(false)
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl transition-colors ${
                        touched.location && errors.location
                          ? 'bg-red-50 border-2 border-red-400'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 flex-shrink-0 ${touched.location && errors.location ? 'text-red-500' : 'text-gray-400'}`} />
                      <span className={`flex-1 text-left font-medium ${values.location ? 'text-gray-800' : 'text-gray-400'}`}>
                        {values.location || 'Select District'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showLocation && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
                        {availableDistricts.length > 0 ? (
                          availableDistricts.map(district => (
                            <button
                              key={district}
                              type="button"
                              onClick={() => {
                                setFieldValue('location', district)
                                setShowLocation(false)
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                                values.location === district
                                  ? 'bg-yellow-50 text-[#2a1407]'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-[#2a1407]'
                              }`}
                            >
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {district}
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">Loading districts...</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Property Type */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowType(!showType)
                        setShowBudget(false)
                        setShowLocation(false)
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl min-w-[140px] text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                      {propertyCategories && values.type && (
                        <LucideIconRenderer
                          iconName={propertyCategories.find(c => String(c.id) === String(values.type))?.icon}
                          className="w-5 h-5"
                        />
                      )}
                      <span className="flex-1 text-left text-sm">
                        {propertyCategories && values.type
                          ? propertyCategories.find(c => String(c.id) === String(values.type))?.name
                          : t('Hero.HeroMenu.flat')}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showType && (
                      <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-2">
                        {propertyCategories?.map(item => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setFieldValue('type', item.id)
                              setShowType(false)
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-[#2a1407] transition-colors"
                          >
                            <LucideIconRenderer iconName={item.icon} className="w-5 h-5 text-gray-500" />
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation()
                        setShowBudget(!showBudget)
                        setShowType(false)
                        setShowLocation(false)
                      }}
                      className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl min-w-[130px] text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                      <IndianRupee className="w-5 h-5 text-gray-400" />
                      <span className="flex-1 text-left text-sm">{formatBudgetDisplay(budgetRange[0], budgetRange[1])}</span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showBudget && (
                      <div
                        className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs text-gray-500 font-medium">
                            <span>₹{(budgetRange[0] / 100000).toFixed(0)} Lakhs</span>
                            <span>₹{(budgetRange[1] / 100000).toFixed(0)} Lakhs</span>
                          </div>
                          <div className="relative h-2">
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
                              className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2a1407]"
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
                              className="absolute w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-[#2a1407]"
                            />
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setBudgetRange([budgetMin, budgetMax])
                                setFieldValue('budget', '')
                                setShowBudget(false)
                              }}
                              className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowBudget(false)}
                              className="flex-1 px-3 py-2 text-sm bg-[#2a1407] text-white rounded-lg hover:bg-[#3d1f0d] transition-colors font-medium"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Search Button */}
                  <button
                    type="button"
                    onClick={() => handleSubmit()}
                    disabled={!values.location}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#2a1407] font-bold text-sm rounded-xl shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none"
                  >
                    <Search className="w-5 h-5" />
                    <span>{t('Hero.HeroMenu.search')}</span>
                  </button>
                </div>
              </div>
            )}
          </Formik>
        </motion.div>
      </div>
    </section>
  )
}