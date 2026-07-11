'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'

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

interface AdvancedFiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  onClear: () => void
  isOpen: boolean
  onToggle: () => void
  pageType?: 'property' | 'agency' | 'ads-list' // To distinguish between property, agency, and ads pages
  hideTriggerButton?: boolean
}

type PriceRange = { label: string; min: number; max: number | null }
type FilterOption = { value: string; label: string }

// Frontend defaults – only overridden where the backend provides values.
const defaultListingTypes: string[] = ['SALE', 'RENT']
const defaultStatuses: string[] = ['AVAILABLE', 'SOLD', 'RENTED']
const defaultProjectStatuses: string[] = ['CURRENT', 'UPCOMING', 'COMPLETED']
const defaultPriceRanges: PriceRange[] = [
  { label: 'Under 50k', min: 0, max: 50000 },
  { label: '50k - 100k', min: 50000, max: 100000 },
  { label: '100k - 250k', min: 100000, max: 250000 },
  { label: '250k+', min: 250000, max: null },
]

// These are not exposed by the current backend filters API, so they stay local.
const defaultPropertyTypes: string[] = ['Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Farm House', 'Studio']
const defaultBedrooms: string[] = ['1', '2', '3', '4', '5+']
const defaultBathrooms: string[] = ['1', '2', '3', '4+']
const defaultLocations: string[] = ['Chennai', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Kolkata', 'Ahmedabad']
const defaultAmenities: string[] = [
  'Parking',
  'Security',
  'Lift',
  'Gym',
  'Swimming Pool',
  'Garden',
  'Power Backup',
  'Water Supply',
  'Clubhouse',
  'Playground',
]
const defaultVerifiedOptions: string[] = ['Verified Only', 'All Properties']
const defaultFeaturedOptions: string[] = ['Featured Properties', 'Premium Properties']
const defaultFurnishing: string[] = ['Fully-Furnished', 'Semi-Furnished', 'Unfurnished']
const defaultFacing: string[] = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']
const defaultParking: string[] = ['Covered', 'Open', 'Two Wheeler', 'Four Wheeler', 'No Parking']
const defaultSortOptions: { value: string; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'size_asc', label: 'Size: Small to Large' },
  { value: 'size_desc', label: 'Size: Large to Small' },
]

