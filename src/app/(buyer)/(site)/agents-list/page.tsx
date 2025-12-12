'use client'

import { useState, useMemo } from 'react'
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

// Enhanced Agent Card Skeleton
const AgentCardSkeleton = () => (
  <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 lg:flex-row animate-pulse">
    {/* Image Skeleton */}
    <div className="relative h-[180px] w-full sm:w-[200px] bg-gradient-to-br from-gray-200 to-gray-300" />

    {/* Content Skeleton */}
    <div className="flex-1 p-4 sm:p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <div className="h-7 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-4 w-40 bg-gray-200 rounded" />
      </div>

      <div className="h-4 w-full bg-gray-200 rounded" />
    </div>

    {/* Action Section Skeleton */}
    <div className="w-full lg:w-[260px] bg-gradient-to-br from-gray-800 to-gray-900 p-5">
      <div className="space-y-3">
        <div className="h-12 w-full bg-gray-700 rounded-xl" />
        <div className="h-12 w-full bg-gray-700 rounded-xl" />
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
  verified: string[]
  featured: string[]
  priceRangePreset: string[]
  furnishing: string[]
  facing: string[]
  parking: string[]
  sizeRange: [number, number]
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
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000000],
    propertyType: [],
    bedrooms: [],
    bathrooms: [],
    location: [],
    amenities: [],
    listingType: [],
    status: [],
    verified: [],
    featured: [],
    priceRangePreset: [],
    furnishing: [],
    facing: [],
    parking: [],
    sizeRange: [0, 0],
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

  const trimmedSearch = searchTerm.trim()
  const shouldUseBackendAutocomplete = trimmedSearch.length >= 2

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

  const totalNumber = Number(agentCompanyProfileData?.length ?? 0)
  const totalPages = Math.max(1, Math.ceil(totalNumber / limit))

  const changePage = (page: number) => setPage(Math.max(1, Math.min(page, totalPages)))

  //   const handleFavorite = async (propertyId: string) => {
  //     try {
  //       const response = await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })
  //       mutateProperties()
  //     } catch (err) {
  //       console.error('Error updating favorite:', err)
  //     }
  //   }

  // Filter agencies based on active filters + search
  const filteredAgencies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

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
      if (query) {
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
  }, [agentCompanyProfileData, filters, searchTerm])

  // Suggestions for autocomplete in advanced search
  const searchSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return []

    const suggestionsSet = new Set<string>()

      ; (agentCompanyProfileData || []).forEach((agency: any) => {
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
  }, [searchTerm, agentCompanyProfileData, backendSuggestions])

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
      verified: [],
      featured: [],
      priceRangePreset: [],
      furnishing: [],
      facing: [],
      parking: [],
      sizeRange: [0, 0],
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2a1407] tracking-tight mb-2 mt-10">Expert Agents Ready to Help</h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
              Connect with trusted real estate experts who know your neighbourhood and budget.
            </p>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                {/* <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 shadow-sm border border-yellow-100">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    
                  </div> */}
              </div>
              {/* Advanced Search with Autocomplete */}
              <div className="relative max-w-xl">
                <div className="flex items-center rounded-full bg-white shadow-sm border border-gray-200 px-4 py-2">
                  <span className="mr-2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by agent, company or location..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                  />
                  {searchTerm && (
                    <button type="button" onClick={() => setSearchTerm('')} className="ml-2 text-xs text-gray-500 hover:text-gray-700">
                      Clear
                    </button>
                  )}
                </div>

                {/* Autocomplete Suggestions */}
                {searchSuggestions.length > 0 && (
                  <div className="absolute z-20 mt-1 w-full rounded-2xl bg-white shadow-lg border border-gray-100 max-h-64 overflow-y-auto">
                    {searchSuggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setSearchTerm(suggestion)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
          />

          {/* Properties / Agencies List */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Display */}
            <div className="mb-5 flex flex-wrap items-center gap-2 p-4 bg-white/90 border border-yellow-200 rounded-2xl shadow-sm">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">Active Filters</span>
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
                    className="ml-1 hover:bg-yellow-600 rounded-full p-0.5"
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
                    className="ml-1 hover:bg-yellow-600 rounded-full p-0.5"
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
                    className="ml-1 hover:bg-yellow-600 rounded-full p-0.5"
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
                    className="ml-1 hover:bg-yellow-600 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-gray-500">
                  {totalNumber} result{totalNumber !== 1 ? 's' : ''} found
                </span>
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1 text-xs sm:text-sm font-semibold text-yellow-800 hover:text-yellow-900 underline underline-offset-4"
                >
                  Clear all
                </button>
              </div>
            </div>

            {agentCompanyProfileFetchLoader ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: limit }).map((_, index) => (
                  <motion.div
                    key={`agency-skeleton-${index}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.5,
                    }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm h-[320px] animate-pulse"
                  >
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-gray-200 rounded" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : filteredAgencies?.length === 0 ? (
              <div className="text-center py-16 rounded-2xl bg-white/80 border border-dashed border-gray-200">
                <p className="text-gray-700 text-lg font-semibold">No agencies match your filters</p>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  Widen your search by changing city or removing some filters to discover more expert agents.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-5 px-6 py-2.5 bg-yellow-500 text-[#2a1407] rounded-full text-sm font-semibold hover:bg-yellow-600 transition-all shadow-sm"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgencies?.map((agentProperty: any, index: number) => (
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
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col"
                    onClick={() => router.push(`/agent-details/${agentProperty.id}`)} // Assuming connection to detail page
                  >
                    {/* Image Section */}
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      {agentProperty.profile_image ? (
                        <NextImage
                          src={agentProperty.profile_image}
                          alt={agentProperty.companyName || agentProperty.profileName || 'Agent'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-yellow-50 text-yellow-700 font-bold text-4xl">
                          {(agentProperty.companyName?.[0] || agentProperty.profileName?.[0] || 'A').toUpperCase()}
                        </div>
                      )}

                      <div className="absolute top-3 right-3 flex gap-2">
                        {agentProperty.isVerified && (
                          <span className="px-2 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold backdrop-blur-sm shadow-sm">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-[#2a1407] mb-1 line-clamp-1">
                        {agentProperty.companyName || agentProperty.profileName || 'Unknown Agent'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-1 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                        {[agentProperty.city, agentProperty.district, agentProperty.state].filter(Boolean).join(', ') || 'Location N/A'}
                      </p>

                      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 font-medium">Properties</span>
                          <span className="text-sm font-bold text-[#2a1407]">{agentProperty.property_count || 0}</span>
                        </div>
                        <button className="text-sm font-semibold text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1.5 rounded-lg transition-colors">
                          View Profile
                        </button>
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
