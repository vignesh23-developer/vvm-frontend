'use client'

import { useEffect, useMemo, useState, useRef, useCallback, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import AgentCompanyProfile from '@/app/(buyer)/(site)/agents-list/(dto)/agentCompanyProfile'
import { getMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { ResponseDTO } from '@/components/dto/response_dto'
import { mockAgents, mockAgentProperties, USE_MOCK_DATA } from '@/app/(buyer)/(site)/agents-list/mockAgents'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/CustomComponent/Button/Button'
import CustumLoader from '@/components/ui/CustomComponent/Loader/CustomLoader'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
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

export default function AgencyDetails({ decodedName }: { decodedName: string }) {
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
  // Prevent duplicate fetches in React 18 strict mode/dev double renders
  const fetchedAgencyRef = useRef<string | null>(null)
  const useMockData = USE_MOCK_DATA

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

  // console.log('Decoded Name in AgencyDetails Component:', decodedName)

  useEffect(() => {
    if (!decodedName) return

    const alreadyFetched = fetchedAgencyRef.current === decodedName
    fetchedAgencyRef.current = decodedName
    if (alreadyFetched) return

    let isMounted = true

    const fetchAgencyDetails = async () => {
      if (useMockData) {
        setIsFetching(true)
        // Find mock agent by profileName (decodedName)
        const mockAgent = mockAgents.find(a => a.profileName === decodedName)
        if (mockAgent) {
          setAgencyData(mockAgent)
          const properties = mockAgentProperties[mockAgent.id] || []
          setAgentIdProperties(properties)
          setSelectedTab(DEFAULT_TABS[0])
        } else {
          setAgencyData(null)
          setFetchError('Mock Agent not found')
        }
        setIsFetching(false)
        return
      }

      setIsFetching(true)
      setFetchError(null)

      try {
        const response: ResponseDTO = await getMethod(appEndpoints.getCompanyProfilesByName(decodedName))

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
  }, [decodedName, t])

  const establishedYear = useMemo(() => {
    if (!agencyData?.createdAt) return '—'
    const year = new Date(agencyData.createdAt).getFullYear()
    return Number.isNaN(year) ? '—' : String(year)
  }, [agencyData?.createdAt])

  const highlightStats = useMemo(
    () => [
      { label: 'Total Listings', value: agencyData?.agentStats?.totalPropertiesPosted ?? '—', Icon: Building2 },
      { label: 'Active Properties', value: (agencyData?.agentStats as any)?.activeProperties ?? '—', Icon: Sparkles },
      { label: 'Closed Properties', value: agencyData?.agentStats?.totalPropertiesSold ?? '—', Icon: Handshake },
    ],
    [agencyData],
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
    if (typeof window !== 'undefined' && decodedName) {
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
  }, [decodedName, profileTitle])

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
    <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-50 py-10 px-4 sm:px-6 lg:px-0">
      <div className="mx-auto w-full px-10 space-y-10">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Profile Info */}
              <div className="lg:col-span-2 space-y-8">
                <section className="overflow-hidden rounded-3xl border border-yellow-200 bg-white shadow-sm">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-48 shrink-0">
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-stone-100 bg-stone-50 shadow-inner">
                          <Image src={companyLogo} alt={`${profileTitle} logo`} fill className="object-contain p-4" sizes="192px" priority />
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h1 className="text-3xl font-bold text-stone-900">{agencyData?.companyName}</h1>
                            {isVerified && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 border border-emerald-100">
                                <ShieldCheck size={12} />
                                Verified
                              </span>
                            )}
                          </div>
                          {agencyData?.shortTitle && <p className="text-lg text-amber-700 font-medium">{agencyData.shortTitle}</p>}
                        </div>

                        <p className="text-sm leading-relaxed text-stone-600 line-clamp-4">
                          {agencyData?.description || 'This agency provides professional real estate services. Contact them for more details about their current listings and specialized areas.'}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                          <div className="flex items-center gap-2 text-sm text-stone-500">
                            <MapPin size={16} className="text-amber-600" />
                            <span>{fullAddress}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-stone-500">
                            <CalendarDays size={16} className="text-amber-600" />
                            <span>Operating since {establishedYear}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 bg-stone-50/50 px-6 py-4 flex flex-wrap gap-6">
                    {contactPhone && (
                      <a href={`tel:${contactPhone}`} className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-amber-600 transition-colors">
                        <Phone size={16} /> {contactPhone}
                      </a>
                    )}
                    {contactEmail && (
                      <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-amber-600 transition-colors">
                        <Mail size={16} /> {contactEmail}
                      </a>
                    )}
                  </div>
                </section>

                {/* Property Listings Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-stone-900">Agency Listings</h2>
                    <div className="flex gap-2">
                      {availableTabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setSelectedTab(tab)}
                          className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-bold transition-all border",
                            selectedTab === tab
                              ? "bg-[#2a1407] text-white border-[#2a1407]"
                              : "bg-white text-stone-600 border-stone-200 hover:border-amber-200"
                          )}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isFetching ? (
                    <PropertyGallerySkeleton />
                  ) : paginatedProperties.length > 0 ? (
                    <motion.div
                      key={`page-${currentPage}-${selectedTab}`}
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    >
                      {paginatedProperties.map((item: any) => (
                        <PropertyCard
                          key={item.id}
                          id={String(item.id)}
                          title={item.title}
                          description={item.description || ''}
                          price={String(item.price)}
                          property_size={item.property_size}
                          property_size_unit={item.property_size_unit}
                          status={item.status || 'Active'}
                          listing_type={item.listing_type}
                          address_line={item.address_line || ''}
                          district={item.district || ''}
                          city={item.city || ''}
                          state={item.state || ''}
                          postal_code={item.postal_code || ''}
                          approval_status={item.approval_status || 'APPROVED'}
                          favorite_count={item.favorite_count || 0}
                          media={item.media}
                          property_category={item.property_category}
                          onPrimaryAction={() => handleSeeMoreClick(item.id)}
                          handleFavorite={() => {}}
                          isVerified={item.isVerified}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-stone-200">
                      <p className="text-stone-500">No properties found in this category.</p>
                    </div>
                  )}

                  {/* Pagination */}
                  {!isFetching && totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "w-10 h-10 rounded-xl font-bold text-sm transition-all",
                            currentPage === pageNum
                              ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                              : "bg-white text-stone-600 border border-stone-200 hover:border-amber-300"
                          )}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column: Stats & Actions */}
              <div className="space-y-6">
                <section className="rounded-3xl border border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30 p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-stone-900 mb-6">Performance Stats</h3>
                  <div className="space-y-4">
                    {highlightStats.map((stat) => (
                      <div key={stat.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-100 shadow-sm">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                          <stat.Icon size={24} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-stone-900">{stat.value}</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{stat.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-stone-900">Quick Actions</h3>
                  <div className="grid gap-3">
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border border-stone-200 font-bold text-stone-700 hover:bg-stone-50 transition-all"
                    >
                      <Share2 size={18} /> Share Profile
                    </button>
                    {contactPhone && (
                      <a
                        href={`tel:${contactPhone}`}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-all shadow-md shadow-amber-200"
                      >
                        <Phone size={18} /> Contact Agency
                      </a>
                    )}
                  </div>
                </section>

                <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-stone-900 mb-4">Location</h3>
                  <div className="h-48 rounded-2xl overflow-hidden border border-stone-100 grayscale hover:grayscale-0 transition-all duration-500">
                    <MapView
                      center={{
                        lat: Number(agencyData?.latitude || 0),
                        lng: Number(agencyData?.longitude || 0),
                      }}
                      markers={[
                        {
                          lat: Number(agencyData?.latitude || 0),
                          lng: Number(agencyData?.longitude || 0),
                        },
                      ]}
                      zoom={12}
                    />
                  </div>
                  <p className="mt-4 text-xs text-stone-500 flex items-center gap-2">
                    <MapPin size={14} className="text-amber-500" />
                    {fullAddress}
                  </p>
                </section>
              </div>
            </div>

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
