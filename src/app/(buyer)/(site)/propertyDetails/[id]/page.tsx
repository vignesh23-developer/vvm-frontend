'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import useSWR from 'swr'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Heart,
  Share2,
  MessageSquare,
  Flag,
  MapPin,
  Eye,
  Phone,
  BarChart3,
  ArrowRight,
  Home,
  Ruler,
  BadgeCheck,
  IndianRupee,
  Building2,
  Droplets,
  Calendar,
  Download,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  Shield,
  Video,
  ChevronRight,
  Sparkles,
  X,
  ChevronLeft,
  Camera,
  Play,
} from 'lucide-react'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'
import type { LucideIcon } from 'lucide-react'
import Amenities from '@/components/buyer/Amenities/Amenities'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import Button from '@/components/ui/CustomComponent/Button/Button'
import ReportPropertyModal from './modal/ReportPropertyModal'
import usePropertiesDetail from '../(hooks)/usePropertiesHook'
import { useSimilarProperties } from '../(hooks)/useSimilarProperties'
import { usePopularProperties } from '@/components/buyer/LandingPage/PopularProperties/hooks/usePopularProperties'
import MapView from '@/components/ui/map/MapView'
import Image from 'next/image'
import { appEndpoints } from '@/services/endpoints'
import { getMethod, postMethod } from '@/services/service'
import EnquiryPropertyModal from './modal/EnquiryPropertyModal'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import { formatPrice } from '@/utils/converter/formatPrice'
import ApproveOrRejectPropertyModal from '@/components/ui/CustomComponent/Modal/ApproveOrReject/ApproveOrRejectModal'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const cardHover = {
  scale: 1.02,
  y: -4,
  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }
}

// Tab types
type TabType = 'overview' | 'amenities' | 'floorplan' | 'about' | 'location' | 'reviews'

