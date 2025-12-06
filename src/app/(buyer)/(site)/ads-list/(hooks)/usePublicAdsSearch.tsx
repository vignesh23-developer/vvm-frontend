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
  category_id: string[]
  sortBy?: string
  isPremium?: boolean
  ownerId?: string
  agentId?: string
  lat?: number
  lon?: number
  radius?: string
}

interface UsePublicAdsSearchOptions {
  page: number
  limit: number
  filters: FilterState
  searchTerm: string
  includeFilters?: boolean
  enabled?: boolean
}

interface SearchResult<T = any> {
  items: T[]
  total: number
}

const unwrapData = (payload: any) => {
  let current = payload
  let guard = 0
  while (current && typeof current === 'object' && 'data' in current && guard < 5) {
    current = current.data
    guard += 1
  }
  return current
}

export function usePublicAdsSearch<T = any>({ page, limit, filters, searchTerm, includeFilters = false, enabled = true }: UsePublicAdsSearchOptions) {
  const trimmedSearch = searchTerm.trim()
  const params: Record<string, any> = {
    page,
    limit,
  }

  if (trimmedSearch) params.q = trimmedSearch

  if (filters.listingType.length > 0) {
    params.listing_type = filters.listingType[0]
  }

  if (filters.status.length > 0) {
    params.status = filters.status[0]
  }

  if (filters.location.length > 0) {
    params.city = filters.location[0]
  }
  if (filters.district.length > 0) {
    params.district = filters.district[0]
  }
  if (filters.state.length > 0) {
    params.state = filters.state[0]
  }

  if (filters.category_id.length > 0) {
    params.category_id = filters.category_id[0]
  } else if (filters.propertyCategoryId.length > 0) {
    params.category_id = filters.propertyCategoryId[0]
  }

  if (filters.propertyType.length > 0) {
    params.property_type = filters.propertyType.join(',')
  }

  if (filters.priceRange[0] > 0) {
    params.price_min = filters.priceRange[0]
  }
  if (filters.priceRange[1] && filters.priceRange[1] < 100000000) {
    params.price_max = filters.priceRange[1]
  }

  if (filters.amenities.length > 0) {
    params.amenities = filters.amenities.join(',')
  }

  if (filters.verified.includes('Verified Only')) {
    params.is_verified = true
  }
  if (filters.featured.includes('Featured Properties')) {
    params.is_featured = true
  }
  if (filters.isPremium) {
    params.is_premium = true
  }

  if (filters.ownerId) {
    params.owner_id = filters.ownerId
  }
  if (filters.agentId) {
    params.agent_id = filters.agentId
  }

  if (filters.lat !== undefined) {
    params.lat = filters.lat
  }
  if (filters.lon !== undefined) {
    params.lon = filters.lon
  }
  if (filters.radius) {
    params.radius = filters.radius
  }

  if (filters.sortBy) {
    params.sort = filters.sortBy
  }

  if (includeFilters) {
    params.include_filters = true
  }

  const swrKey = enabled ? (['public-ads-search', params] as const) : null

  const fetcher = async ([, query]: [string, Record<string, any>]): Promise<SearchResult<T>> => {
    console.log('🔎 Ads Search API Call:', {
      endpoint: appEndpoints.publicSearchAds,
      params: query,
    })

    try {
      const response = await getMethod<any>(appEndpoints.publicSearchAds, query)
      const container = unwrapData(response?.data)

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

      return { items, total }
    } catch (error) {
      console.error('❌ Ads Search API Error:', error)
      return { items: [], total: 0 }
    }
  }

  const { data, error, isLoading, mutate } = useSWR<SearchResult<T>>(swrKey as any, fetcher)

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    error,
    isLoading: enabled ? isLoading : false,
    mutate,
  }
}
