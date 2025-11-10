'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { AdsDto } from '@/app/(seller)/ads/dto/AdsDto'
import { getMethod } from '@/services/service'

interface ApiResponse<T> {
  statusCode: number
  data: {
    data: T
    total: number
    page: number
    limit: number
  }
  message: string
  timestamp: string
  error?: boolean
}

interface UseAdsOptions {
  page?: number
  limit?: number
}

interface AdsFetcherResult {
  items: AdsDto[]
  total: number
}

// Custom hook for managing ads
export function useAds(options: UseAdsOptions = {}) {
  const { page = 1, limit = 10 } = options

  const queryParams = new URLSearchParams()
  if (limit != null) {
    queryParams.set('limit', String(limit))
  }
  if (page != null) {
    queryParams.set('page', String(page))
  }

  const swrKey = queryParams.toString() ? `${appEndpoints.getAllAds}?${queryParams.toString()}` : appEndpoints.getAllAds

  // Fetcher using our generic API helper
  const fetcher = async (url: string): Promise<AdsFetcherResult> => {
    try {
      const response = await getMethod<ApiResponse<AdsDto[]>>(url)
      
      if (response.error) {
        console.error('API error while fetching ads:', response.message)
        return { items: [], total: 0 }
      }

      // getMethod already unwraps the API response, so response.data contains { data: [...], total, page, limit }
      const apiResponse = response.data as any
      const payload = apiResponse?.data
      const total = apiResponse?.total ?? 0

      if (Array.isArray(payload)) {
        return {
          items: payload,
          total,
        }
      }

      console.warn('Unexpected data format:', response.data)
      return { items: [], total: 0 }
    } catch (error) {
      console.error('Failed to fetch ads:', error)
      return { items: [], total: 0 }
    }
  }

  // SWR handles caching, revalidation, and errors
  const { data, error, isLoading, mutate: mutateAds } = useSWR<AdsFetcherResult>(swrKey, fetcher)

  const ads = data?.items ?? []
  const total = data?.total ?? ads.length

  return {
    ads: ads ?? [],
    total,
    error,
    isLoading,
    mutateAds,
  }
}
