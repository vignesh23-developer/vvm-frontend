'use client'
import { useState, useCallback, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSearchProperties } from './(hooks)/useSearchProperties'
import { usePublicPropertySearch } from './(hooks)/usePublicPropertySearch'
import { getMethod, postMethod } from '@/services/service'
import { appEndpoints } from '@/services/endpoints'
import { motion, AnimatePresence } from 'framer-motion'
import PropertyCard from '@/components/buyer/PropertyCard/PropertyCard'
import Pagination from '@/components/ui/CustomComponent/Paginations/Pagination'
import AdvancedFilters from '@/components/ui/AdvancedFilter/AdvancedFilters'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/hooks/AuthContext/AuthContextProvider'
import { useLoginModal } from '@/components/auth/LoginModalProvider'

// Enhanced Property Card Skeleton
// Enhanced Property Card Skeleton - Vertical for Grid
const PropertyCardSkeleton = () => (
  <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 animate-pulse h-full">
    {/* Image Skeleton */}
    <div className="relative h-64 w-full bg-gray-200" />

    {/* Content Skeleton */}
    <div className="flex flex-col flex-1 p-5 space-y-4">
      {/* Title & Location */}
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-gray-200 rounded" />
        <div className="flex gap-2 items-center">
          <div className="h-4 w-4 rounded-full bg-gray-200" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Divider & Footer Grid */}
      <div className="mt-auto border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
        {/* Price Placeholder */}
        <div className="space-y-1">
          <div className="h-3 w-10 bg-gray-200 rounded" />
          <div className="h-6 w-24 bg-gray-200 rounded" />
        </div>
        {/* Size Placeholder */}
        <div className="flex flex-col items-end space-y-1">
          <div className="h-3 w-10 bg-gray-200 rounded" />
          <div className="flex items-center gap-1">
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>
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
  offer: string[]
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

