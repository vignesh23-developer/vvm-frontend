'use client'

import useSWR from 'swr'
import { appEndpoints } from '@/services/endpoints'
import { getMethod } from '@/services/service'

interface UseSimilarPropertiesOptions {
  city?: string
  propertyCategoryId?: string
  excludeId?: string
  limit?: number
}

interface PropertySearchResponse<T = any> {
  data: T[]
  total: number
  page: number
  limit: number
}

export function useSimilarProperties<T = any>({
  city,
  propertyCategoryId,
  excludeId,
  limit = 8,
}: UseSimilarPropertiesOptions) {
  const hasParams = Boolean(city || propertyCategoryId)

  const params: Record<string, any> = {
    page: 1,
    limit,
  }
  if (city) params.city = city
  if (propertyCategoryId) params.property_category_id = propertyCategoryId

  const swrKey = hasParams ? ['similar-properties', params] : null

  const fetcher = async ([, query]: [string, Record<string, any>]) => {
    const response = await getMethod<PropertySearchResponse<T>>(appEndpoints.publicSearchProperties, query)
    const data = response.data

    let items: T[] = Array.isArray((data as any)?.data) ? (data as any).data : []
    if (excludeId) {
      items = items.filter((item: any) => item.id !== excludeId)
    }

    return {
      items,
      total: typeof (data as any)?.total === 'number' ? (data as any).total : items.length,
    }
  }

  const { data, error, isLoading } = useSWR(swrKey as any, fetcher)

  return {
    similarProperties: (data?.items as T[]) ?? [],
    total: data?.total ?? 0,
    isLoadingSimilar: isLoading,
    error,
  }
}