// Skeleton Loader
const PropertyDetailsSkeleton = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen animate-pulse">
      {/* Image Gallery Skeleton */}
      <div className="h-[500px] md:h-[600px] bg-gray-200" />

      {/* Header Card Skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex gap-3">
                <div className="h-6 w-24 bg-gray-200 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
              <div className="h-10 w-3/4 bg-gray-200 rounded" />
              <div className="h-6 w-1/2 bg-gray-200 rounded" />
              <div className="h-16 w-full bg-gray-200 rounded" />
            </div>
            <div className="lg:w-64 space-y-4">
              <div className="h-32 bg-gray-200 rounded-xl" />
              <div className="h-8 w-full bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl" />
              ))}
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="h-12 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-4/6 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-48 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

const page = () => {
  const t = useTranslations()
  const router = useRouter()
  const { user } = useAuth()
  const params = useParams<{ id: string | string[] }>()
  const propertyIdParam = params?.id
  const propertyId = Array.isArray(propertyIdParam) ? propertyIdParam[0] : propertyIdParam
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false)
  const [approveOrRejectModalOpen, setApproveOrRejectModalOpen] = useState(false)
  const [approveOrRejectReason, setApproveOrRejectReason] = useState<string>('')
  const [isSharing, setIsSharing] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [carouselScrollPosition, setCarouselScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [funFactRevealed, setFunFactRevealed] = useState(false)
  const [revealedFacts, setRevealedFacts] = useState<string[]>([])
  const [quizAnswers, setQuizAnswers] = useState<{ budget: string; location: string }>({ budget: '', location: '' })
  const [showQuizResult, setShowQuizResult] = useState(false)
  const [quizResultCount, setQuizResultCount] = useState<number | null>(null)
  const [isQuizLoading, setIsQuizLoading] = useState(false)

  // Quick Match filter metadata from backend search filters
  const { data: quickMatchFilters } = useSWR(
    appEndpoints.publicSearchPropertyFilters,
    (url: string) => getMethod<any>(url),
  )

  // Fun facts about properties (static, no price impact)
  const propertyFunFacts = [
    '🏠 This property is located in a prime area with excellent connectivity',
    '🌳 Green spaces and parks are within walking distance',
    '🚇 Metro station is just 5 minutes away',
    '🏥 Top-rated hospitals and schools nearby',
    '🛍️ Shopping malls and entertainment centers close by',
    '🔒 24/7 security with CCTV surveillance',
    '⚡ Power backup and modern amenities included',
    '💧 24/7 water supply with modern infrastructure'
  ]
  const { propertyDetailsData, propertyDetailsFetchLoader, propertyDetailsFetchErr, propertyDetailsRefresh } =
    usePropertiesDetail({ id: propertyId })

  // Fetch similar properties based on city + category via search service
  const { similarProperties, isLoadingSimilar } = useSimilarProperties({
    city: propertyDetailsData?.city,
    propertyCategoryId: propertyDetailsData?.property_category_id,
    excludeId: propertyId || undefined,
    limit: 8,
  })

  // Fallback: if search-based similar properties are empty, use popular properties list
  const { items: popularSimilarProperties, isLoading: isLoadingPopularSimilar } = usePopularProperties({
    limit: 8,
  })

  // Quick Match derived options (now that we have propertyDetailsData & filters)
  const quickBudgetOptions = useMemo(() => {
    const priceStats = quickMatchFilters?.data?.filters?.price

    type BudgetOption = { id: string; label: string; min?: number; max?: number }

    // Frontend fallback if backend doesn't provide stats
    const fallback: BudgetOption[] = [
      { id: 'under-50', label: 'Under ₹50 Lakhs', max: 5000000 },
      { id: '50-100', label: '₹50 Lakhs - ₹1 Crore', min: 5000000, max: 10000000 },
      { id: '100-200', label: '₹1 - ₹2 Crores', min: 10000000, max: 20000000 },
      { id: 'above-200', label: 'Above ₹2 Crores', min: 20000000 },
    ]

    if (!priceStats || typeof priceStats.min !== 'number' || typeof priceStats.max !== 'number') {
      return fallback
    }

    const min = priceStats.min
    const max = priceStats.max
    if (max <= min) return fallback

    const step = (max - min) / 4
    const ranges = [
      { min: min, max: min + step },
      { min: min + step, max: min + 2 * step },
      { min: min + 2 * step, max: min + 3 * step },
      { min: min + 3 * step, max: max },
    ]

    const dynamicOptions: BudgetOption[] = ranges.map((r, idx) => ({
      id: `b${idx}`,
      label: `${formatPrice(Math.round(r.min))} - ${formatPrice(Math.round(r.max))}`,
      min: Math.round(r.min),
      max: Math.round(r.max),
    }))

    return dynamicOptions
  }, [quickMatchFilters])

  const quickLocationOptions = useMemo(() => {
    const backendCities =
      (quickMatchFilters?.data?.filters?.cities as { value: string; label: string; count: number }[] | undefined) ??
      []

    if (backendCities.length > 0) return backendCities

    // Fallback: use current property's city/district if available
    const seen = new Set<string>()
    const cities: { value: string; label: string; count: number }[] = []

    if (propertyDetailsData?.city) {
      const v = String(propertyDetailsData.city)
      if (!seen.has(v)) {
        cities.push({ value: v, label: v, count: 0 })
        seen.add(v)
      }
    }
    if (propertyDetailsData?.district) {
      const v = String(propertyDetailsData.district)
      if (!seen.has(v)) {
        cities.push({ value: v, label: v, count: 0 })
        seen.add(v)
      }
    }

    return cities
  }, [quickMatchFilters, propertyDetailsData])

  // Show full owner contact only when user is available; otherwise mask with 'xxx'
  const ownerNameDisplay = user ? propertyDetailsData?.contact_name ?? 'Unknown' : 'xxxxx'
  const ownerPhoneDisplay = user ? propertyDetailsData?.contact_phone ?? 'Unknown' : 'xxxxx'

  const handleFavorite = useCallback(async (propertyId: string) => {
    try {
      const response = await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })
      if (!response.error) {
        propertyDetailsRefresh()
        toast.success(propertyDetailsData?.is_user_favorite ? 'Removed from favorites' : 'Added to favorites')
      }
    } catch (err) {
      console.error('Error updating favorite:', err)
      toast.error('Failed to update favorite')
    }
  }, [propertyDetailsData?.is_user_favorite, propertyDetailsRefresh])

  const handleShare = useCallback(async () => {
    if (typeof window !== 'undefined' && propertyId) {
      setIsSharing(true)
      try {
        const url = window.location.href
        if (navigator.share) {
          await navigator.share({
            title: propertyDetailsData?.title || 'Property',
            text: `Check out this property: ${propertyDetailsData?.title}`,
            url: url,
          })
          toast.success('Shared successfully')
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(url)
          toast.success('Link copied to clipboard!')
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea')
          textArea.value = url
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          toast.success('Link copied to clipboard!')
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      } finally {
        setIsSharing(false)
      }
    }
  }, [propertyId, propertyDetailsData?.title])

  // Get only IMAGE type media from API, sorted by is_primary and sort_order
  const apiImages = useMemo(() => {
    if (!propertyDetailsData?.media) return []
    return propertyDetailsData.media
      .filter((item: any) => item.media_type === 'IMAGE' && item.url)
      .sort((a: any, b: any) => {
        if (a.is_primary && !b.is_primary) return -1
        if (!a.is_primary && b.is_primary) return 1
        return (a.sort_order || 0) - (b.sort_order || 0)
      })
      .map((item: any) => item.url)
  }, [propertyDetailsData?.media])

  // Images used in the hero gallery (max 4 tiles; rest via "View All")
  const galleryImages = useMemo(() => {
    const maxGridSlots = 4
    const validImages = apiImages || []
    return validImages.slice(0, maxGridSlots)
  }, [apiImages])

  const totalImageCount = apiImages?.length || 0

  // Property Overview Cards - always render up to 5 cards derived from backend data
  const propertyOverviewCards = useMemo(() => {
    const featureValues = propertyDetailsData?.feature_values || []

    type OverviewItem = { label: string; value: string }

    const items: OverviewItem[] = []
    const seenLabels = new Set<string>()

    // 1. Build items from feature_values (use category name as label, options/values as value)
    for (const fv of featureValues) {
      const labelRaw = fv.feature_category_name || fv.feature_group_name
      if (!labelRaw) continue
      const label = String(labelRaw).trim()
      if (!label || seenLabels.has(label.toLowerCase())) continue

      let value = ''
      if (Array.isArray(fv.feature_options) && fv.feature_options.length > 0) {
        value = fv.feature_options
          .map((opt: any) => opt?.name)
          .filter((n: any) => typeof n === 'string' && n.trim().length > 0)
          .join(', ')
      } else if (typeof fv.values === 'string' && fv.values.trim().length > 0) {
        value = fv.values
      }

      if (!value) continue

      items.push({ label, value })
      seenLabels.add(label.toLowerCase())
      if (items.length >= 5) break
    }

    // 2. If we still have < 5, supplement with core fields like price / size / location
    if (items.length < 5 && propertyDetailsData) {
      const coreCandidates: OverviewItem[] = []

      if (propertyDetailsData.price) {
        coreCandidates.push({
          label: 'Price',
          value: `₹ ${formatPrice(propertyDetailsData.price)}`,
        })
      }

      if (propertyDetailsData.property_size) {
        coreCandidates.push({
          label: 'Size',
          value: `${propertyDetailsData.property_size} ${propertyDetailsData.property_size_unit || 'sqft'
            }`,
        })
      }

      if (propertyDetailsData.listing_type) {
        coreCandidates.push({
          label: 'Listing Type',
          value: propertyDetailsData.listing_type,
        })
      }

      if (propertyDetailsData.status) {
        coreCandidates.push({
          label: 'Status',
          value: propertyDetailsData.status.replace(/_/g, ' '),
        })
      }

      if (propertyDetailsData.city || propertyDetailsData.district) {
        coreCandidates.push({
          label: 'Location',
          value: [propertyDetailsData.district, propertyDetailsData.city].filter(Boolean).join(', '),
        })
      }

      for (const cand of coreCandidates) {
        if (items.length >= 5) break
        if (!cand.value || seenLabels.has(cand.label.toLowerCase())) continue
        items.push(cand)
        seenLabels.add(cand.label.toLowerCase())
      }
    }

    // 3. Map items to cards with icons chosen heuristically by label/index
    const pickIcon = (label: string, index: number) => {
      const lower = label.toLowerCase()
      if (lower.includes('price')) return IndianRupee
      if (lower.includes('size') || lower.includes('area')) return Ruler
      if (lower.includes('bhk') || lower.includes('unit')) return Home
      if (lower.includes('water')) return Droplets
      if (lower.includes('tower') || lower.includes('building')) return Building2
      if (lower.includes('status')) return BadgeCheck
      if (lower.includes('location') || lower.includes('city')) return MapPin

      // fallback rotation
      const icons = [Home, Droplets, Building2, Ruler, BadgeCheck]
      return icons[index % icons.length]
    }

    return items.slice(0, 5).map((item, idx) => ({
      icon: pickIcon(item.label, idx),
      label: item.label,
      value: item.value,
    }))
  }, [propertyDetailsData])

  // Key Features - Extract from API feature_values and description
  const keyFeatures = useMemo(() => {
    const features: string[] = []
    const featureValues = propertyDetailsData?.feature_values || []

    // Extract features from feature_values (amenities, highlights, etc.)
    featureValues.forEach((feature: any) => {
      if (feature.feature_category_name && feature.values) {
        const categoryName = feature.feature_category_name.toLowerCase()
        // Include relevant features like amenities, highlights, etc.
        if (categoryName.includes('amenity') ||
          categoryName.includes('feature') ||
          categoryName.includes('highlight') ||
          categoryName.includes('facility')) {
          if (feature.feature_options && feature.feature_options.length > 0) {
            // If it has options, add option names
            feature.feature_options.forEach((option: any) => {
              if (option.name) features.push(option.name)
            })
          } else if (feature.values) {
            // Otherwise use the value
            features.push(feature.values)
          }
        }
      }
    })

    // If no features found, extract from description (first few sentences)
    if (features.length === 0 && propertyDetailsData?.description) {
      const sentences = propertyDetailsData.description.split(/[.!?]+/).filter(s => s.trim().length > 20)
      features.push(...sentences.slice(0, 6).map(s => s.trim()))
    }

    // Return unique features, limit to 6
    return [...new Set(features)].slice(0, 6)
  }, [propertyDetailsData])

  // Property Insights Data - Using only API data
  const propertyInsights = useMemo(
    () => [
      {
        label: 'Number of Reports',
        value: propertyDetailsData?.reports?.length || 0,
        icon: BarChart3,
      },
      {
        label: 'Total Enquiries',
        value: propertyDetailsData?.enquiry_count || 0,
        icon: MessageSquare,
      },
      {
        label: 'Page Views',
        value: propertyDetailsData?.view_count || 0,
        icon: Eye,
      },
    ],
    [propertyDetailsData],
  )

  // Filter similar properties (exclude current property; if empty, fall back to all)
  const filteredSimilarProperties = useMemo(() => {
    const base =
      Array.isArray(similarProperties) && similarProperties.length > 0
        ? similarProperties
        : Array.isArray(popularSimilarProperties)
          ? popularSimilarProperties
          : []

    if (base.length === 0) return []

    let list = [...base]
    if (propertyId) {
      list = list.filter((prop: any) => prop.id !== propertyId)
    }

    if (list.length === 0) {
      list = [...base]
    }

    return list.slice(0, 8)
  }, [similarProperties, popularSimilarProperties, propertyId])

  // Derive primary video URL from media (fallback to a generic YouTube embed)
  const primaryVideoMedia = useMemo(
    () => propertyDetailsData?.media?.find(media => media.media_type === 'VIDEO'),
    [propertyDetailsData],
  )

  const videoEmbedUrl = useMemo(() => {
    const fallback = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    const raw = primaryVideoMedia?.url
    if (!raw) return fallback

    if (raw.includes('youtube.com/watch')) {
      return raw.replace('watch?v=', 'embed/')
    }
    if (raw.includes('youtu.be/')) {
      return raw.replace('youtu.be/', 'www.youtube.com/embed/')
    }
    return raw
  }, [primaryVideoMedia])

  // FAQ Data (removed from UI as per latest design, kept here for future use if needed)

  const handleDownloadBrochure = useCallback(() => {
    const brochureUrl = (propertyDetailsData as any)?.brochure_url as string | undefined
    if (!brochureUrl) {
      toast.error('Brochure is not available for this property yet.')
      return
    }
    if (typeof window !== 'undefined') {
      window.open(brochureUrl, '_blank', 'noopener,noreferrer')
    }
  }, [propertyDetailsData])

  // Tabs configuration
  const tabs: { id: TabType; label: string; icon?: LucideIcon }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'amenities', label: 'Amenities' },
    { id: 'floorplan', label: 'Floor Plan' },
    { id: 'about', label: 'About Project' },
    { id: 'location', label: 'Location' },
    { id: 'reviews', label: 'Reviews' },
  ]

  if (propertyDetailsFetchErr) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <p className="text-red-600 text-sm md:text-base">
          Unable to load property details right now. Please try again later.
        </p>
      </main>
    )
  }

  if (propertyDetailsFetchLoader) {
    return <PropertyDetailsSkeleton />
  }

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full bg-gray-50 min-h-screen"
    >
      {/* Hero Section with Image Gallery */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Image Gallery - full banner for single image, responsive grid for multiple */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px] md:h-[600px] overflow-hidden"
          >
            {galleryImages.length === 1 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative h-full w-full rounded-2xl overflow-hidden group cursor-pointer"
                onClick={() => galleryImages[0] && setSelectedImageIndex(0)}
              >
                {galleryImages[0] ? (
                  <Image
                    src={galleryImages[0]}
                    alt="Property main image"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Camera size={48} className="text-gray-400" />
                  </div>
                )}
              </motion.div>
            ) : galleryImages.length === 2 ? (
              <div className="grid grid-cols-3 gap-2 h-full">
                {/* Large Main Image - Left (2 columns) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="col-span-2 relative group overflow-hidden rounded-l-2xl"
                  onClick={() => setSelectedImageIndex(0)}
                  style={{ cursor: 'pointer' }}
                >
                  <Image
                    src={galleryImages[0]}
                    alt="Property main image"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                </motion.div>

                {/* Small Right Image taking full height */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative h-full group overflow-hidden rounded-r-2xl"
                  onClick={() => setSelectedImageIndex(1)}
                  style={{ cursor: 'pointer' }}
                >
                  <Image
                    src={galleryImages[1]}
                    alt="Property image 2"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </motion.div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 h-full">
                {/* Large Main Image - Left (2 columns) */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="col-span-2 relative group overflow-hidden rounded-l-2xl"
                  onClick={() => galleryImages[0] && setSelectedImageIndex(0)}
                  style={{ cursor: galleryImages[0] ? 'pointer' : 'default' }}
                >
                  <Image
                    src={galleryImages[0]}
                    alt="Property main image"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>

                {/* Right Grid - up to 2 images + optional video */}
                <div className="col-span-1 grid grid-rows-2 gap-2">
                  {/* Top Right Image */}
                  {galleryImages[1] && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative group overflow-hidden rounded-tr-2xl"
                      onClick={() => setSelectedImageIndex(1)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Image
                        src={galleryImages[1]}
                        alt="Property image 2"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </motion.div>
                  )}

                  {/* Bottom Right - image + optional video tile */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Bottom Left */}
                    {galleryImages[2] && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative group overflow-hidden"
                        onClick={() => setSelectedImageIndex(2)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Image
                          src={galleryImages[2]}
                          alt="Property image 3"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </motion.div>
                    )}

                    {/* Bottom Right: either video tile or 4th image / view-all */}
                    {(primaryVideoMedia || galleryImages[3] || totalImageCount > galleryImages.length) && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative group overflow-hidden rounded-br-2xl cursor-pointer"
                        onClick={() => {
                          if (primaryVideoMedia) {
                            setIsVideoModalOpen(true)
                          } else if (galleryImages[3]) {
                            setSelectedImageIndex(3)
                          }
                        }}
                      >
                        {primaryVideoMedia ? (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-black/70 to-black/60 text-white">
                            <div className="text-center">
                              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/40">
                                <Play size={20} />
                              </div>
                              <p className="text-sm font-semibold">Play Video Tour</p>
                            </div>
                          </div>
                        ) : galleryImages[3] ? (
                          <>
                            <Image
                              src={galleryImages[3]}
                              alt="Property image 4"
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                            {totalImageCount > galleryImages.length && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white cursor-pointer group-hover:bg-black/70 transition-colors">
                                <div className="text-center">
                                  <Camera size={24} className="mx-auto mb-1" />
                                  <p className="text-sm font-semibold">View All</p>
                                  <p className="text-xs">{totalImageCount} Photos</p>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Camera size={24} className="text-gray-400" />
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Floating Action Buttons */}
            <div className="absolute top-6 right-6 flex gap-3 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                disabled={isSharing}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg transition hover:bg-white hover:text-[#2a1407] disabled:opacity-50"
                aria-label="Share property"
              >
                <Share2 size={18} />
              </motion.button>
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <button
                  onClick={() => handleFavorite(propertyId || '')}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg transition hover:bg-white hover:text-[#2a1407]"
                  aria-label="Favorite property"
                >
                  <Heart 
                    size={18} 
                    className={propertyDetailsData?.is_user_favorite ? 'fill-red-500 text-red-500' : ''}
                  />
                </button>
                {(propertyDetailsData?.favorite_count ?? 0) > 0 && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2a1407] text-[10px] font-semibold text-yellow-200 shadow-md">
                    {propertyDetailsData?.favorite_count ?? 0}
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Property Header Card */}
          <motion.div
            variants={fadeInUp}
            className="relative -mt-20 mx-4 md:mx-8 z-10"
          >
            <div className="bg-gradient-to-br from-white to-yellow-50/20 rounded-2xl shadow-xl border border-yellow-200 p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left Section */}
                <div className="flex-1 space-y-4">
                  {/* Badge - Listing type only */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-[#2a1407] text-xs font-semibold uppercase">
                      {propertyDetailsData?.listing_type || 'SALE'}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#2a1407] mb-2">
                      {propertyDetailsData?.title || 'Property Title'}
                    </h1>
                    <p className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                      <MapPin size={18} className="text-yellow-600 flex-shrink-0" />
                      <span>{propertyDetailsData?.address_line || 'Location not provided'}</span>
                    </p>
                  </div>

                  {/* Contact Owner (header area) */}
                  <div className="pt-4 mt-2 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center">
                        <Building2 size={20} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{ownerNameDisplay}</p>
                        <p className="text-xs text-gray-500">{ownerPhoneDisplay}</p>
                      </div>
                    </div>

                    {/* Actions stacked below owner info */}
                    <div className="mt-4 space-y-3 max-w-md">
                      <Button
                        type="button"
                        onClick={() => setEnquiryModalOpen(true)}
                        className="w-full bg-[#2a1407] text-white py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-sm hover:from-[#3b1804] hover:to-[#2a1407] transition-all"
                      >
                        <MessageSquare size={18} />
                        Enquire Now
                      </Button>
                      <div className="flex gap-3 w-full">
                        <Button
                          type="button"
                          onClick={() => setReportModalOpen(true)}
                          className="flex-1 bg-white border border-yellow-200 rounded-full py-2.5 px-4 text-sm text-gray-700 hover:bg-yellow-50 flex items-center justify-center gap-1 transition-all"
                        >
                          <Flag size={16} />
                          <span>Report</span>
                        </Button>
                        <Button
                          type="button"
                          onClick={handleDownloadBrochure}
                          className="flex-1 bg-white border border-yellow-200 rounded-full py-2.5 px-4 text-sm text-gray-700 hover:bg-yellow-50 flex items-center justify-center gap-1 transition-all"
                        >
                          <Download size={16} />
                          <span>Brochure</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Price */}
                <div className="lg:text-right space-y-4">
                  <motion.div
                    whileHover={cardHover}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-6 border border-yellow-200 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Price</p>
                    <p className="text-3xl md:text-4xl font-bold text-[#2a1407] mb-2">
                      ₹ {formatPrice(propertyDetailsData?.price)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {propertyDetailsData?.property_size
                        ? `${propertyDetailsData.property_size} ${propertyDetailsData.property_size_unit || 'sqft'}`
                        : 'Price per unit'}
                    </p>
                  </motion.div>

                  {/* Construction Status */}
                  <div className="flex items-center gap-2 text-sm justify-end">
                    <div className="h-2 w-2 rounded-full bg-yellow-600"></div>
                    <span className="text-gray-700 font-medium">Under Construction</span>
                  </div>
                  <p className="text-sm text-gray-600">Possession in October 2026</p>

                  <Button
                    type="button"
                    className="w-full lg:w-auto bg-[#2a1407] text-white hover:from-[#3b1804] hover:to-[#2a1407] px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Show Interest
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Overview Cards - Brand colors only */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {propertyOverviewCards.map((card, idx) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    whileHover={cardHover}
                    className="rounded-xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-4 text-center transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-yellow-300"
                  >
                    <div className="inline-flex p-2 rounded-lg mb-2 bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 shadow-sm">
                      <Icon size={20} className="text-yellow-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">{card.label}</p>
                    <p className="text-sm font-bold text-gray-900">{card.value || 'N/A'}</p>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Details Sections - rendered as stacked cards */}
            <motion.div variants={fadeInUp} className="bg-gradient-to-br from-white to-yellow-50/20 rounded-xl border border-yellow-200 overflow-hidden shadow-sm min-h-[900px]">
              <div className="p-6 space-y-10">
                {/* Overview */}
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Key Features */}
                  {keyFeatures.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-6 ">
                      {/* Features List */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#2a1407] mb-4">Key Features</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {keyFeatures.map((feature, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <CheckCircle2 size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>


                    </div>
                  )}

                  {/* Description */}
                  <div className="pt-4 border-t border-yellow-200">
                    <h3 className="text-xl font-bold text-[#2a1407] mb-4">About the Property</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {propertyDetailsData?.description ||
                        'This is a charming residential project spread across prime location. It features modern architecture with spacious apartments designed to provide comfort and luxury. The project enjoys excellent connectivity and is surrounded by all essential amenities including schools, hospitals, shopping centers, and recreational facilities.'}
                    </p>
                  </div>
                </motion.div>

                {/* Amenities */}
                <motion.div
                  key="amenities"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Amenities
                    title="Amenities"
                    PropertyAmenities={propertyDetailsData?.feature_values}
                  />
                </motion.div>

                {/* Conditional Ad Carousel - fills empty space when content is short */}
                {/* {((propertyDetailsData?.feature_values?.length || 0) < 3 || keyFeatures.length < 4) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-8 px-6 pb-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Featured Properties</h3>
                    {popularSimilarProperties && popularSimilarProperties.length > 0 ? (
                      <motion.div
                        className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg relative group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="w-full h-full relative"
                          animate={{
                            backgroundImage: popularSimilarProperties
                              .slice(0, 8)
                              .map((prop: any) => {
                                const primaryMedia = prop?.media?.find((m: any) => m.is_primary) || prop?.media?.[0]
                                return `url(${primaryMedia?.url || '/ads-1.jpg'})`
                              }),
                          }}
                          transition={{
                            duration: popularSimilarProperties.length * 2,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <p className="text-lg font-bold mb-1">Explore More Properties</p>
                            <p className="text-sm opacity-90">Discover your dream home today</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg relative group"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="w-full h-full"
                          animate={{
                            backgroundImage: [
                              'url(/ads-1.jpg)',
                              'url(/ads-2.jpg)',
                              'url(/ads-3.jpg)',
                              'url(/ads-4.jpg)',
                              'url(/ads-5.jpg)',
                              'url(/ads-6.jpg)',
                              'url(/ads-7.jpg)',
                              'url(/ads-8.jpg)',
                            ],
                          }}
                          transition={{
                            duration: 16,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          style={{
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                          <div className="absolute bottom-6 left-6 right-6 text-white">
                            <p className="text-lg font-bold mb-1">Explore More Properties</p>
                            <p className="text-sm opacity-90">Discover your dream home today</p>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                )} */}

                {/* (Floor Plans and About Project mock sections removed) */}

              </div>
            </motion.div>

          </div>

          {/* Right Sidebar */}
          <motion.aside
            variants={fadeInUp}
            className="space-y-6"
          >
            {/* Approve / Reject Section - Moved Above Property Insights */}
            {propertyDetailsData?.approval_status === 'UNDER_REVIEW' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-white to-yellow-50/20 border border-yellow-200 rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-[#2a1407] text-center mb-5">Approve or Reject</h2>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setApproveOrRejectModalOpen(true)
                      setApproveOrRejectReason('approve')
                    }}
                    className="px-6 py-2.5 rounded-lg border border-emerald-600 text-emerald-700 font-medium hover:bg-emerald-600 hover:text-white transition-all"
                  >
                    Approve
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setApproveOrRejectModalOpen(true)
                      setApproveOrRejectReason('reject')
                    }}
                    className="px-6 py-2.5 rounded-lg border border-red-600 text-red-600 font-medium hover:bg-red-600 hover:text-white transition-all"
                  >
                    Reject
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Property Insights - compact summary cards */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Property Insights</h3>
                  <p className="text-xs text-gray-500 mt-1">Quick snapshot of engagement on this listing</p>
                </div>
                <span className="text-xs font-medium text-gray-500">Analytics &amp; Statistics</span>
              </div>
              <div className="grid md:grid-cols-3 lg:grid-cols-1 gap-4">
                {propertyInsights.map((insight, idx) => {
                  const Icon = insight.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ y: -3, boxShadow: '0 18px 40px rgba(0,0,0,0.07)' }}
                      className="relative flex flex-col justify-between rounded-2xl bg-gradient-to-br from-yellow-50/50 to-white px-5 py-4 border border-yellow-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl bg-white shadow-sm border border-yellow-100 flex items-center justify-center">
                            <Icon size={22} className="text-yellow-600" />
                          </div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {insight.label}
                          </p>
                        </div>
                        <p className="text-2xl md:text-3xl font-extrabold text-[#2a1407]">{insight.value}</p>
                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((Number(insight.value) || 0) / 100 * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.15 }}
                          className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Contact Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="bg-gradient-to-br from-yellow-50 to-yellow-100/30 rounded-xl border border-yellow-200 p-6 shadow-sm"
            >
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2a1407] mb-4"
                >
                  <Users size={24} className="text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Why Search Alone?</h3>
                <p className="text-sm text-gray-600">Looking for your dream home?</p>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  { icon: Home, text: 'Free site visits to explore your options' },
                  { icon: TrendingUp, text: 'Expert insights on locations & neighborhoods' },
                  { icon: Shield, text: 'Pros & cons reviewed by experts' },
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 text-sm text-gray-700"
                    >
                      <Icon size={18} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span>{item.text}</span>
                    </motion.li>
                  )
                })}
              </ul>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all bg-white"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all bg-white"
                />
                <input
                  type="tel"
                  placeholder="Your Phone"
                  className="w-full px-4 py-3 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-400 transition-all bg-white"
                />
                  <Button
                    type="button"
                    className="w-full bg-[#2a1407] text-white hover:from-[#3b1804] hover:to-[#2a1407] py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Connect →
                  </Button>
              </div>
            </motion.div>

            {/* Contact Owner */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Owner</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <MessageSquare size={18} className="text-yellow-600" />
                  <span className="font-medium">{ownerNameDisplay}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={18} className="text-yellow-600" />
                  <span className="font-medium">{ownerPhoneDisplay}</span>
                </div>
              </div>

            <div className="space-y-3">
                <Button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="w-full bg-[#2a1407] text-white hover:bg-[#3b1804] py-3 rounded-lg font-semibold transition-all"
                >
                  <MessageSquare size={18} className="inline mr-2" />
                  Enquire Now
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 py-2.5 rounded-lg font-medium text-sm transition-all"
                  >
                    <Flag size={16} className="inline mr-1" />
                    Report
                  </Button>
                  <Button
                    type="button"
                    onClick={handleDownloadBrochure}
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 py-2.5 rounded-lg font-medium text-sm transition-all"
                  >
                    <Download size={16} className="inline mr-1" />
                    Brochure
                  </Button>
                </div>
                </div>
              </motion.div> */}
          </motion.aside>
        </div>
      </div>

      {/* Full-width Location Map Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="w-full py-8 md:py-12"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white shadow-md overflow-hidden">
            <div className="h-[400px] w-full">
              {/* Location (text only, map moved to full-width section below) */}
              <motion.div
                key="location"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2 p-8"
              >
                <h3 className="text-xl font-bold text-[#2a1407]">Location</h3>
                <p className="text-sm text-gray-600">
                  {propertyDetailsData?.address_line ||
                    'Located in a well-connected neighbourhood with easy access to schools, hospitals, shopping and public transport.'}
                </p>
              </motion.div>
              <MapView
                center={{
                  lat: Number(propertyDetailsData?.latitude) || 12.9177477,
                  lng: Number(propertyDetailsData?.longitude) || 80.2209669,
                }}
                zoom={14}
                markers={[
                  {
                    lat: Number(propertyDetailsData?.latitude) || 12.9177477,
                    lng: Number(propertyDetailsData?.longitude) || 80.2209669,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Property Video & Ads Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 md:px-8 py-8"
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-yellow-50 border border-yellow-200 flex items-center justify-center">
                  <Video size={18} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Virtual Property Tour</h3>
                  <p className="text-xs text-gray-500">Take a virtual walkthrough of this property</p>
                </div>
              </div>
            </div>
            <div className="relative w-full pb-[56.25%]">
              <iframe
                src={videoEmbedUrl}
                title={propertyDetailsData?.title || 'Project walkthrough video'}
                className="absolute inset-0 h-full w-full border-t border-gray-100 rounded-b-2xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </motion.div>

          {/* Interactive Ads / Promotions Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Interactive Fun Facts Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-2xl bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-200/70 p-5 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">✨ Discover</p>
                  <h3 className="text-lg font-bold text-[#2a1407] mt-1">Scratch to Reveal Fun Facts</h3>
                </div>
                <span className="px-2 py-1 rounded-full bg-yellow-500 text-[10px] font-semibold text-white uppercase tracking-wide">
                  Interactive
                </span>
              </div>

              {!funFactRevealed ? (
                <div className="relative">
                  <div
                    className="relative h-32 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg cursor-grab active:cursor-grabbing overflow-hidden"
                    onMouseDown={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = e.clientX - rect.left
                      const y = e.clientY - rect.top
                      const overlay = e.currentTarget.querySelector('.scratch-overlay') as HTMLElement
                      if (overlay) {
                        overlay.style.clipPath = `circle(35px at ${x}px ${y}px)`
                      }
                    }}
                    onMouseMove={(e) => {
                      if (e.buttons === 1) {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const y = e.clientY - rect.top
                        const overlay = e.currentTarget.querySelector('.scratch-overlay') as HTMLElement
                        if (overlay) {
                          const currentClip = overlay.style.clipPath
                          if (currentClip && currentClip.includes('circle')) {
                            overlay.style.clipPath = `circle(45px at ${x}px ${y}px)`
                          }
                        }
                        // Check if enough is revealed
                        const revealed = overlay?.style.clipPath || ''
                        if (revealed.includes('circle') && !revealed.includes('100%')) {
                          const match = revealed.match(/circle\((\d+)px/)
                          if (match && parseInt(match[1]) > 80) {
                            setFunFactRevealed(true)
                            const randomFact = propertyFunFacts[Math.floor(Math.random() * propertyFunFacts.length)]
                            setRevealedFacts([randomFact])
                          }
                        }
                      }
                    }}
                    onTouchMove={(e) => {
                      const touch = e.touches[0]
                      const rect = e.currentTarget.getBoundingClientRect()
                      const x = touch.clientX - rect.left
                      const y = touch.clientY - rect.top
                      const overlay = e.currentTarget.querySelector('.scratch-overlay') as HTMLElement
                      if (overlay) {
                        overlay.style.clipPath = `circle(50px at ${x}px ${y}px)`
                        setTimeout(() => {
                          setFunFactRevealed(true)
                          const randomFact = propertyFunFacts[Math.floor(Math.random() * propertyFunFacts.length)]
                          setRevealedFacts([randomFact])
                        }, 500)
                      }
                    }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <p className="text-xl font-bold text-yellow-600 mb-2">🎯 Property Highlights</p>
                      <p className="text-sm text-gray-700 text-center">Scratch to discover interesting facts about this property!</p>
                    </div>
                    <div className="scratch-overlay absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800"
                      style={{ clipPath: 'circle(100% at 50% 50%)' }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">👆 Drag your mouse or finger to scratch!</p>
                </div>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-3"
                >
                  {revealedFacts.map((fact, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg p-4 border border-yellow-200"
                    >
                      <p className="text-sm font-semibold text-gray-800">{fact}</p>
                    </motion.div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      if (revealedFacts.length < 3) {
                        const remainingFacts = propertyFunFacts.filter(f => !revealedFacts.includes(f))
                        if (remainingFacts.length > 0) {
                          const randomFact = remainingFacts[Math.floor(Math.random() * remainingFacts.length)]
                          setRevealedFacts([...revealedFacts, randomFact])
                          toast.success('Another fun fact revealed!')
                        } else {
                          toast('All facts revealed!', { icon: '✨' })
                        }
                      }
                    }}
                    className="w-full bg-yellow-500 text-white hover:bg-yellow-600 py-2 rounded-lg text-xs font-semibold transition-all"
                  >
                    {revealedFacts.length < 3 ? '🎲 Reveal Another Fact' : '✨ All Facts Revealed!'}
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Interactive Quiz for Recommendations */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl bg-gradient-to-br from-white to-yellow-50/20 border border-yellow-200 p-5 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-50 to-yellow-100/50 border border-yellow-200 flex items-center justify-center shadow-sm">
                  <Home size={18} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">🎯 Quick Match</p>
                  <p className="text-sm font-semibold text-[#2a1407]">Find Your Perfect Home</p>
                </div>
              </div>

              {!showQuizResult ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Your Budget Range</label>
                    <select
                      value={quizAnswers.budget}
                      onChange={e => setQuizAnswers({ ...quizAnswers, budget: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">Select budget</option>
                      {quickBudgetOptions.map(option => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Preferred Location</label>
                    <select
                      value={quizAnswers.location}
                      onChange={e => setQuizAnswers({ ...quizAnswers, location: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">Select location</option>
                      {quickLocationOptions.map(city => (
                        <option key={city.value} value={city.value}>
                          {city.label} {city.count ? `(${city.count})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    type="button"
                    disabled={isQuizLoading}
                    onClick={async () => {
                      if (!quizAnswers.budget || !quizAnswers.location) {
                        toast.error('Please fill all fields')
                        return
                      }

                      setIsQuizLoading(true)
                      setQuizResultCount(null)
                      try {
                        const selectedBudget = quickBudgetOptions.find(b => b.id === quizAnswers.budget)
                        const price_min = selectedBudget?.min
                        const price_max = selectedBudget?.max

                        const params: Record<string, any> = {
                          page: 1,
                          limit: 1,
                          city: quizAnswers.location,
                        }
                        if (price_min != null) params.price_min = price_min
                        if (price_max != null) params.price_max = price_max

                        const res = await getMethod<any>(appEndpoints.publicSearchProperties, params)
                        const totalFromApi = (res?.data as any)?.total
                        const count =
                          typeof totalFromApi === 'number'
                            ? totalFromApi
                            : Array.isArray((res?.data as any)?.data)
                              ? (res.data as any).data.length
                              : 0

                        setQuizResultCount(count)
                        setShowQuizResult(true)
                        toast.success('Matches updated from backend')
                      } catch (err) {
                        console.error('Quick match search failed', err)
                        toast.error('Failed to fetch matches')
                      } finally {
                        setIsQuizLoading(false)
                      }
                    }}
                    className="w-full bg-[#2a1407] text-white hover:from-[#3b1804] hover:to-[#2a1407] disabled:opacity-60 py-2.5 rounded-lg text-xs font-semibold transition-all"
                  >
                    {isQuizLoading ? 'Searching…' : '🎯 Get My Matches'}
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-3"
                >
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <p className="text-lg font-bold text-[#2a1407] mb-2">✨ Perfect Matches Found!</p>
                    <p className="text-sm text-gray-700 mb-3">
                      {quizResultCount === null && isQuizLoading && (
                        <>Calculating the best matches for you…</>
                      )}
                      {quizResultCount !== null && !isQuizLoading && (
                        <>
                          We found{' '}
                          <span className="font-bold text-yellow-600">
                            {quizResultCount} propert{quizResultCount === 1 ? 'y' : 'ies'}
                          </span>{' '}
                          matching your preferences
                        </>
                      )}
                      {quizResultCount === null && !isQuizLoading && (
                        <>We found some properties matching your preferences.</>
                      )}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-semibold">
                        {quizAnswers.budget
                          .replace('-', ' - ')
                          .replace('under-', 'Under ')
                          .replace('above-', 'Above ')}
                      </span>
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full font-semibold capitalize">
                        {quizAnswers.location}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      toast.success('Redirecting to property listings...')
                      router.push('/properties')
                    }}
                    className="w-full bg-[#2a1407] text-white hover:from-[#3b1804] hover:to-[#2a1407] py-2.5 rounded-lg text-xs font-semibold transition-all"
                  >
                    View Matched Properties →
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQuizResult(false)
                      setQuizAnswers({ budget: '', location: '' })
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Similar Projects Carousel Section */}
      {filteredSimilarProperties.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 md:px-8 py-12"
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-[#2a1407]">Similar Projects</h2>
              </div>
              <p className="text-gray-600">Explore other properties you might be interested in</p>
            </div>

            {/* Carousel Navigation Buttons */}
            {!isLoadingSimilar && !isLoadingPopularSimilar && filteredSimilarProperties.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (carouselRef.current) {
                      const cardWidth = 320 // Approximate card width with gap
                      carouselRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' })
                    }
                  }}
                  disabled={carouselScrollPosition === 0}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
                    carouselScrollPosition === 0
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-yellow-200 bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                  )}
                  aria-label="Previous properties"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (carouselRef.current) {
                      const cardWidth = 320
                      carouselRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
                    }
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-yellow-200 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-all"
                  aria-label="Next properties"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            )}
          </div>

          {isLoadingSimilar ? (
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              {/* Carousel Container */}
              <style jsx>{`
                .property-carousel::-webkit-scrollbar {
                  display: none;
                }
                .property-carousel {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              <div
                ref={carouselRef}
                onScroll={(e) => {
                  const target = e.target as HTMLDivElement
                  setCarouselScrollPosition(target.scrollLeft)
                }}
                className="property-carousel flex gap-6 overflow-x-auto scroll-smooth pb-4"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {filteredSimilarProperties.map((property: any, idx: number) => (
                  <motion.div
                    key={property.id || idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={cardHover}
                    className="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                    style={{ scrollSnapAlign: 'start' }}
                    onClick={() => router.push(`/propertyDetails/${property.id}`)}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={property.media?.[0]?.url || property.image || '/villa.png'}
                        alt={property.title || 'Property'}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {property.is_published && (
                          <span className="px-2 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold backdrop-blur-sm">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#2a1407] mb-1 line-clamp-1">{property.title || 'Property'}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-1 flex items-center gap-1">
                        <MapPin size={14} className="text-yellow-600 flex-shrink-0" />
                        {property.address_line || 'Location not available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Price</p>
                          <p className="text-lg font-bold text-[#2a1407]">
                            ₹{formatPrice(Number(property.price)) || 'Price on request'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Size</p>
                          <p className="text-sm font-semibold text-gray-700">
                            {property.property_size ? `${property.property_size} ${property.property_size_unit || 'sqft'}` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Scroll Indicator Dots */}
              {filteredSimilarProperties.length > 4 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: Math.ceil(filteredSimilarProperties.length / 4) }).map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "h-2 rounded-full transition-all",
                        Math.floor(carouselScrollPosition / 1280) === idx
                          ? "w-8 bg-yellow-600"
                          : "w-2 bg-gray-300"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.section>
      )}

      {/* Modals */}
      <ApproveOrRejectPropertyModal
        approveOrRejectModalOpen={approveOrRejectModalOpen}
        setApproveOrRejectModalOpen={setApproveOrRejectModalOpen}
        approveOrRejectReason={approveOrRejectReason}
        userId={user ? user?.id : ''}
        property={propertyDetailsData ? propertyDetailsData : ''}
        propertyRefresh={propertyDetailsRefresh}
      />

      <ReportPropertyModal
        reportModalOpen={reportModalOpen}
        setReportModalOpen={setReportModalOpen}
        propertyId={propertyId ? String(propertyId) : ''}
        propertyDetailsRefresh={propertyDetailsRefresh}
      />

      <EnquiryPropertyModal
        EnquiryModalOpen={enquiryModalOpen}
        setEnquiryModalOpen={setEnquiryModalOpen}
        propertyId={propertyId ? String(propertyId) : ''}
        propertyDetailsRefresh={propertyDetailsRefresh}
      />

      {/* Image Gallery Modal Carousel - Only show if there's an actual image */}
      <AnimatePresence>
        {selectedImageIndex !== null && galleryImages[selectedImageIndex] && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
              onClick={() => setSelectedImageIndex(null)}
            >
              <style jsx global>{`
                body {
                  overflow: hidden;
                }
              `}</style>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImageIndex(null)
                }}
                aria-label="Close gallery"
              >
                <X size={24} />
              </motion.button>

              {/* Navigation Buttons - Only show if there are actual images */}
              {apiImages.length > 1 && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (selectedImageIndex !== null) {
                        // Find previous actual image
                        let newIndex = selectedImageIndex - 1
                        while (newIndex >= 0 && !galleryImages[newIndex]) {
                          newIndex--
                        }
                        if (newIndex < 0) {
                          // Wrap to last actual image
                          newIndex = galleryImages.length - 1
                          while (newIndex >= 0 && !galleryImages[newIndex]) {
                            newIndex--
                          }
                        }
                        if (newIndex >= 0) setSelectedImageIndex(newIndex)
                      }
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (selectedImageIndex !== null) {
                        // Find next actual image
                        let newIndex = selectedImageIndex + 1
                        while (newIndex < galleryImages.length && !galleryImages[newIndex]) {
                          newIndex++
                        }
                        if (newIndex >= galleryImages.length) {
                          // Wrap to first actual image
                          newIndex = 0
                          while (newIndex < galleryImages.length && !galleryImages[newIndex]) {
                            newIndex++
                          }
                        }
                        if (newIndex < galleryImages.length) setSelectedImageIndex(newIndex)
                      }
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </motion.button>
                </>
              )}

              {/* Main Image */}
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative flex w-full max-w-6xl justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {galleryImages[selectedImageIndex] ? (
                  <Image
                    src={galleryImages[selectedImageIndex]}
                    alt={`Property image ${selectedImageIndex + 1}`}
                    width={1600}
                    height={900}
                    className="max-h-[90vh] w-auto object-contain rounded-lg select-none"
                    priority
                  />
                ) : (
                  <div className="max-h-[90vh] w-full max-w-6xl flex items-center justify-center bg-gray-800 rounded-lg">
                    <div className="text-center text-white">
                      <Camera size={64} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg opacity-75">Image not available</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Image Counter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium"
              >
                {selectedImageIndex + 1} / {apiImages.length || galleryImages.length}
              </motion.div>

              {/* Thumbnail Strip */}
              {galleryImages.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-4xl overflow-x-auto px-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  {galleryImages.map((img, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => img && setSelectedImageIndex(idx)}
                      disabled={!img}
                      className={cn(
                        "relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                        selectedImageIndex === idx
                          ? "border-yellow-500 scale-110"
                          : "border-white/30 opacity-60 hover:opacity-100",
                        !img && "bg-gray-800 border-gray-600"
                      )}
                    >
                      {img ? (
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <Camera size={20} className="text-gray-500" />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Keyboard Navigation */}
            {selectedImageIndex !== null && (
              <ImageCarouselKeyboardHandler
                currentIndex={selectedImageIndex}
                totalImages={apiImages.length}
                onNavigate={(dir) => {
                  if (dir === 'next') {
                    // Find next actual image
                    let newIndex = selectedImageIndex + 1
                    while (newIndex < galleryImages.length && !galleryImages[newIndex]) {
                      newIndex++
                    }
                    if (newIndex >= galleryImages.length) {
                      newIndex = 0
                      while (newIndex < galleryImages.length && !galleryImages[newIndex]) {
                        newIndex++
                      }
                    }
                    if (newIndex < galleryImages.length) setSelectedImageIndex(newIndex)
                  } else {
                    // Find previous actual image
                    let newIndex = selectedImageIndex - 1
                    while (newIndex >= 0 && !galleryImages[newIndex]) {
                      newIndex--
                    }
                    if (newIndex < 0) {
                      newIndex = galleryImages.length - 1
                      while (newIndex >= 0 && !galleryImages[newIndex]) {
                        newIndex--
                      }
                    }
                    if (newIndex >= 0) setSelectedImageIndex(newIndex)
                  }
                }}
                onClose={() => setSelectedImageIndex(null)}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </motion.main>
  )
}

// Keyboard Handler Component
const ImageCarouselKeyboardHandler = ({
  currentIndex,
  totalImages,
  onNavigate,
  onClose,
}: {
  currentIndex: number
  totalImages: number
  onNavigate: (dir: 'next' | 'prev') => void
  onClose: () => void
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        onNavigate('next')
      } else if (e.key === 'ArrowLeft') {
        onNavigate('prev')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, totalImages, onNavigate, onClose])

  return null
}

export default page
