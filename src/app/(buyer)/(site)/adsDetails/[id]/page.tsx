'use client'

import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import {
  Share2,
  Flag,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
  Eye,
  BarChart3,
  MessageSquareMore,
  Camera,
  Heart,
  Building2,
  Users,
  Home,
  TrendingUp,
  Shield,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
} from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

import Button from '@/components/ui/CustomComponent/Button/Button'
import CustomLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import ModalComponent from '@/components/ui/CustomComponent/Modal/ModalComponent'
import FavoriteButton from '@/components/ui/CustomComponent/FavoriteButton/FavoriteButton'
import MapView from '@/components/ui/map/MapView'
import ImageViewer from '@/components/ui/CustomComponent/ImageGallery/ImageGallery'
import { formatPrice } from '@/utils/converter/formatPrice'
import { useAdDetails } from '@/app/(buyer)/(site)/adsDetails/(hooks)/useAdDetails'
import { appEndpoints } from '@/services/endpoints'
import { postMethod, getMethod } from '@/services/service'
import { cn } from '@/lib/utils'

import ReportAdModal from './modal/ReportAdModal'
import EnquiryAdModal from './modal/EnquiryAdModal'
import { getUserRoles, hasRole, Roles } from '@/utils/roles/roles'
import EnquiryFormCard from '@/components/enquiry/forms/EnquiryFormCard'

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const AdsDetailsPage = () => {
  const params = useParams<{ id: string | string[] }>()
  const router = useRouter()
  const { user } = useAuth()
  const userRoles = getUserRoles(user)
  const isAdmin = hasRole(userRoles, [Roles.ADMIN])
  const isAgent = hasRole(userRoles, [Roles.AGENT])

  const adIdParam = params?.id
  const adId = Array.isArray(adIdParam) ? adIdParam[0] : adIdParam

  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false)
  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [approveAction, setApproveAction] = useState<'approve' | 'reject' | null>(null)
  const [approvalComment, setApprovalComment] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [approvalSubmitting, setApprovalSubmitting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [carouselScrollPosition, setCarouselScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement | null>(null)

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  const { adDetails, adDetailsLoading, adDetailsError, adDetailsRefresh, handleAdApprovalAction } = useAdDetails({ id: adId })

  const reviewerId = user ? user?.id : null

  // Process Media (Images & Video)
  const { apiImages, galleryImages, totalImageCount } = useMemo(() => {
    if (!adDetails) return { apiImages: [], galleryImages: [], totalImageCount: 0 }

    const allMedia = adDetails.media || adDetails.images || []

    // Sort media: Primary first, then by sort order (if available)
    const sortedMedia = [...allMedia].sort((a: any, b: any) => {
      if (a.is_primary && !b.is_primary) return -1
      if (!a.is_primary && b.is_primary) return 1
      return (a.sort_order || 0) - (b.sort_order || 0)
    })

    // Map to unified structure
    const processedMedia = sortedMedia
      .filter((m: any) => m.url && m.url.trim() !== '')
      .map((m: any) => ({
        url: m.url,
        type: m.media_type === 'VIDEO' ? 'video' : 'image',
        is_primary: m.is_primary,
      }))

    // Gallery grid logic (max 4 items)
    const gallerySlice = processedMedia.slice(0, 4)

    return {
      apiImages: processedMedia,
      galleryImages: gallerySlice,
      totalImageCount: processedMedia.length,
    }
  }, [adDetails])

  const getVideoEmbedUrl = useCallback((url: string) => {
    const fallback = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    if (!url) return fallback

    if (url.includes('youtube.com/watch')) {
      return url.replace('watch?v=', 'embed/')
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/')
    }
    return url
  }, [])

  const formattedAddress = useMemo(
    () => [adDetails?.address_line, adDetails?.city, adDetails?.state].filter(Boolean).join(', '),
    [adDetails?.address_line, adDetails?.city, adDetails?.state],
  )

  useEffect(() => {
    if (!adId) {
      router.replace('/ads/list')
    }
  }, [adId, router])

  // Property Insights Data - matching propertyDetails page style
  const adInsights = useMemo(
    () => [
      {
        label: 'Page Views',
        value: adDetails?.view_count ?? 0,
        icon: Eye,
      },
      {
        label: 'Total Enquiries',
        value: adDetails?.contact_count ?? 0,
        icon: MessageSquare,
      },
      {
        label: 'Number of Favourites',
        value: adDetails?.favorite_count ?? 0,
        icon: Heart,
      },
    ],
    [adDetails],
  )

  // Fetch similar ads from backend
  const [similarAds, setSimilarAds] = useState<any[]>([])
  const [isLoadingSimilarAds, setIsLoadingSimilarAds] = useState(false)

  useEffect(() => {
    const fetchSimilarAds = async () => {
      if (!adDetails?.category_id && !adDetails?.city) return
      setIsLoadingSimilarAds(true)
      try {
        const params: Record<string, any> = {
          page: 1,
          limit: 8,
        }
        if (adDetails.city) params.city = adDetails.city
        if (adDetails.category_id) params.category_id = adDetails.category_id

        const response: any = await getMethod(appEndpoints.getAllAds, params)
        const ads = response?.data?.data || response?.data || (Array.isArray(response) ? response : [])
        // Exclude current ad
        const filtered = Array.isArray(ads) ? ads.filter((ad: any) => ad.id !== adId).slice(0, 8) : []
        setSimilarAds(filtered)
      } catch (err) {
        console.error('Failed to fetch similar ads:', err)
        setSimilarAds([])
      } finally {
        setIsLoadingSimilarAds(false)
      }
    }

    if (adDetails) {
      fetchSimilarAds()
    }
  }, [adDetails, adId])

  const detailItems = useMemo(
    () => [
      { label: 'Category', value: adDetails?.category_id ?? '-' },
      { label: 'Status', value: adDetails?.status ?? '-' },
      { label: 'Approval', value: adDetails?.approval_status ?? '-' },
      {
        label: 'Price',
        value: adDetails?.price ? `₹ ${formatPrice(Number(adDetails.price))}` : '-',
      },
      { label: 'Negotiable', value: adDetails?.is_negotiable ? 'Yes' : 'No' },
      {
        label: 'Created On',
        value: adDetails?.created_at ? new Date(adDetails.created_at).toLocaleDateString() : '-',
      },
    ],
    [adDetails],
  )

  const handleFavorite = useCallback(
    async (adId: string) => {
      try {
        await postMethod(appEndpoints.toggleFavorite, { entity_type: 'ad', entity_id: adId })
        adDetailsRefresh()
      } catch (err) {
        console.error('Failed to toggle favorite', err)
      }
    },
    [adDetailsRefresh],
  )

  const handleShare = useCallback(async () => {
    if (typeof window !== 'undefined' && adId) {
      setIsSharing(true)
      try {
        const url = window.location.href
        if (navigator.share) {
          await navigator.share({
            title: adDetails?.title || 'Ad',
            text: `Check out this ad: ${adDetails?.title}`,
            url: url,
          })
          toast.success('Shared successfully')
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(url)
          toast.success('Link copied to clipboard!')
        } else {
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
  }, [adId, adDetails?.title])

  const openApproveModal = useCallback((action: 'approve' | 'reject') => {
    setApproveAction(action)
    setApprovalComment('')
    setRejectReason('')
    setApproveModalOpen(true)
  }, [])

  const closeApproveModal = useCallback(() => {
    setApproveModalOpen(false)
    setApproveAction(null)
  }, [])

  const handleApproveSubmit = useCallback(async () => {
    if (!adDetails || !approveAction || !reviewerId) return
    setApprovalSubmitting(true)
    const success = await handleAdApprovalAction(adDetails.id, reviewerId, approveAction, {
      comment: approvalComment,
      rejectReason,
    })
    setApprovalSubmitting(false)
    if (success) {
      closeApproveModal()
    }
  }, [adDetails, approveAction, reviewerId, handleAdApprovalAction, approvalComment, rejectReason, closeApproveModal])

  const handleEnquiryAds = async (values: any, { resetForm }: any) => {
    try {
      const payload = {
        entity_type: values.entity_type,
        entity_id: values.entity_id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
      }

      const response = await postMethod(appEndpoints.createEnquiry, payload)

      if (Number(response.status) === 201) {
        toast.success('Enquiry sent successfully')
        adDetailsRefresh()
      } else {
        toast.error(response.message || 'Failed to submit enquiry')
      }
    } catch (err) {
      console.error('Failed to send enquiry', err)
      toast.error('Unable to send enquiry right now')
    }
  }

  const enquiryPrefillValues = useMemo(
    () => ({
      name: (user?.firstName || '') + ' ' + (user?.lastName || ''),
      email: user?.email || '',
      phone: user?.phoneNumber || '',
    }),
    [user],
  )

  if (adDetailsLoading) {
    return <CustomLoader text="Loading ad details..." />
  }

  if (adDetailsError || !adDetails) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-4">
        <div className="bg-white shadow-md rounded-2xl p-8 max-w-md w-full text-center">
          <p className="text-gray-700 text-lg font-medium mb-4">Unable to load ad details right now</p>

          <p className="text-gray-500 text-sm mb-6">Please check your connection or try again.</p>

          <Button onClick={() => adDetailsRefresh()} className="bg-[#2a1407] text-white px-6 py-2 rounded-lg hover:bg-[#8f2424] transition">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // adImages and formattedAddress are now defined at the top with useMemo

  return (
    <motion.main initial="hidden" animate="visible" variants={staggerContainer} className="w-full bg-gray-50 min-h-screen">
      {/* Hero Section with Image Gallery */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Image Gallery */}
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
                  <>
                    <Image
                      src={galleryImages[0].url}
                      alt="Ad main media"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      priority
                    />
                    {galleryImages[0].type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                          <Play className="text-white fill-white ml-1" size={32} />
                        </div>
                      </div>
                    )}
                  </>
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
                  onClick={() => galleryImages[0] && setSelectedImageIndex(0)}
                  style={{ cursor: galleryImages[0] ? 'pointer' : 'default' }}
                >
                  {galleryImages[0] ? (
                    <>
                      <Image
                        src={galleryImages[0].url}
                        alt="Ad main media"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority
                      />
                      {galleryImages[0].type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                            <Play className="text-white fill-white ml-1" size={32} />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Camera size={48} className="text-gray-400" />
                    </div>
                  )}
                </motion.div>

                {/* Small Right Image */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative h-full group overflow-hidden rounded-r-2xl"
                  onClick={() => galleryImages[1] && setSelectedImageIndex(1)}
                  style={{ cursor: galleryImages[1] ? 'pointer' : 'default' }}
                >
                  {galleryImages[1] ? (
                    <>
                      <Image
                        src={galleryImages[1].url}
                        alt="Ad media 2"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {galleryImages[1].type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                            <Play className="text-white fill-white ml-1" size={24} />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Camera size={48} className="text-gray-400" />
                    </div>
                  )}
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
                  {galleryImages[0] ? (
                    <>
                      <Image
                        src={galleryImages[0].url}
                        alt="Ad main media"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority
                      />
                      {galleryImages[0].type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                            <Play className="text-white fill-white ml-1" size={32} />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Camera size={48} className="text-gray-400" />
                    </div>
                  )}
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
                      onClick={() => galleryImages[1] && setSelectedImageIndex(1)}
                      style={{ cursor: galleryImages[1] ? 'pointer' : 'default' }}
                    >
                      <Image
                        src={galleryImages[1].url}
                        alt="Ad media 2"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {galleryImages[1].type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                            <Play className="text-white fill-white ml-1" size={24} />
                          </div>
                        </div>
                      )}

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
                        onClick={() => galleryImages[2] && setSelectedImageIndex(2)}
                        style={{ cursor: galleryImages[2] ? 'pointer' : 'default' }}
                      >
                        <Image
                          src={galleryImages[2].url}
                          alt="Ad media 3"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {galleryImages[2].type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                              <Play className="text-white fill-white ml-1" size={16} />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      </motion.div>
                    )}

                    {/* Bottom Right: either video tile or 4th image / view-all */}
                    {galleryImages[3] && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="relative group overflow-hidden rounded-br-2xl cursor-pointer"
                        onClick={() => {
                          if (galleryImages[3]) {
                            setSelectedImageIndex(3)
                          }
                        }}
                      >
                        <Image
                          src={galleryImages[3].url}
                          alt="Ad media 4"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {galleryImages[3].type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center">
                              <Play className="text-white fill-white ml-1" size={16} />
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        {totalImageCount > galleryImages.length && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white cursor-pointer group-hover:bg-black/70 transition-colors">
                            <div className="text-center">
                              <Camera size={24} className="mx-auto mb-1" />
                              <p className="text-sm font-semibold">View All</p>
                              <p className="text-xs">{totalImageCount} Items</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Floating Action Buttons */}
            <div className="absolute top-22 right-6 flex gap-3 z-40">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                disabled={isSharing}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg transition hover:bg-white hover:text-[#2a1407] disabled:opacity-50"
                aria-label="Share ad"
              >
                <Share2 size={18} />
              </motion.button>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
                <button
                  onClick={() => handleFavorite(adDetails.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg transition hover:bg-white hover:text-[#2a1407]"
                  aria-label="Favorite ad"
                >
                  <Heart size={18} className={adDetails?.is_user_favorite ? 'fill-red-500 text-red-500' : ''} />
                </button>
                {(adDetails?.favorite_count ?? 0) > 0 && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2a1407] text-[10px] font-semibold text-yellow-200 shadow-md">
                    {adDetails?.favorite_count ?? 0}
                  </span>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Ad Header Card */}
          <motion.div variants={fadeInUp} className="relative -mt-20 mx-4 md:mx-8 z-10">
            <div className="bg-gradient-to-br from-white to-yellow-50/20 rounded-2xl shadow-xl border border-yellow-200 p-6 md:p-8">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Left Section */}
                <div className="flex-1 space-y-4">
                  {/* Badge - Category */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-[#2a1407] text-xs font-semibold uppercase">
                      {adDetails?.category?.name || 'AD'}
                    </span>
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-[#2a1407] mb-2">{adDetails.title || 'Ad Title'}</h1>
                    <p className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                      <MapPin size={18} className="text-yellow-600 flex-shrink-0" />
                      <span>{formattedAddress || 'Location not provided'}</span>
                    </p>
                  </div>

                  {/* Contact Owner (header area) */}
                  <div className="pt-4 mt-2 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center">
                        <Building2 size={20} className="text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{adDetails.contact_name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{adDetails.contact_phone || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Actions stacked below owner info */}
                    <div className="mt-4 space-y-3 max-w-md">
                      <div className="flex gap-3 w-full">
                        <Button
                          type="button"
                          onClick={() => setReportModalOpen(true)}
                          className="flex-1 bg-white border border-yellow-200 rounded-full py-2.5 px-4 text-sm text-gray-700 hover:bg-yellow-50 flex items-center justify-center gap-1 transition-all"
                        >
                          <Flag size={16} />
                          <span>Report</span>
                        </Button>
                        {/* <Button
                          type="button"
                          onClick={() => setEnquiryModalOpen(true)}
                          className="flex-1 bg-[#2a1407] text-white rounded-full py-2.5 px-4 text-sm hover:bg-[#2a1407] flex items-center justify-center gap-1 transition-all"
                        >
                          <MessageSquare size={16} />
                          <span>Enquire</span>
                        </Button> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Price */}
                <div className="lg:text-right space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-xl p-6 border border-yellow-200 shadow-sm"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Price</p>
                    <p className="text-3xl md:text-4xl font-bold text-[#2a1407] mb-2">₹ {formatPrice(Number(adDetails.price))}</p>
                    <p className="text-sm text-gray-600">{adDetails.is_negotiable ? 'Negotiable' : 'Fixed Price'}</p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.section variants={fadeInUp} className="lg:col-span-2 space-y-8">
            {/* Detail Cards */}
            {/* <motion.div variants={fadeInUp} className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {detailItems.map((info, idx) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="rounded-xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-4 text-center transition-all cursor-pointer shadow-sm hover:shadow-md hover:border-yellow-300"
                >
                  <p className="text-xs font-semibold text-gray-600 mb-1">{info.label}</p>
                  <p className="text-sm font-bold text-gray-900 break-words">{info.value}</p>
                </motion.div>
              ))}
            </motion.div> */}

            {/* Description */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-br from-white to-yellow-50/20 rounded-xl border border-yellow-200 overflow-hidden shadow-sm min-h-[200px]"
            >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-[#2a1407]">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{adDetails.description || 'No description provided.'}</p>
              </div>
            </motion.div>

            {/* Location Map Section - In same row as sidebar */}
            {adDetails && (adDetails.latitude || adDetails.longitude) && (
              <motion.div
                variants={fadeInUp}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="rounded-3xl border border-gray-200 bg-white shadow-md overflow-hidden"
              >
                <div className="h-[400px] w-full">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-2 p-8">
                    <h3 className="text-xl font-bold text-[#2a1407]">Location</h3>
                    <p className="text-sm text-gray-600">{formattedAddress || 'Location not provided'}</p>
                  </motion.div>
                  <MapView
                    center={{
                      lat: Number(adDetails.latitude) || 12.9177477,
                      lng: Number(adDetails.longitude) || 80.2209669,
                    }}
                    zoom={14}
                    markers={[
                      {
                        lat: Number(adDetails.latitude) || 12.9177477,
                        lng: Number(adDetails.longitude) || 80.2209669,
                      },
                    ]}
                  />
                </div>
              </motion.div>
            )}
          </motion.section>

          <motion.aside
            variants={fadeInUp}
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {adDetails.approval_status === 'UNDER_REVIEW' && isAdmin && (
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.01 }}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col gap-5"
              >
                <h3 className="text-lg font-semibold text-center">Approve or Reject the Ad</h3>
                <div className="flex items-center justify-center gap-6">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      className="px-6 py-2.5 rounded-lg border border-green-600 text-green-700 font-medium shadow-sm hover:bg-green-600 hover:text-white transition-all"
                      onClick={() => openApproveModal('approve')}
                    >
                      Approve
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      type="button"
                      className="px-6 py-2.5 rounded-lg border border-red-600 text-red-600 font-medium shadow-sm hover:bg-red-600 hover:text-white transition-all"
                      onClick={() => openApproveModal('reject')}
                    >
                      Reject
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Property Insights - matching propertyDetails page style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                {adInsights.map((insight, idx) => {
                  const Icon = insight.icon
                  const isPrivileged = (insight.label === 'Number of Reports' || insight.label === 'Total Enquiries') && (isAdmin || isAgent)
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      whileHover={{ y: -3, boxShadow: '0 18px 40px rgba(0,0,0,0.07)' }}
                      className={`relative flex flex-col justify-between rounded-2xl bg-gradient-to-br from-yellow-50/50 to-white px-5 py-4 border border-yellow-100 ${
                        isPrivileged ? 'cursor-pointer hover:shadow-md' : ''
                      }`}
                      role={isPrivileged ? 'button' : undefined}
                      tabIndex={isPrivileged ? 0 : undefined}
                      onClick={() => {
                        if (!isPrivileged) return
                        if (insight.label === 'Number of Reports')
                          isAdmin ? router.push(`/admin/dashboard/ads-reports`) : router.push(`/admin/dashboard/ads-reports?adsId=${adId}`)
                        if (insight.label === 'Total Enquiries')
                          isAdmin ? router.push(`/admin/dashboard/ads-enquiry`) : router.push(`/admin/dashboard/ads-enquiry?adsId=${adId}`)
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 rounded-2xl bg-white shadow-sm border border-yellow-100 flex items-center justify-center">
                            <Icon size={22} className="text-yellow-600" />
                          </div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{insight.label}</p>
                        </div>
                        <p className="text-2xl md:text-3xl font-extrabold text-[#2a1407]">{insight.value}</p>
                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(((Number(insight.value) || 0) / 100) * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: idx * 0.15 }}
                          className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600"
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Why Search Alone */}
            <EnquiryFormCard Id={adDetails.id} entityType="ad" handleSubmit={handleEnquiryAds} defaultValues={enquiryPrefillValues} />
          </motion.aside>
        </div>
      </div>

      {/* Similar Ads Carousel Section */}
      {similarAds.length > 0 && (
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
                <h2 className="text-3xl md:text-4xl font-bold text-[#2a1407]">Similar Ads</h2>
              </div>
              <p className="text-gray-600">Explore other ads you might be interested in</p>
            </div>

            {/* Carousel Navigation Buttons */}
            {!isLoadingSimilarAds && similarAds.length > 0 && (
              <div className="hidden md:flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    if (carouselRef.current) {
                      const cardWidth = 320
                      carouselRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' })
                    }
                  }}
                  disabled={carouselScrollPosition === 0}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border transition-all',
                    carouselScrollPosition === 0
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-yellow-200 bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
                  )}
                  aria-label="Previous ads"
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
                  aria-label="Next ads"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            )}
          </div>

          {isLoadingSimilarAds ? (
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <style jsx>{`
                .ads-carousel::-webkit-scrollbar {
                  display: none;
                }
                .ads-carousel {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>
              <div
                ref={carouselRef}
                onScroll={e => {
                  const target = e.target as HTMLDivElement
                  setCarouselScrollPosition(target.scrollLeft)
                }}
                className="ads-carousel flex gap-6 overflow-x-auto scroll-smooth pb-4"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {similarAds.map((ad: any, idx: number) => (
                  <motion.div
                    key={ad.id || idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
                    className="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
                    style={{ scrollSnapAlign: 'start' }}
                    onClick={() => router.push(`/adsDetails/${ad.id}`)}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={ad.images?.[0]?.url || ad.image || '/villa.png'}
                        alt={ad.title || 'Ad'}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#2a1407] mb-1 line-clamp-1">{ad.title || 'Ad'}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-1 flex items-center gap-1">
                        <MapPin size={14} className="text-yellow-600 flex-shrink-0" />
                        {ad.address_line || ad.city || 'Location not available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Price</p>
                          <p className="text-lg font-bold text-[#2a1407]">{ad.price ? `₹${formatPrice(Number(ad.price))}` : 'Price on request'}</p>
                        </div>
                        {ad.is_negotiable && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Negotiable</p>
                            <p className="text-sm font-semibold text-gray-700">Yes</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Scroll Indicator Dots */}
              {similarAds.length > 4 && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: Math.ceil(similarAds.length / 4) }).map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'h-2 rounded-full transition-all',
                        Math.floor(carouselScrollPosition / 1280) === idx ? 'w-8 bg-yellow-600' : 'w-2 bg-gray-300',
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.section>
      )}

      <ReportAdModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} adId={adDetails.id} />
      <EnquiryAdModal open={enquiryModalOpen} onClose={() => setEnquiryModalOpen(false)} adId={adDetails.id} />

      <ModalComponent
        open={approveModalOpen}
        onClose={closeApproveModal}
        title={approveAction === 'approve' ? 'Approve Ad' : 'Reject Ad'}
        footer={
          <div className="flex justify-end gap-3">
            <Button className="border px-4 py-2 text-sm" onClick={closeApproveModal} disabled={approvalSubmitting}>
              Cancel
            </Button>
            <Button className="bg-[#2a1407] text-white px-4 py-2 text-sm" onClick={handleApproveSubmit} disabled={approvalSubmitting}>
              {approvalSubmitting ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Are you sure you want to <span className="font-semibold">{approveAction}</span> the ad{' '}
            <span className="font-semibold">{adDetails.title}</span>?
          </p>

          {approveAction === 'reject' && (
            <>
              <select
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-[#2a1407] focus:ring-[#2a1407]"
              >
                <option value="">Select a reason</option>
                <option value="FAKE_INFO">Fake Information</option>
                <option value="SCAM">Scam / Fraudulent</option>
                <option value="INAPPROPRIATE">Inappropriate Content</option>
                <option value="OTHER">Other</option>
              </select>

              <textarea
                value={approvalComment}
                onChange={e => setApprovalComment(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm focus:border-[#2a1407] focus:ring-[#2a1407]"
                placeholder="Rejection notes (optional)"
                rows={3}
              />
            </>
          )}
        </div>
      </ModalComponent>

      {/* Image Gallery Carousel Overlay */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm"
              onClick={() => setSelectedImageIndex(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[70] flex flex-col pointer-events-none"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 pointer-events-auto">
                <div className="text-white/90">
                  <p className="font-medium text-lg">{adDetails?.title}</p>
                  <p className="text-sm opacity-70">
                    {selectedImageIndex + 1} / {totalImageCount}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Main Image */}
              <div className="flex-1 relative flex items-center justify-center p-4 pointer-events-auto">
                <motion.button
                  className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  onClick={e => {
                    e.stopPropagation()
                    setSelectedImageIndex(prev => (prev !== null && prev > 0 ? prev - 1 : totalImageCount - 1))
                  }}
                >
                  <ChevronLeft size={24} />
                </motion.button>

                <div className="relative h-full w-full max-w-5xl" onClick={e => e.stopPropagation()}>
                  <AnimatePresence>
                    <motion.div
                      key={selectedImageIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="relative h-full w-full flex items-center justify-center"
                    >
                      {apiImages[selectedImageIndex] ? (
                        apiImages[selectedImageIndex].type === 'video' ? (
                          <div className="w-full h-full md:h-[80%] aspect-video bg-black rounded-lg overflow-hidden">
                            <iframe
                              src={getVideoEmbedUrl(apiImages[selectedImageIndex].url)}
                              title="Property Video"
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <Image
                            src={apiImages[selectedImageIndex].url}
                            alt={`Gallery media ${selectedImageIndex + 1}`}
                            fill
                            className="object-contain"
                            quality={100}
                            priority
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                          <Camera size={48} className="opacity-50" />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <motion.button
                  className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  onClick={e => {
                    e.stopPropagation()
                    setSelectedImageIndex(prev => (prev !== null && prev < totalImageCount - 1 ? prev + 1 : 0))
                  }}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>

              {/* Thumbnails Strip */}
              {galleryImages.length > 0 && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="h-24 bg-black/40 backdrop-blur-md flex items-center gap-2 px-4 overflow-x-auto pointer-events-auto"
                >
                  {apiImages.map((img: any, idx: number) => {
                    const hasValidImage = img.url && img.url.trim() !== ''
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => hasValidImage && setSelectedImageIndex(idx)}
                        disabled={!hasValidImage}
                        className={cn(
                          'relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all',
                          selectedImageIndex === idx ? 'border-yellow-500 scale-110' : 'border-white/30 opacity-60 hover:opacity-100',
                          !hasValidImage && 'bg-gray-800 border-gray-600',
                        )}
                      >
                        {hasValidImage ? (
                          img.type === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center bg-black">
                              <Play size={20} className="text-white" />
                            </div>
                          ) : (
                            <Image src={img.url} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <Camera size={20} className="text-gray-500" />
                          </div>
                        )}
                      </motion.button>
                    )
                  })}
                </motion.div>
              )}
            </motion.div>

            {/* Keyboard Navigation */}
            {selectedImageIndex !== null && (
              <ImageCarouselKeyboardHandler
                currentIndex={selectedImageIndex}
                totalImages={totalImageCount}
                onNavigate={dir => {
                  if (dir === 'next') {
                    // Simple loop
                    setSelectedImageIndex(prev => (prev !== null ? (prev + 1) % totalImageCount : 0))
                  } else {
                    setSelectedImageIndex(prev => (prev !== null ? (prev - 1 + totalImageCount) % totalImageCount : totalImageCount - 1))
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

export default AdsDetailsPage
