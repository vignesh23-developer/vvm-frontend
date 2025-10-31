'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { PopularPropertyDto } from '../dto/popularPropertiesDto'
import { getMethod } from '@/services/service'
import { useRouter } from 'next/navigation'

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
}

interface PopularPropertiesFetcherResult {
  items: PopularPropertyDto[]
  total: number
}

const fetchPopularProperties = async (
  url: string,
): Promise<PopularPropertiesFetcherResult> => {
  try {
    const response = await getMethod<ApiResponse<PopularPropertyDto[]>>(url)

    if (response.error) {
      console.error('Failed to fetch popular properties:', response.message)
      return { items: [], total: 0 }
    }

    const payload = response.data?.data
    const metaTotal = response.data?.meta?.total
    const topLevelTotal = response.data?.total

    if (Array.isArray(payload)) {
      return {
        items: payload,
        total:
          typeof metaTotal === 'number'
            ? metaTotal
            : typeof topLevelTotal === 'number'
            ? topLevelTotal
            : payload.length,
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

export function usePopularProperties(
  options: UsePopularPropertiesOptions = {},
) {
  const router = useRouter()
  const { page = 1, limit = 6 } = options

  const queryParams = new URLSearchParams()

  if (limit != null) {
    queryParams.set('limit', String(limit))
  }

  if (page != null) {
    queryParams.set('page', String(page))
  }

  const swrKey = queryParams.toString()
    ? `${appEndpoints.getAllProperties}?${queryParams.toString()}`
    : appEndpoints.getAllProperties

  const { data, error, isLoading } = useSWR<PopularPropertiesFetcherResult>(
    swrKey,
    fetchPopularProperties,
  )

  const handleSeeMore = (id: number) => {
    router.push(`/propertyDetails/${id}`)
  }

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    handleSeeMore,
  }
}