export default function AdvancedFilters({
  filters,
  onFilterChange,
  onClear,
  isOpen,
  onToggle,
  pageType = 'property', // Default to property page
  hideTriggerButton = false,
}: AdvancedFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    price: true,
    verified: true,
    propertyType: true,
    bedrooms: true,
    location: true,
  })

  // Load filter metadata from backend (property page)
  const { data: filtersMeta, error: filtersError } = useSWR(
    pageType !== 'ads-list' ? appEndpoints.publicSearchPropertyFilters : null,
    async (url: string) => {
      console.log('🔍 Filter Options API Call:', url)
      try {
        const response = await getMethod<any>(url)

        // The backend now provides a consistent filters payload, but this parser
        // still supports older nested formats.
        // Supported shapes (inside ResponseDTO.data):
        // 1) { filters: {...} }
        // 2) { data: { filters: {...} } }
        // 3) { data: { data: { filters: {...} } } }  (legacy)
        const dtoPayload = response.data

        let container = dtoPayload as any
        if (container && typeof container === 'object' && 'data' in container && !Array.isArray(container.data)) {
          container = container.data
        }
        if (container && typeof container === 'object' && 'data' in container && !Array.isArray(container.data)) {
          container = container.data
        }

        const filters = (container && container.filters) || {}
        const message = (container && (container as any).message) || (dtoPayload && (dtoPayload as any).message) || undefined

        console.log('✅ Filter Options API Response (normalized):', {
          raw: dtoPayload,
          container,
          filterKeys: Object.keys(filters),
          message,
        })

        return { data: { filters, message } }
      } catch (error) {
        console.error('❌ Filter Options API Error:', error)
        return { data: { filters: {} } }
      }
    },
  )

  // Load filter metadata from backend (ads page)
  const { data: filtersAdsMeta, error: filtersAdsError } = useSWR(
    pageType === 'ads-list' ? appEndpoints.publicSearchAdsFilters : null,
    async (url: string) => {
      console.log('🔍 Filter AAds Options API Call:', url)
      try {
        const response = await getMethod<any>(url)

        // The backend now provides a consistent filters payload, but this parser
        // still supports older nested formats.
        // Supported shapes (inside ResponseDTO.data):
        // 1) { filters: {...} }
        // 2) { data: { filters: {...} } }
        // 3) { data: { data: { filters: {...} } } }  (legacy)
        const dtoPayload = response.data

        let container = dtoPayload as any
        if (container && typeof container === 'object' && 'data' in container && !Array.isArray(container.data)) {
          container = container.data
        }
        if (container && typeof container === 'object' && 'data' in container && !Array.isArray(container.data)) {
          container = container.data
        }

        const filters = (container && container.filters) || {}
        const message = (container && (container as any).message) || (dtoPayload && (dtoPayload as any).message) || undefined

        console.log('✅ Filter Options API Response (normalized):', {
          raw: dtoPayload,
          container,
          filterKeys: Object.keys(filters),
          message,
        })

        return { data: { filters, message } }
      } catch (error) {
        console.error('❌ Filter Options API Error:', error)
        return { data: { filters: {} } }
      }
    },
  )

  console.log('🔧 AdvancedFilters Component - Filter Meta Data:', { filtersMeta, filtersError, filtersAdsMeta, filtersAdsError })

  // Extract filter options from backend response
  // After normalization above we always expect: { data: { filters: {...}, message?: string } }
  // but we keep a small fallback for any older shapes.
  const filtersMetaData = filtersMeta as any
  const backendFilters = filtersMetaData?.data?.filters || filtersMetaData?.data?.data?.filters || {}
  const backendMessage = filtersMetaData?.data?.message as string | undefined

  const adsFiltersMetaData = filtersAdsMeta as any
  const backendAdsFilters = adsFiltersMetaData?.data?.filters || adsFiltersMetaData?.data?.data?.filters || {}
  const backendAdsMessage = adsFiltersMetaData?.data?.message as string | undefined

  const activeBackendFilters = pageType === 'ads-list' ? backendAdsFilters : backendFilters
  const activeBackendMessage = pageType === 'ads-list' ? backendAdsMessage : backendMessage

  // Log filter availability for debugging (more neutral messaging)
  if (Object.keys(activeBackendFilters).length === 0) {
    console.info('ℹ️ No filter buckets received from backend – falling back to default filter options.', {
      backendMessage: activeBackendMessage,
    })
    console.log('📊 Filter Meta Structure:', {
      hasData: !!filtersMetaData?.data,
      hasNestedData: !!filtersMetaData?.data?.data,
      hasFilters: !!filtersMetaData?.data?.filters || !!filtersMetaData?.data?.data?.filters,
      dataKeys: filtersMetaData?.data ? Object.keys(filtersMetaData.data) : [],
      nestedDataKeys: filtersMetaData?.data?.data ? Object.keys(filtersMetaData.data.data) : [],
      filtersKeys: Object.keys(activeBackendFilters),
    })
  } else {
    console.log('✅ Backend filters loaded:', {
      filterKeys: Object.keys(activeBackendFilters),
      totalFilters: Object.keys(activeBackendFilters).length,
      sampleFilter: Object.keys(activeBackendFilters)[0]
        ? {
          key: Object.keys(activeBackendFilters)[0],
          value: (activeBackendFilters as any)[Object.keys(activeBackendFilters)[0]],
        }
        : null,
    })
  }

  // Transform backend filter buckets (which have {value, label, count}) to simple string arrays
  const transformFilterBuckets = (buckets: Array<{ value: string; label: string; count: number }> | undefined): string[] => {
    if (!Array.isArray(buckets)) return []
    return buckets.map(b => b.value || b.label).filter(Boolean)
  }

  // Transform backend buckets into value/label options (so we can display names but keep IDs)
  const transformFilterOptions = (buckets: Array<{ value: string; label: string; count: number }> | undefined): FilterOption[] => {
    if (!Array.isArray(buckets)) return []
    return buckets.map(b => ({ value: String(b.value ?? ''), label: String(b.label ?? b.value ?? '') })).filter(o => o.value && o.label)
  }

  // Values driven purely by backend – no local fallbacks.
  const listingTypes = transformFilterBuckets((activeBackendFilters as any).listing_types)

  const statuses = transformFilterBuckets((activeBackendFilters as any).statuses)
  const projectStatuses = transformFilterBuckets((activeBackendFilters as any).project_statuses)

  // Price ranges - backend provides min/max, we create ranges from that.
  // If backend doesn't send stats, the list stays empty.
  const backendPriceStats = (activeBackendFilters as any).price
  const priceRanges: PriceRange[] =
    backendPriceStats?.min !== undefined && backendPriceStats?.max !== undefined
      ? [
        { label: `Under ${(backendPriceStats.min / 1000).toFixed(0)}k`, min: 0, max: backendPriceStats.min },
        {
          label: `${(backendPriceStats.min / 1000).toFixed(0)}k - ${(backendPriceStats.max / 1000).toFixed(0)}k`,
          min: backendPriceStats.min,
          max: backendPriceStats.max,
        },
        { label: `${(backendPriceStats.max / 1000).toFixed(0)}k+`, min: backendPriceStats.max, max: null },
      ]
      : []

  // Property Types (e.g., Apartment/Villa) and Property Categories (master categories) are different.
  // - `propertyType` is used for `property_type` query param.
  // - `propertyCategoryId` is used for `property_category_id` query param (expects IDs).
  const propertyTypes = transformFilterBuckets((activeBackendFilters as any).property_types)
  const propertyCategories = transformFilterOptions((activeBackendFilters as any).property_categories)
  const adsCategories = transformFilterOptions((activeBackendFilters as any).categories)

  const bedrooms = transformFilterBuckets((activeBackendFilters as any).bhk)
  const bathrooms = transformFilterBuckets((activeBackendFilters as any).bathrooms)
  const locations = transformFilterBuckets((activeBackendFilters as any).cities)
  const districts = transformFilterBuckets((activeBackendFilters as any).districts)
  const states = transformFilterBuckets((activeBackendFilters as any).states)
  const amenities = transformFilterBuckets((activeBackendFilters as any).amenities)

  // These remain local-only toggles (no backend buckets), but they don't affect API params
  // beyond simple flags, so we keep the UX defaults.
  const verifiedOptions = defaultVerifiedOptions
  const featuredOptions = defaultFeaturedOptions

  const furnishingOptions = transformFilterBuckets((activeBackendFilters as any).furnishing)
  const facingOptions = defaultFacing // still local; backend doesn't provide facing aggregations
  const parkingOptions = transformFilterBuckets((activeBackendFilters as any).parking)
  const sortOptions = defaultSortOptions

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: keyof FilterState, value: string) => {
    const current = Array.isArray(filters[key]) ? (filters[key] as string[]) : []
    const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value]
    updateFilter(key, updated)
  }

  const activeFilterCount =
    (filters.propertyType.length > 0 ? 1 : 0) +
    (filters.bedrooms.length > 0 ? 1 : 0) +
    (filters.bathrooms.length > 0 ? 1 : 0) +
    (filters.location.length > 0 ? 1 : 0) +
    (filters.amenities.length > 0 ? 1 : 0) +
    (filters.listingType.length > 0 ? 1 : 0) +
    (filters.status.length > 0 ? 1 : 0) +
    (filters.projectStatus.length > 0 ? 1 : 0) +
    (filters.verified.length > 0 ? 1 : 0) +
    (filters.featured.length > 0 ? 1 : 0) +
    (filters.offer?.length > 0 ? 1 : 0) +
    (filters.priceRangePreset.length > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000000 ? 1 : 0) +
    (filters.furnishing.length > 0 ? 1 : 0) +
    (filters.facing.length > 0 ? 1 : 0) +
    (filters.parking.length > 0 ? 1 : 0) +
    (filters.sizeRange[0] > 0 || filters.sizeRange[1] > 0 ? 1 : 0) +
    (filters.layoutPriceRange[0] > 0 || filters.layoutPriceRange[1] > 0 ? 1 : 0) +
    (filters.layoutAreaRange[0] > 0 || filters.layoutAreaRange[1] > 0 ? 1 : 0) +
    (filters.layoutTotalSqftRange[0] > 0 || filters.layoutTotalSqftRange[1] > 0 ? 1 : 0) +
    (filters.plotAvailableRange[0] > 0 || filters.plotAvailableRange[1] > 0 ? 1 : 0) +
    (filters.district.length > 0 ? 1 : 0) +
    (filters.state.length > 0 ? 1 : 0) +
    (filters.postalCode.length > 0 ? 1 : 0) +
    (filters.propertyCategoryId.length > 0 ? 1 : 0) +
    (filters.category_id.length > 0 ? 1 : 0) +
    (filters.sortBy ? 1 : 0)

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#2a1407] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold hover:bg-[#2a1407] transition-all transform hover:scale-105"
      >
        <SlidersHorizontal size={20} />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-yellow-500 text-[#2a1407] rounded-full px-2.5 py-1 text-xs font-bold min-w-[24px] text-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Desktop Filter Sidebar - With Close Button */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto bg-white border-r border-gray-200 w-80 p-6 shadow-lg scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-gray-100"
          >
            <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-yellow-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-yellow-600" size={22} />
                <h3 className="text-xl font-bold text-[#2a1407]">Refine Results</h3>
                {activeFilterCount > 0 && (
                  <span className="bg-yellow-500 text-[#2a1407] rounded-full px-2.5 py-1 text-xs font-bold">{activeFilterCount}</span>
                )}
              </div>
              <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close filters">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <FilterContent
              filters={filters}
              updateFilter={updateFilter}
              toggleArrayFilter={toggleArrayFilter}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              activeFilterCount={activeFilterCount}
              onClear={onClear}
              listingTypes={listingTypes}
              statuses={statuses}
              projectStatuses={projectStatuses}
              priceRanges={priceRanges}
              propertyTypes={propertyTypes}
              propertyCategories={propertyCategories}
              adsCategories={adsCategories}
              bedrooms={bedrooms}
              bathrooms={bathrooms}
              locations={locations}
              districts={districts}
              states={states}
              amenities={amenities}
              verifiedOptions={verifiedOptions}
              featuredOptions={featuredOptions}
              furnishingOptions={furnishingOptions}
              facingOptions={facingOptions}
              parkingOptions={parkingOptions}
              sortOptions={sortOptions}
              pageType={pageType}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Filter Toggle Button - When Closed */}
      {!isOpen && !hideTriggerButton && (
        <button
          onClick={onToggle}
          className="hidden lg:flex fixed right-6 top-24 z-40 bg-[#2a1407] text-white px-4 py-3 rounded-full shadow-xl items-center gap-2 font-bold hover:bg-[#2a1407] transition-all transform hover:scale-105"
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-yellow-500 text-[#2a1407] rounded-full px-2 py-0.5 text-xs font-bold min-w-[20px] text-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      )}

      {/* Mobile Filter Sidebar - Toggleable */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Mobile Filter Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 h-screen overflow-y-auto bg-white border-r border-gray-200 z-50 w-80 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-yellow-200">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="text-yellow-600" size={22} />
                  <h3 className="text-xl font-bold text-[#2a1407]">Refine Results</h3>
                  {activeFilterCount > 0 && (
                    <span className="bg-yellow-500 text-[#2a1407] rounded-full px-2.5 py-1 text-xs font-bold">{activeFilterCount}</span>
                  )}
                </div>
                <button onClick={onToggle} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              <FilterContent
                filters={filters}
                updateFilter={updateFilter}
                toggleArrayFilter={toggleArrayFilter}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                activeFilterCount={activeFilterCount}
                onClear={onClear}
                listingTypes={listingTypes}
                statuses={statuses}
                projectStatuses={projectStatuses}
                priceRanges={priceRanges}
                propertyTypes={propertyTypes}
                propertyCategories={propertyCategories}
                adsCategories={adsCategories}
                bedrooms={bedrooms}
                bathrooms={bathrooms}
                locations={locations}
                districts={districts}
                states={states}
                amenities={amenities}
                verifiedOptions={verifiedOptions}
                featuredOptions={featuredOptions}
                furnishingOptions={furnishingOptions}
                facingOptions={facingOptions}
                parkingOptions={parkingOptions}
                sortOptions={sortOptions}
                pageType={pageType}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function FilterContent({
  filters,
  updateFilter,
  toggleArrayFilter,
  expandedSections,
  toggleSection,
  activeFilterCount,
  onClear,
  listingTypes,
  statuses,
  projectStatuses,
  priceRanges,
  propertyTypes,
  propertyCategories,
  adsCategories,
  bedrooms,
  bathrooms,
  locations,
  districts,
  states,
  amenities,
  verifiedOptions,
  featuredOptions,
  furnishingOptions,
  facingOptions,
  parkingOptions,
  sortOptions,
  pageType = 'property',
}: {
  filters: FilterState
  updateFilter: (key: keyof FilterState, value: any) => void
  toggleArrayFilter: (key: keyof FilterState, value: string) => void
  expandedSections: Record<string, boolean>
  toggleSection: (section: string) => void
  activeFilterCount: number
  onClear: () => void
  listingTypes: string[]
  statuses: string[]
  projectStatuses: string[]
  priceRanges: PriceRange[]
  propertyTypes: string[]
  propertyCategories: FilterOption[]
  adsCategories: FilterOption[]
  bedrooms: string[]
  bathrooms: string[]
  locations: string[]
  districts: string[]
  states: string[]
  amenities: string[]
  verifiedOptions: string[]
  featuredOptions: string[]
  furnishingOptions: string[]
  facingOptions: string[]
  parkingOptions: string[]
  sortOptions: { value: string; label: string }[]
  pageType?: 'property' | 'agency' | 'ads-list'
}) {
  return (
    <>
      {/* Clear All Button */}
      {activeFilterCount > 0 && (
        <button
          onClick={onClear}
          className="w-full mb-4 px-4 py-2.5 text-sm font-bold text-[#2a1407] bg-yellow-500 hover:bg-yellow-600 border-2 border-yellow-600 rounded-lg transition-all shadow-sm hover:shadow"
        >
          Clear All ({activeFilterCount})
        </button>
      )}

      {/** These locals are derived here so JSX below can use them */}
      {/** eslint-disable-next-line @typescript-eslint/no-unused-vars */}
      {(() => {
        void priceRanges
        void listingTypes
        void statuses
      })()}

      <div className="space-y-4">
        {/* Price Range Presets - Only show on property page if more than 1 range */}
        {pageType === 'property' && priceRanges.length > 1 && (
          <FilterSection title="Price Range" isExpanded={expandedSections.price} onToggle={() => toggleSection('price')}>
            <div className="space-y-3">
              {priceRanges.map((range, idx) => (
                <label key={idx} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.priceRangePreset) && filters.priceRangePreset.includes(range.label)}
                    onChange={() => {
                      const currentPresets = Array.isArray(filters.priceRangePreset) ? filters.priceRangePreset : []
                      const updated = currentPresets.includes(range.label)
                        ? currentPresets.filter(p => p !== range.label)
                        : [...filters.priceRangePreset, range.label]
                      updateFilter('priceRangePreset', updated)
                      if (!currentPresets.includes(range.label)) {
                        updateFilter('priceRange', [range.min, range.max ?? 100000000])
                      }
                    }}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{range.label}</span>
                </label>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Min</label>
                    <input
                      type="number"
                      value={(() => {
                        const min = Array.isArray(filters.priceRange) ? filters.priceRange[0] : 0
                        return typeof min === 'number' && Number.isFinite(min) ? (min === 0 ? '' : min) : ''
                      })()}
                      onChange={e => {
                        const nextMin = e.target.value === '' ? 0 : Number(e.target.value) || 0
                        const currentMax = Array.isArray(filters.priceRange) ? filters.priceRange[1] : 100000000
                        updateFilter('priceRange', [nextMin, typeof currentMax === 'number' && Number.isFinite(currentMax) ? currentMax : 100000000])
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Max</label>
                    <input
                      type="number"
                      value={(() => {
                        const max =
                          typeof filters.priceRange[1] === 'number' && Number.isFinite(filters.priceRange[1]) ? filters.priceRange[1] : 100000000
                        return max === 100000000 ? '' : max
                      })()}
                      onChange={e => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value) || 100000000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="No limit"
                    />
                  </div>
                </div>
              </div>
            </div>
          </FilterSection>
        )}

        {/* Property Category - show name (label) but store ID (value) */}
        {pageType === 'property' && propertyCategories.length > 1 && (
          <FilterSection title="Property Category" isExpanded={expandedSections.propertyType} onToggle={() => toggleSection('propertyType')}>
            <div className="space-y-2">
              {propertyCategories.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.propertyCategoryId) && filters.propertyCategoryId.includes(option.value)}
                    onChange={() => toggleArrayFilter('propertyCategoryId', option.value)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Ads Category - show name (label) but store ID (value) into category_id */}
        {pageType === 'ads-list' && adsCategories.length > 0 && (
          <FilterSection title="Category" isExpanded={expandedSections.category_id || false} onToggle={() => toggleSection('category_id')}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {adsCategories.map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.category_id) && filters.category_id.includes(option.value)}
                    onChange={() => toggleArrayFilter('category_id', option.value)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Property Type (e.g., Apartment/Villa) - optional backend buckets */}
        {pageType === 'property' && propertyTypes.length > 1 && (
          <FilterSection title="Property Type" isExpanded={expandedSections.propertyType} onToggle={() => toggleSection('propertyType')}>
            <div className="space-y-2">
              {propertyTypes.map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.propertyType) && filters.propertyType.includes(type)}
                    onChange={() => toggleArrayFilter('propertyType', type)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Bedrooms - Only show on property page if more than 1 option */}
        {pageType === 'property' && bedrooms.length > 1 && (
          <FilterSection title="Bedrooms" isExpanded={expandedSections.bedrooms} onToggle={() => toggleSection('bedrooms')}>
            <div className="flex flex-wrap gap-2">
              {bedrooms.map((bed: string) => (
                <button
                  key={bed}
                  type="button"
                  onClick={() => toggleArrayFilter('bedrooms', bed)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    filters.bedrooms.includes(bed)
                      ? 'bg-yellow-500 text-[#2a1407] border-2 border-yellow-600'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200',
                  )}
                >
                  {bed} BHK
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Bathrooms - Only show on property page if more than 1 option */}
        {pageType === 'property' && bathrooms.length > 1 && (
          <FilterSection title="Bathrooms" isExpanded={expandedSections.bathrooms} onToggle={() => toggleSection('bathrooms')}>
            <div className="flex flex-wrap gap-2">
              {bathrooms.map((bath: string) => (
                <button
                  key={bath}
                  type="button"
                  onClick={() => toggleArrayFilter('bathrooms', bath)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    filters.bathrooms.includes(bath)
                      ? 'bg-yellow-500 text-[#2a1407] border-2 border-yellow-600'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200',
                  )}
                >
                  {bath}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Location (Cities) - Show on both pages if more than 1 location */}
        {locations.length > 1 && (
          <FilterSection title="Location" isExpanded={expandedSections.location} onToggle={() => toggleSection('location')}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {locations.map((location: string) => (
                <label key={location} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.location) && filters.location.includes(location)}
                    onChange={() => toggleArrayFilter('location', location)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Listing Type - Only show on property page if more than 1 type */}
        {pageType === 'property' && listingTypes.length > 1 && (
          <FilterSection title="Listing Type" isExpanded={expandedSections.listingType} onToggle={() => toggleSection('listingType')}>
            <div className="space-y-2">
              {listingTypes.map((type: string) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.listingType) && filters.listingType.includes(type)}
                    onChange={() => toggleArrayFilter('listingType', type)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Offer - properties with a promotional offer */}
        {pageType === 'property' && (
          <FilterSection title="Offer" isExpanded={expandedSections.offer || false} onToggle={() => toggleSection('offer')}>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleArrayFilter('offer', 'Offer')}
                className={cn(
                  'px-3 py-1.5 rounded-full text-sm font-semibold border transition-colors',
                  Array.isArray(filters.offer) && filters.offer.includes('Offer')
                    ? 'bg-yellow-500 text-[#2a1407] border-yellow-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-yellow-400',
                )}
              >
                Offer
              </button>
            </div>
          </FilterSection>
        )}

        {/* Status - Only show on property page if more than 1 status */}
        {pageType === 'property' && statuses.length > 1 && (
          <FilterSection title="Status" isExpanded={expandedSections.status} onToggle={() => toggleSection('status')}>
            <div className="space-y-2">
              {statuses.map((status: string) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.status) && filters.status.includes(status)}
                    onChange={() => toggleArrayFilter('status', status)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Project Status - buyer-facing */}
        {pageType === 'property' && (
          <FilterSection title="Project Status" isExpanded={expandedSections.projectStatus || false} onToggle={() => toggleSection('projectStatus')}>
            <div className="space-y-2">
              {(projectStatuses.length > 0 ? projectStatuses : defaultProjectStatuses).map((status: string) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.projectStatus) && filters.projectStatus.includes(status)}
                    onChange={() => toggleArrayFilter('projectStatus', status)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Amenities - Only show on property page if more than 1 amenity */}
        {pageType === 'property' && amenities.length > 1 && (
          <FilterSection title="Amenities" isExpanded={expandedSections.amenities} onToggle={() => toggleSection('amenities')}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenities.map((amenity: string) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.amenities) && filters.amenities.includes(amenity)}
                    onChange={() => toggleArrayFilter('amenities', amenity)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Districts - Show on agency page if more than 1 district */}
        {/* {pageType === 'agency' && districts.length > 1 && (
          <FilterSection title="Districts" isExpanded={expandedSections.district || false} onToggle={() => toggleSection('district')}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {districts.map((district: string) => (
                <label key={district} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.district) && filters.district.includes(district)}
                    onChange={() => toggleArrayFilter('district', district)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{district}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )} */}

        {/* States - Show on agency page if more than 1 state */}
        {pageType === 'agency' && states.length > 1 && (
          <FilterSection title="States" isExpanded={expandedSections.state || false} onToggle={() => toggleSection('state')}>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {states.map((state: string) => (
                <label key={state} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.state) && filters.state.includes(state)}
                    onChange={() => toggleArrayFilter('state', state)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{state}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Size Range - Only show on property page (manual input) */}
        {pageType === 'property' && (
          <FilterSection title="Size Range (sqft)" isExpanded={expandedSections.sizeRange || false} onToggle={() => toggleSection('sizeRange')}>
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    type="number"
                    value={(() => {
                      const min = Array.isArray(filters.sizeRange) ? filters.sizeRange[0] : 0
                      return typeof min === 'number' && Number.isFinite(min) ? (min === 0 ? '' : min) : ''
                    })()}
                    onChange={e => {
                      const nextMin = e.target.value === '' ? 0 : Number(e.target.value) || 0
                      const currentMax = Array.isArray(filters.sizeRange) ? filters.sizeRange[1] : 0
                      updateFilter('sizeRange', [nextMin, typeof currentMax === 'number' && Number.isFinite(currentMax) ? currentMax : 0])
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    type="number"
                    value={(() => {
                      const max = Array.isArray(filters.sizeRange) ? filters.sizeRange[1] : 0
                      return typeof max === 'number' && Number.isFinite(max) ? (max === 0 ? '' : max) : ''
                    })()}
                    onChange={e => {
                      const nextMax = e.target.value === '' ? 0 : Number(e.target.value) || 0
                      const currentMin = Array.isArray(filters.sizeRange) ? filters.sizeRange[0] : 0
                      updateFilter('sizeRange', [typeof currentMin === 'number' && Number.isFinite(currentMin) ? currentMin : 0, nextMax])
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="No limit"
                  />
                </div>
              </div>
            </div>
          </FilterSection>
        )}

        {/* Layout Price Range */}
        {pageType === 'property' && (
          <FilterSection title="Layout Price Range (₹)" isExpanded={expandedSections.layoutPriceRange || false} onToggle={() => toggleSection('layoutPriceRange')}>
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    type="number"
                    value={filters.layoutPriceRange?.[0] ? filters.layoutPriceRange[0] : ''}
                    onChange={e => updateFilter('layoutPriceRange', [Number(e.target.value) || 0, filters.layoutPriceRange?.[1] || 0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    type="number"
                    value={filters.layoutPriceRange?.[1] ? filters.layoutPriceRange[1] : ''}
                    onChange={e => updateFilter('layoutPriceRange', [filters.layoutPriceRange?.[0] || 0, Number(e.target.value) || 0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="No limit"
                  />
                </div>
              </div>
            </div>
          </FilterSection>
        )}

        {/* Layout Area Range */}
        {pageType === 'property' && (
          <FilterSection title="Layout Area Range (sqft)" isExpanded={expandedSections.layoutAreaRange || false} onToggle={() => toggleSection('layoutAreaRange')}>
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    type="number"
                    value={filters.layoutAreaRange?.[0] ? filters.layoutAreaRange[0] : ''}
                    onChange={e => updateFilter('layoutAreaRange', [Number(e.target.value) || 0, filters.layoutAreaRange?.[1] || 0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    type="number"
                    value={filters.layoutAreaRange?.[1] ? filters.layoutAreaRange[1] : ''}
                    onChange={e => updateFilter('layoutAreaRange', [filters.layoutAreaRange?.[0] || 0, Number(e.target.value) || 0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="No limit"
                  />
                </div>
              </div>
            </div>
          </FilterSection>
        )}

        {/* Layout Total Sqft */}
        {pageType === 'property' && (
          <FilterSection title="Layout Total Sqft" isExpanded={expandedSections.layoutTotalSqftRange || false} onToggle={() => toggleSection('layoutTotalSqftRange')}>
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    type="number"
                    value={filters.layoutTotalSqftRange?.[0] ? filters.layoutTotalSqftRange[0] : ''}
                    onChange={e => updateFilter('layoutTotalSqftRange', [Number(e.target.value) || 0, filters.layoutTotalSqftRange?.[1] || 0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    type="number"
                    value={filters.layoutTotalSqftRange?.[1] ? filters.layoutTotalSqftRange[1] : ''}
                    onChange={e => updateFilter('layoutTotalSqftRange', [filters.layoutTotalSqftRange?.[0] || 0, Number(e.target.value) || 0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="No limit"
                  />
                </div>
              </div>
            </div>
          </FilterSection>
        )}

        {/* Plot Availability */}
        {pageType === 'property' && (
          <FilterSection title="Available Plots" isExpanded={expandedSections.plotAvailableRange || false} onToggle={() => toggleSection('plotAvailableRange')}>
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Min</label>
                  <input
                    type="number"
                    value={filters.plotAvailableRange?.[0] ? filters.plotAvailableRange[0] : ''}
                    onChange={e => updateFilter('plotAvailableRange', [Number(e.target.value) || 0, filters.plotAvailableRange?.[1] || 0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">Max</label>
                  <input
                    type="number"
                    value={filters.plotAvailableRange?.[1] ? filters.plotAvailableRange[1] : ''}
                    onChange={e => updateFilter('plotAvailableRange', [filters.plotAvailableRange?.[0] || 0, Number(e.target.value) || 0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="No limit"
                  />
                </div>
              </div>
            </div>
          </FilterSection>
        )}

        {/* Furnishing - Only show on property page if more than 1 option */}
        {pageType === 'property' && furnishingOptions.length > 1 && (
          <FilterSection title="Furnishing" isExpanded={expandedSections.furnishing || false} onToggle={() => toggleSection('furnishing')}>
            <div className="flex flex-wrap gap-2">
              {furnishingOptions.map((option: string) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleArrayFilter('furnishing', option)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    filters.furnishing.includes(option)
                      ? 'bg-yellow-500 text-[#2a1407] border-2 border-yellow-600'
                      : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Parking - Only show on property page if more than 1 option */}
        {pageType === 'property' && parkingOptions.length > 1 && (
          <FilterSection title="Parking" isExpanded={expandedSections.parking || false} onToggle={() => toggleSection('parking')}>
            <div className="space-y-2">
              {parkingOptions.map((option: string) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={Array.isArray(filters.parking) && filters.parking.includes(option)}
                    onChange={() => toggleArrayFilter('parking', option)}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Sort By - Always show (UI helper) */}
        <FilterSection title="Sort By" isExpanded={expandedSections.sortBy || false} onToggle={() => toggleSection('sortBy')}>
          <div className="space-y-2">
            {sortOptions.map(option => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="sortBy"
                  checked={filters.sortBy === option.value}
                  onChange={() => updateFilter('sortBy', option.value)}
                  className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </>
  )
}

function FilterSection({
  title,
  children,
  isExpanded,
  onToggle,
}: {
  title: string
  children: React.ReactNode
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left mb-3 py-1 hover:bg-gray-50 rounded px-2 -mx-2 transition-colors"
      >
        <h4 className="font-bold text-[#2a1407] text-sm uppercase tracking-wide">{title}</h4>
        {isExpanded ? <ChevronUp size={16} className="text-yellow-600" /> : <ChevronDown size={16} className="text-yellow-600" />}
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
