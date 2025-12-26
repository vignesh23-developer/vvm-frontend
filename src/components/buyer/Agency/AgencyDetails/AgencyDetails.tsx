'use client'

import { useEffect, useMemo, useState, useRef, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import AgentCompanyProfile from '@/app/(buyer)/(site)/agents-list/(dto)/agentCompanyProfile'
import { getMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'
import CustumLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import {
  Loader2,
  CalendarDays,
  Building2,
  Handshake,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  CircleUserRound,
  ChevronLeft,
  ChevronRight,
  Captions,
  ChartBarStacked,
  Ruler,
  IndianRupee,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  Share2,
  BarChart3,
  Eye,
  MessageSquare,
} from 'lucide-react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/utils/converter/formatPrice'
import { PopularPropertyDto } from '@/components/buyer/LandingPage/PopularProperties/dto/popularPropertiesDto'
import MapView from '@/components/ui/map/MapView'
import { useSimilarProperties } from '@/app/(buyer)/(site)/propertyDetails/(hooks)/useSimilarProperties'
import { usePopularProperties } from '@/components/buyer/LandingPage/PopularProperties/hooks/usePopularProperties'
import { getUserRoles, hasRole, Roles } from '@/utils/roles/roles'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { maskName, maskPhone, maskEmail } from '@/utils/converter/maskedFirstTwoChar'

interface InfoItemProps {
  label: string
  value: string
  icon?: ReactNode
  href?: string
}

function InfoItem({ label, value, icon, href }: InfoItemProps) {
  const content = (
    <div className="flex items-start gap-3 rounded-2xl bg-stone-50/70 px-4 py-3">
      {icon ? <span className="mt-1 text-amber-600">{icon}</span> : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-stone-800">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block transition hover:text-amber-600">
        {content}
      </a>
    )
  }

  return content
}

const PROPERTIES_PER_PAGE = 6
const DEFAULT_TABS = ['All']

const extractYouTubeVideoId = (rawUrl: string): string | null => {
  try {
    const url = new URL(rawUrl)
    const host = url.hostname.toLowerCase()

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      return id ? id : null
    }

    if (host.endsWith('youtube.com')) {
      if (url.pathname === '/watch') {
        return url.searchParams.get('v')
      }

      const parts = url.pathname.split('/').filter(Boolean)
      if (parts[0] === 'embed' && parts[1]) return parts[1]
      if (parts[0] === 'shorts' && parts[1]) return parts[1]
    }
  } catch {
    // ignore invalid URLs
  }

  return null
}

const getMediaPreviewImageSrc = (rawUrl?: string | null): string => {
  if (!rawUrl) return '/villa.png'

  const youTubeId = extractYouTubeVideoId(rawUrl)
  if (youTubeId) {
    return `https://i.ytimg.com/vi/${youTubeId}/hqdefault.jpg`
  }

  return rawUrl
}

const getPropertyCategoryName = (property: any): string => {
  const rawName = property?.property_category?.name ?? ''

  return typeof rawName === 'string' ? rawName.trim() : ''
}

const getEmptyStateCopy = (tab?: string) => {
  if (!tab || tab === DEFAULT_TABS[0]) {
    return {
      title: 'No properties available yet',
      subtitle: "This agency hasn't published any properties just yet. Please check back soon.",
    }
  }

  return {
    title: `No ${tab} properties available`,
    subtitle: `This agency doesn't have any properties listed under ${tab.toLowerCase()} right now.`,
  }
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function AgencyDetails({ name }: { name: string }) {
  const t = useTranslations()
  const router = useRouter()
  const { user } = useAuth()
  const userRoles = getUserRoles(user)
  // Simplified flag: true if user is ADMIN or AGENT
  const isAdmin = hasRole(userRoles, [Roles.ADMIN])
  const isAgent = hasRole(userRoles, [Roles.AGENT])
  const [selectedTab, setSelectedTab] = useState<string>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSharing, setIsSharing] = useState<boolean>(false)
  const [agentIdProperties, setAgentIdProperties] = useState<any>(null)
  const [agencyData, setAgencyData] = useState<AgentCompanyProfile | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [carouselScrollPosition, setCarouselScrollPosition] = useState(0)
  const carouselRef = useRef<HTMLDivElement | null>(null)

  const normalizedProperties = useMemo(() => (Array.isArray(agentIdProperties) ? agentIdProperties : []), [agentIdProperties])

  // Derive tabs from property category names (property_category_name) instead of listing_type
  const availableTabs = useMemo(() => {
    if (!normalizedProperties.length) return [...DEFAULT_TABS]

    const categoryNames = normalizedProperties.map(getPropertyCategoryName).filter(Boolean)
    const uniqueCategories = Array.from(new Set(categoryNames))

    return [DEFAULT_TABS[0], ...uniqueCategories]
  }, [normalizedProperties])

  useEffect(() => {
    if (!availableTabs.length) return
    if (!availableTabs.includes(selectedTab as string)) {
      setSelectedTab(availableTabs[0])
    }
  }, [availableTabs, selectedTab])

  const filteredProperties = useMemo(() => {
    if (!normalizedProperties.length) return []
    if (!selectedTab || selectedTab === DEFAULT_TABS[0]) return normalizedProperties

    return normalizedProperties.filter((property: any) => getPropertyCategoryName(property) === selectedTab)
  }, [normalizedProperties, selectedTab])

  const totalPages = useMemo(() => {
    if (!filteredProperties.length) {
      return 0
    }
    return Math.ceil(filteredProperties.length / PROPERTIES_PER_PAGE)
  }, [filteredProperties])

  const paginatedProperties = useMemo(() => {
    if (!filteredProperties.length) {
      return []
    }
    const start = (currentPage - 1) * PROPERTIES_PER_PAGE
    return filteredProperties.slice(start, start + PROPERTIES_PER_PAGE)
  }, [filteredProperties, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedTab])

  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) {
        setCurrentPage(1)
      }
      return
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  useEffect(() => {
    setHovered(null)
  }, [currentPage, selectedTab])

  const handleSeeMoreClick = (propertyId: number) => {
    if (!propertyId) return
    router.push(`/propertyDetails/${propertyId}`)
  }

  const fetchAgentGetById = async (id: any) => {
    setIsLoading(true)
    try {
      const response: ResponseDTO = await getMethod(appEndpoints.getAgentPropertiesById + `?agentId=${id}`)

      // Normalize status check (api might return number or string)
      const ok = response && String(response.status) === '200'

      if (ok) {
        const payload = response?.data?.data ?? response?.data ?? null
        return payload as any
      }

      toast.error(response?.message || 'Failed to fetch agent details')
      return null
    } catch (error: any) {
      toast.error(error?.message || 'Failed to fetch agent details')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const fetchAgencyDetails = async () => {
      setIsFetching(true)
      setFetchError(null)

      try {
        const response: ResponseDTO = await getMethod(appEndpoints.getCompanyProfilesByName(name))

        if (!isMounted) return

        if (response?.status === '200') {
          const payload = Array.isArray(response?.data) ? (response.data as AgentCompanyProfile[])[0] : (response?.data as AgentCompanyProfile | null)
          const agentId = payload?.id
          fetchAgentGetById(agentId).then(agentProperties => {
            if (!agentProperties || !Array.isArray(agentProperties) || agentProperties.length === 0) {
              setAgentIdProperties([])
              setSelectedTab(DEFAULT_TABS[0])
              return
            }

            setAgentIdProperties(agentProperties)
            setSelectedTab(DEFAULT_TABS[0])
          })
          setAgencyData(payload ?? null)

          if (!payload) {
            setFetchError(t('AgencyDetails.no_results'))
          }
        } else {
          setAgencyData(null)
          setFetchError(response?.message || t('AgencyDetails.fetch_error'))
        }
      } catch (error: any) {
        if (!isMounted) return
        setAgencyData(null)
        const message = error?.message || t('AgencyDetails.fetch_error')
        setFetchError(message)
        toast.error(message)
      } finally {
        if (isMounted) {
          setIsFetching(false)
        }
      }
    }

    void fetchAgencyDetails()

    return () => {
      isMounted = false
    }
  }, [name, t])

  const establishedYear = useMemo(() => {
    if (!agencyData?.createdAt) return '—'
    const year = new Date(agencyData.createdAt).getFullYear()
    return Number.isNaN(year) ? '—' : String(year)
  }, [agencyData?.createdAt])

  const highlightStats = useMemo(
    () => [
      { labelKey: 'PropertiesListCard.operating_since', value: establishedYear, Icon: CalendarDays },
      { labelKey: 'PropertiesListCard.total_properties', value: agencyData?.agentStats?.totalPropertiesPosted ?? '—', Icon: Building2 },
      { labelKey: 'PropertiesListCard.deals_closed', value: agencyData?.agentStats?.totalPropertiesSold ?? '—', Icon: Handshake },
    ],
    [establishedYear],
  )

  // buyer can't see contact details unless admin or agent
  const isCheckPropertiesOwner = user && agencyData && user.id === agencyData.userId
  const onlyAdminOrAgentCanViewContactDetails = isCheckPropertiesOwner || isAdmin
  // const onlyAdminOrAgentCanViewContactDetails = isAgent || isAdmin

  const fullAddress = useMemo(() => {
    // Agent & Admin → full address
    if (onlyAdminOrAgentCanViewContactDetails) {
      const parts = [agencyData?.address_line].filter(Boolean)

      return parts.join(', ')
    }

    // Others → only district & city
    return [agencyData?.district, agencyData?.city].filter(Boolean).join(', ')
  }, [
    isAgent,
    isAdmin,
    agencyData?.address_line,
    agencyData?.city,
    agencyData?.district,
    agencyData?.state,
    agencyData?.postal_code,
    agencyData?.country,
  ])

  const serviceRegions = useMemo(() => {
    const regions = [agencyData?.district, agencyData?.state, agencyData?.country].filter(Boolean)
    return regions.length ? regions.join(', ') : '—'
  }, [agencyData?.district, agencyData?.state, agencyData?.country])

  const contactPhone = onlyAdminOrAgentCanViewContactDetails
    ? agencyData?.contact_phone || agencyData?.user?.phoneNumber || ''
    : maskPhone(agencyData?.contact_phone || agencyData?.user?.phoneNumber || '')
  const contactEmail = onlyAdminOrAgentCanViewContactDetails
    ? agencyData?.contact_email || agencyData?.user?.email || ''
    : maskEmail(agencyData?.contact_email || agencyData?.user?.email || '')
  const profileTitle = agencyData?.profileName || agencyData?.companyName || name
  const contactName = onlyAdminOrAgentCanViewContactDetails
    ? agencyData?.contact_name || agencyData?.user?.firstName || ''
    : maskName(agencyData?.contact_name || agencyData?.user?.firstName || '')
  const companyLogo = agencyData?.companyLogo || '/agency.png'
  const isVerified = Boolean(agencyData?.user?.isKycVerified)

  // Agency Insights Data - Property Insights style
  const agencyInsights = useMemo(
    () => [
      {
        label: 'Number of Reports',
        value: (agencyData as any)?.reports_count || 0,
        icon: BarChart3,
      },
      {
        label: 'Total Enquiries',
        value: (agencyData as any)?.contact_count || 0,
        icon: MessageSquare,
      },
      {
        label: 'Page Views',
        value: (agencyData as any)?.view_count || 0,
        icon: Eye,
      },
    ],
    [agencyData],
  )

  const handleShare = useCallback(async () => {
    if (typeof window !== 'undefined' && name) {
      setIsSharing(true)
      try {
        const url = window.location.href
        if (navigator.share) {
          await navigator.share({
            title: profileTitle || 'Agency',
            text: `Check out this agency: ${profileTitle}`,
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
  }, [name, profileTitle])

  // Fetch similar properties from backend
  const { similarProperties, isLoadingSimilar } = useSimilarProperties({
    city: agencyData?.city,
    propertyCategoryId: undefined, // Can be set if needed
    excludeId: undefined,
    limit: 8,
  })

  // Fallback: if search-based similar properties are empty, use popular properties list
  const { items: popularSimilarProperties, isLoading: isLoadingPopularSimilar } = usePopularProperties({
    limit: 8,
  })

  // Filter similar properties (exclude current agency's properties)
  const filteredSimilarProperties = useMemo(() => {
    const base =
      Array.isArray(similarProperties) && similarProperties.length > 0
        ? similarProperties
        : Array.isArray(popularSimilarProperties)
        ? popularSimilarProperties
        : []

    // Exclude properties from current agency
    const agencyPropertyIds = new Set(normalizedProperties.map((p: any) => p.id))
    return base.filter((prop: any) => !agencyPropertyIds.has(prop.id)).slice(0, 8)
  }, [similarProperties, popularSimilarProperties, normalizedProperties])

  // Skeleton Loader Component
  const PropertyGallerySkeleton = () => (
    <div className="w-full max-w-7xl space-y-6 mt-8">
      {/* Filter Buttons Skeleton */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200" />
        ))}
      </div>

      {/* Property Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <motion.div
            key={i}
            className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg animate-pulse"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <div className="w-full h-64 sm:h-72 lg:h-80 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-stone-200 rounded" />
              <div className="h-4 w-1/2 bg-stone-200 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-stone-200 rounded" />
                <div className="h-6 w-20 bg-stone-200 rounded" />
              </div>
              <div className="h-8 w-full bg-stone-200 rounded-lg" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-100 via-white to-stone-50 py-10 px-4 sm:px-6 lg:px-0">
      <div className="mx-auto w-full max-w-6xl space-y-10">
        <nav className="flex items-center gap-2 text-sm text-stone-500">
          <Link href="/" className="font-medium text-stone-700 transition hover:text-amber-600">
            {t('Navbar.home')}
          </Link>
          <span>/</span>
          <span className="text-stone-400">{t('Navbar.subMenus.agency_details')}</span>
        </nav>

        {isFetching ? (
          <CustumLoader text="Loading agency details..." />
        ) : (
          <div className="space-y-10">
            <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white/80 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-8 px-6 py-8 sm:px-10 md:flex-row md:py-10">
                <div className="mx-auto w-full max-w-xs md:mx-0 md:w-64">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                    <Image src={companyLogo} alt={`${profileTitle} logo`} fill className="object-contain" sizes="256px" priority />
                  </div>

                  {isVerified && (
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                      <ShieldCheck size={14} /> {t('AgencyDetails.verified')}
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-amber-700">
                      <span className="rounded-full bg-amber-100/80 px-3 py-1 text-amber-700">{t('PropertiesListCard.agent')}</span>
                      {!isVerified && <span className="rounded-full bg-stone-200 px-3 py-1 text-stone-600">{t('AgencyDetails.not_verified')}</span>}
                    </div>

                    <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">{agencyData?.companyName}</h1>
                    {agencyData?.shortTitle && <p className="text-base text-stone-600">{agencyData.shortTitle}</p>}
                    {agencyData?.description && <p className="text-sm leading-relaxed text-stone-600">{agencyData.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {highlightStats.map(stat => (
                      <div key={stat.labelKey} className="flex gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-5 shadow-sm">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <stat.Icon size={22} />
                        </span>
                        <div>
                          <p className="text-2xl font-semibold text-stone-900">{stat.value}</p>
                          <p className="whitespace-pre-line text-xs font-medium uppercase tracking-wide text-stone-500">{t(stat.labelKey)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 z-30 md:top-6 md:right-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg transition hover:bg-white cursor-pointer hover:text-[#2a1407] disabled:opacity-50"
                  aria-label="Share property"
                  title="Share Agent"
                >
                  <Share2 size={18} />
                </motion.button>
              </div>

              <div className="flex flex-col gap-4 border-t border-stone-200 bg-stone-50/80 px-6 py-5 sm:px-10 sm:py-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-stone-600">
                  {contactName && (
                    <span className="inline-flex items-center gap-2 font-medium text-stone-800">
                      <CircleUserRound size={16} /> {contactName}
                    </span>
                  )}
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone}`}
                      className="inline-flex items-center gap-2 font-medium text-stone-800 transition hover:text-amber-600"
                    >
                      <Phone size={16} /> {contactPhone}
                    </a>
                  )}
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="inline-flex items-center gap-2 font-medium text-stone-800 transition hover:text-amber-600"
                    >
                      <Mail size={16} /> {contactEmail}
                    </a>
                  )}
                  {fullAddress && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={16} /> {fullAddress}
                    </span>
                  )}
                </div>

                {/* {contactPhone && (
                  <Button
                    onClick={() => window.open(`tel:${contactPhone}`)}
                    className="flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                  >
                    <Phone size={16} /> {t('AgencyDetails.contact_owner')}
                  </Button>
                )} */}
              </div>
            </section>

            {/* Properties by this Agency - Full Width and Centered */}
            <section className="w-full flex flex-col items-center py-8">
              <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
                <h2 className="mb-6 text-center text-2xl font-bold tracking-wide text-stone-900">Properties by this Agency</h2>

                {/* Tabs - Always show All plus category names derived from properties */}
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                    {availableTabs.map((tab, idx) => {
                      const isActive = selectedTab === tab
                      return (
                        <motion.div
                          key={tab}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                        >
                          <Button
                            type="button"
                            onClick={() => setSelectedTab(tab)}
                            className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                              isActive
                                ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-sm'
                                : 'border-stone-200 bg-white text-stone-700 hover:border-amber-200 hover:text-amber-700'
                            }`}
                          >
                            {tab}
                          </Button>
                        </motion.div>
                      )
                    })}
                  </div>
                )}

                {/* Property Cards */}
                {isFetching ? (
                  <PropertyGallerySkeleton />
                ) : paginatedProperties.length > 0 ? (
                  <motion.div
                    key={`page-${currentPage}-${selectedTab}`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 w-full"
                  >
                    {paginatedProperties.map((item: PopularPropertyDto, index: number) => (
                      <motion.div
                        key={`${item.id}-page-${currentPage}`}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        className={cn(
                          'group relative flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out',
                          hovered === index && 'scale-[1.02] z-10',
                        )}
                        style={{
                          minHeight: '16rem',
                          boxShadow:
                            hovered === index
                              ? '0 20px 50px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(251, 191, 36, 0.1)'
                              : '0 8px 25px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04)',
                        }}
                      >
                        {/* Premium Border Glow */}
                        <div
                          className={cn(
                            'absolute inset-0 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 pointer-events-none z-20',
                            hovered === index ? 'border-yellow-400/60 shadow-[0_0_20px_rgba(251,191,36,0.3)]' : 'border-transparent',
                          )}
                        />

                        {/* Image Container */}
                        <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden rounded-xl sm:rounded-2xl">
                          <motion.div
                            animate={{ scale: hovered === index ? 1.1 : 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="w-full h-full"
                          >
                            {item?.media && item.media.length > 0 ? (
                              <Image
                                src={getMediaPreviewImageSrc(item.media?.[0]?.url)}
                                alt={item.title || 'Property'}
                                fill
                                className="object-cover"
                                priority={index < 3}
                              />
                            ) : (
                              <Image src="/villa.png" alt="Property" fill className="object-cover" />
                            )}
                          </motion.div>

                          {/* Shimmer Effect */}
                          <div
                            className={cn(
                              'absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out',
                              hovered === index ? 'translate-x-full' : '-translate-x-full',
                            )}
                            style={{ width: '200%' }}
                          />
                        </div>

                        {/* Expandable Card Content */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 bg-white p-3 sm:p-4 flex flex-col rounded-b-xl sm:rounded-b-2xl shadow-lg"
                          initial={false}
                          animate={{
                            y: hovered === index ? 0 : '100%',
                            opacity: hovered === index ? 1 : 0,
                          }}
                          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                        >
                          {/* Title Section */}
                          <div className="mb-2">
                            <h3 className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                              <Captions size={14} className="text-yellow-600" />
                              <span className="text-xs font-semibold text-gray-800">{item?.title ? item.title : ''}</span>
                            </h3>
                          </div>

                          {/* Address Section */}
                          <div className="mb-2">
                            <h3 className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
                              <MapPin size={14} className="text-yellow-600 shrink-0 mt-0.5" />
                              <span className="flex-1">
                                {item?.district}
                                {item?.district && item?.city && ', '}
                                {item?.city}
                              </span>
                            </h3>
                          </div>

                          {/* Property Features */}
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-yellow-100">
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50/50">
                              <ChartBarStacked size={14} className="text-yellow-600" />
                              <span className="text-xs font-semibold text-gray-800">{item?.listing_type ? item.listing_type : 0}</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50/50">
                              <Ruler size={14} className="text-yellow-600" />
                              <span className="text-xs font-semibold text-gray-800">
                                {item?.property_size ? `${item.property_size} ${item.property_size_unit || ''}`.trim() : 'N/A'}
                              </span>
                            </div>
                          </div>

                          {/* Price & Button Section */}
                          <div className="flex justify-between items-center gap-2">
                            <Button
                              type="button"
                              variant="primary"
                              size="small"
                              className="px-3 py-1.5 bg-[#2a1407] text-white rounded-lg font-semibold text-xs shadow-md hover:shadow-lg hover:bg-[#2a1407] transition-all duration-300"
                              onClick={() => handleSeeMoreClick(item.id)}
                            >
                              {t('PopularProperties.see_more')}
                            </Button>

                            <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gradient-to-r from-yellow-50 to-yellow-100/50 border border-yellow-200/50">
                              <IndianRupee size={14} className="text-yellow-700 font-bold" />
                              <p className="font-bold text-xs sm:text-sm text-gray-900">{formatPrice(item.price) || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Top Border Accent */}
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
                        </motion.div>

                        {/* Corner Accent */}
                        <div
                          className={cn(
                            'absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full transition-opacity duration-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]',
                            hovered === index ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 mt-8 w-full">
                    {(() => {
                      const copy = getEmptyStateCopy(selectedTab)
                      return (
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/30 rounded-xl border border-yellow-200 p-8 shadow-sm">
                          <p className="text-gray-600 text-lg font-medium mb-2">{copy.title}</p>
                          <p className="text-gray-500 text-sm">{copy.subtitle}</p>
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Pagination */}
                {!isFetching && totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex items-center justify-center gap-2 mt-8"
                  >
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300',
                        currentPage === 1
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                          : 'border-yellow-200 text-yellow-700 bg-white hover:bg-yellow-50 hover:border-yellow-300 hover:scale-105 shadow-sm',
                      )}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            'min-w-[2.5rem] h-10 px-3 rounded-lg font-semibold text-sm transition-all duration-300',
                            currentPage === pageNum
                              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30 scale-105'
                              : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 hover:scale-105',
                          )}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300',
                        currentPage === totalPages
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                          : 'border-yellow-200 text-yellow-700 bg-white hover:bg-yellow-50 hover:border-yellow-300 hover:scale-105 shadow-sm',
                      )}
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </motion.div>
                )}
              </div>
            </section>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Content - 2 columns */}
                <div className="lg:col-span-2 space-y-8"></div>

                {/* Right Sidebar - 1 column */}
                <motion.aside
                  className="space-y-6"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                ></motion.aside>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
