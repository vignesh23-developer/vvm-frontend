'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { PopularPropertyDto } from '../dto/popularPropertiesDto'
import { getMethod } from '@/services/service'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface ApiResponse<T> {
  data?: T
  meta?: {
    total?: number
  }
  total?: number
  error?: boolean
  message?: string
}

interface UsePopularPropertiesOptions {
  page?: number
  limit?: number
  district?: string
  packageType?: string
}

interface PopularPropertiesFetcherResult {
  items: PopularPropertyDto[]
  total: number
}

const fetchPopularProperties = async (url: string): Promise<PopularPropertiesFetcherResult> => {
  try {
    const response = await getMethod<ApiResponse<PopularPropertyDto[]>>(url)

    if (response.error) {
      toast.error(response.message || 'Failed to fetch popular properties')
      console.error('Failed to fetch popular properties:', response.message)
      return { items: [], total: 0 }
    }

    const payload = response.data?.data
    const metaTotal = response.data?.meta?.total
    const topLevelTotal = response.data?.total

    if (Array.isArray(payload)) {
      return {
        items: payload,
        total: typeof metaTotal === 'number' ? metaTotal : typeof topLevelTotal === 'number' ? topLevelTotal : payload.length,
      }
    }

    if (Array.isArray(response.data)) {
      return { items: response.data, total: response.data.length }
    }

    console.warn('Unexpected response format:', response.data)
    return { items: [], total: 0 }
  } catch (error) {
    console.error('Unexpected error while fetching popular properties:', error)
    return { items: [], total: 0 }
  }
}

export function usePopularProperties(options: UsePopularPropertiesOptions = {}) {
  const router = useRouter()
  const { page = 1, limit = 6, district, packageType } = options

  const queryParams = new URLSearchParams()

  if (limit != null) {
    queryParams.set('limit', String(limit))
  }

  if (page != null) {
    queryParams.set('page', String(page))
  }

  // If district is provided, filter by district and package type (Platinum)
  if (district) {
    queryParams.set('district', district)
    if (packageType) {
      queryParams.set('package_type', packageType)
    }
  }

  const swrKey = queryParams.toString() ? `${appEndpoints.getAllPropertiesList}?${queryParams.toString()}` : appEndpoints.getAllPropertiesList

  const { data, error, isLoading } = useSWR<PopularPropertiesFetcherResult>(swrKey, fetchPopularProperties)

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
  }
}
