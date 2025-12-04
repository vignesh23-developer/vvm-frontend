'use client'

import { useState, useMemo } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useProperties } from '@/app/(seller)/properties/(hooks)/useProperties'
import PropertyCard from '../PropertyCard/PropertyCard'
import FilterBar from '../FilterBar/FilterBar'
import AgentCard from '../Agency/AgentCard/AgentCard'
import BuilderCard from '../Builders/BuilderCard/BuilderCard'
import { useTranslations } from 'next-intl'
import { getMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import SkeletonLoader from '@/components/ui/CustomComponent/SkeletonLoader/SkeletonLoader'
import { usePublicPropertySearch } from './(hooks)/usePublicPropertySearch'

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

// Enhanced Property Card Skeleton
const PropertyCardSkeleton = () => (
  <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-md border border-gray-100 lg:flex-row animate-pulse">
    {/* Image Skeleton */}
    <div className="relative h-48 w-full sm:w-[280px] bg-gradient-to-br from-gray-200 to-gray-300" />
    
    {/* Content Skeleton */}
    <div className="flex-1 p-4 sm:p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
        </div>
      </div>
      
      <div className="flex gap-2 rounded-xl bg-gray-100 p-3">
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
      </div>
    </div>
    
    {/* Price Section Skeleton */}
    <div className="w-full lg:w-[260px] bg-gradient-to-br from-gray-800 to-gray-900 p-5">
      <div className="space-y-2 text-right">
        <div className="h-8 w-32 bg-gray-700 rounded ml-auto" />
        <div className="h-4 w-24 bg-gray-700 rounded ml-auto" />
      </div>
      <div className="mt-6 h-12 w-full bg-gray-700 rounded-xl" />
    </div>
  </div>
)
import useAgentCompanyProfile from './(hooks)/useAgentCompanyProfile'
import AdvancedFilters from './AdvancedFilters'

const BuildersPropertiesList = [
  {
    image: '/builder.png',
    title: '4 BHK Villa for Sale in Whitefield',
    area: '4000 sqft',
    status: 'Ready to Move',
    transaction: 'Resale',
    facing: 'East Facing Properties',
    description: '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
    agent: 'Rich Source Realty',
    builderName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
  {
    image: '/builder.png',
    title: '4 BHK Villa for Sale in Whitefield',
    area: '4000 sqft',
    status: 'Ready to Move',
    transaction: 'Resale',
    facing: 'East Facing Properties',
    description: '4BHK A Type corner villa for sale in Sterling Villagrande with all amenities',
    agent: 'Rich Source Realty',
    builderName: 'Shankar',
    agentAddress: 'MG Road,Bangalore',
  },
]

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
  sortBy?: string
  isPremium?: boolean
  ownerId?: string
  agentId?: string
  lat?: number
  lon?: number
  radius?: string
}

const PropertiesListing = ({ params }: { params: string }) => {
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
    sortBy: undefined,
    isPremium: false,
    ownerId: undefined,
    agentId: undefined,
    lat: undefined,
    lon: undefined,
    radius: undefined,
  })

  const isExploreByCategory = params === 'explore_by_category'

  const {
    properties,
    handleEdit,
    handleDelete,
    total,
    error,
    isLoadingProperties,
    mutateProperties,
    handlePropertyAction,
  } = useProperties({
    page,
    limit,
    approval_status: 'APPROVED',
  })

  const {
    items: searchedProperties,
    total: searchedTotal,
    isLoading: isLoadingSearchedProperties,
    mutate: mutateSearchedProperties,
  } = usePublicPropertySearch({
    page,
    limit,
    filters,
    searchTerm,
    enabled: isExploreByCategory,
    includeFilters: true,
  })

  const { agentCompanyProfileData, agentCompanyProfileFetchErr, agentCompanyProfileFetchLoader, agentCompanyProfileRefresh } =
    useAgentCompanyProfile()

  const trimmedSearch = searchTerm.trim()
  const shouldUseBackendAutocomplete = params === 'explore_by_category' && trimmedSearch.length >= 2

  const { data: autocompleteResponse } = useSWR(
    shouldUseBackendAutocomplete
      ? `${appEndpoints.publicSearchProperties}?q=${encodeURIComponent(trimmedSearch)}&limit=10`
      : null,
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

  const changePage = (page: number) => setPage(Math.max(1, Math.min(page, totalPages)))

  const handleFavorite = async (propertyId: string) => {
    try {
      const response = await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })
      if (isExploreByCategory) {
        void mutateSearchedProperties()
      } else {
        mutateProperties()
      }
    } catch (err) {
      console.error('Error updating favorite:', err)
    }
  }

  // For explore_by_category we now rely on backend search; for other params we keep original list.
  const filteredProperties = useMemo(
    () => (isExploreByCategory ? searchedProperties : properties),
    [isExploreByCategory, searchedProperties, properties],
  )

  // Filter agencies based on active filters + search
  const filteredAgencies = useMemo(() => {
    if (params !== 'agency') return agentCompanyProfileData || []

    const query = searchTerm.trim().toLowerCase()

    return (agentCompanyProfileData || []).filter(agency => {
      // Location filter
      if (filters.location.length > 0) {
        const matchesLocation = filters.location.some(loc => 
          agency.city?.toLowerCase().includes(loc.toLowerCase()) ||
          agency.district?.toLowerCase().includes(loc.toLowerCase()) ||
          agency.state?.toLowerCase().includes(loc.toLowerCase())
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
  }, [agentCompanyProfileData, filters, params, searchTerm])

  // Suggestions for autocomplete in advanced search
  const searchSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return []

    // For property explore page, prefer backend autocomplete suggestions
    if (params === 'explore_by_category' && backendSuggestions.length > 0) {
      return backendSuggestions
    }

    const suggestionsSet = new Set<string>()

    if (params === 'explore_by_category') {
      properties.forEach(property => {
        const candidates = [
          property.title,
          property.city,
          property.district,
          property.state,
          property.address_line,
        ]
        candidates.forEach(value => {
          if (typeof value === 'string') {
            const lower = value.toLowerCase()
            if (lower.includes(query)) {
              suggestionsSet.add(value)
            }
          }
        })
      })
    } else if (params === 'agency') {
      ;(agentCompanyProfileData || []).forEach(agency => {
        const candidates = [
          agency.companyName,
          agency.profileName,
          agency.contact_name,
          agency.city,
          agency.district,
          agency.state,
        ]
        candidates.forEach(value => {
          if (typeof value === 'string') {
            const lower = value.toLowerCase()
            if (lower.includes(query)) {
              suggestionsSet.add(value)
            }
          }
        })
      })
    }

    return Array.from(suggestionsSet).slice(0, 8)
  }, [searchTerm, params, properties, agentCompanyProfileData, backendSuggestions])

  const totalItems =
    params === 'explore_by_category'
      ? searchedTotal
      : params === 'agency'
      ? filteredAgencies.length
      : params === 'builder'
      ? BuildersPropertiesList.length
      : 0
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const isEmpty = totalItems === 0

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
          {params === 'explore_by_category' ? (
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2a1407] tracking-tight mb-2">
                Discover Your Dream Property
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                Curated homes, villas and apartments from trusted sellers. Refine your search with smart filters and instant insights.
              </p>
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 shadow-sm border border-yellow-100">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-semibold text-[#2a1407]">{searchedTotal}</span> matching properties
                    </p>
                  </div>
                </div>
                {/* Advanced Search with Autocomplete */}
                <div className="relative max-w-xl">
                  <div className="flex items-center rounded-full bg-white shadow-sm border border-gray-200 px-4 py-2">
                    <span className="mr-2 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search by title, city, area or address..."
                      className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                      >
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
          ) : params === 'agency' ? (
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2a1407] tracking-tight mb-2">
                Expert Agents Ready to Help
              </h1>
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-4.35-4.35M11 5a6 6 0 100 12 6 6 0 000-12z"
                        />
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
                      <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                      >
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
          ) : params === 'builder' ? (
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2a1407] tracking-tight mb-2">
                Trusted Builders in Chennai
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                Premium developments from verified builders with modern amenities and prime locations.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Advanced Filters - Show for properties and agencies */}
          {(params === 'explore_by_category' || params === 'agency') && (
            <AdvancedFilters
              filters={filters}
              onFilterChange={setFilters}
              onClear={handleClearFilters}
              isOpen={isFiltersOpen}
              onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
              pageType={params === 'agency' ? 'agency' : 'property'}
            />
          )}

          {/* Properties / Agencies List */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Display */}
            {((params === 'explore_by_category' && hasActivePropertyFilters) || 
              (params === 'agency' && filteredAgencies.length !== (agentCompanyProfileData?.length || 0))) && (
              <div className="mb-5 flex flex-wrap items-center gap-2 p-4 bg-white/90 border border-yellow-200 rounded-2xl shadow-sm">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Active Filters
                </span>
                {filters.location.map(loc => (
                  <span key={loc} className="px-3 py-1 bg-yellow-500/90 text-[#2a1407] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
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
                  <span key={type} className="px-3 py-1 bg-yellow-500/90 text-[#2a1407] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
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
                  <span key={ver} className="px-3 py-1 bg-yellow-500/90 text-[#2a1407] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
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
                  <span key={preset} className="px-3 py-1 bg-yellow-500/90 text-[#2a1407] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm">
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
                    {totalItems} result{totalItems !== 1 ? 's' : ''} found
                  </span>
                  <button
                    onClick={handleClearFilters}
                    className="px-3 py-1 text-xs sm:text-sm font-semibold text-yellow-800 hover:text-yellow-900 underline underline-offset-4"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {params === 'explore_by_category' && (
              <>
                {isLoadingSearchedProperties ? (
                  <div className="space-y-4">
                    {Array.from({ length: limit }).map((_, index) => (
                      <motion.div
                        key={`property-skeleton-${index}`}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: index * 0.08, 
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94] as const
                        }}
                      >
                        <PropertyCardSkeleton />
                      </motion.div>
                    ))}
                  </div>
                ) : filteredProperties.length === 0 ? (
                  <div className="text-center py-16 rounded-2xl bg-white/80 border border-dashed border-gray-200">
                    <p className="text-gray-700 text-lg font-semibold">No properties match your filters</p>
                    <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                      Try adjusting your search keywords, price range or removing some filters to see more homes.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-5 px-6 py-2.5 bg-yellow-500 text-[#2a1407] rounded-full text-sm font-semibold hover:bg-yellow-600 transition-all shadow-sm"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredProperties.map((property, index) => (
                      <motion.div
                        key={property.id ?? index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ 
                          delay: index * 0.06, 
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94] as const
                        }}
                        className="w-full"
                      >
                        <PropertyCard
                          {...property}
                          language={t}
                          primaryActionLabel="View Details"
                          onPrimaryAction={() => router.push(`/propertyDetails/${property.id}`)}
                          handleFavorite={handleFavorite}
                          handleShare={() => console.log('Share', property.id)}
                          isUserFavorited={property.is_user_favorite}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {params === 'agency' && (
              <>
                {agentCompanyProfileFetchLoader ? (
                  <div className="space-y-5">
                    {Array.from({ length: limit }).map((_, index) => (
                      <motion.div
                        key={`agency-skeleton-${index}`}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: index * 0.08, 
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94] as const
                        }}
                      >
                        <AgentCardSkeleton />
                      </motion.div>
                    ))}
                  </div>
                ) : filteredAgencies.length === 0 ? (
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
                  <div className="space-y-5">
                    {filteredAgencies.map((agentProperty, index) => (
                      <motion.div
                        key={agentProperty.id ?? index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ 
                          delay: index * 0.06, 
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94] as const
                        }}
                        className="w-full"
                      >
                        <AgentCard 
                          {...agentProperty} 
                          language={t}
                          isFiltersOpen={isFiltersOpen}
                          handleFavorite={(agentId) => {
                            // Implement favorite functionality if needed
                            console.log('Favorite agent:', agentId)
                          }}
                          handleShare={(agentId) => {
                            // Implement share functionality
                            if (navigator.share) {
                              navigator.share({
                                title: agentProperty.companyName,
                                text: agentProperty.description,
                                url: window.location.href,
                              })
                            } else {
                              navigator.clipboard.writeText(window.location.href)
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {params === 'builder' && (
              <>
                {isLoadingProperties ? (
                  <div className="space-y-4">
                    {Array.from({ length: limit }).map((_, index) => (
                      <motion.div
                        key={`builder-skeleton-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <SkeletonLoader />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {BuildersPropertiesList.map((builderProperty, index) => (
                      <motion.div
                        key={index}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        whileHover={{ y: -2 }}
                        className="hover:shadow-lg transition-shadow duration-300"
                      >
                        <BuilderCard {...builderProperty} language={t} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination totalItems={totalItems} itemsPerPage={limit} currentPage={page} onPageChange={changePage} />
              </div>
            )}
          </div>
        </div>
      </div>

    </motion.div>
  )
}

export default PropertiesListing
