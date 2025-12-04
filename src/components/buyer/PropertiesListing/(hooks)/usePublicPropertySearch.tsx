'use client'

import useSWR from 'swr'
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

interface UsePublicPropertySearchOptions {
  page: number
  limit: number
  filters: FilterState
  searchTerm: string
  enabled: boolean
  includeFilters?: boolean
}

interface PropertySearchResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
}

interface SearchResult<T = any> {
  items: T[]
  total: number
}

export function usePublicPropertySearch<T = any>({
  page,
  limit,
  filters,
  searchTerm,
  enabled,
  includeFilters = false,
}: UsePublicPropertySearchOptions) {
  const trimmedSearch = searchTerm.trim()

  const params: Record<string, any> = {
    page,
    limit,
  }

  // Text search
  if (trimmedSearch) params.q = trimmedSearch

  // Listing type (support multiple, comma-separated)
  if (filters.listingType.length > 0) {
    params.listing_type = filters.listingType[0] // API supports single enum, but we can extend if needed
  }

  // Status (support multiple, comma-separated)
  if (filters.status.length > 0) {
    params.status = filters.status[0] // API supports single enum
  }

  // Location filters
  if (filters.location.length > 0) {
    params.city = filters.location[0] // Primary city filter
  }
  if (filters.district.length > 0) {
    params.district = filters.district[0]
  }
  if (filters.state.length > 0) {
    params.state = filters.state[0]
  }
  if (filters.postalCode.length > 0) {
    params.postal_code = filters.postalCode[0]
  }

  // Price range
  if (filters.priceRange[0] > 0) {
    params.price_min = filters.priceRange[0]
  }
  if (filters.priceRange[1] && filters.priceRange[1] < 100000000) {
    params.price_max = filters.priceRange[1]
  }

  // Size range
  if (filters.sizeRange[0] > 0) {
    params.size_min = filters.sizeRange[0]
  }
  if (filters.sizeRange[1] > 0) {
    params.size_max = filters.sizeRange[1]
  }

  // BHK (bedrooms) - comma-separated
  if (filters.bedrooms.length > 0) {
    params.bhk = filters.bedrooms.join(',')
  }

  // Bathrooms - comma-separated
  if (filters.bathrooms.length > 0) {
    params.bathrooms = filters.bathrooms.join(',')
  }

  // Furnishing - comma-separated
  if (filters.furnishing.length > 0) {
    params.furnishing = filters.furnishing.join(',')
  }

  // Facing - comma-separated
  if (filters.facing.length > 0) {
    params.facing = filters.facing.join(',')
  }

  // Parking - comma-separated
  if (filters.parking.length > 0) {
    params.parking = filters.parking.join(',')
  }

  // Amenities - comma-separated
  if (filters.amenities.length > 0) {
    params.amenities = filters.amenities.join(',')
  }

  // Property category
  if (filters.propertyCategoryId.length > 0) {
    params.property_category_id = filters.propertyCategoryId[0]
  }

  // Boolean flags
  if (filters.verified.includes('Verified Only')) {
    params.is_verified = true
  }
  if (filters.featured.includes('Featured Properties')) {
    params.is_featured = true
  }
  if (filters.isPremium) {
    params.is_premium = true
  }

  // Owner/Agent filters
  if (filters.ownerId) {
    params.owner_id = filters.ownerId
  }
  if (filters.agentId) {
    params.agent_id = filters.agentId
  }

  // Geo filters
  if (filters.lat !== undefined) {
    params.lat = filters.lat
  }
  if (filters.lon !== undefined) {
    params.lon = filters.lon
  }
  if (filters.radius) {
    params.radius = filters.radius
  }

  // Sorting
  if (filters.sortBy) {
    params.sort = filters.sortBy
  }

  // Include filter aggregations
  if (includeFilters) {
    params.include_filters = true
  }

  const swrKey = enabled ? ['public-property-search', params] : null

  const fetcher = async ([, query]: [string, Record<string, any>]): Promise<SearchResult<T>> => {
    // Log the API call for debugging
    console.log('🔍 Property Search API Call:', {
      endpoint: appEndpoints.publicSearchProperties,
      params: query,
      hasFilters: Object.keys(query).length > 2, // More than just page and limit
    })

    try {
      const response = await getMethod<any>(appEndpoints.publicSearchProperties, query)

      // The backend now returns a consistent search payload, but we keep this
      // parser flexible to support older nested formats too.
      // Supported shapes (inside ResponseDTO.data):
      // 1) { data: [...], total, page, limit }
      // 2) { items: [...], total, page, limit }
      // 3) [ ... ] (bare array)
      const dtoPayload = response.data

      // Unwrap one level of nesting if the payload itself has a "data" object
      const container =
        dtoPayload && typeof dtoPayload === 'object' && !Array.isArray(dtoPayload) && 'data' in dtoPayload
          ? (dtoPayload as any).data
          : dtoPayload

      let items: T[] = []
      let total = 0

      if (Array.isArray(container)) {
        items = container as T[]
        total = items.length
      } else if (container && typeof container === 'object') {
        const obj = container as any
        if (Array.isArray(obj.items)) {
          items = obj.items as T[]
        } else if (Array.isArray(obj.data)) {
          items = obj.data as T[]
        }
        total = typeof obj.total === 'number' ? obj.total : items.length
      }

      console.log('✅ Property Search API Response (normalized):', {
        raw: dtoPayload,
        container,
        itemsCount: items.length,
        total,
      })

      if (!Array.isArray(items)) {
        console.warn('⚠️ Property search response did not contain a list – defaulting to empty list.')
        return { items: [], total: 0 }
      }

      return { items, total }
    } catch (error) {
      console.error('❌ Property Search API Error:', error)
      return { items: [], total: 0 }
    }
  }

  const { data, error, isLoading, mutate } = useSWR<SearchResult<T>>(swrKey as any, fetcher)

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    error,
    isLoading,
    mutate,
  }
}