const PropertiesListPage = () => {
  const t = useTranslations()
  const router = useRouter()
  const { token } = useAuth()
  const { openLoginModal } = useLoginModal()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const searchParams = useSearchParams()
  const params = {
    district: decodeURIComponent(searchParams.get('district') || ''),
    listingType: decodeURIComponent(searchParams.get('listingType') || ''),
    type: decodeURIComponent(searchParams.get('type') || ''),
    budget: decodeURIComponent(searchParams.get('budget') || ''),
  }

  const [isFiltersOpen, setIsFiltersOpen] = useState(false) // Closed by default, user can open
  const [searchTerm, setSearchTerm] = useState('') // Advanced search term
  const [isHydratedFromUrl, setIsHydratedFromUrl] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debouncedUrlSearch, setDebouncedUrlSearch] = useState('')
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
    offer: [],
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

  const trimmedSearch = searchTerm.trim()

  const selectedDistrict = filters.district?.[0] ?? params.district ?? ''

  // District dropdown options
  const { data: districtSummaryResponse } = useSWR(['property-district-summary', 500] as const, ([, limit]) =>
    getMethod<any>(appEndpoints.getAllPropertyDistrictSummary, { limit }),
  )

  const districts = useMemo(() => {
    const raw = (districtSummaryResponse as any)?.data
    const list = Array.isArray(raw) ? raw : []

    const names = list
      .map((item: any) => (typeof item === 'string' ? item : item?.district))
      .filter((v: unknown): v is string => typeof v === 'string' && v.trim().length > 0)

    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b))
  }, [districtSummaryResponse])

  // One-time hydration from URL params (supports deep links)
  useEffect(() => {
    if (isHydratedFromUrl) return

    const initialQ = searchParams.get('q') || ''
    const initialDistrict = searchParams.get('district') || ''

    if (initialQ) setSearchTerm(initialQ)
    if (initialDistrict) {
      setFilters(prev => ({ ...prev, district: [initialDistrict] }))
    }

    setIsHydratedFromUrl(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydratedFromUrl])

  // Debounce URL updates for q to avoid excessive router.replace while typing
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedUrlSearch(trimmedSearch), 300)
    return () => clearTimeout(handle)
  }, [trimmedSearch])

  // Keep URL in sync: searchTerm -> q, selectedDistrict -> district
  useEffect(() => {
    if (!isHydratedFromUrl) return

    const currentQ = searchParams.get('q') || ''
    const currentDistrict = searchParams.get('district') || ''

    const nextQ = debouncedUrlSearch
    const nextDistrict = selectedDistrict

    if (currentQ === nextQ && currentDistrict === nextDistrict) return

    const nextParams = new URLSearchParams(searchParams.toString())

    if (nextQ) nextParams.set('q', nextQ)
    else nextParams.delete('q')

    if (nextDistrict) nextParams.set('district', nextDistrict)
    else nextParams.delete('district')

    const qs = nextParams.toString()
    // console.log('Updating URL with params:', qs)

    router.replace(qs ? `/properties-list?${qs}` : '/properties-list', { scroll: false })
  }, [debouncedUrlSearch, isHydratedFromUrl, router, searchParams, selectedDistrict])

  // Debounce autocomplete: only trigger after 3+ characters and a short pause.
  useEffect(() => {
    if (trimmedSearch.length < 3) {
      setDebouncedSearch('')
      return
    }

    const handle = setTimeout(() => setDebouncedSearch(trimmedSearch), 300)
    return () => clearTimeout(handle)
  }, [trimmedSearch])

  const hasActivePropertyFilters = useMemo(() => {
    const arrayFilters = [
      filters.propertyType,
      filters.bedrooms,
      filters.bathrooms,
      filters.location,
      filters.amenities,
      filters.listingType,
      filters.status,
      filters.verified,
      filters.featured,
      filters.priceRangePreset,
      filters.furnishing,
      filters.facing,
      filters.parking,
      filters.district,
      filters.state,
      filters.postalCode,
      filters.propertyCategoryId,
      filters.category_id,
    ]

    if (arrayFilters.some(bucket => bucket.length > 0)) return true

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000) return true
    if (filters.sizeRange[0] > 0 || filters.sizeRange[1] > 0) return true
    if (filters.sortBy) return true
    if (filters.isPremium) return true
    if (filters.ownerId || filters.agentId) return true
    if (filters.lat !== undefined || filters.lon !== undefined || !!filters.radius) return true

    return false
  }, [filters])

  const shouldUseAdvancedResults = trimmedSearch.length > 0 || hasActivePropertyFilters

  const { properties, handleEdit, handleDelete, total, error, isLoadingProperties, mutateProperties, handlePropertyAction } = useSearchProperties({
    page,
    limit,
    district: params.district,
    listingType: params.listingType,
    type: params.type,
    budget: params.budget,
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
    includeFilters: true,
    enabled: shouldUseAdvancedResults,
  })
  const shouldUseBackendAutocomplete = debouncedSearch.length >= 3

  const { data: autocompleteResponse } = useSWR(
    shouldUseBackendAutocomplete ? `${appEndpoints.publicSearchProperties}?q=${encodeURIComponent(debouncedSearch)}&limit=12` : null,
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

  const baseTotal = Number(total ?? 0)
  const totalResults = shouldUseAdvancedResults ? (searchedTotal ?? 0) : baseTotal
  const totalPages = Math.max(1, Math.ceil((totalResults || 0) / limit))

  const displayedProperties = shouldUseAdvancedResults ? searchedProperties : properties
  const isLoadingList = shouldUseAdvancedResults ? isLoadingSearchedProperties : isLoadingProperties

  const changePage = (page: number) => setPage(Math.max(1, Math.min(page, totalPages)))

  const handlePropertyClick = (propertyId: string | number) => {
    if (!propertyId) return

    const detailsPath = `/propertyDetails/${propertyId}`

    if (!token) {
      openLoginModal({ next: detailsPath })
      return
    }

    router.push(detailsPath)
  }

  const handleFavorite = async (propertyId: string) => {
    try {
      const response = await postMethod(appEndpoints.toggleFavorite, { entity_type: 'property', entity_id: propertyId })
      await Promise.all([mutateProperties(), shouldUseAdvancedResults ? mutateSearchedProperties() : Promise.resolve()])
    } catch (err) {
      console.error('Error updating favorite:', err)
    }
  }

  const handleShare = async (url?: string) => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

    try {
      if (navigator.share) {
        await navigator.share({ url: shareUrl })
      } else {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Link copied to clipboard')
      }
    } catch (err) {
      console.error('Share failed', err)
    }
  }

  // console.log('PropertiesListPage render:', { properties, total, isLoadingProperties, error })

  // For explore_by_category we now rely on backend search; for other params we keep original list.
  // Suggestions for autocomplete in advanced search
  const searchSuggestions = useMemo(() => {
    const query = debouncedSearch.toLowerCase()
    if (!query || query.length < 3) return []

    if (backendSuggestions.length > 0) {
      return backendSuggestions
    }

    const suggestionsSet = new Set<string>()
    const suggestionSource = shouldUseAdvancedResults && searchedProperties.length > 0 ? searchedProperties : properties

    suggestionSource.forEach((property: any) => {
      const candidates = [property.title, property.city, property.district, property.state, property.address_line]
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
  }, [debouncedSearch, properties, searchedProperties, backendSuggestions, shouldUseAdvancedResults])

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
      offer: [],
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
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2a1407] tracking-tight mb-3">{t('PropertiesList.heading')}</h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">{t('PropertiesList.subheading')}</p>
            </div>

            {/* Full Width Search & Filter Bar */}
            <div className="w-full">
              <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center bg-white p-2 rounded-2xl shadow-lg border border-yellow-100/50">
                {/* District Dropdown */}
                <div className="w-full md:w-64 px-2 md:px-0">
                  <select
                    value={selectedDistrict}
                    onChange={e => {
                      const v = e.target.value
                      setPage(1)
                      setFilters(prev => ({ ...prev, district: v ? [v] : [] }))
                    }}
                    className="block w-full px-4 py-3 bg-transparent border-none rounded-xl text-gray-900 focus:ring-0 sm:text-base"
                  >
                    <option value="">{t('PropertiesList.all_districts')}</option>

                    {districts.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Divider (Hidden on mobile) */}
                <div className="hidden md:block w-px bg-gray-200 my-2"></div>

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
                    onChange={e => {
                      setPage(1)
                      setSearchTerm(e.target.value)
                    }}
                    placeholder={t('PropertiesList.search_placeholder')}
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
              {searchSuggestions.length > 0 && (
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

            {/* Results Count & Context */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-50 border border-yellow-100/50">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm font-medium text-gray-700">
                  <span className="font-extrabold text-[#2a1407]">{totalResults}</span> {t('PropertiesList.results_found')}
                  {(searchTerm || params.district) && (
                    <span className="text-gray-500 font-normal">
                      {' '}
                      {t('PropertiesList.for')} <span className="text-[#2a1407] italic">"{searchTerm || params.district}"</span>
                    </span>
                  )}
                </p>
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
            pageType={'property'}
          />

          {/* Properties / Agencies List */}
          <div className="flex-1 min-w-0">
            {/* Active Filters Display */}
            {/* {((params === 'explore_by_category' && hasActivePropertyFilters) || 
                  (params === 'agency' && filteredAgencies.length !== (agentCompanyProfileData?.length || 0))) && ( */}
            <div className="mb-5 flex flex-wrap items-center gap-2 p-4 bg-white/90 border border-yellow-200 rounded-2xl shadow-sm">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wide">{t('PropertiesList.active_filters')}</span>
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
              {(filters.offer || []).map(offer => (
                <span
                  key={offer}
                  className="px-3 py-1 bg-yellow-500/90 text-[#2a1407] rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm"
                >
                  {offer}
                  <button
                    onClick={() => {
                      setFilters(prev => ({ ...prev, offer: (prev.offer || []).filter(o => o !== offer) }))
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
                  {totalResults} {t('PropertiesList.results_found')}
                </span>
                <button
                  onClick={handleClearFilters}
                  className="px-3 py-1 text-xs sm:text-sm font-semibold text-yellow-800 hover:text-yellow-900 underline underline-offset-4 cursor-pointer"
                >
                  {t('PropertiesList.clear_all')}
                </button>
              </div>
            </div>
            {/* )} */}

            <>
              {isLoadingList ? (
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isFiltersOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-6`}>
                  {Array.from({ length: limit }).map((_, index) => (
                    <motion.div
                      key={`property-skeleton-${index}`}
                      initial={{ opacity: 0, y: 30, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                      }}
                      className="h-full"
                    >
                      <PropertyCardSkeleton />
                    </motion.div>
                  ))}
                </div>
              ) : displayedProperties.length === 0 ? (
                <div className="text-center py-16 rounded-2xl bg-white/80 border border-dashed border-gray-200">
                  <p className="text-gray-700 text-lg font-semibold">{t('PropertiesList.no_results_title')}</p>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">{t('PropertiesList.no_results_desc')}</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-5 px-6 py-2.5 bg-yellow-500 text-[#2a1407] rounded-full text-sm font-semibold hover:bg-yellow-600 transition-all shadow-sm cursor-pointer"
                  >
                    {t('PropertiesList.clear_filters')}
                  </button>
                </div>
              ) : (
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${isFiltersOpen ? 'xl:grid-cols-3' : 'xl:grid-cols-4'} gap-6`}>
                  {displayedProperties.map((property: any, index: number) => (
                    <motion.div
                      key={property.id ?? index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{
                        delay: index * 0.06,
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94] as const,
                      }}
                      className="h-full"
                    >
                      <PropertyCard
                        {...property}
                        language={t}
                        primaryActionLabel="View Details"
                        onPrimaryAction={() => handlePropertyClick(property.id)}
                        handleFavorite={handleFavorite}
                        handleShare={() => handleShare(`/propertyDetails/${property.id}`)}
                        isUserFavorited={property.is_user_favorite}
                        isVerified={property.approval_status === 'APPROVED'}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination totalItems={totalResults} itemsPerPage={limit} currentPage={page} onPageChange={changePage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PropertiesListPage
