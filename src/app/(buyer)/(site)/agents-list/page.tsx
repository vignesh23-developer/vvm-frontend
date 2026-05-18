'use client'

import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import AgentCard from '@/components/buyer/Agency/AgentCard/AgentCard'
import { useTranslations } from 'next-intl'
import { getMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import useAgentCompanyProfile from '@/app/(buyer)/(site)/agents-list/(hooks)/useAgentCompanyProfile'
import AdvancedFilters from '@/components/ui/AdvancedFilter/AdvancedFilters'
import NextImage from 'next/image'

// Enhanced Agent Card Skeleton - Vertical for Grid
const AgentCardSkeleton = () => (
  <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 animate-pulse h-full">
    {/* Image Skeleton */}
    <div className="relative h-64 w-full bg-gray-200" />

    {/* Content Skeleton */}
    <div className="flex flex-col flex-1 p-5 space-y-4">
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="flex gap-2 items-center">
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="mt-auto border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="h-3 w-10 bg-gray-200 rounded" />
          <div className="h-6 w-16 bg-gray-200 rounded" />
        </div>
        <div className="flex justify-end items-end">
          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
)

interface FilterState {
  priceRange: [number, number]
  propertyType: string[]
  bedrooms: string[]
  bathrooms: string[]
  location: string[]
  amenities: string[]
  listingType: string[]
  status: string[]
  projectStatus: string[]
  verified: string[]
  featured: string[]
  priceRangePreset: string[]
  furnishing: string[]
  facing: string[]
  parking: string[]
  sizeRange: [number, number]
  layoutPriceRange: [number, number]
  layoutAreaRange: [number, number]
  layoutTotalSqftRange: [number, number]
  plotAvailableRange: [number, number]
  district: string[]
  state: string[]
  postalCode: string[]
  propertyCategoryId: string[]
  category_id: string[]
  sortBy?: string
  isPremium?: boolean
  ownerId?: string
  agentId?: string
  lat?: number
  lon?: number
  radius?: string
}

const AgentListPage = () => {
  const t = useTranslations()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false) // Closed by default, user can open
  const [searchTerm, setSearchTerm] = useState('') // Advanced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000000],
    propertyType: [],
    bedrooms: [],
    bathrooms: [],
    location: [],
    amenities: [],
    listingType: [],
    status: [],
    projectStatus: [],
    verified: [],
    featured: [],
    priceRangePreset: [],
    furnishing: [],
    facing: [],
    parking: [],
    sizeRange: [0, 0],
    layoutPriceRange: [0, 0],
    layoutAreaRange: [0, 0],
    layoutTotalSqftRange: [0, 0],
    plotAvailableRange: [0, 0],
    district: [],
    state: [],
    postalCode: [],
    propertyCategoryId: [],
    category_id: [],
    sortBy: undefined,
    isPremium: false,
    ownerId: undefined,
    agentId: undefined,
    lat: undefined,
    lon: undefined,
    radius: undefined,
  })

  const { agentCompanyProfileData, agentCompanyProfileFetchErr, agentCompanyProfileFetchLoader, agentCompanyProfileRefresh } =
    useAgentCompanyProfile()

  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(handle)
  }, [searchTerm])

  const trimmedSearch = debouncedSearchTerm.trim()
  const shouldUseBackendAutocomplete = trimmedSearch.length >= 3

  const { data: autocompleteResponse } = useSWR(
    shouldUseBackendAutocomplete ? `${appEndpoints.publicSearchProperties}?q=${encodeURIComponent(trimmedSearch)}&limit=10` : null,
    (url: string) => getMethod<any[]>(url),
  )

  const backendSuggestions = useMemo(() => {
    const raw = autocompleteResponse?.data as any
    if (!raw) return [] as string[]

    if (Array.isArray(raw)) {
      return raw
        .map((item: any) => (typeof item === 'string' ? item : item?.value))
        .filter((v: unknown): v is string => typeof v === 'string' && v.trim().length > 0)
        .slice(0, 10)
    }

    return [] as string[]
  }, [autocompleteResponse])

  // Filter agencies based on active filters + search
  const filteredAgencies = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase()
    const shouldApplySearch = query.length >= 3

    return (agentCompanyProfileData || []).filter((agency: any) => {
      // Location filter
      if (filters.location.length > 0) {
        const matchesLocation = filters.location.some(
          loc =>
            agency.city?.toLowerCase().includes(loc.toLowerCase()) ||
            agency.district?.toLowerCase().includes(loc.toLowerCase()) ||
            agency.state?.toLowerCase().includes(loc.toLowerCase()),
        )
        if (!matchesLocation) return false
      }

      // Verified filter
      if (filters.verified.includes('Verified Only') && !agency.isVerified) {
        return false
      }

      // Search filter (company / contact / location)
      if (shouldApplySearch) {
        const matchesSearch =
          agency.companyName?.toLowerCase().includes(query) ||
          agency.profileName?.toLowerCase().includes(query) ||
          agency.contact_name?.toLowerCase().includes(query) ||
          agency.city?.toLowerCase().includes(query) ||
          agency.district?.toLowerCase().includes(query) ||
          agency.state?.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      return true
    })
  }, [agentCompanyProfileData, filters, debouncedSearchTerm])


  const totalNumber = Number(filteredAgencies?.length ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalNumber / limit))

  const changePage = (nextPage: number) => setPage(Math.max(1, Math.min(nextPage, totalPages)))

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchTerm, filters, limit])

  const pagedAgencies = useMemo(() => {
    const start = (page - 1) * limit
    return (filteredAgencies || []).slice(start, start + limit)
  }, [filteredAgencies, page, limit])

  // Suggestions for autocomplete in advanced search
  const searchSuggestions = useMemo(() => {
    const query = debouncedSearchTerm.trim().toLowerCase()
    if (query.length < 3) return []

    const suggestionsSet = new Set<string>()

    backendSuggestions.forEach(s => {
      if (typeof s === 'string' && s.trim().length > 0) {
        suggestionsSet.add(s)
      }
    })
    ;(agentCompanyProfileData || []).forEach((agency: any) => {
      const candidates = [agency.companyName, agency.profileName, agency.contact_name, agency.city, agency.district, agency.state]
      candidates.forEach(value => {
        if (typeof value === 'string') {
          const lower = value.toLowerCase()
          if (lower.includes(query)) {
            suggestionsSet.add(value)
          }
        }
      })
    })

    return Array.from(suggestionsSet).slice(0, 8)
  }, [debouncedSearchTerm, agentCompanyProfileData, backendSuggestions])

  const hasActivePropertyFilters =
    filters.location.length > 0 ||
    filters.listingType.length > 0 ||
    filters.verified.length > 0 ||
    filters.featured.length > 0 ||
    filters.priceRangePreset.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 100000000

  const handleClearFilters = () => {
    setFilters({
      priceRange: [0, 100000000],
      propertyType: [],
      bedrooms: [],
      bathrooms: [],
      location: [],
      amenities: [],
      listingType: [],
      status: [],
      projectStatus: [],
      verified: [],
      featured: [],
      priceRangePreset: [],
      furnishing: [],
      facing: [],
      parking: [],
      sizeRange: [0, 0],
      layoutPriceRange: [0, 0],
      layoutAreaRange: [0, 0],
      layoutTotalSqftRange: [0, 0],
      plotAvailableRange: [0, 0],
      district: [],
      state: [],
      postalCode: [],
      propertyCategoryId: [],
      category_id: [],
      sortBy: undefined,
      isPremium: false,
      ownerId: undefined,
      agentId: undefined,
      lat: undefined,
      lon: undefined,
      radius: undefined,
    })
  }

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: -10,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-[#FFF7EA] via-[#FFFDF8] to-[#F5F5F5]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Heading Section */}
      <div className="border-b border-yellow-100/70 bg-gradient-to-r from-[#FFF3D6] via-[#FFF9EB] to-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2a1407] tracking-tight mb-3">{t('AgentList.heading')}</h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">{t('AgentList.subheading')}</p>
            </div>

            {/* Full Width Search & Filter Bar */}
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-white p-2 rounded-2xl shadow-lg border border-yellow-100/50">
                {/* Search Input Area */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder={t('AgentList.search_placeholder')}
                    className="block w-full pl-11 pr-4 py-3 bg-transparent border-none rounded-xl text-gray-900 placeholder-gray-400 focus:ring-0 sm:text-base"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Divider (Hidden on mobile) */}
                <div className="hidden md:block w-px bg-gray-200 my-2"></div>

                {/* Filter Button */}
                <button
                  onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    isFiltersOpen ? 'bg-[#2a1407] text-white shadow-md' : 'bg-yellow-50 text-[#2a1407] hover:bg-yellow-100'
                  } cursor-pointer`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t('PropertiesList.filters')}</span>
                </button>
              </div>

              {/* Autocomplete Suggestions */}
              {trimmedSearch.length >= 3 && searchSuggestions.length > 0 && (
                <div className="absolute z-20 mt-2 w-full max-w-3xl rounded-2xl bg-white shadow-xl border border-gray-100 max-h-64 overflow-y-auto">
                  {searchSuggestions.map(suggestion => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setSearchTerm(suggestion)}
                      className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-yellow-50 border-b last:border-0 border-gray-50 flex items-center gap-2 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Advanced Filters - Show for properties and agencies */}

          <AdvancedFilters
            filters={filters}
            onFilterChange={setFilters}
            onClear={handleClearFilters}
            isOpen={isFiltersOpen}
            onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
            pageType={'agency'}
            hideTriggerButton={true}
          />

          {/* Properties / Agencies List */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Display */}
            <div className="mb-5 flex flex-wrap items-center gap-2 p-4 bg-white/90 border border-yellow-200 rounded-2xl shadow-sm">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">{t('AgentList.active_filters')}</span>
              {filters.location.map(loc => (
                <span
                  key={loc}
                  className="px-3 py-1 bg-yellow-500/90 text-[#2a1407] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  {loc}
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, location: prev.location.filter(l => l !== loc) }))
                    }}
                    className="ml-1 hover:bg-yellow-600 rounded-full p-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.listingType.map(type => (
                <span
                  key={type}
                  className="px-3 py-1 bg-yellow-500/90 text-[#2a1407] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  {type}
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, listingType: prev.listingType.filter(t => t !== type) }))
                    }}
                    className="ml-1 hover:bg-yellow-600 rounded-full p-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.verified.map(ver => (
                <span
                  key={ver}
                  className="px-3 py-1 bg-yellow-500/90 text-[#2a1407] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  {ver}
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, verified: prev.verified.filter(v => v !== ver) }))
                    }}
                    className="ml-1 hover:bg-yellow-600 rounded-full p-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {filters.priceRangePreset.map(preset => (
                <span
                  key={preset}
                  className="px-3 py-1 bg-yellow-500/90 text-[#2a1407] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  {preset}
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, priceRangePreset: prev.priceRangePreset.filter(p => p !== preset) }))
                    }}
                    className="ml-1 hover:bg-yellow-600 rounded-full p-0.5 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-gray-500">
                  {totalNumber} {t('AgentList.results_found')}
                </span>
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1 text-xs sm:text-sm font-semibold text-yellow-800 hover:text-yellow-900 underline underline-offset-4 cursor-pointer"
                >
                  {t('AgentList.clear_all')}
                </button>
              </div>
            </div>

            {agentCompanyProfileFetchLoader ? (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isFiltersOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-6`}>
                {Array.from({ length: limit }).map((_, index) => (
                  <motion.div
                    key={`agency-skeleton-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.5,
                    }}
                    className="h-full"
                  >
                    <AgentCardSkeleton />
                  </motion.div>
                ))}
              </div>
            ) : filteredAgencies?.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-white/80 border border-dashed border-gray-200">
                <p className="text-gray-700 text-lg font-semibold">{t('AgentList.no_results_title')}</p>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">{t('AgentList.no_results_desc')}</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-5 px-6 py-2.5 bg-yellow-500 text-[#2a1407] rounded-full text-sm font-semibold hover:bg-yellow-600 transition-all shadow-sm cursor-pointer"
                >
                  {t('AgentList.clear_filters')}
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isFiltersOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-6`}>
                {pagedAgencies?.map((agentProperty: any, index: number) => (
                  <motion.div
                    key={agentProperty.id ?? index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ y: -5 }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.4,
                    }}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl cursor-pointer h-full"
                    onClick={() => router.push(`/agent-profile/${agentProperty.profileName}`)}
                  >
                    {/* Image Section */}
                    <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                      {agentProperty.companyLogo || agentProperty.profile_image ? (
                        <NextImage
                          src={agentProperty.companyLogo || agentProperty.profile_image}
                          alt={agentProperty.companyName || agentProperty.profileName || 'Agent'}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-yellow-50 text-yellow-700 font-bold text-5xl">
                          {(agentProperty.companyName?.[0] || agentProperty.profileName?.[0] || 'A').toUpperCase()}
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                      {/* Verified Badge */}
                      {agentProperty.isVerified && (
                        <div className="absolute top-4 right-4 z-10">
                          <span className="px-3 py-1 rounded-full bg-[#FFFBEB] text-[#B45309] border border-[#FEF3C7] text-xs font-bold shadow-sm flex items-center gap-1">
                            {t('AgentList.verified')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col flex-1 p-5">
                      <div className="mb-4">
                        <h3
                          className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-yellow-700 transition-colors"
                          title={agentProperty.companyName}
                        >
                          {agentProperty.companyName || 'Unknown Agent'}
                        </h3>
                        <div className="flex items-start gap-1.5 text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-yellow-600 flex-shrink-0 mt-0.5"
                          >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <p className="text-sm line-clamp-2 leading-relaxed">
                            {[agentProperty.district, agentProperty.city].filter(Boolean).join(', ') || 'Location N/A'}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-auto" />

                      {/* Footer Section */}
                      <div className="grid grid-cols-2 gap-4 pt-4 mt-4 items-end">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">{t('AgentList.status')}</span>
                          <p className="text-sm font-semibold text-gray-700">
                            {agentProperty.isActive ? t('AgentList.active') : t('AgentList.inactive')}
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={event => {
                              event.stopPropagation()
                              router.push(`/agent-profile/${agentProperty.profileName}`)
                            }}
                            className="text-sm font-semibold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-4 py-2 rounded-lg transition-colors border border-yellow-100 cursor-pointer"
                          >
                            {t('AgentList.view_profile')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination totalItems={totalNumber} itemsPerPage={limit} currentPage={page} onPageChange={changePage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AgentListPage
